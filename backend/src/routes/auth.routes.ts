// ============================================
//  🔹 Auth Route Section
// ============================================
import { Router } from "express";
import {
  rateLimitMiddleware,
  limiters,
} from "@/middlewares/rate-limiter.middleware.js";
import asyncHandler from "@/middlewares/async-handler.middleware.js";
import loginContoller from "@/controllers/auth/login.controller.js";
import validateRequestMiddleware from "@/middlewares/validate-request.middleware.js";
import { loginSchema } from "@/validator/auth.validator.js";

// Create a new router instance
const router = Router();

// ------------------------------------------------------
// 1️⃣ Login Route
// ------------------------------------------------------
router.route("/login").post(
  validateRequestMiddleware(loginSchema),
  rateLimitMiddleware(limiters.authLimiter, (req) => req.ip as string),
  asyncHandler(loginContoller)
);

export default router;
