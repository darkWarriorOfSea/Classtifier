import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getGeminiResponse = async (prompt: string, history: any[] = []) => {
  if (!API_KEY) {
    return "API Key not configured. Please add GEMINI_API_KEY to your secrets.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are Classtifier AI, a helpful academic assistant for a school management platform. You help students with studies and teachers with management tasks. Keep responses concise and use markdown for formatting."
      }
    });

    return response.text || "I'm having trouble connecting to my brain right now. Please try again later.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again later.";
  }
};
