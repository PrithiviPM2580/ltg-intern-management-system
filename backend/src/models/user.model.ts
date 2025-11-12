// --------------------------------------------
//  🧩 Node Module Setup
// --------------------------------------------

import bcrypt from "bcrypt";
import mongoose, {
	type HydratedDocument,
	type Model,
	Schema,
	type Types,
} from "mongoose";

// ------------------------------------------------------
// 1️⃣ Define user interfaces
// ------------------------------------------------------
export interface IUser {
	_id: Types.ObjectId;
	username: string;
	email: string;
	password: string;
	role: "admin" | "intern";
	avatarUrl?: string;
	department?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

// Method that every document can call
export interface IUserMethods {
	comparePassword(enteredPasssword: string): Promise<boolean>;
}

// Document and Mode type
export type UserDocument = HydratedDocument<IUser, IUserMethods>;
export type UserModelType = Model<IUser, Record<string, never>, IUserMethods>;
export type UserObject = IUser;

// ------------------------------------------------------
// 2️⃣ Define schema
// ------------------------------------------------------
const userSchema = new Schema<IUser, UserModelType, IUserMethods>(
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
userSchema.pre<UserDocument>("save", async function () {
	if (!this.isModified("password")) return;

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// ------------------------------------------------------
// 4️⃣ Method to compare passwords
// ------------------------------------------------------
userSchema.method(
	"comparePassword",
	async function (enteredPasssword: string): Promise<boolean> {
		return await bcrypt.compare(enteredPasssword, this.password);
	},
);

// ------------------------------------------------------
// 5️⃣ Transform output (remove password, __v)
// ------------------------------------------------------
userSchema.set("toJSON", {
	transform(_, ret: Partial<IUser> & { __v?: number }) {
		delete ret.password;
		delete ret.__v;
		return ret;
	},
});

// ------------------------------------------------------
// 6️⃣ Model export
// ------------------------------------------------------
const UserModel = mongoose.model<IUser, UserModelType>("User", userSchema);

export default UserModel;
