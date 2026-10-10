import { Schema, model, Types } from "mongoose";

export interface IChapter {
  clubId: Types.ObjectId;
  bookId: Types.ObjectId;
  number: number;
  title: string;
  keyScripture?: string;
  createdAt: Date;
  updatedAt: Date;
}

const chapterSchema = new Schema<IChapter>(
  {
    clubId: { type: Schema.Types.ObjectId, ref: "Club", required: true, index: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true, index: true },
    number: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    keyScripture: { type: String, trim: true },
  },
  { timestamps: true }
);

chapterSchema.index({ bookId: 1, number: 1 }, { unique: true });

export const Chapter = model<IChapter>("Chapter", chapterSchema);