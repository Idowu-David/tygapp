import mongoose, { Schema } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  nickname?: string;
  role: "admin" | "user" | "leader";
  googleId?: string;
  status: "active" | "muted" | "deactivated";
  clubId?: string;
  avatarColor: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true },
    nickname: { type: String, required: false },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "leader", "user"], default: "user" },
    googleId: { type: String, select: false },
    clubId: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "muted", "deactivated"],
      default: "active",
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordTokenExpiry: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
