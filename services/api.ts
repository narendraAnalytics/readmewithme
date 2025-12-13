import { generateBookContent } from './gemini';
import { Book } from './types';

/**
 * Type guard to check if a Partial<Book> has all required Book properties
 */
function isCompleteBook(book: Partial<Book> | null): book is Book {
  return (
    book !== null &&
    typeof book.title === 'string' &&
    book.title.length > 0 &&
    typeof book.author === 'string' &&
    book.author.length > 0 &&
    typeof book.description === 'string'
  );
}

/**
 * Parse markdown book recommendations into Book objects
 * Format: ### Title by Author | Date
 */
export const parseBooks = (markdownText: string): Book[] => {
  if (!markdownText) return [];

  // Helper to remove brackets from text
  const removeBrackets = (text: string): string => {
    return text.replace(/^\[|\]$/g, '').trim();
  };

  const books: Book[] = [];
  const lines = markdownText.split('\n');
  let currentBook: Partial<Book> | null = null;

  lines.forEach(line => {
    if (line.trim().startsWith('###')) {
      // Save previous book if exists
      if (isCompleteBook(currentBook)) {
        books.push(currentBook);
      }

      // Parse new header: ### Title by Author | Date
      const cleanLine = line.replace(/^###\s*/, '').trim();

      let titleAndAuthor = cleanLine;
      let publishedDate = '';

      // Check for date separator '|'
      if (cleanLine.includes('|')) {
        const splitDate = cleanLine.split('|');
        publishedDate = splitDate.pop()?.trim() || '';
        titleAndAuthor = splitDate.join('|').trim();
      }

      // Split Title by Author
      const parts = titleAndAuthor.split(/ by /i);
      if (parts.length >= 2) {
        const author = parts.pop(); // Last part is author
        const title = parts.join(' by '); // Rejoin rest as title
        currentBook = {
          title: removeBrackets(title?.trim() || ''),
          author: removeBrackets(author?.trim() || ''),
          publishedDate: removeBrackets(publishedDate),
          description: ''
        };
      } else {
        // Fallback if "by" isn't found
        currentBook = {
          title: removeBrackets(titleAndAuthor),
          author: 'Unknown',
          publishedDate: removeBrackets(publishedDate),
          description: ''
        };
      }
    } else if (currentBook) {
      // Append to description if it's not a markdown header or empty line
      if (line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('[')) {
        // Remove bold markers from description
        const cleanDesc = line.replace(/\*\*/g, '');
        currentBook.description = (currentBook.description + ' ' + cleanDesc).trim();
      }
    }
  });

  // Don't forget the last book
  if (isCompleteBook(currentBook)) {
    books.push(currentBook);
  }

  return books;
};

/**
 * Get book recommendations by topic
 */
export const getBooksByTopic = async (topicName: string): Promise<string> => {
  const prompt = `Recommend 5 highly-rated books about "${topicName}".
  IMPORTANT: Prioritize the MOST RECENT publications (from the last 2-3 years if available). Sort these books by publication date in DESCENDING order (newest/most recent books first).

  For each book, provide:
  - Title
  - Author
  - Publication year (in YYYY format)
  - Brief description (2-3 sentences)

  CRITICAL FORMATTING INSTRUCTION:
  Format each book entry exactly like this:
  ### Title by Author | Year
  Description

  Use Google Search to find the most recent, highly-rated books and ensure the published dates are accurate.`;

  const response = await generateBookContent(prompt, true);
  return response.text;
};

/**
 * Search for a specific book by name
 */
export const searchBooks = async (query: string): Promise<string> => {
  const prompt = `I am looking for the specific book: "${query}".

  Please find this exact book and provide:
  - Title (exact title of the book)
  - Author (full author name)
  - Publication year (in YYYY format)
  - Brief description (2-3 sentences about this specific book)

  CRITICAL FORMATTING INSTRUCTION:
  Format the book entry exactly like this:
  ### Title by Author | Year
  Description

  Use Google Search to find the exact book titled "${query}" and verify all details are accurate.
  If you cannot find this exact book, find the closest match and explain in the description.`;

  const response = await generateBookContent(prompt, true);
  return response.text;
};
