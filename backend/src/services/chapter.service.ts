import { Chapter } from "../models/Chapter";
import ReadingSchedule from "../models/ReadingSchedule";
import { Types } from 'mongoose';

export const getReadingSchedule = async (weekKey: string) => {
  return await ReadingSchedule.findOne({
    weekKey,
  });
};

export const readingHistory = async (clubId: Types.ObjectId, currentBookId: string) => {
  return await ReadingSchedule.find({
    clubId,
    currentBookId,
    status: { $ne: "draft" },
  });
};

export const newChapter = async (
  clubId: string,
  bookId: string,
  number: number,
  title: string,
  keyScripture: string[],
) => {
  return await Chapter.create({
    clubId,
    bookId,
    title,
    keyScripture,
    number,
  });
};

export const findReadingSchedule = async (id: string) => {
  return await ReadingSchedule.findOne({
    chapterIds: id,
  });
};
