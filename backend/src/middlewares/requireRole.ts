import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";

const allowedRoles = ["leader", "admin"];

export const requireRole = (role: "leader" | "admin") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      console.log("NO REQ USER");
      return res.status(401).json({
        status: "error",
        code: "USER_NOT_ATTACHED",
        message: "user is not attached to the request",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.log("User's role not allowed");
      return res.status(401).json({
        status: "error",
        code: "USER_ROLE_NOT_ALLOWED",
        message: "user is not allowed",
      });
    }

    if (req.user.role === "leader" && role === "admin") {
      return res.status(403).json({
        status: "error",
        code: "ADMIN_ACCESS_ONLY",
        message: "Admin access only",
      });
    }

    next();
  };
};
