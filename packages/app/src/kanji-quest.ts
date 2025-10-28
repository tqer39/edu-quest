import type {
  KanjiGrade,
  KanjiQuestType,
  ReadingType,
  KanjiQuestion,
  KanjiQuestConfig,
} from '@edu-quest/domain';
import {
  generateKanjiQuestions,
  verifyKanjiAnswer,
  calculateKanjiScore,
  getKanjiPerformanceMessage,
} from '@edu-quest/domain';

/**
 * Input for starting a KanjiQuest quiz session
 */
export type StartKanjiQuizInput = {
  grade: KanjiGrade;
  questType: KanjiQuestType;
  questionCount: number;
  readingType?: ReadingType;
};

/**
 * KanjiQuest quiz session state
 */
export type KanjiQuiz = {
  config: KanjiQuestConfig;
  questions: KanjiQuestion[];
  index: number;
  correct: number;
};

/**
 * Create a new KanjiQuest quiz session
 */
export const createKanjiQuiz = (input: StartKanjiQuizInput): KanjiQuiz => {
  const config: KanjiQuestConfig = {
    grade: input.grade,
    questType: input.questType,
    questionCount: input.questionCount,
    readingType: input.readingType,
  };

  const questions = generateKanjiQuestions(config);

  return {
    config,
    questions,
    index: 0,
    correct: 0,
  };
};

/**
 * Get the current question in the quiz
 */
export const getCurrentKanjiQuestion = (
  quiz: KanjiQuiz
): KanjiQuestion | null => {
  if (quiz.index >= quiz.questions.length) {
    return null;
  }
  return quiz.questions[quiz.index];
};

/**
 * Check if the quiz is finished
 */
export const isKanjiQuizFinished = (quiz: KanjiQuiz): boolean => {
  return quiz.index >= quiz.questions.length;
};

/**
 * Submit an answer and update quiz state
 * Returns whether the answer was correct
 */
export const submitKanjiAnswer = (
  quiz: KanjiQuiz,
  userAnswer: string
): boolean => {
  const question = getCurrentKanjiQuestion(quiz);
  if (!question) {
    throw new Error('No current question available');
  }

  const isCorrect = verifyKanjiAnswer(question, userAnswer);

  // Update quiz state
  quiz.index += 1;
  if (isCorrect) {
    quiz.correct += 1;
  }

  return isCorrect;
};

/**
 * Get quiz results
 */
export type KanjiQuizResult = {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  message: string;
};

export const getKanjiQuizResult = (quiz: KanjiQuiz): KanjiQuizResult => {
  const score = calculateKanjiScore(quiz.questions.length, quiz.correct);
  const message = getKanjiPerformanceMessage(score);

  return {
    totalQuestions: quiz.questions.length,
    correctAnswers: quiz.correct,
    score,
    message,
  };
};

/**
 * Get quiz progress
 */
export type KanjiQuizProgress = {
  current: number;
  total: number;
  percentage: number;
};

export const getKanjiQuizProgress = (quiz: KanjiQuiz): KanjiQuizProgress => {
  return {
    current: quiz.index,
    total: quiz.questions.length,
    percentage: Math.round((quiz.index / quiz.questions.length) * 100),
  };
};
