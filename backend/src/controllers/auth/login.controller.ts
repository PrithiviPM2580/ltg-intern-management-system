import type { NextFunction, Request, Response } from "express";
import { loginService } from "@/services/auth.service.js";
import type { LoginRequest } from "@/validator/auth.validator.js";
import APIError from "@/utils/errors.utils.js";
import cookie from "@/lib/cookie.lib.js";
import { successResponse } from "@/utils/index.utils.js";

const loginContoller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { intern, accessToken, refreshToken } = await loginService(
    req.body as LoginRequest
  );

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

  cookie.set(res, "refreshToken", refreshToken);
  successResponse(req, res, 200, "Login successful", {
    intern,
    accessToken,
  });
};

export default loginContoller;
