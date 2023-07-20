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

  private getFirstMatchFromRegex(input: string, regex: RegExp) {
    const match = input.match(regex);
    return (match ?? []).shift();
  }

  private getIpAddressFromString(input: string) {
    return this.getFirstMatchFromRegex(input, IpAddress.regExp);
  }

  private getMacAddressFromString(input: string) {
    return this.getFirstMatchFromRegex(input, MacAddress.regExp);
  }

  private filterUndefinedRecords(records: { ip?: string, mac?: string }[]): { ip: string, mac: string }[] {
    return records.filter((record) => record.mac !== undefined && record.ip !== undefined) as { ip: string, mac: string }[];
  }

  async arp(): Promise<ArpResponse[]> {
    const arp = async () => {
      const bufferResult = execSync('arp -a');
      const result = bufferResult.toString();
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