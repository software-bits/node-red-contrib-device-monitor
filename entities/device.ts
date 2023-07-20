import { IpAddress } from './ipAddress';
import { MacAddress } from './macAddress';

export interface DeviceSummary {
  name: string,
  mac: string,
  ip?: string,
  active: boolean;
  connected: boolean;
  notActiveCount: number;
  notConnectedCount: number;
}

export class Device {
  private isActive: boolean;

  private isConnected: boolean;

  private notActiveCount: number;

  private notConnectedCount: number;

  mac: MacAddress;

  ip?: IpAddress;

  constructor(readonly name: string, mac: string) {
    this.isActive = false;
    this.isConnected = false;
    this.notActiveCount = 0;
    this.notConnectedCount = 0;
    this.mac = new MacAddress(mac);
  }

  setIp(ip?: IpAddress): Device {
    this.ip = ip;
    return this;
  }

  setActive(active: boolean): Device {
    if (active === false) {
      this.notActiveCount += 1;
    }
    if (active === true) {
      this.notActiveCount = 0;
    }
    this.isActive = active;
    return this;
  }

  setConnected(connected: boolean): Device {
    if (connected === false) {
      this.notConnectedCount += 1;
    }
    if (connected === true) {
      this.notConnectedCount = 0;
    }
    this.isConnected = connected;
    return this;
  }

  toSummary(): DeviceSummary {
    return {
      name: this.name,
      mac: this.mac.get(),
      ip: this.ip !== undefined ? this.ip.get() : undefined,
      active: this.isActive,
      connected: this.isConnected,
      notActiveCount: this.notActiveCount,
      notConnectedCount: this.notConnectedCount,
    };
  }
}