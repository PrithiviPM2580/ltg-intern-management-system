// ============================================
//  🔹 Types defination
// ============================================

import type { Request, Response } from "express";
import { Types } from "mongoose";
import { ZodTypeAny } from "zod";

declare global {
	type Role = "admin" | "intern";
	type TokenPayload = {
		internId?: Types.ObjectId;
		role?: "admin" | "intern";
	};
	type ErrorDetail = {
		field?: string;
		message?: string;
	};

	type ErrorInfo = {
		type: string;
		details?: ErrorDetail[];
	};

	type APIErrorType = string | ErrorInfo;

	interface LogOptions {
		req: Request;
		res?: Response;
		message?: string;
		data?: unknown;
		error?: unknown;
	}

	type RequestValidate = {
		body?: ZodTypeAny;
		query?: ZodTypeAny;
		params?: ZodTypeAny;
	};
}
