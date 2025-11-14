// ============================================
//  🔹 Login Controller
// ============================================
import type { NextFunction, Request, Response } from "express";
import cookie from "@/lib/cookie.lib.js";
import { loginService } from "@/services/auth.service.js";
import APIError from "@/utils/errors.util.js";
import { successResponse } from "@/utils/index.util.js";
import type { LoginRequest } from "@/validator/auth.validator.js";

// ------------------------------------------------------
// 1️⃣ Login Controller
// ------------------------------------------------------
const loginContoller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Call the login service
  const { intern, accessToken, refreshToken } = await loginService(
    req.body as LoginRequest
  );

  // Validate service response
  if (!intern || !accessToken || !refreshToken) {
    return next(
      new APIError(500, "Internal Server Error", {
        type: "InternalServerError",
        details: [
          {
            field: "server",
            message: "Failed to process login",
          },
        ],
      })
    );
  }

  // Set refresh token in HTTP-only cookie
  cookie.set(res, "refreshToken", refreshToken);

  // Send success response
  successResponse(req, res, 200, "Login successful", {
    intern,
    accessToken,
  });
};

export default loginContoller;
