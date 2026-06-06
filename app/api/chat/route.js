import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Read prompt safely from the public assets directory
function getSystemInstruction() {
  try {
    const filePath = path.join(process.cwd(), "public", "assets", "prompt.txt");
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
  } catch (error) {
    console.error("Failed to parse prompt.txt file asset:", error);
  }
  // Fallback safety prompt instructions
  return "You are an expert Kodular extension and screen generator layout engine.";
}

async function tryChatSession(modelName, message, history) {
  if (!ai) throw new Error("GEMINI_API_KEY is missing.");

  const systemPrompt = getSystemInstruction();

  const chat = ai.chats.create({
    model: modelName,
    config: { 
      maxOutputTokens: 2500,
      systemInstruction: systemPrompt
    },
    history: history || []
  });

  const response = await chat.sendMessage({ message: message });
  const updatedHistory = await chat.getHistory();

  return {
    text: response.text || "No response text generated.",
    history: updatedHistory
  };
}

export async function POST(req) {
  try {
    const { message, history } = await req.json();
    let result;

    try {
      result = await tryChatSession("gemini-2.5-flash", message, history);
    } catch (flashError) {
      const isOverloaded = flashError.message?.includes("503") || flashError.status === 503 || flashError.message?.includes("demand");
      const isRateLimited = flashError.message?.includes("429") || flashError.status === 429 || flashError.message?.includes("quota");

      if (isOverloaded || isRateLimited) {
        try {
          result = await tryChatSession("gemini-2.5-pro", message, history);
        } catch (proError) {
          if (proError.message?.includes("429") || proError.status === 429 || proError.rawError === "RATE_LIMIT_EXHAUSTED") {
            return NextResponse.json({ error: "RATE_LIMIT_EXHAUSTED" }, { status: 429 });
          }
          throw proError;
        }
      } else {
        throw flashError;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: error.status || 500 });
  }
}