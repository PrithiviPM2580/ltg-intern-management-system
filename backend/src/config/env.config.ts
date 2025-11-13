// ============================================
//  🔹 Environment Config
// ============================================
import "dotenv/config";
import validate from "@/lib/validate.lib.js";
import envSchema from "@/validator/env.validator.js";

// ------------------------------------------------------
// 1️⃣ Environment Config
// ------------------------------------------------------
const envConfig = {
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,
	DB_URI: process.env.DB_URI,
	DB_NAME: process.env.DB_NAME,
	APP_NAME: process.env.APP_NAME,
	LOG_LEVEL: process.env.LOG_LEVEL,
	APP_VERSION: process.env.APP_VERSION,
	ADMIN_EMAIL: process.env.ADMIN_EMAIL,
	JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
	JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
	JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
	JWT_REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
};

// Validate and export the config
const config = validate(envSchema, envConfig);

export default config;
