// API Request/Response types
export interface GeminiRequest {
  prompt: string;
  useSearch?: boolean;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GeminiResponse {
  text: string;
  groundingChunks: GroundingChunk[];
}

// Book data structure
export interface Book {
  title: string;
  author: string;
  publishedDate?: string;
  description: string;
}

// Topic data structure
export interface Topic {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}
