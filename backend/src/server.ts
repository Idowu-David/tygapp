import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { env } from "./config/env";
import { connectDB } from "./config/db";
import app from "./app";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(`API running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
