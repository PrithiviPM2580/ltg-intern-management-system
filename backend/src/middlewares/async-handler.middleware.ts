// ============================================
//  🔹 Async handler Middleware
// ============================================
import type { NextFunction, Request, Response } from "express";

// ------------------------------------------------------
// 1️⃣ Async Handler Middleware
// ------------------------------------------------------
const asyncHandler =
	(
		controller: (
			req: Request,
			res: Response,
			next: NextFunction,
		) => Promise<void>,
	) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		// Execute the controller and catch any errors
		controller(req, res, next).catch(next);
	};

export default asyncHandler;
