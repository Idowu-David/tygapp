import Router from "express";
import { getMe, getTeams } from "../controllers/profile.controller";

const router = Router();

router.get("/get-me", getMe)
router.get("/get-teams", getTeams)
