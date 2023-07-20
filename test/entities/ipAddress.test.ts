import { IpAddress } from '../../entities/ipAddress';
import { InvalidIpAddressError } from '../../errors/invalid-ip-address-error';

describe('ipAddress', () => {
  it('creates ipAddress instance and gets address', () => {
    const ipAddress = new IpAddress('192.168.1.10');
    expect(ipAddress.get()).toStrictEqual('192.168.01.10');
  });
  it('a new ipAddress defaults to not alive', () => {
    const ipAddress = new IpAddress('192.168.1.10');
    expect(ipAddress.isAlive()).toStrictEqual(false);
  });
  it('can set ipAddress alive', () => {
    const ipAddress = new IpAddress('192.168.1.10');
    ipAddress.setAlive(true);
    expect(ipAddress.isAlive()).toStrictEqual(true);
  });
  it('compares equal ip addresses', () => {
    const ipAddressA = new IpAddress('192.168.1.10');
    const ipAddressB = new IpAddress('192.168.1.10');
    expect(ipAddressA.equals(ipAddressB)).toStrictEqual(true);
    expect(ipAddressB.equals(ipAddressA)).toStrictEqual(true);
  });
  it('compares unequal ip addresses as unequal', () => {
    const ipAddressA = new IpAddress('192.168.1.10');
    const ipAddressB = new IpAddress('192.168.1.11');
    expect(ipAddressA.equals(ipAddressB)).toStrictEqual(false);
    expect(ipAddressB.equals(ipAddressA)).toStrictEqual(false);
  });
  it('compares ip addresses to undefined as unequal', () => {
    const ipAddress = new IpAddress('192.168.1.10');
    expect(ipAddress.equals(undefined)).toStrictEqual(false);
  });
  it('returns error on invalid ipAddress input', () => {
    let error;
    try {
      new IpAddress('bla');
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(InvalidIpAddressError);
  });
});