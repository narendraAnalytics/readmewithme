import { GoogleGenAI } from '@google/genai';
import { QuizQuestion } from './types';

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
  useSearch = true,
  jsonMode = false
) => {
  const ai = getAiClient();
  const tools = useSearch && !jsonMode ? [{ googleSearch: {} }] : [];

  const config: any = {
    systemInstruction: SYSTEM_INSTRUCTION,
    tools: tools,
  };

  if (jsonMode) {
    config.responseMimeType = 'application/json';
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: config,
    });

    const text = response.text || 'No content generated.';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, groundingChunks };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

export const generateQuiz = async (bookTitle: string, bookAuthor: string): Promise<QuizQuestion[]> => {
  const prompt = `Create a 5-question multiple choice quiz about the book "${bookTitle}" by "${bookAuthor}".

For each question, provide:
- question: The question text
- options: Array of exactly 4 answer options
- answer: Index (0-3) of the correct option
- explanation: Brief explanation of why the answer is correct

Return ONLY a valid JSON array with no markdown formatting.

Example format:
[
  {
    "question": "What is the main theme?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "The main theme is..."
  }
]`;

  const response = await generateBookContent(prompt, true, true);

  // Clean potential markdown
  let cleanText = response.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    const questions = JSON.parse(cleanText);
    return questions.slice(0, 5); // Ensure only 5 questions
  } catch (error) {
    throw new Error('Failed to parse quiz questions');
  }
};
