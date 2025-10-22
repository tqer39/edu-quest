import type { Mode, Question, QuizConfig } from '@edu-quest/domain';
import { checkAnswer as check, generateQuestion } from '@edu-quest/domain';

export type StartQuizInput = {
  mode: Mode;
  max: number;
  total: number;
};

export type Quiz = {
  config: QuizConfig & { total: number };
  index: number;
  correct: number;
};

export const createQuiz = (input: StartQuizInput): Quiz => ({
  config: { mode: input.mode, max: input.max, total: input.total },
  index: 0,
  correct: 0,
});

/**
 * 2つの問題が同一かどうかを判定する
 * 同一の基準: a, b, op, extras, isInverse, inverseSide が全て一致
 */
const isSameQuestion = (q1: Question, q2: Question): boolean => {
  // 基本的な値の比較
  if (q1.a !== q2.a || q1.b !== q2.b || q1.op !== q2.op) {
    return false;
  }

  // 逆算問題の比較
  if (q1.isInverse !== q2.isInverse || q1.inverseSide !== q2.inverseSide) {
    return false;
  }

  // extras の比較
  const extras1 = q1.extras;
  const extras2 = q2.extras;

  if (!extras1 && !extras2) return true;
  if (!extras1 || !extras2) return false;
  if (extras1.length !== extras2.length) return false;

  return extras1.every(
    (step, idx) =>
      extras2[idx] &&
      step.op === extras2[idx].op &&
      step.value === extras2[idx].value
  );
};

export const nextQuestion = (
  quiz: Quiz,
  previousQuestion?: Question
): Question => {
  const maxRetries = 10;
  let question = generateQuestion({
    mode: quiz.config.mode,
    max: quiz.config.max,
  });

  // 前の問題と同じ場合は、最大10回まで再生成を試みる
  if (previousQuestion) {
    let retries = 0;
    while (isSameQuestion(question, previousQuestion) && retries < maxRetries) {
      question = generateQuestion({
        mode: quiz.config.mode,
        max: quiz.config.max,
      });
      retries += 1;
    }
  }

  return question;
};

export const checkAnswer = (quiz: Quiz, q: Question, value: number) => {
  const ok = check(q, value);
  quiz.index += 1;
  if (ok) quiz.correct += 1;
  return ok;
};
