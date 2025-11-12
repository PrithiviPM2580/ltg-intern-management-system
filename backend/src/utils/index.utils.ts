import type { Request, Response } from "express";
import type { ZodError } from "zod";
import logger from "@/lib/logger.lib.js";

export const timeStampToDate = () => {
	return new Date().toISOString();
};

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

export const keyGetter = (req: Request): string => {
	if (req.user?.userId) {
		return `user-${req.user.userId.toString()}`;
	} else {
		return `ip-${req.ip}`;
	}
};

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

export const formatIssues = (issues: ZodError["issues"]) => {
	return issues.map((issue) => ({
		field: issue.path.join("."),
		message: issue.message,
	}));
};
