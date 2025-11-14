// ============================================
//  🔹 Authentication Middleware
// ============================================
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyAccessToken } from "@/lib/jwt.lib.js";
import logger from "@/lib/logger.lib.js";
import APIError from "@/utils/errors.util.js";

const { TokenExpiredError, JsonWebTokenError } = jwt;

// ------------------------------------------------------
// 1️⃣ Authenticate Middleware
// ------------------------------------------------------
const authenticateMiddleware = (allowRoles: string[] = []) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // Extract the Authorization header
    const { authorization } = req.headers;

    // Check if the Authorization header is present
    if (!authorization) {
      logger.warn(`No authorization header provided`, {
        label: "AuthenticateMiddleware",
      });
      return next(
        new APIError(401, "Unauthorized", {
          type: "UnauthorizedError",
          details: [
            {
              field: "authorization",
              message: "No authorization header provided",
            },
          ],
        })
      );
    }

    // Split the header to get the token
    const [schema, token] = authorization.split(" ");
    if (!schema || schema !== "Bearer" || !token) {
      logger.warn(`Invalid authorization header format`, {
        label: "AuthenticateMiddleware",
      });
      return next(
        new APIError(401, "Unauthorized", {
          type: "UnauthorizedError",
          details: [
            {
              field: "authorization",
              message: "Invalid authorization header format",
            },
          ],
        })
      );
    }
    try {
      // Verify the token
      const payload = verifyAccessToken(token) as TokenPayload;

      // If payload is null or undefined
      if (!payload) {
        logger.warn(`Invalid or expired token`, {
          label: "AuthenticateMiddleware",
        });
        return next(
          new APIError(401, "Unauthorized", {
            type: "UnauthorizedError",
            details: [
              {
                field: "authorization",
                message: "Invalid or expired token",
              },
            ],
          })
        );
      }

      // Attach intern info to request object
      req.intern = {
        internId: payload.internId!,
        role: payload.role!,
      };
      if (allowRoles.length > 0 && !allowRoles.includes(payload.role || "")) {
        logger.error(`Access denied for role: ${payload.role}`);
        return next(new APIError(403, "Forbidden - Insufficient role"));
      }
      return next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        logger.error("AccessToken has expired");
        return next(
          new APIError(401, "Unauthorized - AccessToken has expired")
        );
      }
      if (error instanceof JsonWebTokenError) {
        logger.error("Invalid AccessToken");
        return next(new APIError(401, "Unauthorized - Invalid AccessToken"));
      }
      logger.error("Error occurred while verifying AccessToken");
      return next(new APIError(500, "Internal Server Error"));
    }
  };
};

export default authenticateMiddleware;
