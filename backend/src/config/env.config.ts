import "dotenv/config";
import validate from "@/lib/validate.lib.js";
import envSchema from "@/validator/env.validator.js";

const envConfig = {
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,
	DB_URI: process.env.DB_URI,
	DB_NAME: process.env.DB_NAME,
	APP_NAME: process.env.APP_NAME,
	LOG_LEVEL: process.env.LOG_LEVEL,
	APP_VERSION: process.env.APP_VERSION,
};

const config = validate(envSchema, envConfig);

export default config;
