import { MacAddress } from '../../entities/macAddress';
import { InvalidMacAddressError } from '../../errors/invalid-mac-address-error';

describe('Address', () => {
  it('creates macAddress instance and gets address', () => {
    const macAddress = new MacAddress('00:11:22:33:44:55');
    expect(macAddress.get()).toStrictEqual('00:11:22:33:44:55');
  });
  it('compares equal mac addresses as equal', () => {
    const macAddressA = new MacAddress('00:01:22:33:44:55');
    const macAddressB = new MacAddress('0:1:22:33:44:55');
    expect(macAddressA.equals(macAddressB)).toStrictEqual(true);
    expect(macAddressB.equals(macAddressA)).toStrictEqual(true);
  });
  it('compares unequal mac addresses as unequal', () => {
    const macAddressA = new MacAddress('00:01:22:33:44:55');
    const macAddressB = new MacAddress('1:1:22:33:44:55');
    expect(macAddressA.equals(macAddressB)).toStrictEqual(false);
    expect(macAddressB.equals(macAddressA)).toStrictEqual(false);
  });
  it('compares mac addresses to undefined as unequal', () => {
    const macAddress = new MacAddress('00:01:22:33:44:55');
    expect(macAddress.equals(undefined)).toStrictEqual(false);
  });
  it('returns error on invalid macAddress input', () => {
    let error;
    try {
      new MacAddress('bla');
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(InvalidMacAddressError);
  });
});