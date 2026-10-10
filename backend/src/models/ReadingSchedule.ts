import { Schema, model, Types } from "mongoose";

export type ReadingScheduleStatus = "draft" | "published" | "closed";

export interface IReadingSchedule {
  clubId: Types.ObjectId;
  chapterIds: Types.ObjectId[]; // one or more chapters bundled into this week's ReadingSchedule
  weekKey: string; // e.g. "2026-W41" — computed in the club's timezone
  title: string;
  discussionQuestion: string; // one combined question, even for multi-chapter ReadingSchedules
  status: ReadingScheduleStatus;
  startDay: Date;
  deadline: Date;
  closedAt?: Date;
  createdBy: Types.ObjectId; // the leader who created/published it
  createdAt: Date;
  updatedAt: Date;
}

const readingScheduleSchema = new Schema<IReadingSchedule>(
  {
    clubId: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: true,
      index: true,
    },
    chapterIds: [
      { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
    ],
    weekKey: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    discussionQuestion: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
    },
    startDay: { type: Date, required: true },
    deadline: { type: Date, required: true },
    closedAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

readingScheduleSchema.index({ clubId: 1, weekKey: 1 }, { unique: true });

const ReadingSchedule = model<IReadingSchedule>(
  "ReadingSchedule",
  readingScheduleSchema,
);

export default ReadingSchedule;
