// ============================================
//  🔹 Auth Dao
// ============================================

import type { Types } from "mongoose";
import InternModel from "@/models/intern.model.js";
import TokenModel, { type IToken } from "@/models/token.model.js";
import type { SignupRequest } from "@/validator/auth.validator.js";

// ------------------------------------------------------
//  1️⃣ Dao to find intern by email (return InternModel)
// ------------------------------------------------------
export const findInternByEmail = async (email: string) => {
  return InternModel.findOne({ email }).select("+password");
};

// ------------------------------------------------------
// 2️⃣ Dao to know if the inter email exist (return boolean)
// ------------------------------------------------------
export const isInternEmailExist = async (email: string): Promise<boolean> => {
  const intern = await InternModel.exists({ email });
  return !!intern;
};

// ------------------------------------------------------
// 3️⃣ Dao to create the intern
// ------------------------------------------------------
export const createIntern = async (
  data: SignupRequest,
  internId: Types.ObjectId
) => {
  return InternModel.create({
    _id: internId,
    ...data,
  });
};

// ------------------------------------------------------
// 4️⃣ Dao to create token
// ------------------------------------------------------
export const createToken = async (data: IToken) => {
  await TokenModel.create(data);
};

// ------------------------------------------------------
// 5️⃣ Dao to delete the refresh token
// ------------------------------------------------------
export const deleteRefreshToken = async (internId: Types.ObjectId) => {
  return TokenModel.deleteOne({ internId });
};
