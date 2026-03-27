import OpenAI from "openai";
import { loadBackendEnv } from "../src/utils/loadEnv.js";

loadBackendEnv();

const apiKey = process.env.GEMINIAI_API_KEY?.trim() || process.env.GEMINI_API_KEY?.trim();

if (!apiKey) {
  throw new Error("Missing Gemini API key in .env");
}

const client = new OpenAI({
  apiKey,
  baseURL: process.env.GEMINI_BASE_URL?.trim() || "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const response = await client.chat.completions.create({
  model: process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash",
  temperature: 0,
  messages: [
    {
      role: "user",
      content: "Reply with this exact JSON only: {\"ok\":true,\"provider\":\"gemini\"}",
    },
  ],
});

console.log(response.choices[0]?.message?.content || "No content returned");