export class InvalidMacAddressError extends Error {
  constructor(mac: unknown) {
    super(`Invalid mac address found: ${mac}`);
  }
}