import { z } from "zod";

const validate = <T>(schema: z.ZodType<T>, data: unknown): T => {
  const parsedData = schema.safeParse(data);

  if (!parsedData.success) {
    const issues = parsedData.error.issues.map((issue) => ({
      field: issue.path.join("."),
      mesage: issue.message,
    }));
    throw new Error(`Validation failed: ${JSON.stringify(issues)}`);
  }

  return parsedData.data;
};

export default validate;
