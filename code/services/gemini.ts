import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL_TEXT, SYSTEM_INSTRUCTION_TEXT } from "../constants";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

interface GenerateOptions {
  useSearch?: boolean;
  jsonMode?: boolean;
}

export const generateBookContent = async (
  prompt: string, 
  options: GenerateOptions = { useSearch: true, jsonMode: false }
) => {
  const ai = getAiClient();
  
  // JSON mode cannot be used with Google Search tools currently in the SDK/API constraints for this model
  // If jsonMode is requested, we force useSearch to false
  const useSearch = options.jsonMode ? false : (options.useSearch ?? true);
  
  const tools = useSearch ? [{ googleSearch: {} }] : [];
  
  const config: any = {
    systemInstruction: SYSTEM_INSTRUCTION_TEXT,
    tools: tools,
  };

  if (options.jsonMode) {
    config.responseMimeType = 'application/json';
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: config,
    });

    const text = response.text || "No content generated.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, groundingChunks };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};