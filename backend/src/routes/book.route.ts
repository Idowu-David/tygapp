import Router from "express";
import { authenticate } from "../middlewares/authenticate";
import { requireRole } from "../middlewares/requireRole";
import { addNewBook } from "../controllers/book.controller";

const router = Router();

router.post("/", authenticate, requireRole("admin"), addNewBook);

export default router;
