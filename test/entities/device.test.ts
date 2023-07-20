import { Device } from '../../entities/device';
import { IpAddress } from '../../entities/ipAddress';

describe('device', () => {
  it('creates device instance and makes summary', async () => {
    const deviceName = 'device-name';
    const deviceMac = '00:00:00:00:00';
    const device = new Device(deviceName, deviceMac);
    expect(device.toSummary()).toStrictEqual({
      "active": false,
      "connected": false,
      "ip": undefined,
      "mac": deviceMac,
      "name": deviceName,
      "notActiveCount": 0,
      "notConnectedCount": 0,
    });
  });
  it('sets Ip', async () => {
    const deviceName = 'device-name';
    const deviceMac = '00:00:00:00:00';
    const deviceIp = new IpAddress('192.168.1.10');
    const device = new Device(deviceName, deviceMac);
    device.setIp(deviceIp);
    expect(device.toSummary()).toStrictEqual({
      "active": false,
      "connected": false,
      "ip": deviceIp.get(),
      "mac": deviceMac,
      "name": deviceName,
      "notActiveCount": 0,
      "notConnectedCount": 0,
    });
  });
  it('sets active count', async () => {
    const deviceName = 'device-name';
    const deviceMac = '00:00:00:00:00';
    const device = new Device(deviceName, deviceMac);
    device.setActive(true);
    expect(device.toSummary().active).toStrictEqual(true);
    expect(device.toSummary().notActiveCount).toStrictEqual(0);
    device.setActive(false);
    expect(device.toSummary().active).toStrictEqual(false);
    expect(device.toSummary().notActiveCount).toStrictEqual(1);
    device.setActive(false);
    expect(device.toSummary().active).toStrictEqual(false);
    expect(device.toSummary().notActiveCount).toStrictEqual(2);
    device.setActive(true);
    expect(device.toSummary().active).toStrictEqual(true);
    expect(device.toSummary().notActiveCount).toStrictEqual(0);
  });
  it('sets connected count', async () => {
    const deviceName = 'device-name';
    const deviceMac = '00:00:00:00:00';
    const device = new Device(deviceName, deviceMac);
    device.setConnected(true);
    expect(device.toSummary().connected).toStrictEqual(true);
    expect(device.toSummary().notConnectedCount).toStrictEqual(0);
    device.setConnected(false);
    expect(device.toSummary().connected).toStrictEqual(false);
    expect(device.toSummary().notConnectedCount).toStrictEqual(1);
    device.setConnected(false);
    expect(device.toSummary().connected).toStrictEqual(false);
    expect(device.toSummary().notConnectedCount).toStrictEqual(2);
    device.setConnected(true);
    expect(device.toSummary().connected).toStrictEqual(true);
    expect(device.toSummary().notConnectedCount).toStrictEqual(0);
  });
});