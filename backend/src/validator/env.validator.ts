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
});

export default envSchema;
