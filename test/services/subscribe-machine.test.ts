import { SubscribeMachine } from '../../services/subscribe-machine';

describe('subscribe-machine', () => {
  it('calls subscriber', async () => {
    const subscriber = jest.fn();
    const subscribeMachine = new SubscribeMachine();
    subscribeMachine.subscribe(subscriber);
    const args = ['argument-a', 1, null];
    await subscribeMachine.callSubscribers(...args);
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(...args);
  });
  it('calls multiple subscribers', async () => {
    const subscriberA = jest.fn();
    const subscriberB = jest.fn();
    const subscriberC = jest.fn();
    const subscribeMachine = new SubscribeMachine();
    subscribeMachine.subscribe(subscriberA);
    subscribeMachine.subscribe(subscriberB);
    subscribeMachine.subscribe(subscriberC);
    const args = ['argument-a', 1, null];
    await subscribeMachine.callSubscribers(...args);
    expect(subscriberA).toHaveBeenCalledTimes(1);
    expect(subscriberA).toHaveBeenCalledWith(...args);
    expect(subscriberB).toHaveBeenCalledTimes(1);
    expect(subscriberB).toHaveBeenCalledWith(...args);
    expect(subscriberC).toHaveBeenCalledTimes(1);
    expect(subscriberC).toHaveBeenCalledWith(...args);
  });
  it('unsubscribes', async () => {
    const subscriberA = jest.fn();
    const subscriberB = jest.fn();
    const subscribeMachine = new SubscribeMachine();
    subscribeMachine.subscribe(subscriberA);
    subscribeMachine.subscribe(subscriberB);
    const args = ['argument-a', 1, null];
    subscribeMachine.unsubscribe(subscriberA)
    await subscribeMachine.callSubscribers(...args);
    expect(subscriberA).toHaveBeenCalledTimes(0);
    expect(subscriberB).toHaveBeenCalledTimes(1);
    expect(subscriberB).toHaveBeenCalledWith(...args);
  });
  it('throws error if subscriber fails', async () => {
    const subscriber = jest.fn(() => {
      throw new Error('ERROR');
    });
    const subscribeMachine = new SubscribeMachine();
    subscribeMachine.subscribe(subscriber);
    const args = ['argument-a', 1, null];
    await expect(() => subscribeMachine.callSubscribers(...args)).rejects.toThrowError('Failed execution: ERROR');
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(...args);
  });
});