// ============================================
//  🔹 Jwt Lib
// ============================================
import jwt, { type SignOptions } from "jsonwebtoken";
import config from "@/config/env.config.js";
import logger from "@/lib/logger.lib.js";
import APIError from "@/utils/errors.utils.js";

// ------------------------------------------------------
// 1️⃣ SignToken utility
// ------------------------------------------------------
const signToken = <T extends object>(
	payload: T,
	secret: string,
	expiresIn: string | number,
): string => {
	return jwt.sign(payload, secret, {
		expiresIn: expiresIn as SignOptions["expiresIn"],
	});
};

// ------------------------------------------------------
// 2️⃣ Verify token utility
// ------------------------------------------------------
const verifyToken = <T extends object>(
	token: string,
	secret: string,
): T | null => {
	try {
		return jwt.verify(token, secret) as T;
	} catch (error) {
		logger.error("Token verification failed:", {
			label: "JWT_LIB",
			error: (error as Error).message,
		});
		throw new APIError(401, "Invalid or expired token", {
			type: "TokenError",
			details: [
				{
					field: "token",
					message: "The provided token is invalid or has expired.",
				},
			],
		});
	}
};

// ------------------------------------------------------
// 3️⃣ Generate access token using signtoken utility
// ------------------------------------------------------
export const generateAccessToken = (payload: TokenPayload) =>
	signToken(
		payload,
		config.JWT_ACCESS_TOKEN_SECRET,
		config.JWT_ACCESS_TOKEN_EXPIRATION,
	);

// ------------------------------------------------------
// 4️⃣ Generate refresh token using signtoken utility
// ------------------------------------------------------
export const generateRefreshToken = (payload: TokenPayload) =>
	signToken(
		payload,
		config.JWT_REFRESH_TOKEN_SECRET,
		config.JWT_REFRESH_TOKEN_EXPIRATION,
	);

// ------------------------------------------------------
// 5️⃣ Verify access token using verify token utility
// ------------------------------------------------------
export const verifyAccessToken = (token: string) =>
	verifyToken<TokenPayload>(token, config.JWT_ACCESS_TOKEN_SECRET);

// ------------------------------------------------------
// 6️⃣ Verify refresh token using verify token utility
// ------------------------------------------------------
export const verifyRefreshToken = (token: string) =>
	verifyToken<TokenPayload>(token, config.JWT_REFRESH_TOKEN_SECRET);
