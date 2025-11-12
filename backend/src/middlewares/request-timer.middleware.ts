import type { NextFunction, Request, Response } from "express";

const requestTimerMiddleware = (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	res.locals.startTime = Date.now();

	res.on("finish", () => {
		const responseTime = Date.now() - res.locals.startTime;
		res.locals.responseTime = `${responseTime}ms`;
	});
	next();
};

export default requestTimerMiddleware;
