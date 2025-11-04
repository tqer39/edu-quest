import type {
  KanjiGrade,
  KokugoQuestConfig,
  KanjiQuestion,
  KokugoQuestType,
  ReadingType,
} from '@edu-quest/domain';
import {
  calculateKanjiScore,
  generateKanjiQuestions,
  getKanjiPerformanceMessage,
  verifyKanjiAnswer,
} from '@edu-quest/domain';

/**
 * Input for starting a KokugoQuest quiz session
 */
export type StartKanjiQuizInput = {
  grade: KanjiGrade;
  questType: KokugoQuestType;
  questionCount: number;
  readingType?: ReadingType;
};

/**
 * KokugoQuest quiz session state
 */
export type KanjiQuiz = {
  config: KokugoQuestConfig;
  questions: KanjiQuestion[];
  index: number;
  correct: number;
};

/**
 * Create a new KokugoQuest quiz session
 */
export const createKanjiQuiz = (input: StartKanjiQuizInput): KanjiQuiz => {
  const config: KokugoQuestConfig = {
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
