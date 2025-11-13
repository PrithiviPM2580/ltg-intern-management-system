import cookie from "@/lib/cookie.lib.js";
import logger from "@/lib/logger.lib.js";
import { logoutService } from "@/services/auth.service.js";
import APIError from "@/utils/errors.utils.js";
import { successResponse } from "@/utils/index.utils.js";
import type { NextFunction, Request, Response } from "express";
const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.intern || !req.intern?.internId) {
    next(
      new APIError(401, "Intern not authenticate", {
        type: "UnauthorizedError",
        details: [
          {
            field: "authorization",
            message: "No intern is logged in",
          },
        ],
      })
    );
  }

  const isLoggedOut = await logoutService(req.intern?.internId);
  if (!isLoggedOut) {
    logger.error(`Logout failed for intern ID: ${req.intern?.internId}`, {
      label: "LogoutController",
    });
    return next(
      new APIError(500, "Logout failed", {
        type: "InternalServerError",
      })
    );
  }

  cookie.clear(res, "refreshToken");
  logger.info(`Intern ID: ${req.intern?.internId} logged out successfully`, {
    label: "LogoutController",
  });
  successResponse(req, res, 200, "Logout successful");
};

export default logoutController;
