// ============================================
//  🔹 Utility Functions
// ============================================
import type { Request, Response } from "express";
import { Types } from "mongoose";
import type { ZodError } from "zod";
import logger from "@/lib/logger.lib.js";

// ------------------------------------------------------
// 1️⃣ Date to ISO String
// ------------------------------------------------------
export const timeStampToDate = () => {
	return new Date().toISOString();
};

// ------------------------------------------------------
// 2️⃣ Convert logger to logRequest with more monitoring
// ------------------------------------------------------
export const logRequest = ({ req, res, message, data, error }: LogOptions) => {
	const responseTime = `${Date.now() - (res?.locals.startTime || 0)}ms`;

	const meta: Record<string, unknown> = {
		timestamp: timeStampToDate(),
		method: req.method,
		url: req.originalUrl,
		baseUrl: req.baseUrl || "",
		ip: req.ip || req.socket.remoteAddress,
		userAgent: req.headers["user-agent"] || "",
		body: req.body || {},
		query: req.query || {},
		params: req.params || {},
		statusCode: res?.statusCode,
		responseTime,
	};

	if (data) meta.data = data;
	if (error) meta.error = error;

	error
		? logger.error(message || "Error occurred in middleware", meta)
		: logger.info(message || "Request completed", meta);
};

// ------------------------------------------------------
// 3️⃣ Key getter return the userId or ip for rate-limiting
// ------------------------------------------------------
export const keyGetter = (req: Request): string => {
	if (req.intern?.internId) {
		return `user-${req.intern.internId.toString()}`;
	} else {
		return `ip-${req.ip}`;
	}
};

// --------------------------------------------------------
// 4️⃣ Success response return the sucess json with logging
// --------------------------------------------------------
export const successResponse = <T>(
	req: Request,
	res: Response,
	statusCode: number = 200,
	message: string,
	data?: T,
) => {
	logRequest({
		req,
		res,
		message,
		data,
	});
	return res.status(statusCode).json({
		success: true,
		statusCode,
		message,
		data,
	});
};

// --------------------------------------------------------
// 5️⃣ Format Zod validation issues
// --------------------------------------------------------
export const formatIssues = (issues: ZodError["issues"]) => {
	return issues.map((issue) => ({
		field: issue.path.join("."),
		message: issue.message,
	}));
};

// ------------------------------------------------------
// 6️⃣ Generate new mongoose id
// ------------------------------------------------------
export const generateMongooseId = (): Types.ObjectId => {
	return new Types.ObjectId();
};

// ------------------------------------------------------
// 7️⃣ 7day timestamp
// ------------------------------------------------------
export const sevenDaysFromNow = (): Date => {
	return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
};
