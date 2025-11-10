import type { NextFunction, Request, Response } from "express";

const asyncHandler =
	(
		controller: (
			req: Request,
			res: Response,
			next: NextFunction,
		) => Promise<void>,
	) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		controller(req, res, next).catch(next);
	};

export default asyncHandler;
