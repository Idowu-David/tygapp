import mongoose, { Schema } from "mongoose";

export interface IPointsConfig {
  checkIn: number;
  readingComplete: number;
  reflection: number;
  quiz: number;
  discussion: number;
  weeklyChallenge: number;
}

export interface IClubSettings {
  timeZone: string;
    minReflectionWords: number;
    pointsConfig: IPointsConfig;
    pauseWeeksPerTerm: number;
    requireGuardianConsentUnder18: boolean;
    currentBookId?: mongoose.Types.ObjectId
}
export interface IClub {
  name: string;
  joinCode: string;
  joinCodeExpiresAt?: Date;
  settings: IClubSettings
}

const pointsConfigSchema = new mongoose.Schema<IPointsConfig>({
  checkIn: { type: Number, default: 1, min: 0, },
  readingComplete: { type: Number, default: 2, min: 0 },
  reflection: { type: Number, default: 10, min: 0 },
  quiz: { type: Number, default: 5, min: 0 },
  discussion: { type: Number, default: 2, min: 0 },
}, { _id: false });

const settingsSchema = new Schema<IClubSettings>({
   timeZone: {
      type: String,
      default: "Africa/Lagos",
    },

    minReflectionWords: {
      type: Number,
      default: 10,
      min: 0,
    },

    pointsConfig: {
      type: pointsConfigSchema,
      default: () => ({}),
    },

    pauseWeeksPerTerm: {
      type: Number,
      default: 1,
      min: 0,
    },

    requireGuardianConsentUnder18: {
      type: Boolean,
      default: true,
    },

    currentBookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  },
  { _id: false }
)

const clubSchema = new mongoose.Schema<IClub>({
  name: { type: String, required: true, trim: true },
  joinCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
  joinCodeExpiresAt: { type: Date },
  settings: {
    type: settingsSchema,
    default: () => ({}),
  }
}, timestamps: true,)

const Club = mongoose.model("Club", clubSchema);

export default Club;