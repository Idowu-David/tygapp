import { Schema, model, Types } from "mongoose";

export type PointCode =
  | "CHECKIN_ON_TIME"
  | "DAILY_READ"
  | "TAKEAWAY"
  | "APPLY"
  | "ENCOURAGE"
  | "SCRIPTURE"
  | "STAR_BONUS"
  | "STREAK_BONUS"
  | "ADJUSTMENT";

export interface IPointsLog {
  clubId: Types.ObjectId;
  userId: Types.ObjectId;
  taskId?: Types.ObjectId;
  weekKey: string;
  month: string; // 'YYYY-MM', for monthly leaderboard queries
  code: PointCode;
  points: number; // can be negative, for corrections
  refType?: "submission" | "readingLog" | "manual";
  refId?: Types.ObjectId;
  idempotencyKey: string; // e.g. "TAKEAWAY:{submissionId}:2" — prevents double awards
  reason?: string;
  createdBy: "system" | Types.ObjectId;
  createdAt: Date; // this collection is append-only — never updated, never deleted
}

const pointsLogSchema = new Schema<IPointsLog>(
  {
    clubId: { type: Schema.Types.ObjectId, ref: "Club", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
    weekKey: { type: String, required: true },
    month: { type: String, required: true },
    code: {
      type: String,
      enum: [
        "CHECKIN_ON_TIME",
        "DAILY_READ",
        "TAKEAWAY",
        "APPLY",
        "ENCOURAGE",
        "SCRIPTURE",
        "STAR_BONUS",
        "STREAK_BONUS",
        "ADJUSTMENT",
      ],
      required: true,
    },
    points: { type: Number, required: true },
    refType: { type: String, enum: ["submission", "readingLog", "manual"] },
    refId: { type: Schema.Types.ObjectId },
    idempotencyKey: { type: String, required: true, unique: true },
    reason: String,
    createdBy: { type: Schema.Types.Mixed, required: true }, // "system" or a User ObjectId
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

pointsLogSchema.index({ clubId: 1, weekKey: 1, userId: 1 });
pointsLogSchema.index({ clubId: 1, month: 1, userId: 1 });
pointsLogSchema.index({ userId: 1, createdAt: -1 });

export const PointsLog = model<IPointsLog>("PointsLog", pointsLogSchema);
