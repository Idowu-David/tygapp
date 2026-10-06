import express, { Application, Request, Response } from "express"
import dotenv from "dotenv"
dotenv.config()

import cors from "cors"
import { requestLogger } from "./middlewares/logger";

const app: Application = express();
const PORT = process.env.PORT || 5000;

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
  console.log(`API running on http://localhost:${PORT}`);
});
