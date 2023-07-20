import { ConfigurationParser } from '../../services/configuration-parser';

describe('configuration-parser', () => {
  const expectError = (method: (input: string) => unknown, input: unknown, expectedError: string) => {
    let error;
    try {
      method(input as string);
    } catch (err) {
      error = err;
    }
    expect(error instanceof Error && error.message).toStrictEqual(expectedError);
  }
  it('parses device configuration', () => {
    const config = [
      {
        name: 'name',
        macAddress: 'mac-address'
      }
    ];
    expect(ConfigurationParser.parseAndValidateDeviceConfiguration(
      JSON.stringify(config))
    ).toStrictEqual(config);
  });
  it('parses intervalSeconds configuration', () => {
    expect(ConfigurationParser.parseAndValidateIntervalSeconds(
      '5')
    ).toStrictEqual(5);
  });
  it('Throws error on non-number intervalSeconds configuration', () => {
    expectError(ConfigurationParser.parseAndValidateIntervalSeconds, '5a', 'Invalid configuration: No valid "intervalSeconds" found.');
  });
  it('Throws error on non-parsable device string input', () => {
    expectError(ConfigurationParser.parseAndValidateDeviceConfiguration, 'some-string', 'Invalid configuration');
  });
  it('Throws error on invalid device configuration - no array', () => {
    expectError(ConfigurationParser.parseAndValidateDeviceConfiguration, JSON.stringify({}), 'Invalid configuration: No "device" array found.');
  });
  it('Throws error on invalid device configuration - no "name" element', () => {
    expectError(ConfigurationParser.parseAndValidateDeviceConfiguration, JSON.stringify([{
      macAddress: 'mac'
    }]), 'Invalid configuration: No "name" element found.');
  });
  it('Throws error on invalid device configuration - no "macAddress" element', () => {
    expectError(ConfigurationParser.parseAndValidateDeviceConfiguration, JSON.stringify([{
      name: 'name'
    }]), 'Invalid configuration: No "macAddress" element found.');
  });
});