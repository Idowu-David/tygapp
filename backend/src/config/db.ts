import mongoose from "mongoose"
import { env } from "./env";

export const connectDB = async (): Promise<void> => { 
  try {
    const uri = env.MONGODB_URI as string;

    if (!uri) throw new Error("MONGODB_URI is not defined in environment variables")

    await mongoose.connect(uri);
    console.log("MongoDB connected successfully")
  } catch (error) { 
    console.error("MongoDB connection failed: ", error);
    process.exit(1);
  }
}

mongoose.connection.on("disconnected", () => { 
  console.warn("MongoDB disconnected")
})
