import type { Request, Response } from "express";
import { Types } from "mongoose";

declare global {
  type ErrorDetail = {
    field?: string;
    message?: string;
  };

  type ErrorInfo = {
    type: string;
    details?: ErrorDetail[];
  };

  type APIErrorType = string | ErrorInfo;

  interface LogOptions {
    req: Request;
    res?: Response;
    message?: string;
    data?: unknown;
    error?: unknown;
  }
}
