// ============================================
//  🔹 Task Model
// ============================================
import mongoose, {
	type HydratedDocument,
	type Model,
	Schema,
	type Types,
} from "mongoose";

// ------------------------------------------------------
// 1️⃣ Define Task Interfaces
// ------------------------------------------------------
export interface ITask {
	_id: Types.ObjectId;
	title: string;
	description: string;
	assignedTo: Types.ObjectId;
	assignedBy: Types.ObjectId;
	department: string;
	category: string;
	priority: "high" | "medium" | "low";
	status: "pending" | "in-progress" | "completed" | "overdue";
	progress: number;
	startDate: Date;
	dueDate: Date;
	completionDate?: Date;
	estimatedHours: number;
	actualHours?: number;
	tags: string[];
	attachmentsUrl: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

// Document and Model type
export type TaskDocument = HydratedDocument<ITask>;
export type TaskModelType = Model<ITask>;
export type TaskObject = ITask;

// ------------------------------------------------------
// 2️⃣ Define Task Schema
// ------------------------------------------------------
const taskSchema = new Schema<ITask, TaskModelType>(
	{
		_id: {
			type: Schema.Types.ObjectId,
			auto: true,
		},
		title: {
			type: String,
			required: [true, "Task title is required"],
			trim: true,
		},
		description: {
			type: String,
			required: [true, "Task description is required"],
			trim: true,
		},
		assignedTo: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Intern",
		},
		assignedBy: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Intern",
		},
		department: {
			type: String,
			required: [true, "Department is required"],
			trim: true,
		},
		category: {
			type: String,
			required: [true, "Task category is required"],
			trim: true,
		},
		priority: {
			type: String,
			enum: ["high", "medium", "low"],
			default: "medium",
		},
		status: {
			type: String,
			enum: ["pending", "in-progress", "completed", "overdue"],
			default: "pending",
		},
		progress: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
		startDate: {
			type: Date,
			required: [true, "Start date is required"],
		},
		dueDate: {
			type: Date,
			required: [true, "Due date is required"],
		},
		completionDate: {
			type: Date,
		},
		estimatedHours: {
			type: Number,
			required: [true, "Estimated hours are required"],
			min: 0,
		},
		actualHours: {
			type: Number,
			min: 0,
		},
		tags: {
			type: [String],
			default: [],
		},
		attachmentsUrl: {
			type: [String],
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

// Indexing for optimization
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ assignedBy: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ department: 1 });

// ------------------------------------------------------
// 3️⃣ Task Model export
// ------------------------------------------------------
const TaskModel = mongoose.model<ITask, TaskModelType>("Task", taskSchema);

export default TaskModel;
