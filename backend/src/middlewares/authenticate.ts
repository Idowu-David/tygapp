import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from '../types';
import { Types } from 'mongoose';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        code: "NO_TOKEN",
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: "user" | "leader" | "admin";
      clubCode: string;
    };

    req.user = decoded;

    next();
  } catch (error) {
    console.error(`Internal server error: ${error}`);
    res.status(401).json({
      status: "error",
      message: "Not authorized, invalid token",
    });
  }
};

export default authenticate;