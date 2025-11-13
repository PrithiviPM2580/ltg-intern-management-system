import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  APP_NAME: z.string().default("LTG Intern Management System"),
  DB_NAME: z.string().default("ltg_intern_management_system"),
  DB_URI: z.string().min(1, { message: "DB_URI is required" }),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  APP_VERSION: z.string().default("1.0.0"),
  ADMIN_EMAIL: z
    .string()
    .default("")
    .transform((val) =>
      val
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter((email) => email.length > 0)
    ),
  JWT_ACCESS_TOKEN_SECRET: z
    .string()
    .min(1, { message: "JWT_ACCESS_TOKEN_SECRET is required" }),
  JWT_REFRESH_TOKEN_SECRET: z
    .string()
    .min(1, { message: "JWT_REFRESH_TOKEN_SECRET is required" }),
  JWT_ACCESS_TOKEN_EXPIRATION: z.string().default("15m"),
  JWT_REFRESH_TOKEN_EXPIRATION: z.string().default("7d"),
});

export default envSchema;
