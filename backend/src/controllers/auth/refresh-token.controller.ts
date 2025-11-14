// ============================================
//  🔹 Refresh Token Contoller
// ============================================
import cookie from "@/lib/cookie.lib.js";
import logger from "@/lib/logger.lib.js";
// import { refreshTokenService } from "@/services/auth.service.js";
import APIError from "@/utils/errors.utils.js";
import type { Request, Response, NextFunction } from "express";

// ------------------------------------------------------
// 1️⃣ Refresh Token Controller
// ------------------------------------------------------
const refreshTokenController = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Extract refresh token from cookies
  const refreshToken = cookie.get(req, "refreshToken");
  console.log(refreshToken);

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

  //   const {}= await refreshTokenService(refreshToken);

  //   return {};
  return Promise.resolve();
};

export default refreshTokenController;
