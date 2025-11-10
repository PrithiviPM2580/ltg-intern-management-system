export class APIError extends Error {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly error?: APIErrorType;

  constructor(
    statusCode: number = 500,
    message: string = "Internal Server Error",
    error?: APIErrorType,
    stack?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    this.error = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
