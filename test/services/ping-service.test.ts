import * as ping from 'ping';
import * as ip from 'ip';
import { PingService } from '../../services/ping-service';
import { IpAddress } from '../../entities/ipAddress';

jest.mock('ping');
jest.mock('ip');

describe('ping-service', () => {
  it('delegates pinging', async () => {
    const pingService = new PingService(1000);
    jest.spyOn(ip, 'address').mockImplementation(() => '192.168.999.10');
    jest.spyOn(ping.promise, 'probe').mockImplementation(async (host: string) => ({
      inputHost: `192.168.1.${host}`,
      alive: true,
    }) as ping.PingResponse);
    await pingService.pingAllIPs();
    expect(ip.address).toHaveBeenCalledTimes(1);
    expect(ping.promise.probe).toHaveBeenCalledTimes(255);
    const expectedPingHosts = Array.from({ length: 255 }, (_, i) => `192.168.999.${i + 1}`);
    expectedPingHosts.forEach((host) => {
      expect(ping.promise.probe).toHaveBeenCalledWith(host);
    });
  });
  it('returns array of IpAddress classes with alive hosts', async () => {
    const pingService = new PingService(1000);
    jest.spyOn(ip, 'address').mockImplementation(() => '192.168.999.10');
    jest.spyOn(ping.promise, 'probe').mockImplementation(async (host: string) => ({
      inputHost: `192.168.1.${host}`,
      alive: true,
    }) as ping.PingResponse);
    const response = await pingService.pingAllIPs();
    response.forEach((entry) => {
      expect(entry).toBeInstanceOf(IpAddress);
      expect(entry.isAlive()).toStrictEqual(true);
    });
  });
  it('returns array of IpAddress classes with non-alive hosts', async () => {
    const pingService = new PingService(1000);
    jest.spyOn(ip, 'address').mockImplementation(() => '192.168.999.10');
    jest.spyOn(ping.promise, 'probe').mockImplementation(async (host: string) => ({
      inputHost: `192.168.1.${host}`,
      alive: false,
    }) as ping.PingResponse);
    const response = await pingService.pingAllIPs();
    response.forEach((entry) => {
      expect(entry).toBeInstanceOf(IpAddress);
      expect(entry.isAlive()).toStrictEqual(false);
    });
  });
});