export class InvalidConfigurationError extends Error {
  constructor(details?: string) {
    super(details ? `Invalid configuration: ${details}` : 'Invalid configuration');
  }
}