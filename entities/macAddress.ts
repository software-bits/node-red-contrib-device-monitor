export class MacAddress {
  private readonly address: string;

  constructor(address: string) {
    this.address = this.format(address);
  }

  private format(address: string) {
    return address
      .split(':')
      .map((element) => element.padStart(2, '0'))
      .join(':')
      .toUpperCase();
  }

  public get() {
    return this.address;
  }

  public equals(otherAddress?: MacAddress): boolean {
    if (otherAddress === undefined) {
      return false;
    }
    return this.get() === otherAddress.get();
  }
}