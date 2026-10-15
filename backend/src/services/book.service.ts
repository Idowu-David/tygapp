import { Book } from "../models/Book";

export const newBook = async (
  clubId: string,
  title: string,
  author: string,
  noOfPages: number,
  noOfChapters: number,
  sourceLink: { label: string; url: string },
  startedAt?: Date 
) => {
  return await Book.create({
    clubId,
    title,
    author,
    noOfPages,
    noOfChapters,
    sourceLink,
    startedAt
  });
};
