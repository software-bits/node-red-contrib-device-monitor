export class IpAddress {
  private readonly address: string;

  private alive: boolean;

  constructor(address: string) {
    this.address = this.format(address);
    this.alive = false;
  }

  private format(address: string) {
    return address
      .split('.')
      .map((element) => element.padStart(2, '0'))
      .join('.');
  }

  public get() {
    return this.address;
  }

  public isAlive() {
    return this.alive;
  }

  public setAlive(alive: boolean): IpAddress {
    this.alive = alive;
    return this;
  }

  public equals(otherAddress?: IpAddress): boolean {
    if (otherAddress === undefined) {
      return false;
    }
    return this.get() === otherAddress.get();
  }
}