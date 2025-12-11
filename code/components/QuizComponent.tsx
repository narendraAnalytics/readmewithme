import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Award } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizComponentProps {
  questions: QuizQuestion[];
  onRetry: () => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ questions, onRetry }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    if (index === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-indigo-100 p-6 rounded-full text-indigo-600 mb-6">
          <Award size={64} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Quiz Completed!</h2>
        <p className="text-stone-500 mb-8 font-sans">
          You scored <span className="font-bold text-indigo-600 text-xl">{score}</span> out of <span className="font-bold text-stone-800 text-xl">{questions.length}</span>
        </p>
        
        <div className="w-full max-w-xs bg-stone-100 rounded-full h-4 mb-8 overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-1000 ease-out"
            style={{ width: `${(score / questions.length) * 100}%` }}
          />
        </div>

        <button 
          onClick={onRetry}
          className="flex items-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors font-sans font-medium"
        >
          <RotateCcw size={18} /> Try Another Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-800 mb-8 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let stateClass = "border-stone-200 hover:border-indigo-300 hover:bg-stone-50";
            
            if (showResult) {
              if (idx === currentQuestion.answer) {
                stateClass = "border-green-500 bg-green-50 text-green-800";
              } else if (idx === selectedOption) {
                stateClass = "border-red-300 bg-red-50 text-red-800";
              } else {
                stateClass = "border-stone-100 opacity-50";
              }
            } else if (selectedOption === idx) {
              stateClass = "border-indigo-500 bg-indigo-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-sans text-stone-700 font-medium flex items-center justify-between group ${stateClass}`}
              >
                <span>{option}</span>
                {showResult && idx === currentQuestion.answer && <CheckCircle2 size={20} className="text-green-600" />}
                {showResult && idx === selectedOption && idx !== currentQuestion.answer && <XCircle size={20} className="text-red-500" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button */}
        {showResult && (
          <div className="mt-8 pt-6 border-t border-stone-100 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-stone-50 p-4 rounded-lg mb-6">
              <p className="text-sm font-bold text-stone-500 uppercase mb-1">Explanation</p>
              <p className="text-stone-700 text-sm leading-relaxed">{currentQuestion.explanation}</p>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors font-medium font-sans shadow-lg shadow-indigo-200"
              >
                {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};