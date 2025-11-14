// ============================================
//  🔹 Global error handler middleware
// ============================================
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import APIError from "@/utils/errors.util.js";
import { logRequest } from "@/utils/index.util.js";

// Extract JWT error classes
const { JsonWebTokenError, TokenExpiredError, NotBeforeError } = jwt;

// ------------------------------------------------------
// 1️⃣ Global Error Handler Middleware
// ------------------------------------------------------
const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  void next;

  // Initialize customError variable
  let customError: APIError;

  // Handle specific error types
  if (err instanceof JsonWebTokenError) {
    logRequest({
      req,
      message: "JWT Error occurred",
      error: err.message,
    });
    customError = new APIError(
      401,
      "Invalid token. Please log in again.",
      "JsonWebTokenError",
      err.stack
    );
  } else if (err instanceof TokenExpiredError) {
    logRequest({
      req,
      message: "JWT Token Expired",
      error: err.message,
    });
    customError = new APIError(
      401,
      "Your token has expired. Please log in again.",
      "TokenExpiredError",
      err.stack
    );
  } else if (err instanceof NotBeforeError) {
    logRequest({
      req,
      message: "JWT Not Before Error",
      error: err.message,
    });
    customError = new APIError(
      401,
      "Token not active. Please log in again.",
      "NotBeforeError",
      err.stack
    );
  } else if (err instanceof APIError) {
    logRequest({
      req,
      res,
      message: "API Error occurred",
      error: err.message,
    });
    customError = err;
  } else {
    const unknownError = err as Error;
    logRequest({
      req,
      res,
      message: "Unknown Error occurred",
      error: unknownError.message,
    });
    customError = new APIError(
      500,
      unknownError.message || "An unexpected error occurred.",
      "InternalServerError",
      unknownError.stack
    );
  }

  // Send error response
  logRequest({
    req,
    res,
    message: "Sending error response",
    error: customError,
  });

  // Send the formatted error response
  res.status(customError.statusCode).json({
    success: customError.success,
    statusCode: customError.statusCode,
    message: customError.message,
    error: customError.error,
  });
};

export default globalErrorHandler;
