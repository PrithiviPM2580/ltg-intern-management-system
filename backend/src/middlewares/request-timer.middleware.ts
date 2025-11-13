// ============================================
//  🔹 Request Timer middleware
// ============================================
import type { NextFunction, Request, Response } from "express";

// ------------------------------------------------------
// 1️⃣ Request Timer middleware
// ------------------------------------------------------
const requestTimerMiddleware = (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	// Store the start time of the request
	res.locals.startTime = Date.now();

	// Calculate and store the response time when the response is finished
	res.on("finish", () => {
		const responseTime = Date.now() - res.locals.startTime;
		res.locals.responseTime = `${responseTime}ms`;
	});
	next();
};

export default requestTimerMiddleware;
