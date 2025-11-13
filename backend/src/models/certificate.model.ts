// ============================================
//  🔹 Certificate Model
// ============================================

import mongoose, {
  Schema,
  type Model,
  type HydratedDocument,
  type Types,
} from "mongoose";

// ------------------------------------------------------
// 1️⃣ Define the certificate interfaces
// ------------------------------------------------------
export interface ICertificate {
  _id: Types.ObjectId;
  internId: Types.ObjectId;
  courseName: string;
  courseCategory: string;
  issueDate: Date;
  expiryDate: Date;
  status: "issued" | "expired" | "revoked" | "pending";
  certificateId: string;
  complitionScore: number;
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "E+" | "E";
  instructorId: Types.ObjectId;
  department: string;
  verificationCode: string;
  priority: "high" | "medium" | "low";
  documentUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Document and Model type
export type CertificateDocument = HydratedDocument<ICertificate>;
export type CertificateModelType = Model<ICertificate>;
export type CertificateObject = ICertificate;

// ------------------------------------------------------
// 2️⃣ Define Certificate Schema
// ------------------------------------------------------
const certificateSchema = new Schema<ICertificate, CertificateModelType>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    internId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Intern",
    },
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    courseCategory: {
      type: String,
      required: [true, "Course category is required"],
      trim: true,
    },
    issueDate: {
      type: Date,
      required: [true, "Issue date is required"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    status: {
      type: String,
      enum: ["issued", "expired", "revoked", "pending"],
      default: "pending",
    },
    certificateId: {
      type: String,
      required: [true, "Certificate ID is required"],
      unique: true,
      trim: true,
    },
    complitionScore: {
      type: Number,
      required: [true, "Completion score is required"],
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      enum: ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "E+", "E"],
      required: [true, "Grade is required"],
    },
    instructorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Intern",
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    verificationCode: {
      type: String,
      required: [true, "Verification code is required"],
      unique: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    documentUrl: {
      type: String,
      required: [true, "Document URL is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for optimization and uniqueness
certificateSchema.index({ certificateId: 1 }, { unique: true });
certificateSchema.index({ verificationCode: 1 }, { unique: true });
certificateSchema.index({ internId: 1 });
certificateSchema.index({ instructorId: 1 });

// ------------------------------------------------------
// 3️⃣ Certificate Model export
// ------------------------------------------------------
const CertificateModel = mongoose.model<ICertificate, CertificateModelType>(
  "Certificate",
  certificateSchema
);

export default CertificateModel;
