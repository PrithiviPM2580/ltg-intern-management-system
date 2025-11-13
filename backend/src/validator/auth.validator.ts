// ============================================
//  🔹 Auth Validator
// ============================================
import { z } from "zod";

// ------------------------------------------------------
// 1️⃣ Signup Schema
// ------------------------------------------------------
export const signupSchema = {
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["admin", "intern"]).optional(),
  }),
};

// ------------------------------------------------------
// 2️⃣ Login Schema
// ------------------------------------------------------
export const loginSchema = {
  body: z
    .object({
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    })
    .strict(),
};

// ------------------------------------------------------
// Define the type definitions for request bodies
// ------------------------------------------------------
export type SignupRequest = z.infer<typeof signupSchema.body>;
export type LoginRequest = z.infer<typeof loginSchema.body>;
