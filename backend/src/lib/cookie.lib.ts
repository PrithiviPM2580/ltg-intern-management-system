// ============================================
//  🔹 Cookie Lib
// ============================================
import type { CookieOptions, Request, Response } from "express";

// ------------------------------------------------------
// 1️⃣ Cookie for set,get and clear
// ------------------------------------------------------
const cookie = {
	// Default cookie options
	getOptions: (): CookieOptions => ({
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 15 * 60 * 1000, // 15 minutes
	}),
	// Set cookie
	set: (
		res: Response,
		name: string,
		value: string,
		options: CookieOptions = {},
	): void => {
		res.cookie(name, value, { ...cookie.getOptions(), ...options });
	},
	// Clear cookie
	clear: (res: Response, name: string, options: CookieOptions = {}): void => {
		res.clearCookie(name, { ...cookie.getOptions(), ...options });
	},
	// Get cookie
	get: (req: Request, name: string): string | undefined => {
		return req.cookies ? req.cookies[name] : undefined;
	},
};

export default cookie;
