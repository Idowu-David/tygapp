import ReadingSchedule from "../models/ReadingSchedule";

export const getReadingSchedule = async (weekKey: string) => {
  return await ReadingSchedule.findOne({
    weekKey,
  });
};
