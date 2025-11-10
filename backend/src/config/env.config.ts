import "dotenv/config";
import validate from "lib/validate.lib.js";
import envSchema from "validator/env.validator.js";

const envConfig = {
  PORT: process.env.PORT!,
  NODE_ENV: process.env.NODE_ENV!,
  DB_URL: process.env.DB_URL!,
  DB_NAME: process.env.DB_NAME!,
  APP_NAME: process.env.APP_NAME!,
  LOG_LEVEL: process.env.LOG_LEVEL!,
};

const config = validate(envSchema, envConfig);

export default config;
