import { GoogleGenAI } from '@google/genai';

const GEMINI_MODEL_TEXT = 'gemini-3-pro-preview';
const SYSTEM_INSTRUCTION = `You are ReadWithMe, an AI-powered reading companion.
Your role is to help users discover books, provide insightful analysis, and enhance their reading experience.
Always use Google Search to verify book information and provide accurate, up-to-date recommendations.`;

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('EXPO_PUBLIC_GEMINI_API_KEY not found in environment');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const generateBookContent = async (
  prompt: string,
  useSearch = true
) => {
  const ai = getAiClient();
  const tools = useSearch ? [{ googleSearch: {} }] : [];

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
      },
    });

    const text = response.text || 'No content generated.';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, groundingChunks };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};
