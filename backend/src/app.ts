import express, { Application, Request, Response } from "express";
import { requestLogger } from "./middlewares/logger";
import authRoutes from "../src/routes/auth.route";
import chapterRoutes from "../src/routes/chapter.route";
import bookRoutes from "../src/routes/book.route";
import clubRoutes from "../src/routes/club.route";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Logger middleware
app.use("/api", requestLogger);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: "true",
    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/clubs", clubRoutes);

export default app;
