import { InvalidIpAddressError } from '../errors/invalid-ip-address-error';

export class IpAddress {
  private readonly address: string;

  private alive: boolean;

  constructor(address: string) {
    this.validate(address);
    this.address = this.format(address);
    this.alive = false;
  }

  static get regExp(): RegExp {
    return /[0-9.]{7,15}/g;
  }

  private validate(address: string) {
    if (IpAddress.regExp.test(address) === false) {
      throw new InvalidIpAddressError(address);
    }
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