import { NodeInitializer, Node } from 'node-red';
import { NodeDef } from 'node-red';
import { DeviceMonitor } from '../../services/device-monitor';
import { PeriodicCaller } from '../../services/periodic-caller';
import { ConfigurationParser } from '../../services/configuration-parser';

interface DeviceMonitorConfiguration extends NodeDef {
  intervalSeconds: string,
  devices: string
}

const CACHE_PING_ARP_MS = 1000;

const nodeInit: NodeInitializer = (RED): void => {
  function DeviceMonitorNode(
    this: Node,
    config: DeviceMonitorConfiguration,
  ): void {
    RED.nodes.createNode(this, config);
    try {
      const devices = ConfigurationParser.parseAndValidateDeviceConfiguration(config.devices);
      const intervalSeconds = ConfigurationParser.parseAndValidateIntervalSeconds(config.intervalSeconds);
      const deviceMonitor = new DeviceMonitor(devices, CACHE_PING_ARP_MS);
      this.status({ fill: 'yellow', shape: 'dot', 'text': 'Initializing...' })
      const run = async () => {
        try {
          const payload = await deviceMonitor.run();
          this.send({ payload });
          this.status({ fill: 'green', shape: 'dot', 'text': `Running every ${intervalSeconds} seconds` });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'unknown L2 error';
          this.status({ fill: 'red', shape: 'dot', 'text': message });
          this.error(`DeviceMonitorError: ${message}`);
        }
      }
      const periodicCaller = new PeriodicCaller(intervalSeconds * 1000);
      periodicCaller.subscribe(run);
      periodicCaller.start();
      this.on('close', () => periodicCaller.stop());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown L1 error';
      this.status({ fill: 'red', shape: 'dot', 'text': message });
      this.error(`DeviceMonitorError: ${message}`);
    }
  }

  RED.nodes.registerType('device-monitor', DeviceMonitorNode);
};

export = nodeInit;
