export interface Book {
  title: string;
  author: string;
  description?: string;
  coverColor?: string;
  publishedDate?: string;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  // Allow loose matching for other properties the SDK might return
  [key: string]: any;
}

export interface AIState {
  isLoading: boolean;
  text: string;
  groundingChunks: GroundingChunk[];
  error?: string;
}

export enum ViewMode {
  HOME = 'HOME',
  TOPIC_RESULT = 'TOPIC_RESULT',
  READING = 'READING',
}

export interface Topic {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export type LanguageCode = 'en' | 'te' | 'hi' | 'ta' | 'mr';