import type {
  ClockDifficulty,
  ClockQuestion,
  ClockAnswer,
  ClockGrade,
} from '@edu-quest/domain';
import {
  createClockQuiz,
  nextClockQuestion,
  checkClockAnswerApp,
} from '@edu-quest/app';
import type { ClockQuiz } from '@edu-quest/app';

export type ClockQuizSession = {
  quiz: ClockQuiz;
  currentQuestion: ClockQuestion;
};

/**
 * 新しいクイズセッションを開始
 */
export const startClockQuizSession = (
  grade: ClockGrade,
  difficulty: ClockDifficulty,
  total: number
): ClockQuizSession => {
  const quiz = createClockQuiz({ grade, difficulty, total });
  const currentQuestion = nextClockQuestion(quiz);
  return { quiz, currentQuestion };
};

/**
 * 回答を検証して次の質問に進む
 */
export const submitClockAnswer = (
  session: ClockQuizSession,
  answer: ClockAnswer
): { isCorrect: boolean; nextSession: ClockQuizSession | null } => {
  const isCorrect = checkClockAnswerApp(
    session.quiz,
    session.currentQuestion,
    answer
  );

  // クイズが終了したかチェック
  if (session.quiz.index >= session.quiz.config.total) {
    return { isCorrect, nextSession: null };
  }

  // 次の質問を生成
  const nextQuestion = nextClockQuestion(session.quiz);
  return {
    isCorrect,
    nextSession: { quiz: session.quiz, currentQuestion: nextQuestion },
  };
};
