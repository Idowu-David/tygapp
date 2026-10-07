import express, { Application, Request, Response } from "express"
import cors from "cors"
import { requestLogger } from "./middlewares/logger";
import { env } from "./config/env"
import { connectDB } from "./config/db";

const app: Application = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// Logger middleware
app.use("/api", requestLogger);

app.get("/api/health", (req: Request, res: Response) => { 
  res.status(200).json({
    success: "true",
    message: "API is running",
  })
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});
