import { ExecutionError } from '../errors/execution-error';

// eslint-disable-next-line no-unused-vars
export class SubscribeMachine <Subscriber extends (...args: any[]) => any> {
  private subscribers: Subscriber[];

  constructor() {
    this.subscribers = [];
  }

  private async callSingleSubscriber(
    subscriber: Subscriber,
    args: Parameters<Subscriber>[],
  ): Promise<void> {
    try {
      await subscriber(...args);
    } catch (err) {
      throw new ExecutionError(err instanceof Error && err.message);
    }
  }

  async callSubscribers(...args: Parameters<Subscriber>): Promise<void> {
    const promises = this.subscribers.map((subscriber) => (
      this.callSingleSubscriber(subscriber, args)));
    await Promise.all(promises);
  }

  public subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
  }

  public unsubscribe(subscriber: Subscriber): void {
    if (this.subscribers.length > 0) {
      this.subscribers.splice(this.subscribers.indexOf(subscriber), 1);
    }
  }
}
