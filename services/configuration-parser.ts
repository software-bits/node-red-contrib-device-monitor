interface DeviceWithMac {
  name: string,
  macAddress: string,
}

type DeviceConfiguration = DeviceWithMac;

export class ConfigurationParser {
  constructor() {}

  static parseDeviceConfiguration(config: string): DeviceConfiguration[] {
    try {
      return JSON.parse(config);
    } catch(_) {
      return [];
    }
  }
}