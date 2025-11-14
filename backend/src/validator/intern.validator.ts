// ============================================
//  🔹 Intern Validator
// ============================================
import app from "@/app.js";
import { z } from "zod";

// ------------------------------------------------------
// 1️⃣ Create Intern Schema
// ------------------------------------------------------
export const createInternSchema = {
  body: z.object({
    fullName: z
      .string({ required_error: "Full name is required" })
      .min(3, "Full name must be at least 3 characters long"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters long")
      .max(15, "Phone number can not be more than 15 characters"),
    location: z
      .string()
      .min(2, "Location must be at least 2 characters long")
      .max(100, "Location can not be more than 100 characters"),
    position: z
      .string()
      .min(2, "Position must be at least 2 characters long")
      .max(100, "Position can not be more than 100 characters"),
    department: z
      .string()
      .min(2, "Department must be at least 2 characters long")
      .max(100, "Department can not be more than 100 characters"),
    supervisorName: z
      .string()
      .min(3, "Supervisor name must be at least 3 characters long")
      .max(100, "Supervisor name can not be more than 100 characters"),
    approvalStatus: z.enum(["pending", "approved", "rejected"], {
      required_error: "Approval status is required",
    }),
    startDate: z.coerce.date({ required_error: "Start date is required" }),
    endDate: z.coerce.date({ required_error: "End date is required" }),
  }),
};

// ------------------------------------------------------
//   Define the type definitions for request bodies
// ------------------------------------------------------
export type CreateInternRequest = z.infer<typeof createInternSchema.body>;
