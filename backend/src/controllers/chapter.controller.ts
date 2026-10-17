import { Request, Response } from "express";
import { getCurrentWeekKey } from "../utils/getCurrentWeek";
import {
  readingHistory,
  getReadingSchedule,
  newChapter,
  findReadingSchedule,
} from "../services/chapter.service";
import { AuthRequest } from "../types";
import { findClub } from "../services/club.service";

// GET /chapters/current?weekKey
export const getCurrentChapter = async (req: AuthRequest, res: Response) => {
  try {
    const weekKeyQuery = req.query.weekKey as string;
    const weekKey = getCurrentWeekKey();

    const schedule = await getReadingSchedule(
      weekKey !== weekKeyQuery ? weekKeyQuery : weekKey,
    );

    if (!schedule) {
      return res.status(400).json({
        status: "error",
        code: "NO_SCHEDULE_FOR_WEEK",
        message: "Selected week has no chapter",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Reading Schedule fetched successfully",
      data: schedule,
    });
  } catch (error) {
    console.error(`An internal server error occured: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// GET /chapters
export const getBookHistory = async (req: AuthRequest, res: Response) => {
  try {
    const clubCode = req.user?.clubCode as string;

    const club = await findClub(clubCode);
    console.log(club);
    const currentBookId = club?.settings.currentBookId;
    const clubId = club?._id!;


    const bookHistory = await readingHistory(clubId, String(currentBookId));

    if (!bookHistory) {
      return res.status(400).json({
        status: "error",
        code: "NO_CHAPTER",
        message: "Selected week has no chapter",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Book History fetched successfully",
      data: bookHistory,
    });
  } catch (error) {
    console.error(`An internal server error occured: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// POST /chapters
export const addChapter = async (req: AuthRequest, res: Response) => {
  try {
    const { bookId, number, title, keyScripture } = req.body;
    const clubId = req.user?.clubCode as string;

    if (!bookId || !number || !title || !keyScripture) {
      return res.status(400).json({
        status: "error",
        code: "INCOMPLETE_PAYLOAD",
        message: "All input fields are required",
      });
    }

    const chapter = newChapter(clubId, bookId, number, title, keyScripture);

    if (!chapter) {
      return res.status(400).json({
        status: "error",
        code: "NEW_CHAPTER_ERROR",
        message: "New chapter could not be added",
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Successfully added a new chapter",
      data: chapter,
    });
  } catch (error) {
    console.error(`An internal server error occured: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// POST /chapters/:id/close
export const closeReadingSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const schedule = await findReadingSchedule(id);

    if (!schedule) {
      return res.status(400).json({
        status: "error",
        code: "NO_SCHEDULE",
        message: "No schedule was found for this id",
      });
    }

    schedule.status = "closed";
    schedule.save();

    return res.status(200).json({
      status: "success",
      message: "Reading schedule closed successfully",
      data: schedule,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      code: "SERVER_ERROR",
      message: `An error occured: ${error}`,
    });
  }
};

export const getReadingLog = async (req: AuthRequest, res: Response) => { 
  try {
    
  } catch (error) {
    
  }
}