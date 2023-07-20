export class InvalidIpAddressError extends Error {
  constructor(ip: unknown) {
    super(`Invalid ip address found: ${ip}`);
  }
}