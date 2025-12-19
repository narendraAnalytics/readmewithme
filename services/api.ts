import { Book } from './types';
import { cacheApi } from './backendApi';

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
 * Now with backend API caching
 */
export const getBooksByTopic = async (topicName: string): Promise<string> => {
  try {
    return await cacheApi.getBooksByTopic(topicName);
  } catch (error) {
    console.error('Failed to fetch books by topic:', error);
    throw error;
  }
};

/**
 * Search for a specific book by name
 * Now with backend API caching
 */
export const searchBooks = async (query: string): Promise<string> => {
  try {
    return await cacheApi.searchBooks(query);
  } catch (error) {
    console.error('Failed to search books:', error);
    throw error;
  }
};
