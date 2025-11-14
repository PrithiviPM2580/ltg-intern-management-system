// ============================================
//  🔹 Intern Dao
// ============================================

import type { Types } from "mongoose";
import InternModel from "@/models/intern.model.js";
import type { CreateInternRequest } from "@/validator/intern.validator.js";

// ------------------------------------------------------
// 1️⃣ Dao to create intern
// ------------------------------------------------------
export const createIntern = async (
	internId: Types.ObjectId,
	data: CreateInternRequest,
) => {
	return await InternModel.create({
		_id: internId,
		...data,
	});
};
