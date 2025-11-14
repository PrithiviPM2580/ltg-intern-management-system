// ============================================
//  🔹 Signup Controller
// ============================================

import type { NextFunction, Request, Response } from "express";
import cookie from "@/lib/cookie.lib.js";
import { signupService } from "@/services/auth.service.js";
import APIError from "@/utils/errors.util.js";
import { successResponse } from "@/utils/index.util.js";
import type { SignupRequest } from "@/validator/auth.validator.js";

// ------------------------------------------------------
// 1️⃣ Signup Contoller
// ------------------------------------------------------
const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Call signup service
  const { intern, accessToken, refreshToken } = await signupService(
    req.body as SignupRequest
  );

  // Validate service response
  if (!intern || !accessToken || !refreshToken) {
    return next(
      new APIError(500, " Internal Server Error", {
        type: "InternalServerError",
        details: [
          {
            field: "server",
            message: "Failed to register intern",
          },
        ],
      })
    );
  }

  // Set refresh token in HTTP-only cookie
  cookie.set(res, "refreshToken", refreshToken);

  // Send success response
  successResponse(req, res, 201, "Intern registered successfully", {
    intern,
    accessToken,
  });
};

export default signupController;
