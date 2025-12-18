import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { QuizQuestion } from '@/services/types';

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: (score: number, answers: any[]) => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(index);
    setShowExplanation(true);

    // Track the answer
    const answerRecord = {
      questionIndex: currentQuestion,
      selectedAnswer: index,
      correctAnswer: question.answer,
      isCorrect: index === question.answer,
    };
    setAnswers([...answers, answerRecord]);

    if (index === question.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  if (quizComplete) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.completionCard}>
          <Text style={styles.completionTitle}>Quiz Complete! 🎉</Text>
          <Text style={styles.scoreText}>
            Your Score: {score}/{questions.length}
          </Text>
          <Text style={styles.percentageText}>
            {Math.round((score / questions.length) * 100)}%
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => onComplete(score, answers)}>
            <Text style={styles.backButtonText}>Back to Reading</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <Text style={styles.progressText}>
          QUESTION {currentQuestion + 1} OF {questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.answer;
          const showCorrect = showExplanation && isCorrect;
          const showIncorrect = showExplanation && isSelected && !isCorrect;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                showCorrect && styles.optionCorrect,
                showIncorrect && styles.optionIncorrect,
              ]}
              onPress={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}>
              <Text style={[
                styles.optionText,
                (showCorrect || showIncorrect) && styles.optionTextSelected
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Explanation */}
      {showExplanation && (
        <View style={styles.explanationCard}>
          <Text style={styles.explanationTitle}>
            {selectedAnswer === question.answer ? '✓ Correct!' : '✗ Incorrect'}
          </Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressSection: {
    padding: 20,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 8,
    letterSpacing: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  questionCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 26,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  optionButton: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionCorrect: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  optionIncorrect: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  explanationCard: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: '#8B5CF6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  completionCard: {
    margin: 20,
    padding: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    color: '#6B7280',
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
