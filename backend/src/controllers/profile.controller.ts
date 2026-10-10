import { Request, Response } from "express";
import { getUserByID } from "../services/auth.service";
import { AuthRequest } from "../types";
import { getAllTeams, getUserStats } from "../services/profile.service";

// GET /auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.user?.id as string;
    const user = await getUserByID(id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const userStat = await getUserStats(id);

    return res.status(200).json({
      status: "success",
      data: {
        user: user,
        stats: userStat,
      },
    });
  } catch (error) {
    console.error(`An internal server error occured: ${error}`);
    return res.status(500).json({
      status: "error",
      code: "SERVER_ERROR",
      message: "Server error",
    });
  }
};

// GET /teams
export const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await getAllTeams();

    return res.status(200).json({
      status: "success",
      message: "Teams fetched successfully",
      data: teams,
    });
  } catch (error) {
    console.error(`An internal server error occured: ${error}`);
    return res.status(500).json({
      status: "error",
      code: "SERVER_ERROR",
      message: "Server error",
    });
  }
};
