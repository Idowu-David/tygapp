import Router from "express";
import {
  addChapter,
  getBookHistory,
  getCurrentChapter,
} from "../controllers/chapter.controller";
import { authenticate } from "../middlewares/authenticate";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

router.get("/", authenticate, getBookHistory);
router.post("/", authenticate, requireRole("admin"), addChapter);
router.get("/current:weekKeyQuery", authenticate, getCurrentChapter);

export default router;