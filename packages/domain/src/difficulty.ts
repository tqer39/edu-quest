import type { Mode, Question } from './types';

export type DifficultyCreature = {
  id: string;
  name: string;
  emoji: string;
};

export type DifficultyProfile = {
  id: string;
  value: number;
  creature: DifficultyCreature;
};

export type DifficultyContext = {
  mode: Mode;
  max: number;
  terms?: number | null;
  operationsCount?: number;
  highestOperand?: number;
  includesMultiplication?: boolean;
  includesDivision?: boolean;
  includesInverse?: boolean;
};

const creatureTiers: readonly {
  threshold: number;
  creature: DifficultyCreature;
}[] = [
  { threshold: 180, creature: { id: 'chick', name: 'ひよこ', emoji: '🐥' } },
  { threshold: 220, creature: { id: 'kitten', name: 'こねこ', emoji: '🐱' } },
  {
    threshold: 260,
    creature: { id: 'red-panda', name: 'レッサーパンダ', emoji: '🦊' },
  },
  {
    threshold: 320,
    creature: { id: 'cottontail', name: 'ふわふわうさぎ', emoji: '🐰' },
  },
  { threshold: 380, creature: { id: 'fawn', name: 'こじか', emoji: '🦌' } },
  { threshold: 450, creature: { id: 'cub', name: 'こぐま', emoji: '🐻' } },
  {
    threshold: 520,
    creature: { id: 'otter', name: 'こつめかわうそ', emoji: '🦦' },
  },
];

const selectCreature = (difficultyValue: number): DifficultyCreature => {
  for (const tier of creatureTiers) {
    if (difficultyValue <= tier.threshold) {
      return tier.creature;
    }
  }
  return { id: 'penguin-hero', name: 'ペンギンたいちょう', emoji: '🐧' };
};

const normalizeValue = (value: number) => {
  const rounded = Math.round(value);
  if (rounded < 120) return 120;
  if (rounded > 999) return 999;
  return rounded;
};

const computeModeBonus = (context: DifficultyContext) => {
  let bonus = 0;
  if (context.includesInverse || context.mode.includes('inverse')) {
    bonus += 60;
  }
  if (context.includesMultiplication || context.mode === 'mul') {
    bonus += 75;
  }
  if (context.includesDivision || context.mode === 'div') {
    bonus += 85;
  }
  if (context.mode === 'mix') {
    bonus += 55;
  }
  if (context.mode === 'add-sub-mix') {
    bonus += 35;
  }
  return bonus;
};

const collectModeFlags = (context: DifficultyContext) => {
  const flags: string[] = [];
  if (context.includesInverse || context.mode.includes('inverse')) {
    flags.push('inv');
  }
  if (context.includesMultiplication || context.mode === 'mul') {
    flags.push('mul');
  }
  if (context.includesDivision || context.mode === 'div') {
    flags.push('div');
  }
  return flags;
};

export const deriveDifficultyProfile = (
  context: DifficultyContext
): DifficultyProfile => {
  const operationsCount = context.operationsCount
    ? Math.max(1, context.operationsCount)
    : context.terms && context.terms > 0
      ? Math.max(1, context.terms - 1)
      : 1;

  const highestOperand = Math.max(
    1,
    context.highestOperand ?? context.max ?? 1
  );

  const base = 90;
  const operationWeight = operationsCount * 28;
  const rangeWeight = Math.min(140, Math.log2(highestOperand + 2) * 22);
  const capWeight = Math.min(160, Math.log2(context.max + 4) * 18);

  const difficultyValue =
    base +
    operationWeight +
    rangeWeight +
    capWeight +
    computeModeBonus(context);

  const normalized = normalizeValue(difficultyValue);
  const creature = selectCreature(normalized);

  const idParts = [
    'difficulty',
    context.mode,
    `mx${Math.min(999, Math.max(1, Math.round(context.max)))}`,
    `ops${operationsCount}`,
    `val${normalized}`,
    ...collectModeFlags(context),
  ];

  return {
    id: idParts.join(':'),
    value: normalized,
    creature,
  };
};

export const createDifficultyContextFromQuestion = (params: {
  question: Question;
  mode: Mode;
  max: number;
}): DifficultyContext => {
  const extrasCount = params.question.extras?.length ?? 0;
  const terms = extrasCount + 2;
  const operationsCount = extrasCount + 1;
  const highestOperand = Math.max(
    Math.abs(params.question.a),
    Math.abs(params.question.b),
    Math.abs(params.question.answer),
    ...(params.question.extras ?? []).map((step) => Math.abs(step.value))
  );
  const includesMultiplication =
    params.question.op === '×' || params.mode === 'mul';
  return {
    mode: params.mode,
    max: params.max,
    terms,
    operationsCount,
    highestOperand,
    includesMultiplication,
    includesDivision: params.mode === 'div',
    includesInverse:
      Boolean(params.question.isInverse) || params.mode.includes('inverse'),
  };
};

export const deriveDifficultyFromQuestion = (params: {
  question: Question;
  mode: Mode;
  max: number;
}): DifficultyProfile =>
  deriveDifficultyProfile(createDifficultyContextFromQuestion(params));
