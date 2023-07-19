import { NodeInitializer, Node } from 'node-red';
import { NodeDef } from 'node-red';
import { DeviceMonitor } from '../../services/device-monitor';
import { PeriodicCaller } from '../../services/periodic-caller';
import { ConfigurationParser } from '../../services/configuration-parser';

interface DeviceMonitorConfiguration extends NodeDef {
  intervalSeconds: number,
  devices: string
}

const CACHE_PING_ARP_MS = 1000;

const nodeInit: NodeInitializer = (RED): void => {
  function DeviceMonitorNode(
    this: Node,
    config: DeviceMonitorConfiguration,
  ): void {
    RED.nodes.createNode(this, config);
    const devices = ConfigurationParser.parseDeviceConfiguration(config.devices);
    const deviceMonitor = new DeviceMonitor(devices, CACHE_PING_ARP_MS);
    const run = async () => {
      const payload = await deviceMonitor.run();
      this.send({ payload });
    }
    const periodicCaller = new PeriodicCaller(config.intervalSeconds * 1000);
    periodicCaller.subscribe(run);
    periodicCaller.start();

    this.on('close', () => periodicCaller.stop());
  }

  RED.nodes.registerType('device-monitor', DeviceMonitorNode);
};

export = nodeInit;
