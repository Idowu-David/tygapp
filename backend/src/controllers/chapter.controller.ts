import { Request, Response } from "express";
import { getCurrentWeekKey } from "../utils/getCurrentWeek";
import { getReadingSchedule } from "../services/chapter.service";
import { AuthRequest } from "../types";

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
