import Router from 'express';
import { getCurrentChapter } from '../controllers/chapter.controller';

const router = Router();

router.get("/current", getCurrentChapter)