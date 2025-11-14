// ============================================
//  🔹 Logout Contoroller
// ============================================

import type { NextFunction, Request, Response } from "express";
import cookie from "@/lib/cookie.lib.js";
import logger from "@/lib/logger.lib.js";
import { logoutService } from "@/services/auth.service.js";
import APIError from "@/utils/errors.utils.js";
import { successResponse } from "@/utils/index.utils.js";
import { verifyRefreshToken } from "@/lib/jwt.lib.js";

// ------------------------------------------------------
//1️⃣ Logout Controller
// ------------------------------------------------------
const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Read refresh token from cookie
  const refreshToken = cookie.get(req, "refreshToken");

  // Validate presence of refresh token
  if (!refreshToken) {
    return next(
      new APIError(401, "Refresh token missing", {
        type: "UnauthorizedError",
        details: [
          { message: "No refresh token found. User already logged out." },
        ],
      })
    );
  }

  // Decode token only to get internId for logging (optional)
  const payload = verifyRefreshToken(refreshToken);
  logger.info(`Processing logout for intern ID: ${payload?.internId}`, {
    label: "LogoutController",
  });

  // Call logout service
  const isLoggedOut = await logoutService(refreshToken);

  // Validate service response
  if (!isLoggedOut) {
    logger.error(`Logout failed for intern ID: ${payload?.internId}`, {
      label: "LogoutController",
    });
    return next(
      new APIError(500, "Logout failed", {
        type: "InternalServerError",
      })
    );
  }

  // Clear refresh token cookie
  cookie.clear(res, "refreshToken");

  // Send success response
  logger.info(`Intern ID: ${payload?.internId} logged out successfully`, {
    label: "LogoutController",
  });
  successResponse(req, res, 200, "Logout successful");
};

export default logoutController;
