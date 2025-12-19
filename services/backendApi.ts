import apiClient from './apiClient';
import { QuizAttemptData } from './db/queries/quizzes';

/**
 * User API
 */
export const userApi = {
  syncUser: async (userData: {
    email: string | null;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
  }) => {
    const response = await apiClient.post('/users/sync', userData);
    return response.data.user;
  },

  getMe: async () => {
    const response = await apiClient.get('/users/me');
    return response.data.user;
  },
};

/**
 * Reading API
 */
export const readingApi = {
  saveToHistory: async (
    bookTitle: string,
    bookAuthor: string,
    publishedDate?: string,
    topic?: string
  ) => {
    const response = await apiClient.post('/reading/history', {
      bookTitle,
      bookAuthor,
      publishedDate,
      topic,
    });
    return response.data.book;
  },

  getHistory: async (limit = 20) => {
    const response = await apiClient.get('/reading/history', {
      params: { limit },
    });
    return response.data.history;
  },

  getReadingGuide: async (bookTitle: string, bookAuthor: string) => {
    const response = await apiClient.post('/reading/guide', {
      bookTitle,
      bookAuthor,
    });
    return response.data;
  },

  updateProgress: async (
    bookTitle: string,
    bookAuthor: string,
    percentage: number
  ) => {
    const response = await apiClient.put('/reading/progress', {
      bookTitle,
      bookAuthor,
      percentage,
    });
    return response.data;
  },
};

/**
 * Quiz API
 */
export const quizApi = {
  generateQuiz: async (bookTitle: string, bookAuthor: string) => {
    const response = await apiClient.post('/quizzes/generate', {
      bookTitle,
      bookAuthor,
    });
    return response.data.questions;
  },

  saveAttempt: async (data: QuizAttemptData) => {
    const response = await apiClient.post('/quizzes/attempt', data);
    return response.data.attempt;
  },

  getHistory: async (bookTitle: string, bookAuthor: string) => {
    const response = await apiClient.get(
      `/quizzes/history/${encodeURIComponent(bookTitle)}/${encodeURIComponent(bookAuthor)}`
    );
    return response.data.history;
  },

  getStats: async (bookTitle: string, bookAuthor: string) => {
    const response = await apiClient.get(
      `/quizzes/stats/${encodeURIComponent(bookTitle)}/${encodeURIComponent(bookAuthor)}`
    );
    return response.data.stats;
  },
};

/**
 * Cache API (Books)
 */
export const cacheApi = {
  getBooksByTopic: async (topicName: string) => {
    const response = await apiClient.post('/cache/books/topic', {
      topicName,
    });
    return response.data.text;
  },

  searchBooks: async (query: string) => {
    const response = await apiClient.post('/cache/books/search', {
      query,
    });
    return response.data.text;
  },
};
