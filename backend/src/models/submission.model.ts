// ============================================
//  🔹 Submission Model
// ============================================
import mongoose, {
	type HydratedDocument,
	type Model,
	Schema,
	type Types,
} from "mongoose";

// ------------------------------------------------------
// 1️⃣ Define Submission Interfaces
// ------------------------------------------------------
export interface ISubmission {
	_id: Types.ObjectId;
	internId: Types.ObjectId;
	taskId: Types.ObjectId;
	submissionDate: Date;
	status: "submitted" | "pending" | "late" | "graded";
	content: string;
	grade?: string;
	feedback?: string;
	documentUrl: string;
	createdAt?: Date;
	updatedAt?: Date;
}

// Method that every document can call
export interface ISubmissionMethods {
	markAsReviewed(
		feedback: string,
		status: "graded" | "submitted" | "pending" | "late",
	): Promise<void>;
}

// Document and Model type
export type SubmissionDocument = HydratedDocument<
	ISubmission,
	ISubmissionMethods
>;
export type SubmissionModelType = Model<
	ISubmission,
	Record<string, never>,
	ISubmissionMethods
>;
export type SubmissionObject = ISubmission;

// ------------------------------------------------------
// 2️⃣ Define Submission Schema
// ------------------------------------------------------
const submissionSchema = new Schema<
	ISubmission,
	SubmissionModelType,
	ISubmissionMethods
>(
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
		taskId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Task",
		},
		submissionDate: {
			type: Date,
			required: [true, "Submission date is required"],
		},
		status: {
			type: String,
			enum: ["submitted", "pending", "late", "graded"],
			default: "pending",
		},
		content: {
			type: String,
			required: [true, "Submission content is required"],
			trim: true,
		},
		grade: {
			type: String,
			trim: true,
		},
		feedback: {
			type: String,
			trim: true,
		},
		documentUrl: {
			type: String,
			required: [true, "Document URL is required"],
			trim: true,
		},
	},
	{
		timestamps: true,
	},
);

// Indexing for optimization and uniqueness
submissionSchema.index({ internId: 1, taskId: 1 }, { unique: true });

// ------------------------------------------------------
// 3️⃣ Method to markAsReviewed
// ------------------------------------------------------
submissionSchema.method(
	"markAsReviewed",
	async function (
		feedback: string,
		status: "graded" | "submitted" | "pending" | "late",
	) {
		this.feedback = feedback;
		this.status = status;
		await this.save();
	},
);

// ------------------------------------------------------
// 4️⃣Create Submission Model
// ------------------------------------------------------
const SubmissionModel = mongoose.model<ISubmission, SubmissionModelType>(
	"Submission",
	submissionSchema,
);
