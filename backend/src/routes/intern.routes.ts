// ============================================
//  🔹 Auth Route Section
// ============================================
import createInternController from "@/controllers/intern/create-intern.controller.js";
import asyncHandler from "@/middlewares/async-handler.middleware.js";
import authenticateMiddleware from "@/middlewares/authenticate.middleware.js";
import {
  limiters,
  rateLimitMiddleware,
} from "@/middlewares/rate-limiter.middleware.js";
import validateRequestMiddleware from "@/middlewares/validate-request.middleware.js";
import { createInternSchema } from "@/validator/intern.validator.js";
import { Router } from "express";

// Create a new router instance
const router = Router();

// ------------------------------------------------------
// 1️⃣ Create Intern Route (admin only)
// ------------------------------------------------------
router.route("/create-intern").post(
  authenticateMiddleware(["admin"]),
  rateLimitMiddleware(
    limiters.adminLimiter,
    (req) => req.intern?.role as string
  ),
  validateRequestMiddleware(createInternSchema),
  asyncHandler(createInternController)
);

// ------------------------------------------------------
// 2️⃣ Login Route
// ------------------------------------------------------

// ------------------------------------------------------
// 3️⃣ Logout Route
// ------------------------------------------------------

// ------------------------------------------------------
// 4️⃣ Refresh token Route
// ------------------------------------------------------

export default router;
