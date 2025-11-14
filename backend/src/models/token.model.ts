// ============================================
//  🔹 Token Model
// ============================================
import mongoose, {
  type HydratedDocument,
  type Model,
  Schema,
  type Types,
} from "mongoose";

// ------------------------------------------------------
// 1️⃣ Define Token Interfaces
// ------------------------------------------------------
export interface IToken {
  _id: Types.ObjectId;
  token: string;
  internId: Types.ObjectId;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Document and Mode type
export type TokenDocument = HydratedDocument<IToken>;
export type TokenModelType = Model<IToken>;
export type TokenObject = IToken;

// ------------------------------------------------------
// 2️⃣ Define Token Schema
// ------------------------------------------------------
const tokenSchema = new Schema<IToken, TokenModelType>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    token: {
      type: String,
      required: [true, "Token is required"],
      index: true,
      unique: true,
    },
    internId: {
      type: Schema.Types.ObjectId,
      required: [true, "Intern ID is required"],
      ref: "Intern",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ------------------------------------------------------
// 3️⃣ Token Model export
// ------------------------------------------------------
const TokenModel = mongoose.model<IToken, TokenModelType>("Token", tokenSchema);

export default TokenModel;
