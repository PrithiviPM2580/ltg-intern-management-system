// ============================================
//  🔹 Signup Controller
// ============================================

import type { NextFunction, Request, Response } from "express";
import cookie from "@/lib/cookie.lib.js";
import { signupService } from "@/services/auth.service.js";
import APIError from "@/utils/errors.utils.js";
import { successResponse } from "@/utils/index.utils.js";
import type { SignupRequest } from "@/validator/auth.validator.js";

// ------------------------------------------------------
// 1️⃣ Signup Contoller
// ------------------------------------------------------
const signupController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const { intern, accessToken, refreshToken } = await signupService(
		req.body as SignupRequest,
	);

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
			}),
		);
	}

	cookie.set(res, "refreshToken", refreshToken);

	successResponse(req, res, 201, "Intern registered successfully", {
		intern,
		accessToken,
	});
};

export default signupController;
