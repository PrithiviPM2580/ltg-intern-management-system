import type { NextFunction, Request, Response } from "express";
import {
	type IRateLimiterOptions,
	RateLimiterMemory,
	RateLimiterRes,
} from "rate-limiter-flexible";
import logger from "@/lib/logger.lib.js";
import APIError from "@/utils/errors.utils.js";
import { keyGetter } from "@/utils/index.utils.js";

const adminOptions: IRateLimiterOptions = {
	points: 200, // 200 requests
	duration: 60, // per 60 seconds
	blockDuration: 300, // block for 5 minutes if consumed more than points
};

const authOptions: IRateLimiterOptions = {
	points: 20, // 20 requests
	duration: 60, // per 60 seconds
	blockDuration: 300, // block for 5 minutes if consumed more than points
};

const internOptions: IRateLimiterOptions = {
	points: 100, // 100 requests
	duration: 60, // per 60 seconds
	blockDuration: 300, // block for 5 minutes if consumed more than points
};

export const limiters = {
	adminLimiter: new RateLimiterMemory(adminOptions),
	authLimiter: new RateLimiterMemory(authOptions),
	internLimiter: new RateLimiterMemory(internOptions),
};

export const rateLimitMiddleware =
	(limiter: RateLimiterMemory, getKey: (req: Request) => string = keyGetter) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const key = getKey(req);
		try {
			const rateLimitRes: RateLimiterRes = await limiter.consume(key);

			res.set({
				"X-RateLimit-Limit": limiter.points.toString(),
				"X-RateLimit-Remaining": rateLimitRes.remainingPoints.toString(),
				"X-RateLimit-Reset": new Date(
					Date.now() + rateLimitRes.msBeforeNext,
				).toISOString(),
			});

			next();
		} catch (error) {
			if (error instanceof RateLimiterRes) {
				res.set({
					"Retry-After": Math.ceil(error.msBeforeNext / 1000).toString(),
					"X-RateLimit-Limit": limiter.points.toString(),
					"X-RateLimit-Remaining": "0",
					"X-RateLimit-Reset": new Date(
						Date.now() + error.msBeforeNext,
					).toISOString(),
				});

				logger.warn(
					`Rate limit exceeded: key=${key}, limit=${limiter.points}, resetIn=${error.msBeforeNext}ms`,
				);

				return next(
					new APIError(429, "Too Many Requests - Please try again later"),
				);
			}

			logger.error("Rate limiting error", {
				label: "RateLimiterMiddleware",
				error,
			});
			return next(error);
		}
	};
