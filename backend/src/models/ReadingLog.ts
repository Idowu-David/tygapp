import { Schema, model, Types } from "mongoose";

export type ReadingStatus = "not_started" | "reading" | "finished";

export interface IReadingLog {
  clubId: Types.ObjectId;
  userId: Types.ObjectId;
  taskId: Types.ObjectId; // progress is tracked per Task, not per Chapter
  status: ReadingStatus;
  percent: number; // 0-100
  dailyReads: string[]; // dates 'YYYY-MM-DD' the member tapped "I read today"
  firstCheckInAt?: Date;
  finishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const readingLogSchema = new Schema<IReadingLog>(
  {
    clubId: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    status: {
      type: String,
      enum: ["not_started", "reading", "finished"],
      default: "not_started",
    },
    percent: { type: Number, default: 0, min: 0, max: 100 },
    dailyReads: [{ type: String }],
    firstCheckInAt: Date,
    finishedAt: Date,
  },
  { timestamps: true },
);

// one reading log per member per task
readingLogSchema.index({ userId: 1, taskId: 1 }, { unique: true });

export const ReadingLog = model<IReadingLog>("ReadingLog", readingLogSchema);
