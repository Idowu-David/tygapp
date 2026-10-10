import { Schema, model, Types } from "mongoose";

export interface IBook {
  clubId: Types.ObjectId;
  title: string;
  author: string;
  noOfPages: number;
  noOfChapters: number;
  sourceLinks: { label: string; url: string }[]; // legitimate/official sources only — never host the book file
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    clubId: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    noOfPages: { type: Number, required: true },
    noOfChapters: { type: Number, required: true },
    sourceLinks: [{ label: String, url: String }],
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true },
);

export const Book = model<IBook>("Book", bookSchema);
