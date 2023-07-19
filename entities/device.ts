import { IpAddress } from './ipAddress';
import { MacAddress } from './macAddress';

export interface DeviceSummary {
  name: string,
  mac?: string,
  ip?: string,
  active: boolean;
  connected: boolean;
  notActiveSince: number;
  notConnectedSince: number;
}

export class Device {
  private isActive: boolean;

  private isConnected: boolean;

  private notActiveSince: number;

  private notConnectedSince: number;

  mac: MacAddress;

  ip?: IpAddress;

  constructor(readonly name: string, mac: string) {
    this.isActive = false;
    this.isConnected = false;
    this.notActiveSince = 0;
    this.notConnectedSince = 0;
    this.mac = new MacAddress(mac);
  }

  setIp(ip?: IpAddress): Device {
    this.ip = ip;
    return this;
  }

  setActive(active: boolean): Device {
    if (this.isActive === true && active === false) {
      this.notActiveSince = new Date().getTime();
    }
    if (this.isActive === false && active === true) {
      this.notActiveSince = 0;
    }
    this.isActive = active;
    return this;
  }

  setConnected(connected: boolean): Device {
    if (this.isConnected === true && connected === false) {
      this.notConnectedSince = new Date().getTime();
    }
    if (this.isConnected === false && connected === true) {
      this.notConnectedSince = 0;
    }
    this.isConnected = connected;
    return this;
  }

  toSummary(): DeviceSummary {
    return {
      name: this.name,
      mac: this.mac !== undefined ? this.mac.get() : undefined,
      ip: this.ip !== undefined ? this.ip.get() : undefined,
      active: this.isActive,
      connected: this.isConnected,
      notActiveSince: this.notActiveSince,
      notConnectedSince: this.notConnectedSince,
    };
  }
}