import OpenAI from "openai";
import { loadBackendEnv } from "../src/utils/loadEnv.js";

loadBackendEnv();

const apiKey = process.env.OPENAI_API_KEY?.trim();

if (!apiKey) {
  throw new Error("Missing OpenAI API key in backend/.env");
}

const client = new OpenAI({ apiKey });

const response = await client.chat.completions.create({
  model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini",
  temperature: 0,
  response_format: { type: "json_object" },
  messages: [
    {
      role: "user",
      content: "Reply with this exact JSON only: {\"ok\":true,\"provider\":\"openai\"}",
    },
  ],
});

console.log(response.choices[0]?.message?.content || "No content returned");