import { Schema, model, Types, Document } from "mongoose";

export interface IUserStat extends Document {
  userId: Types.ObjectId;
  clubId: Types.ObjectId;
  totalPoints: number;
  weeklyStreak: number;
  bestStreak: number;
  chaptersSubmitted: number;
  lastSubmission: Date | null;
}

const userStatSchema = new Schema<IUserStat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    clubId: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },

    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    weeklyStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    bestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    chaptersSubmitted: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastSubmission: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userStatSchema.index({ userId: 1, clubId: 1 }, { unique: true });

const UserStat = model<IUserStat>("UserStat", userStatSchema);

export default UserStat;
