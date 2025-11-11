import type { Request } from "express";
import logger from "lib/logger.lib.js";

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
export const timeStampToDate = () => {
  return new Date().toISOString();
};

export const logRequest = ({ req, res, message, data, error }: LogOptions) => {
  const responseTime = `${Date.now() - (res?.locals.startTime || 0)}ms`;

  const meta: Record<string, unknown> = {
    timestamp: timeStampToDate(),
    method: req.method,
    url: req.originalUrl,
    baseUrl: req.baseUrl || "",
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.headers["user-agent"] || "",
    body: req.body || {},
    query: req.query || {},
    params: req.params || {},
    statusCode: res?.statusCode,
    responseTime,
  };

  if (data) meta.data = data;
  if (error) meta.error = error;

  error
    ? logger.error(message || "Error occurred in middleware", meta)
    : logger.info(message || "Request completed", meta);
};

export const keyGetter = (req: Request): string => {
  if (req.user && req.user.userId) {
    return `user-${req.user.userId}`;
  } else {
    return `ip-${req.ip}`;
  }
};
