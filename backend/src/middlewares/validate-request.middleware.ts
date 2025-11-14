// ============================================
//  🔹 Validate request middleware
// ============================================
import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import logger from "@/lib/logger.lib.js";
import APIError from "@/utils/errors.util.js";
import { formatIssues } from "@/utils/index.util.js";

// ------------------------------------------------------
// 1️⃣ Request Validate Type
// ------------------------------------------------------
const validatePart = (
  part: "body" | "query" | "params",
  schema: ZodTypeAny | undefined,
  req: Request,
  next: NextFunction
): boolean => {
  // If no schema is provided, skip validation
  if (!schema) return true;

  // Validate the request part against the schema
  const result = schema.safeParse(req[part]);

  // If validation fails, log the error and pass an APIError
  if (!result.success) {
    const issues = formatIssues(result.error.issues);
    logger.error(`Validation error in request ${part}`, {
      label: "ValidateRequestMiddleware",
      issues,
    });

    next(
      new APIError(400, "Validation Error", {
        type: "ValidationError",
        details: issues,
      })
    );
    return false;
  }

  // Assign the validated data back to the request part
  Object.assign(req[part], result.data);
  return true;
};

// ------------------------------------------------------
// 2️⃣ Validate Request Middleware
// ------------------------------------------------------
const validateRequestMiddleware =
  (schema: RequestValidate) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    // Try to validate each part of the request
    try {
      const bodyValid = validatePart("body", schema.body, req, next);
      if (!bodyValid) return;
      const queryValid = validatePart("query", schema.query, req, next);
      if (!queryValid) return;
      const paramsValid = validatePart("params", schema.params, req, next);
      if (!paramsValid) return;
      next();
    } catch (error) {
      logger.error("Unexpected error in validation middleware", {
        label: "ValidateRequestMiddleware",
        error,
      });
      next(error);
    }
  };

export default validateRequestMiddleware;
