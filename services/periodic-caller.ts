import { SubscribeMachine } from './subscribe-machine';

// eslint-disable-next-line no-unused-vars
export class PeriodicCaller extends SubscribeMachine<(iteration: number) => void | Promise<void>> {
  private iteration: number;

  private id?: NodeJS.Timeout;

  private active: boolean;

  // eslint-disable-next-line no-unused-vars
  constructor(private readonly interval: number) {
    super();
    this.iteration = 0;
    this.active = false;
  }

  private async wait() {
    return new Promise((resolve) => {
      this.id = setTimeout(() => {
        resolve('done');
      }, this.interval);
    });
  }

  private async repetitiveExecution() {
    await Promise.all(
      this.iteration > 0
        ? [this.wait(), this.callSubscribers(this.iteration)]
        : [this.wait()],
    );
    this.iteration += 1;
    if (this.active) {
      await this.repetitiveExecution();
    }
  }

  public start() {
    this.active = true;
    this.repetitiveExecution();
  }

  public stop() {
    this.active = false;
    clearTimeout(this.id);
  }
}
