import { Schema, model, Types } from "mongoose";

export interface ITeam {
  clubId: Types.ObjectId;
  name: string;
  teamColor: string;
  teamPoint: number;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    clubId: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    teamColor: { type: String, required: true },
    teamPoint: { type: Number, default: 0 },
  },
  { timestamps: true },
);

teamSchema.index({ clubId: 1, name: 1 }, { unique: true });

export const Team = model<ITeam>("Team", teamSchema);
