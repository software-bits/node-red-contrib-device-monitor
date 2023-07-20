import { InvalidMacAddressError } from '../errors/invalid-mac-address-error';

export class MacAddress {
  private readonly address: string;

  constructor(address: string) {
    this.validate(address);
    this.address = this.format(address);
  }

  static get regExp(): RegExp {
    return /[a-fA-F0-9:]{11,17}/g;
  }

  private validate(address: string) {
    if (MacAddress.regExp.test(address) === false) {
      throw new InvalidMacAddressError(address);
    }
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