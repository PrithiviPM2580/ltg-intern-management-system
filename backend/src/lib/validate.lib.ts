import { z } from "zod";
import logger from "./logger.lib.js";
import { APIError } from "utils/index.utils.js";

const validate = <T>(schema: z.ZodType<T>, data: unknown): T => {
  const parsedData = schema.safeParse(data);

  if (!parsedData.success) {
    const issues = parsedData.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    logger.error("Environment validation failed", {
      label: "ValidateLib",
      issues,
    });
    throw new APIError(500, "Validation Error", {
      type: "ValidationError",
      details: issues,
    });
  }

  return parsedData.data;
};

export default validate;
