// --------------------------------------------
//  🧩 Intern Model
// --------------------------------------------

import bcrypt from "bcrypt";
import mongoose, {
	type HydratedDocument,
	type Model,
	Schema,
	type Types,
} from "mongoose";

// ------------------------------------------------------
// 1️⃣ Define Intern Interfaces
// ------------------------------------------------------
export interface IIntern {
	_id: Types.ObjectId;
	username: string;
	email: string;
	password: string;
	phoneNumber?: string;
	position?: string;
	startDate?: Date;
	endDate?: Date;
	status?: "active" | "inactive" | "completed";
	approvalStatus?: "pending" | "approved" | "rejected";
	progress?: number;
	location?: string;
	supervisorName?: string;
	taskCompleted?: number;
	totalTasks?: number;
	rating?: number;
	role: "admin" | "intern";
	avatarUrl?: string;
	department?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

// Method that every document can call
export interface IInternMethods {
	comparePassword(enteredPasssword: string): Promise<boolean>;
}

// Document and Mode type
export type InternDocument = HydratedDocument<IIntern, IInternMethods>;
export type InternModelType = Model<
	IIntern,
	Record<string, never>,
	IInternMethods
>;
export type InternObject = IIntern;

// ------------------------------------------------------
// 2️⃣ Define Intern Schema
// ------------------------------------------------------
const internSchema = new Schema<IIntern, InternModelType, IInternMethods>(
	{
		_id: {
			type: Schema.Types.ObjectId,
			auto: true,
		},
		username: {
			type: String,
			required: [true, "Username is required"],
			trim: true,
			maxLength: [50, "Username can not be more than 50 characters"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
			lowercase: true,
			maxLength: [100, "Email can not be more than 100 characters"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minLength: [6, "Password must be at least 6 characters"],
			select: false, // do not return password field in queries by default
		},
		phoneNumber: {
			type: String,
			trim: true,
			maxLength: [15, "Phone number can not be more than 15 characters"],
		},
		position: {
			type: String,
			trim: true,
			maxLength: [100, "Position can not be more than 100 characters"],
		},
		startDate: {
			type: Date,
		},
		endDate: {
			type: Date,
		},
		status: {
			type: String,
			enum: ["active", "inactive", "completed"],
			default: "active",
		},
		approvalStatus: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},
		progress: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
		location: {
			type: String,
			trim: true,
			maxLength: [100, "Location can not be more than 100 characters"],
		},
		supervisorName: {
			type: String,
			trim: true,
			maxLength: [100, "Supervisor name can not be more than 100 characters"],
		},
		taskCompleted: {
			type: Number,
			default: 0,
			min: 0,
		},
		totalTasks: {
			type: Number,
			default: 0,
			min: 0,
		},
		rating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		role: {
			type: String,
			enum: ["admin", "intern"],
			default: "intern",
		},
		avatarUrl: {
			type: String,
			default: null,
			trim: true,
		},
		department: {
			type: String,
			default: null,
			trim: true,
		},
	},
	{
		timestamps: true,
	},
);

// ------------------------------------------------------
// 3️⃣ Hash password before saving
// ------------------------------------------------------
internSchema.pre<InternDocument>("save", async function () {
	if (!this.isModified("password")) return;

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// ------------------------------------------------------
// 4️⃣ Method to compare passwords
// ------------------------------------------------------
internSchema.method(
	"comparePassword",
	async function (enteredPasssword: string): Promise<boolean> {
		return await bcrypt.compare(enteredPasssword, this.password);
	},
);

// ------------------------------------------------------
// 5️⃣ Transform output (remove password, __v)
// ------------------------------------------------------
internSchema.set("toJSON", {
	transform(_, ret: Partial<IIntern> & { __v?: number }) {
		delete ret.password;
		delete ret.__v;
		return ret;
	},
});

// ------------------------------------------------------
// 6️⃣ Virtuals (it will not be stored in DB and sued to query and populate data)
// ------------------------------------------------------
internSchema.virtual("tasksAssignedTo", {
	ref: "Task",
	localField: "_id",
	foreignField: "assignedTo",
});
internSchema.virtual("tasksAssignedBy", {
	ref: "Task",
	localField: "_id",
	foreignField: "assignedBy",
});

internSchema.virtual("certificates", {
	ref: "Certificate",
	localField: "_id",
	foreignField: "internId",
});

// ------------------------------------------------------
// 7️⃣Intern Model export
// ------------------------------------------------------
const InternModel = mongoose.model<IIntern, InternModelType>(
	"Intern",
	internSchema,
);

export default InternModel;
