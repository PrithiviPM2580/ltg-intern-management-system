// ============================================
//  🔹 Refresh Token Contoller
// ============================================
import cookie from "@/lib/cookie.lib.js";
import logger from "@/lib/logger.lib.js";
import { refreshTokenService } from "@/services/auth.service.js";
// import { refreshTokenService } from "@/services/auth.service.js";
import APIError from "@/utils/errors.utils.js";
import { successResponse } from "@/utils/index.utils.js";
import type { Request, Response, NextFunction } from "express";

// ------------------------------------------------------
// 1️⃣ Refresh Token Controller
// ------------------------------------------------------
const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Extract refresh token from cookies
  const refreshToken = cookie.get(req, "refreshToken");

  // Validate presence of refresh token
  if (!refreshToken) {
    logger.warn("No refresh token found in cookies", {
      label: "REFRESH_TOKEN_CONTROLLER",
    });
    next(
      new APIError(401, "Authentication required. Please log in again.", {
        type: "Unauthorized",
        details: [
          {
            field: "refreshToken",
            message: "No refresh token provided",
          },
        ],
      })
    );
  }

  // Call refresh token service
  const { newAccessToken, newRefreshToken } = await refreshTokenService(
    refreshToken as string
  );

  // Set new refresh token in cookies
  cookie.set(res, "refreshToken", newRefreshToken);

  // Log the token refresh event
  logger.info("Refresh token rotated and new access token issued", {
    label: "REFRESH_TOKEN_CONTROLLER",
  });

  // Send success response with new access token
  successResponse(req, res, 200, "Token refreshed successfully", {
    accessToken: newAccessToken,
  });
};

export default refreshTokenController;
