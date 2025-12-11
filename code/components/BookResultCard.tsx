import React from 'react';
import { BookOpen, User, Calendar } from 'lucide-react';
import { Book } from '../types';

interface BookResultCardProps {
  book: Book;
  onRead: (book: Book) => void;
}

export const BookResultCard: React.FC<BookResultCardProps> = ({ book, onRead }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      <div className="flex-1">
        <h3 className="font-serif font-bold text-lg text-stone-800 mb-1">{book.title}</h3>
        <div className="flex flex-wrap gap-4 text-stone-500 text-sm mb-4">
          <div className="flex items-center gap-1.5">
            <User size={14} />
            <span>{book.author}</span>
          </div>
          {book.publishedDate && (
            <div className="flex items-center gap-1.5 text-stone-400">
              <Calendar size={14} />
              <span>{book.publishedDate}</span>
            </div>
          )}
        </div>
        <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {book.description}
        </p>
      </div>
      <button 
        onClick={() => onRead(book)}
        className="w-full mt-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
      >
        <BookOpen size={16} />
        Read This Book
      </button>
    </div>
  );
};