import Router from "express";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
