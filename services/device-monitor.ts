import { Device, DeviceSummary } from '../entities/device';
import { ArpService } from './arp-service';
import { PingService } from './ping-service';

interface DeviceConfiguration {
  name: string,
  macAddress: string,
}

export class DeviceMonitor {
  private readonly devices: Device[];

  private readonly pingService: PingService;

  private readonly arpService: ArpService;

  constructor(devices: DeviceConfiguration[], cacheIntervalMs: number) {
    this.devices = devices.map(this.mapDevices);
    this.pingService = new PingService(cacheIntervalMs);
    this.arpService = new ArpService(cacheIntervalMs);
  }

  private mapDevices(device: DeviceConfiguration): Device {
    return new Device(device.name, device.macAddress);
  }

  async run(): Promise<DeviceSummary[]> {
    const pingResult = await this.pingService.pingAllIPs();
    const arpResult = await this.arpService.arp();
    return this.devices.map((device) => {
      const matchingArpResult = arpResult.find((result) => result.macAddress.equals(device.mac));
      device
        .setConnected(!!matchingArpResult)
        .setIp(matchingArpResult?.ipAddress);
      const matchingPingResult = pingResult.find((result) => result.equals(device.ip));
      device.setActive(!!matchingPingResult && matchingPingResult.isAlive());
      return device.toSummary();
    });
  }
}