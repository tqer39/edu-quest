import type {
  ClockAnswer,
  ClockDifficulty,
  ClockGrade,
  ClockQuestion,
} from '@edu-quest/domain';
import { checkClockAnswer, generateClockQuestion } from '@edu-quest/domain';

export type StartClockQuizInput = {
  grade: ClockGrade;
  difficulty: ClockDifficulty;
  total: number;
};

export type ClockQuiz = {
  config: { grade: ClockGrade; difficulty: ClockDifficulty; total: number };
  index: number;
  correct: number;
};

export const createClockQuiz = (input: StartClockQuizInput): ClockQuiz => ({
  config: {
    grade: input.grade,
    difficulty: input.difficulty,
    total: input.total,
  },
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
