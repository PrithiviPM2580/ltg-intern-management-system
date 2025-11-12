import type { z } from "zod";
import APIError from "@/utils/errors.utils.js";

const validate = <T>(schema: z.ZodType<T>, data: unknown): T => {
  const parsedData = schema.safeParse(data);

  if (!parsedData.success) {
    const issues = parsedData.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    throw new APIError(500, "Validation Error", {
      type: "ValidationError",
      details: issues,
    });
  }

  return parsedData.data;
};

export default validate;
