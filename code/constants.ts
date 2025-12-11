import { Topic } from './types';

export const GEMINI_MODEL_TEXT = 'gemini-3-pro-preview';
export const GEMINI_MODEL_LIVE = 'gemini-2.5-flash-native-audio-preview-09-2025';

export const TOPICS: Topic[] = [
  { id: 'tech', label: 'Technology & AI', icon: 'Cpu', color: 'bg-blue-100 text-blue-700' },
  { id: 'science', label: 'Science & Nature', icon: 'FlaskConical', color: 'bg-green-100 text-green-700' },
  { id: 'history', label: 'History & Culture', icon: 'Landmark', color: 'bg-amber-100 text-amber-700' },
  { id: 'philosophy', label: 'Philosophy', icon: 'BrainCircuit', color: 'bg-purple-100 text-purple-700' },
  { id: 'business', label: 'Business & Finance', icon: 'Briefcase', color: 'bg-slate-100 text-slate-700' },
  { id: 'fiction', label: 'Modern Fiction', icon: 'BookOpen', color: 'bg-rose-100 text-rose-700' },
];

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export const SYSTEM_INSTRUCTION_TEXT = `You are ReadWithMe, an intelligent reading assistant. 
Your goal is to help users find books, understand complex topics, and test their knowledge.
Always use the Google Search tool to find the most recent and accurate information about books, authors, and reviews.
When asked for books, provide a list with Title, Author, and a brief summary.
When analyzing a book, provide deep insights, themes, and character analysis.`;

export const SYSTEM_INSTRUCTION_LIVE = `You are ReadWithMe Voice, a friendly and knowledgeable literary companion. 
You are chatting with a user about books, reading, or specific topics they are interested in.
Keep your responses concise, engaging, and conversational. 
If the user asks about a specific book, feel free to discuss its themes, plot (without major spoilers unless asked), and reception.`;