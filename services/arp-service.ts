import { execSync } from 'child_process';
import { CacheService } from './cache-service';
import { IpAddress } from '../entities/ipAddress';
import { MacAddress } from '../entities/macAddress';

export interface ArpResponse {
  ipAddress: IpAddress,
  macAddress: MacAddress,
}

export class ArpService extends CacheService<ArpResponse[]> {
  constructor(cacheIntervalMs: number) {
    super(cacheIntervalMs);
  }

  getIpAddressFromString(input: string) {
    const regex = /[0-9.]{7,15}/g;
    const match = input.match(regex);
    return (match ?? []).shift();
  }

  getMacAddressFromString(input: string) {
    const regex = /[a-fA-F0-9:]{11,17}|[a-fA-F0-9]{6,12}/g;
    const match = input.match(regex);
    return (match ?? []).shift();
  }

  filterUndefinedRecords(records: { ip?: string, mac?: string }[]): { ip: string, mac: string }[] {
    return records.filter((record) => record.mac !== undefined && record.ip !== undefined) as { ip: string, mac: string }[];
  }

  async arp(): Promise<ArpResponse[]> {
    const arp = async () => {
      const result = execSync('arp -a').toString();
      const arpRecords = result.split(/\r?\n/);
      const records = this.filterUndefinedRecords(arpRecords.map((record) => ({
        ip: this.getIpAddressFromString(record),
        mac: this.getMacAddressFromString(record),
      })));
      return records.map((record) => ({
        ipAddress: new IpAddress(record.ip),
        macAddress: new MacAddress(record.mac),
      }))
    };
    return this.executeOrFromCache(arp);
  }
}