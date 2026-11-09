import { Book } from "../models/Book";
import { Types } from "mongoose";

export const newBook = async (
  clubId: string,
  title: string,
  author: string,
  noOfPages: number,
  noOfChapters: number,
  sourceLink: { label: string; url: string },
  startedAt?: Date,
) => {
  return await Book.create({
    clubId,
    title,
    author,
    noOfPages,
    noOfChapters,
    sourceLink,
    startedAt,
  });
};

export const findBook = async (
  bookId: Types.ObjectId,
  clubId: Types.ObjectId,
) => {
  return await Book.findOne({
    _id: bookId,
    clubId,
  });
};

export const getAllBooks = async () => { 
  return await Book.find();
}