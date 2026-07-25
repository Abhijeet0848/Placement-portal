import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables immediately
dotenv.config();

// Initialize the API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Select the appropriate model (gemini-1.5-flash is currently the fastest stable model)
export const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});
