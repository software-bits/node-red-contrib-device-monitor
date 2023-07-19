import { IpAddress } from '../../entities/ipAddress';
import { MacAddress } from '../../entities/macAddress';
import { ArpService } from '../../services/arp-service';
import { DeviceMonitor } from '../../services/device-monitor';
import { PingService } from '../../services/ping-service';

jest.mock('../../services/arp-service');
jest.mock('../../services/ping-service');

describe('device-monitor', () => {
  const devices = [
    {
      name: 'name-of-device',
      macAddress: '00:00:00:00:00',
    },
    {
      name: 'name-of-device-2',
      macAddress: '00:00:00:00:01',
    }
  ];
  it('checks device status based on ping and arp and forms summary', async () => {
    jest.spyOn(ArpService.prototype, 'arp').mockImplementation(async () => ([{
      ipAddress: new IpAddress('192.168.999.2'),
      macAddress: new MacAddress('00:00:00:00:01'),
    }]));
    jest.spyOn(PingService.prototype, 'pingAllIPs').mockImplementation(async () => ([
      new IpAddress('192.168.999.2').setAlive(true)
    ]));
    const deviceMonitor = new DeviceMonitor(devices, 1000);
    const response = await deviceMonitor.run();
    expect(ArpService.prototype.arp).toHaveBeenCalledTimes(1);
    expect(PingService.prototype.pingAllIPs).toHaveBeenCalledTimes(1);
    expect(response).toStrictEqual([
      {
        "active": false,
        "connected": false,
        "ip": undefined,
        "mac": "00:00:00:00:00",
        "name": "name-of-device",
        "notActiveSince": 0,
        "notConnectedSince": 0,
      },
      {
        "active": true,
        "connected": true,
        "ip": "192.168.999.02",
        "mac": "00:00:00:00:01",
        "name": "name-of-device-2",
        "notActiveSince": 0,
        "notConnectedSince": 0,
      },
    ]);
  });
});