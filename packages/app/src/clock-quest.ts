import type {
  ClockDifficulty,
  ClockQuestion,
  ClockAnswer,
} from '@edu-quest/domain';
import { generateClockQuestion, checkClockAnswer } from '@edu-quest/domain';

export type StartClockQuizInput = {
  difficulty: ClockDifficulty;
  total: number;
};

export type ClockQuiz = {
  config: { difficulty: ClockDifficulty; total: number };
  index: number;
  correct: number;
};

export const createClockQuiz = (input: StartClockQuizInput): ClockQuiz => ({
  config: { difficulty: input.difficulty, total: input.total },
  index: 0,
  correct: 0,
});

export const nextClockQuestion = (quiz: ClockQuiz): ClockQuestion => {
  return generateClockQuestion(quiz.config.difficulty);
};

export const checkClockAnswerApp = (
  quiz: ClockQuiz,
  question: ClockQuestion,
  answer: ClockAnswer
): boolean => {
  const ok = checkClockAnswer(question, answer);
  quiz.index += 1;
  if (ok) quiz.correct += 1;
  return ok;
};
