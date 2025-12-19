import { GoogleGenAI } from '@google/genai';

const GEMINI_MODEL_TEXT = 'gemini-3-pro-preview';
const SYSTEM_INSTRUCTION = `You are ReadWithMe, an AI-powered reading companion.
Your role is to help users discover books, provide insightful analysis, and enhance their reading experience.
Always use Google Search to verify book information and provide accurate, up-to-date recommendations.`;

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    console.log('🔄 Initializing Gemini AI client...');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY not found in environment');
      throw new Error('GEMINI_API_KEY not found in environment');
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
    tools: tools,
  };

  if (jsonMode) {
    config.responseMimeType = 'application/json';
  }

  // Prepend system instruction to the prompt instead
  const fullPrompt = `${SYSTEM_INSTRUCTION}\n\n${prompt}`;

  try {
    console.log(`🤖 Calling Gemini (${GEMINI_MODEL_TEXT}) with search=${useSearch}...`);
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      ...config,
    });

    console.log('✅ Gemini response received');
    const text = response.text || 'No content generated.';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, groundingChunks };
  } catch (error: any) {
    console.error('❌ Gemini API Error:', error.message || error);
    if (error.stack) console.error(error.stack);
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

/**
 * Translate reading guide content to target language using Gemini
 */
export const translateReadingGuide = async (
  content: string,
  targetLanguage: string
): Promise<string> => {
  const prompt = `Translate the following book reading guide to ${targetLanguage}.
Preserve all markdown formatting (##, ###, **, bullet points).
Maintain the same structure and sections.
Only translate the text content, keep the markdown syntax intact.

Content to translate:
${content}`;

  const ai = getAiClient();

  try {
    console.log(`🌐 Translating content to ${targetLanguage}...`);

    // Prepend system instruction to prompt
    const fullPrompt = `You are a professional translator. Translate accurately while preserving formatting.\n\n${prompt}`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    });

    console.log(`✅ Translation to ${targetLanguage} completed`);
    return response.text || 'Translation failed.';
  } catch (error: any) {
    console.error('❌ Translation Error:', error.message || error);
    throw error;
  }
};
