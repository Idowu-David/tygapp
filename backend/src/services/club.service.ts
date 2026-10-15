import { Club, IClub } from "../models/Club";
import { Types } from "mongoose";

export interface ISettings {
  timezone: string;
  minReflectionWords: number;
  requireGuardianConsentUnder18: boolean;
  pauseWeeksPerTerm?: number;
  currentBookId?: Types.ObjectId;
}

export const newClub = async (
  name: string,
  settings: ISettings,
  joinCode: string,
  joinCodeExpiresAt?: Date,
) => {
  return await Club.create({
    name,
    joinCode,
    joinCodeExpiresAt,
    settings,
  });
};

export const findClub = async (clubId: string) => {
  return await Club.findById(clubId);
};

export const getClubId = async (joinCode: string) => {
  return await Club.findOne({ joinCode }).select("_id").lean();
};

export const updateClub = async (
  clubCode: string,
  updates: Record<string, unknown>,
) => {
  return await Club.findOneAndUpdate(
    { joinCode: clubCode },
    { $set: updates },
    { returnDocument: "after", runValidators: true },
  );
};
