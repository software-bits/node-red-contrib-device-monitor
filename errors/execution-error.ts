export class ExecutionError extends Error {
  constructor(message: boolean | string) {
    super(`Failed execution: ${message}`);
  }
}