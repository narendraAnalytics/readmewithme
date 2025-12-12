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
          title: title?.trim(),
          author: author?.trim(),
          publishedDate: publishedDate,
          description: ''
        };
      } else {
        // Fallback if "by" isn't found
        currentBook = {
          title: titleAndAuthor,
          author: 'Unknown',
          publishedDate: publishedDate,
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
