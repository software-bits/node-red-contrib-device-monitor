import { InvalidConfigurationError } from '../errors/invalid-configuration-error';

interface DeviceWithMac {
  name: string,
  macAddress: string,
}

type DeviceConfiguration = DeviceWithMac;

export class ConfigurationParser {
  static parseAndValidateIntervalSeconds(config: string): number {
    if (Number.isNaN(Number(config))) {
      throw new InvalidConfigurationError('No valid "intervalSeconds" found.');
    }
    return Number(config);
  }

  static parseAndValidateDeviceConfiguration(config: string): DeviceConfiguration[] {
    let parsed;
    try {
      parsed = JSON.parse(config);
    } catch(_) {
      throw new InvalidConfigurationError();
    }
    if (!Array.isArray(parsed)) {
      throw new InvalidConfigurationError('No "device" array found.');
    }
    if (parsed.some((element) => element.name === undefined)) {
      throw new InvalidConfigurationError('No "name" element found.');
    }
    if (parsed.some((element) => element.macAddress === undefined)) {
      throw new InvalidConfigurationError('No "macAddress" element found.');
    }
    return parsed;
  }
}