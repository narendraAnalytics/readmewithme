import React from 'react';
import * as Icons from 'lucide-react';
import { Topic } from '../types';

interface TopicCardProps {
  topic: Topic;
  onClick: (topic: Topic) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  const IconComponent = (Icons as any)[topic.icon] || Icons.Book;

  return (
    <button 
      onClick={() => onClick(topic)}
      className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group text-center h-48"
    >
      <div className={`p-4 rounded-full mb-4 ${topic.color} group-hover:scale-110 transition-transform`}>
        <IconComponent size={32} />
      </div>
      <h3 className="font-sans font-semibold text-lg text-stone-800">{topic.label}</h3>
    </button>
  );
};
