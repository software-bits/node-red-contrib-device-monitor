import { sleep } from 'ts-workmate';
import { PeriodicCaller } from '../../services/periodic-caller';

describe('periodic caller', () => {
  it('calls periodically', async () => {
    const caller = new PeriodicCaller(100);
    const subscriber = jest.fn((iteration: number) => {
      if (iteration === 3) {
        caller.stop();
      }
    });
    caller.subscribe(subscriber);
    caller.start();
    await sleep(1000);
    expect(subscriber).toHaveBeenCalledTimes(3);
    caller.stop();
  });
});
