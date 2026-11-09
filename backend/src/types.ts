import { Request } from "express";
import { Types } from "mongoose";

export interface IToken {
  id: string;
  role: "user" | "leader" | "admin";
  clubId: Types.ObjectId;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "user" | "leader" | "admin";
    clubId: Types.ObjectId;
  };
}
