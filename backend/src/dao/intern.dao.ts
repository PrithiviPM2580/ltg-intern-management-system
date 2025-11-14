// ============================================
//  🔹 Intern Dao
// ============================================
import InternModel, { IIntern, InternDocument } from "@/models/intern.model.js";
import { CreateInternRequest } from "@/validator/intern.validator.js";
import { Types } from "mongoose";

// ------------------------------------------------------
// 1️⃣ Dao to create intern
// ------------------------------------------------------
export const createIntern = async (
  internId: Types.ObjectId,
  data: CreateInternRequest
) => {
  return await InternModel.create({
    _id: internId,
    ...data,
  });
};
