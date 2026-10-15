import { Schema, model, Types } from "mongoose";

export interface IClub {
  name: string;
  joinCode: string;
  joinCodeExpiresAt?: Date;
  settings: {
    timezone: string;
    minReflectionWords: number;
    pauseWeeksPerTerm: number;
    requireGuardianConsentUnder18: boolean;
    currentBookId?: Types.ObjectId;
  };
  pointsConfig: {
    checkin: number;
    readingComplete: number;
    reflection: number;
    quiz: number;
    discussion: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const clubSchema = new Schema<IClub>(
  {
    name: { type: String, required: true, trim: true },
    joinCode: { type: String, required: true, unique: true },
    joinCodeExpiresAt: Date,
    settings: {
      timezone: { type: String, default: "Africa/Lagos" },
      minReflectionWords: { type: Number, default: 10 },
      pauseWeeksPerTerm: { type: Number, default: 1 },
      requireGuardianConsentUnder18: { type: Boolean, default: false },
      currentBookId: { type: Schema.Types.ObjectId, ref: "Book" },
    },
    pointsConfig: {
      checkin: { type: Number, default: 1 },
      readingComplete: { type: Number, default: 2 },
      reflection: { type: Number, default: 10 },
      quiz: { type: Number, default: 5 },
      discussion: { type: Number, default: 2 },
    },
  },
  { timestamps: true },
);

export const Club = model<IClub>("Club", clubSchema);
