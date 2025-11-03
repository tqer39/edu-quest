import type { KanjiQuiz, KanjiQuizResult } from '@edu-quest/app';
import {
  createKanjiQuiz,
  getCurrentKanjiQuestion,
  getKanjiQuizResult,
  isKanjiQuizFinished,
  submitKanjiAnswer,
} from '@edu-quest/app';
import type {
  KanjiGrade,
  KanjiQuestion,
  KanjiQuestType,
} from '@edu-quest/domain';

export type KanjiQuizSession = {
  quiz: KanjiQuiz;
  currentQuestion: KanjiQuestion | null;
};

/**
 * 新しい漢字クイズセッションを開始
 */
export const startKanjiQuizSession = (
  grade: KanjiGrade,
  questionCount: number = 10,
  questType: KanjiQuestType = 'reading'
): KanjiQuizSession => {
  const quiz = createKanjiQuiz({
    grade,
    questType,
    questionCount,
  });
  const currentQuestion = getCurrentKanjiQuestion(quiz);
  return { quiz, currentQuestion };
};

/**
 * 回答を検証して次の質問に進む
 */
export const submitKanjiQuizAnswer = (
  session: KanjiQuizSession,
  userAnswer: string
): { isCorrect: boolean; nextSession: KanjiQuizSession | null } => {
  if (!session.currentQuestion) {
    return { isCorrect: false, nextSession: null };
  }

  const isCorrect = submitKanjiAnswer(session.quiz, userAnswer);

  // クイズが終了したかチェック
  if (isKanjiQuizFinished(session.quiz)) {
    return { isCorrect, nextSession: null };
  }

  // 次の質問を取得
  const nextQuestion = getCurrentKanjiQuestion(session.quiz);
  return {
    isCorrect,
    nextSession: { quiz: session.quiz, currentQuestion: nextQuestion },
  };
};

/**
 * クイズ結果を取得
 */
export const getKanjiSessionResult = (
  session: KanjiQuizSession
): KanjiQuizResult => {
  return getKanjiQuizResult(session.quiz);
};
