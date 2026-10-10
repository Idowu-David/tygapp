import { Request } from "express";

export interface IToken {
  id: string;
  role: "user" | "leader" | "admin";
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "user" | "leader" | "admin";
  };
}
