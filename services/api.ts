import { generateBookContent } from './gemini';

/**
 * Get book recommendations by topic
 */
export const getBooksByTopic = async (topicName: string): Promise<string> => {
  const prompt = `Recommend 5 interesting books about "${topicName}".
  For each book, provide:
  - Title
  - Author
  - Publication year
  - Brief description (2-3 sentences)

  Format each book as:
  ### [Title] by [Author] | [Year]
  [Description]`;

  const response = await generateBookContent(prompt, true);
  return response.text;
};

/**
 * Search books by custom query
 */
export const searchBooks = async (query: string): Promise<string> => {
  const prompt = `Find 3-5 books related to: "${query}".
  For each book, provide:
  - Title
  - Author
  - Publication year
  - Brief description (2-3 sentences)

  Format each book as:
  ### [Title] by [Author] | [Year]
  [Description]`;

  const response = await generateBookContent(prompt, true);
  return response.text;
};
