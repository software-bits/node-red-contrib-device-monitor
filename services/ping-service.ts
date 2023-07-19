import * as ping from 'ping';
import * as ip from 'ip';
import { CacheService } from './cache-service';
import { IpAddress } from '../entities/ipAddress';

export class PingService extends CacheService<IpAddress[]> {
  constructor(cacheIntervalMs: number) {
    super(cacheIntervalMs);
  }

  async pingAllIPs(): Promise<IpAddress[]> {
    const pingAll = async () => {
      const myIp = ip.address();
      const mySplittedIp = myIp.split('.');
      const hosts = Array.from({ length: 255 }, (_, i) => i + 1).map((i) => (
        `${mySplittedIp[0]}.${mySplittedIp[1]}.${mySplittedIp[2]}.${i}`));
      const promises = hosts.map((host) => ping.promise.probe(host));
      const resolvedPromises = await Promise.all(promises);
      return resolvedPromises.map((resolvedPromise) => (
        new IpAddress(resolvedPromise.inputHost).setAlive(resolvedPromise.alive)));
    };
    return this.executeOrFromCache(pingAll);
  }
}
