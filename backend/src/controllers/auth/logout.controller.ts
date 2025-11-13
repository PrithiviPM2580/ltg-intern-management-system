// ============================================
//  🔹 Logout Contoroller
// ============================================

import type { NextFunction, Request, Response } from "express";
import cookie from "@/lib/cookie.lib.js";
import logger from "@/lib/logger.lib.js";
import { logoutService } from "@/services/auth.service.js";
import APIError from "@/utils/errors.utils.js";
import { successResponse } from "@/utils/index.utils.js";

// ------------------------------------------------------
//1️⃣ Logout Controller
// ------------------------------------------------------
const logoutController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Validate intern authentication
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
			}),
		);
	}

	// Call logout service
	const isLoggedOut = await logoutService(req.intern?.internId);

	// Validate service response
	if (!isLoggedOut) {
		logger.error(`Logout failed for intern ID: ${req.intern?.internId}`, {
			label: "LogoutController",
		});
		return next(
			new APIError(500, "Logout failed", {
				type: "InternalServerError",
			}),
		);
	}

	// Clear refresh token cookie
	cookie.clear(res, "refreshToken");

	// Send success response
	logger.info(`Intern ID: ${req.intern?.internId} logged out successfully`, {
		label: "LogoutController",
	});
	successResponse(req, res, 200, "Logout successful");
};

export default logoutController;
