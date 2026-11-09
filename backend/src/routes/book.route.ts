import Router from "express";
import { authenticate } from "../middlewares/authenticate";
import { requireRole } from "../middlewares/requireRole";
import { addNewBook, getBooks } from "../controllers/book.controller";

const router = Router();

router.post("/", authenticate, requireRole("admin"), addNewBook);
router.get("/", authenticate, getBooks);

export default router;
