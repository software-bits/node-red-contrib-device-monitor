import * as childProcess from 'child_process';
import { ArpService } from '../../services/arp-service';

jest.mock('child_process');

describe('arp-service', () => {
  const arpResult = `? (192.168.1.1) at aa:bb:11:22:33:44 on en0 ifscope [ethernet]
    ? (192.168.1.2) at 0:1:11:22:33:44 on en0 ifscope [ethernet]
    ? (192.168.1.3) at (incomplete) on en0 ifscope [ethernet]`;
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('maps arp result into IpAddress and MacAddress', async () => {
    jest.spyOn(childProcess, 'execSync').mockImplementation(() => Buffer.from(arpResult, "utf-8"));
    const arpService = new ArpService(1000);
    const response = await arpService.arp();
    expect(childProcess.execSync).toHaveBeenCalledTimes(1);
    expect(childProcess.execSync).toHaveBeenCalledWith('arp -a');
    expect(response.length).toStrictEqual(2);
    expect(response[0]?.ipAddress.get()).toStrictEqual('192.168.01.01');
    expect(response[1]?.ipAddress.get()).toStrictEqual('192.168.01.02');
    expect(response[0]?.macAddress.get()).toStrictEqual('AA:BB:11:22:33:44');
    expect(response[1]?.macAddress.get()).toStrictEqual('00:01:11:22:33:44');
  });
});