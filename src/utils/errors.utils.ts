export class AppError extends Error {
  public readonly status: "error" | "fail";
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details: unknown;

  constructor(
    status: "error" | "fail",
    statusCode: number,
    message: string,
    isOperational = true,
    details?: unknown
  ) {
    super(message);
    this.status = status;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Maintain proper stack trace for where the error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}
