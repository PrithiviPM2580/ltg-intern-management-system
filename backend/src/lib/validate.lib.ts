// ============================================
//  🔹 Validate Lib
// ============================================
import type { ZodTypeAny, z } from "zod";
import APIError from "@/utils/errors.util.js";

// ------------------------------------------------------
// 1️⃣ Validate Lib
// ------------------------------------------------------
const validate = <T extends ZodTypeAny>(
	schema: T,
	data: unknown,
): z.infer<T> => {
	// Parse and validate the data against the schema
	const parsedData = schema.safeParse(data);

	// If validation fails, throw an APIError with details
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

	// Return the validated data
	return parsedData.data;
};

export default validate;
