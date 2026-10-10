import { Schema, model, Types } from "mongoose";

export type ReviewStatus =
  | "auto_approved"
  | "needs_review"
  | "approved"
  | "adjusted";

export interface ITakeaway {
  text: string;
  valid: boolean;
  flagged: boolean;
  flagReason?: string;
  starBonus: boolean;
  removed: boolean;
  featured: boolean;
  featuredConsent: boolean;
}

export interface ISubmission {
  clubId: Types.ObjectId;
  userId: Types.ObjectId;
  taskId: Types.ObjectId; // reviews are submitted per Task, not per Chapter
  takeaways: ITakeaway[]; // exactly 5, enforced at the Zod validation layer
  applyText?: string;
  submittedAt: Date;
  onTime: boolean;
  reviewStatus: ReviewStatus;
  reviewedBy?: Types.ObjectId; // must NOT equal userId — enforced in the service layer
  reviewedAt?: Date;
  pointsAwarded: number; // denormalized; PointsLog is the real source of truth
  createdAt: Date;
  updatedAt: Date;
}

const takeawaySchema = new Schema<ITakeaway>(
  {
    text: { type: String, required: true, maxlength: 500 },
    valid: { type: Boolean, default: false },
    flagged: { type: Boolean, default: false },
    flagReason: String,
    starBonus: { type: Boolean, default: false },
    removed: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    featuredConsent: { type: Boolean, default: false },
  },
  { _id: false },
);

const submissionSchema = new Schema<ISubmission>(
  {
    clubId: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    takeaways: { type: [takeawaySchema], required: true },
    applyText: { type: String, maxlength: 500 },
    submittedAt: { type: Date, default: Date.now },
    onTime: { type: Boolean, default: true },
    reviewStatus: {
      type: String,
      enum: ["auto_approved", "needs_review", "approved", "adjusted"],
      default: "auto_approved",
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
    pointsAwarded: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// one submission per member per task — this is what makes a second submit attempt
// throw AppError("CONFLICT", ..., 409) instead of creating a duplicate
submissionSchema.index({ userId: 1, taskId: 1 }, { unique: true });
submissionSchema.index({ clubId: 1, taskId: 1, reviewStatus: 1 });

export const Submission = model<ISubmission>("Submission", submissionSchema);
