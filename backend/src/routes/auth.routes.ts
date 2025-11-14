// ============================================
//  🔹 Auth Route Section
// ============================================
import { Router } from "express";
import loginContoller from "@/controllers/auth/login.controller.js";
import logoutController from "@/controllers/auth/logout.controller.js";
import refreshTokenController from "@/controllers/auth/refresh-token.controller.js";
import signupController from "@/controllers/auth/sign-up.controller.js";
import asyncHandler from "@/middlewares/async-handler.middleware.js";
import authenticateMiddleware from "@/middlewares/authenticate.middleware.js";
import {
	limiters,
	rateLimitMiddleware,
} from "@/middlewares/rate-limiter.middleware.js";
import validateRequestMiddleware from "@/middlewares/validate-request.middleware.js";
import { loginSchema, signupSchema } from "@/validator/auth.validator.js";

// Create a new router instance
const router = Router();

// ------------------------------------------------------
// 1️⃣ Signup Route
// ------------------------------------------------------
router.route("/sign-up").post(
	validateRequestMiddleware(signupSchema),
	rateLimitMiddleware(limiters.authLimiter, (req) => req.ip as string),
	asyncHandler(signupController),
);

// ------------------------------------------------------
// 2️⃣ Login Route
// ------------------------------------------------------
router.route("/login").post(
	validateRequestMiddleware(loginSchema),
	rateLimitMiddleware(limiters.authLimiter, (req) => req.ip as string),
	asyncHandler(loginContoller),
);

// ------------------------------------------------------
// 3️⃣ Logout Route
// ------------------------------------------------------
router.route("/logout").post(
	rateLimitMiddleware(limiters.authLimiter, (req) => req.ip as string),
	authenticateMiddleware(),
	asyncHandler(logoutController),
);

// ------------------------------------------------------
// 4️⃣ Refresh token Route
// ------------------------------------------------------
router.route("/refresh-token").post(
	rateLimitMiddleware(limiters.authLimiter, (req) => req.ip as string),
	asyncHandler(refreshTokenController),
);

export default router;
