import Router from "express";
import { requireRole } from "../middlewares/requireRole";
import { authenticate } from "../middlewares/authenticate";
import { addNewClub, editClub, setCurrentBook } from "../controllers/club.controller";

const router = Router();

router.post("/", authenticate, requireRole("admin"), addNewClub)
router.patch("/current-book", authenticate, requireRole("admin"), setCurrentBook)
// router.patch("/", authenticate, requireRole("admin"), editClub)

export default router;
