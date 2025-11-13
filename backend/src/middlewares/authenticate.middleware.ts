import type { Request, Response, NextFunction } from "express";
import logger from "@/lib/logger.lib.js";
import APIError from "@/utils/errors.utils.js";
import { verifyAccessToken } from "@/lib/jwt.lib.js";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

const authenticateMiddleware = async (allowRoles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
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
      const payload = verifyAccessToken(token) as TokenPayload;
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

      req.intern = payload;
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
