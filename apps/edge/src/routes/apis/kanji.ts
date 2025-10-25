import { Hono } from 'hono';
import type { Env } from '../../env';
import {
  generateKanjiQuestion,
  checkKanjiAnswer,
  kanjiQuestionTypes,
  type KanjiQuestionType,
} from '../../application/usecases/kanji-quiz';

const typeIdSet = new Set(kanjiQuestionTypes.map((item) => item.id));

const normalizeTypes = (input: unknown): KanjiQuestionType[] | undefined => {
  if (!Array.isArray(input)) return undefined;
  const filtered: KanjiQuestionType[] = [];
  for (const value of input) {
    if (typeof value !== 'string') continue;
    if (typeIdSet.has(value as KanjiQuestionType)) {
      filtered.push(value as KanjiQuestionType);
    }
  }
  return filtered.length > 0 ? filtered : undefined;
};

const normalizeExcludeIds = (input: unknown): string[] | undefined => {
  if (!Array.isArray(input)) return undefined;
  const filtered: string[] = [];
  for (const value of input) {
    if (typeof value === 'string' && value.trim().length > 0) {
      filtered.push(value);
    }
  }
  return filtered.length > 0 ? filtered : undefined;
};

export const kanjiQuiz = new Hono<{ Bindings: Env }>();

kanjiQuiz.post('/questions/next', async (c) => {
  const payload = (await c.req.json().catch(() => ({}))) as {
    gradeId?: string;
    allowedTypes?: unknown;
    excludeIds?: unknown;
  };

  const question = generateKanjiQuestion({
    gradeId: payload.gradeId,
    allowedTypes: normalizeTypes(payload.allowedTypes),
    excludeIds: normalizeExcludeIds(payload.excludeIds),
  });

  return c.json({ question });
});

kanjiQuiz.post('/answers/check', async (c) => {
  const payload = (await c.req.json().catch(() => ({}))) as {
    questionId?: unknown;
    selections?: unknown;
  };

  const questionId = typeof payload.questionId === 'string' ? payload.questionId : undefined;
  const selections = Array.isArray(payload.selections)
    ? payload.selections.filter((value): value is string => typeof value === 'string')
    : undefined;

  if (!questionId || !selections || selections.length === 0) {
    return c.json({ error: 'invalid payload' }, 400);
  }

  const result = checkKanjiAnswer({ questionId, selections });
  return c.json(result);
});
