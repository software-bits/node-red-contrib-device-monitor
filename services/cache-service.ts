export class CacheService<T extends unknown> {
  private nextCheck: number;

  private cache: Promise<T> | undefined;

  constructor(private readonly intervalInMs: number) {
    this.nextCheck = 0;
    this.cache = undefined;
  }

  private setNextCheck() {
    this.nextCheck = new Date().getTime() + this.intervalInMs;
  }

  async executeOrFromCache<
  Args extends unknown[], Method extends (...args: Args) => (Promise<T>),
  >(
    method: Method, ...args: Args): Promise<T> {
    if (new Date().getTime() > this.nextCheck) {
      this.cache = method(...args);
      this.setNextCheck();
    }
    return await this.cache as Promise<T>;
  }
}
