import type { ExtraStep, Mode } from '@edu-quest/domain';
import {
  deriveDifficultyFromQuestion,
  formatQuestion,
} from '@edu-quest/domain';
import { Hono } from 'hono';
import {
  generateQuizQuestion,
  verifyAnswer,
} from '../../application/usecases/quiz';
import type { Env } from '../../env';
import { createDb, schema } from '../../infrastructure/database/client';

export const quiz = new Hono<{ Bindings: Env }>();

quiz.post('/questions/next', async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as {
    mode?: Mode;
    max?: number;
    gradeId?: string;
    terms?: 2 | 3 | 4 | 5 | null;
    customConfig?: {
      operations?: string[];
      terms?: number;
      max?: number;
    };
  };
  const question = generateQuizQuestion({
    mode: body.mode,
    max: body.max,
    gradeId: body.gradeId,
    terms: body.terms,
    customConfig: body.customConfig,
  });
  const expression = formatQuestion(question);
  return c.json({ question: { ...question, expression } });
});

// Helper function to validate answer check payload
const validateAnswerCheckPayload = (
  baseQuestion: unknown,
  value: unknown
): boolean => {
  if (
    !baseQuestion ||
    typeof baseQuestion !== 'object' ||
    !('a' in baseQuestion) ||
    !('b' in baseQuestion) ||
    !('op' in baseQuestion)
  ) {
    return false;
  }

  const q = baseQuestion as { a: unknown; b: unknown; op: unknown };

  return (
    typeof q.a === 'number' &&
    typeof q.b === 'number' &&
    (q.op === '+' || q.op === '-' || q.op === '×') &&
    typeof value === 'number'
  );
};

// Helper function to extract and filter extras
const extractExtras = (extras: unknown): ExtraStep[] | undefined => {
  if (!Array.isArray(extras)) return undefined;

  const filtered = extras.filter(
    (step) =>
      step &&
      typeof step === 'object' &&
      'value' in step &&
      'op' in step &&
      typeof step.value === 'number' &&
      (step.op === '+' || step.op === '-')
  );

  return filtered.length > 0 ? (filtered as ExtraStep[]) : undefined;
};

// Helper function to build question for checking
const buildQuestionForCheck = (
  baseQuestion: {
    a: number;
    b: number;
    op: '+' | '-' | '×';
    extras?: ExtraStep[];
    isInverse?: boolean;
    inverseSide?: 'left' | 'right';
    answer?: number;
  },
  extras: ExtraStep[] | undefined
) => {
  return {
    a: baseQuestion.a,
    b: baseQuestion.b,
    op: baseQuestion.op,
    extras,
    isInverse: 'isInverse' in baseQuestion ? baseQuestion.isInverse : undefined,
    inverseSide:
      'inverseSide' in baseQuestion ? baseQuestion.inverseSide : undefined,
    answer: 'answer' in baseQuestion ? baseQuestion.answer : undefined,
  };
};

quiz.post('/answers/check', async (c) => {
  const payload = (await c.req.json()) as {
    question?: {
      a: number;
      b: number;
      op: '+' | '-' | '×';
      extras?: ExtraStep[];
      isInverse?: boolean;
      inverseSide?: 'left' | 'right';
      answer?: number;
    };
    a?: number;
    b?: number;
    op?: '+' | '-' | '×';
    extras?: ExtraStep[];
    value: number;
    gradeId?: string;
    mode?: Mode;
    max?: number;
  };

  const baseQuestion = payload.question ?? {
    a: payload.a,
    b: payload.b,
    op: payload.op,
    extras: payload.extras,
  };

  if (!validateAnswerCheckPayload(baseQuestion, payload.value)) {
    return c.json({ error: 'invalid payload' }, 400);
  }

  const typedBaseQuestion = baseQuestion as {
    a: number;
    b: number;
    op: '+' | '-' | '×';
    extras?: ExtraStep[];
    isInverse?: boolean;
    inverseSide?: 'left' | 'right';
    answer?: number;
  };

  const extras = extractExtras(typedBaseQuestion.extras);
  const questionForCheck = buildQuestionForCheck(typedBaseQuestion, extras);

  const { ok, correctAnswer } = verifyAnswer({
    question: questionForCheck,
    value: payload.value,
  });

  const expression = formatQuestion({
    a: typedBaseQuestion.a,
    b: typedBaseQuestion.b,
    op: typedBaseQuestion.op,
    extras,
    isInverse: questionForCheck.isInverse,
    inverseSide: questionForCheck.inverseSide,
    answer: correctAnswer,
  });

  const fallbackMax = Math.max(
    Math.abs(typedBaseQuestion.a),
    Math.abs(typedBaseQuestion.b),
    Math.abs(correctAnswer),
    ...(extras ?? []).map((step) => Math.abs(step.value))
  );

  const configuredMax =
    typeof payload.max === 'number' && payload.max > 0
      ? payload.max
      : fallbackMax;

  const difficultyProfile = deriveDifficultyFromQuestion({
    question: {
      a: typedBaseQuestion.a,
      b: typedBaseQuestion.b,
      op: typedBaseQuestion.op,
      extras,
      answer: correctAnswer,
      isInverse: questionForCheck.isInverse,
      inverseSide: questionForCheck.inverseSide,
    },
    mode: payload.mode ?? 'mix',
    max: configuredMax,
  });

  const db = createDb(c.env);
  try {
    await db.insert(schema.quizResults).values({
      gradeId: payload.gradeId ?? 'unknown',
      mode: payload.mode ?? 'mix',
      maxValue: typeof payload.max === 'number' ? payload.max : 0,
      operandA: questionForCheck.a,
      operandB: questionForCheck.b,
      operator: questionForCheck.op,
      correctAnswer,
      userAnswer: payload.value,
      isCorrect: ok,
      expression,
      extrasJson: JSON.stringify(extras ?? []),
      difficultyId: difficultyProfile.id,
      difficultyValue: difficultyProfile.value,
      creatureId: difficultyProfile.creature.id,
      creatureName: difficultyProfile.creature.name,
      creatureEmoji: difficultyProfile.creature.emoji,
    });
  } catch (error) {
    console.error('failed to persist quiz result', error);
  }
  return c.json({ ok, correctAnswer });
});
