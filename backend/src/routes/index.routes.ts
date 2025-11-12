// ============================================
//  🔹 Routes
// ============================================

import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import mongoose from "mongoose";
import config from "@/config/env.config.js";
import { logRequest, successResponse } from "@/utils/index.utils.js";

// Create a new router instance
const router = Router();

// ------------------------------------------------------
// 1️⃣ Root Route
// ------------------------------------------------------

router.route("/").get((req: Request, res: Response, next: NextFunction) => {
	try {
		successResponse(
			req,
			res,
			200,
			"LTG Intern Management System API is running successfully",
			{
				appName: "LTG Intern Management System",
				status: "running",
				timestamp: new Date().toISOString(),
				version: config.APP_VERSION,
				env: config.NODE_ENV,
			},
		);
	} catch (error) {
		logRequest({ req, res, message: "Error in root route", error });
		next(error);
	}
});

// ------------------------------------------------------
// 2️⃣ Health Check Route
// ------------------------------------------------------

router
	.route("/health")
	.get((req: Request, res: Response, next: NextFunction) => {
		try {
			const dbState =
				mongoose.connection.readyState === 1 ? "connected" : "disconnected";
			successResponse(req, res, 200, "Health Check Successful", {
				status: "ok",
				service: " LTG Intern Management System",
				database: dbState,
				uptime: process.uptime(),
				memoryUsage: `${process.memoryUsage().heapUsed / 1024 / 1024} MB`,
				timestamp: new Date().toISOString(),
			});
		} catch (error) {
			logRequest({ req, res, message: "Error in health route", error });
			next(error);
		}
	});

export default router;
