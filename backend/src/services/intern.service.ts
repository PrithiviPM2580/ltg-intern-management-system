// ============================================
//  🔹 Intern Service
// ============================================

import { generateMongooseId } from "@/utils/index.util.js";
import { CreateInternRequest } from "@/validator/intern.validator.js";
import { createIntern } from "@/dao/intern.dao.js";
import { Types } from "mongoose";

// ------------------------------------------------------
// 1️⃣ Create Intern Service
// ------------------------------------------------------
export const createInternService = async (data: CreateInternRequest) => {
  const internId: Types.ObjectId = generateMongooseId();
  return await createIntern(internId, data);
};
