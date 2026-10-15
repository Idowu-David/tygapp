import Router from "express";
import { getMe, getTeams } from "../controllers/profile.controller";

const router = Router();

router.get("/me", getMe)
router.get("/teams", getTeams)
