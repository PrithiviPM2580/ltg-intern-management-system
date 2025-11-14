// ============================================
//  🔹 Intern Service
// ============================================

import type { Types } from "mongoose";
import { createIntern } from "@/dao/intern.dao.js";
import { generateMongooseId } from "@/utils/index.util.js";
import type { CreateInternRequest } from "@/validator/intern.validator.js";

// ------------------------------------------------------
// 1️⃣ Create Intern Service
// ------------------------------------------------------
export const createInternService = async (data: CreateInternRequest) => {
	const internId: Types.ObjectId = generateMongooseId();
	return await createIntern(internId, data);
};
