import type { ExtraStep, Mode, Question, QuizConfig } from './types';

export type { ExtraStep, Mode, Question, QuizConfig };

const pick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randInt = (n: number) => Math.floor(Math.random() * (n + 1));
const randIntInclusive = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const clampIntInclusive = (min: number, max: number) => {
  if (max < min) return min;
  return randIntInclusive(min, max);
};

export const pickOp = (mode: Mode): Question['op'] => {
  if (mode === 'mix') return pick(['+', '-', '×'] as const);
  if (mode === 'add-sub-mix') return pick(['+', '-'] as const);
  if (mode === 'add') return '+';
  if (mode === 'sub') return '-';
  return '×';
};

// Helper function to handle special modes
const handleSpecialMode = (config: QuizConfig): Question | null => {
  if (config.mode === 'add-sub-mix') {
    return generateGradeOneQuestion(config.max, config.terms);
  }
  if (config.mode === 'add-inverse') {
    return generateInverseQuestion(config.max, config.terms);
  }
  if (config.mode === 'sub-inverse') {
    return generateSubtractionInverseQuestion(config.max, config.terms);
  }
  return null;
};

// Helper function to handle terms-based generation
const handleTermsBasedGeneration = (config: QuizConfig): Question | null => {
  if (config.terms === 2 || config.terms === 3) {
    if (config.mode === 'add' || config.mode === 'sub') {
      return generateSingleOperationQuestion(
        config.mode,
        config.max,
        config.terms
      );
    }
    return generateGradeOneQuestion(config.max, config.terms);
  }
  return null;
};

// Helper function to generate operands based on operation
const generateOperands = (
  op: Question['op'],
  max: number
): { a: number; b: number } => {
  if (op === '+') {
    const minA = Math.random() < 0.05 ? 0 : 1;
    const a = randIntInclusive(minA, max);
    const minB = Math.random() < 0.05 ? 0 : 1;
    const maxB = max - a;
    const b = maxB >= minB ? randIntInclusive(minB, maxB) : 0;
    return { a, b };
  } else if (op === '-') {
    let a = randInt(max);
    let b = randInt(max);
    if (b > a) [a, b] = [b, a];
    return { a, b };
  } else if (op === '×') {
    const upper = Math.max(10, Math.floor(max / 2));
    const a = randInt(upper);
    const b = randInt(upper);
    return { a, b };
  } else {
    const a = randInt(max);
    const b = randInt(max);
    return { a, b };
  }
};

export const generateQuestion = (config: QuizConfig): Question => {
  // Handle special modes
  const specialResult = handleSpecialMode(config);
  if (specialResult) {
    return specialResult;
  }

  // Handle terms-based generation
  const termsResult = handleTermsBasedGeneration(config);
  if (termsResult) {
    return termsResult;
  }

  // Standard generation
  const op = pickOp(config.mode);
  const { a, b } = generateOperands(op, config.max);
  const answer = evaluateQuestion({ a, b, op });
  return { a, b, op, answer };
};

// Helper function to generate binary operation
const generateBinaryOperation = (
  mode: 'add' | 'sub',
  max: number,
  op: '+' | '-'
): Question => {
  let a: number;
  let b: number;
  if (mode === 'add') {
    const minA = Math.random() < 0.05 ? 0 : 1;
    a = randIntInclusive(minA, max);
    const minB = Math.random() < 0.05 ? 0 : 1;
    const maxB = max - a;
    b = maxB >= minB ? clampIntInclusive(minB, maxB) : 0;
  } else {
    a = randInt(max);
    b = clampIntInclusive(0, a);
  }
  const answer = evaluateQuestion({ a, b, op });
  return { a, b, op, answer };
};

// Helper function to try generating ternary addition
const tryGenerateTernaryAddition = (max: number): Question | null => {
  const avgValue = Math.max(1, Math.floor(max / 3));
  const a = clampIntInclusive(1, avgValue);
  const b = clampIntInclusive(1, Math.max(1, max - a - 1));
  const remaining = max - (a + b);
  if (remaining >= 1) {
    const c = clampIntInclusive(1, remaining);
    const extras = [{ op: '+', value: c }] as const;
    const answer = evaluateQuestion({ a, b, op: '+', extras });
    if (answer >= 0 && answer <= max) {
      return { a, b, op: '+', extras, answer };
    }
  }
  return null;
};

// Helper function to generate fallback ternary addition
const generateFallbackTernaryAddition = (max: number): Question => {
  const a = 1;
  const b = 1;
  const c = Math.min(1, max - 2);
  const extras = [{ op: '+', value: c }] as const;
  const answer = evaluateQuestion({ a, b, op: '+', extras });
  return { a, b, op: '+', extras, answer };
};

// Helper function to try generating ternary subtraction
const tryGenerateTernarySubtraction = (max: number): Question | null => {
  const a = clampIntInclusive(3, max);
  const maxB = Math.max(1, Math.floor(a / 2));
  const b = clampIntInclusive(1, maxB);
  const afterB = a - b;
  const c = clampIntInclusive(1, Math.max(1, afterB - 1));
  const extras = [{ op: '-', value: c }] as const;
  const answer = evaluateQuestion({ a, b, op: '-', extras });
  if (answer >= 0 && answer <= max) {
    return { a, b, op: '-', extras, answer };
  }
  return null;
};

// Helper function to generate fallback ternary subtraction
const generateFallbackTernarySubtraction = (max: number): Question => {
  const a = Math.max(3, max);
  const b = 1;
  const c = 1;
  const extras = [{ op: '-', value: c }] as const;
  const answer = a - b - c;
  return { a, b, op: '-', extras, answer };
};

// Helper function to generate ternary operation
const generateTernaryOperation = (
  mode: 'add' | 'sub',
  max: number
): Question => {
  if (mode === 'add') {
    for (let attempt = 0; attempt < 20; attempt++) {
      const result = tryGenerateTernaryAddition(max);
      if (result) {
        return result;
      }
    }
    return generateFallbackTernaryAddition(max);
  } else {
    for (let attempt = 0; attempt < 20; attempt++) {
      const result = tryGenerateTernarySubtraction(max);
      if (result) {
        return result;
      }
    }
    return generateFallbackTernarySubtraction(max);
  }
};

// たし算またはひき算のみの問題を生成（二項または三項）
export const generateSingleOperationQuestion = (
  mode: 'add' | 'sub',
  max: number,
  terms: 2 | 3
): Question => {
  const op = mode === 'add' ? '+' : '-';

  if (terms === 2) {
    return generateBinaryOperation(mode, max, op);
  } else {
    return generateTernaryOperation(mode, max);
  }
};

const normalizeExtras = (
  extras?: ExtraStep[]
): readonly ExtraStep[] | undefined =>
  extras && extras.length > 0 ? extras.map((step) => ({ ...step })) : undefined;

const ensureMin = (value: number, min: number) => (value < min ? min : value);

const pickNonZero = (min: number, max: number) => {
  const upper = Math.max(min, max);
  if (upper <= 0) return 0;
  const from = ensureMin(min, 1);
  return clampIntInclusive(from, upper);
};

const finalizeGradeOneQuestion = (params: {
  a: number;
  b: number;
  op: '+' | '-';
  extras?: ExtraStep[];
}): Question => {
  const extras = normalizeExtras(params.extras);
  const answer = evaluateQuestion({
    a: params.a,
    b: params.b,
    op: params.op,
    extras,
  });
  return {
    a: params.a,
    b: params.b,
    op: params.op,
    extras,
    answer,
  };
};

// Helper function for complex ternary pattern with two operations
const generateComplexTernaryPattern = (max: number): Question => {
  const minA = Math.random() < 0.05 ? 0 : 1;
  const a = randIntInclusive(minA, max);
  const minB = Math.random() < 0.05 ? 0 : 1;
  const maxB = max - a;
  const b = maxB >= minB ? clampIntInclusive(minB, maxB) : 0;
  const sum = a + b;
  const remaining = Math.max(0, max - sum);
  const c = remaining > 0 ? pickNonZero(0, remaining) : 0;
  const maxSubtract = sum + (c > 0 ? c : 0);
  const d = maxSubtract > 0 ? pickNonZero(0, maxSubtract) : 0;
  const extras: ExtraStep[] = [];
  if (c > 0) extras.push({ op: '+', value: c });
  if (d > 0) extras.push({ op: '-', value: d });
  return finalizeGradeOneQuestion({
    a,
    b,
    op: '+',
    extras: extras.length > 0 ? extras : undefined,
  });
};

export const generateGradeOneQuestion = (
  max: number,
  terms?: 2 | 3 | null
): Question => {
  // 二項演算のパターン
  const binaryPatterns = [
    () => {
      // 5% probability for 0, 95% probability for 1 or higher (for both a and b)
      const minA = Math.random() < 0.05 ? 0 : 1;
      const a = randIntInclusive(minA, max);
      const minB = Math.random() < 0.05 ? 0 : 1;
      const maxB = max - a;
      const b = maxB >= minB ? clampIntInclusive(minB, maxB) : 0;
      return finalizeGradeOneQuestion({ a, b, op: '+' });
    },
    () => {
      const a = randInt(max);
      const b = clampIntInclusive(0, a);
      return finalizeGradeOneQuestion({ a, b, op: '-' });
    },
  ];

  // 三項演算のパターン
  const ternaryPatterns = [
    () => {
      // 5% probability for 0, 95% probability for 1 or higher (for both a and b)
      const minA = Math.random() < 0.05 ? 0 : 1;
      const a = randIntInclusive(minA, max);
      const minB = Math.random() < 0.05 ? 0 : 1;
      const maxB = max - a;
      const b = maxB >= minB ? clampIntInclusive(minB, maxB) : 0;
      const remaining = Math.max(0, max - (a + b));
      const c = remaining > 0 ? pickNonZero(0, remaining) : 0;
      return finalizeGradeOneQuestion({
        a,
        b,
        op: '+',
        extras: c > 0 ? [{ op: '+', value: c }] : undefined,
      });
    },
    () => {
      // 5% probability for 0, 95% probability for 1 or higher (for both a and b)
      const minA = Math.random() < 0.05 ? 0 : 1;
      const a = randIntInclusive(minA, max);
      const minB = Math.random() < 0.05 ? 0 : 1;
      const maxB = max - a;
      const b = maxB >= minB ? clampIntInclusive(minB, maxB) : 0;
      const total = a + b;
      const c = total > 0 ? pickNonZero(0, total) : 0;
      return finalizeGradeOneQuestion({
        a,
        b,
        op: '+',
        extras: c > 0 ? [{ op: '-', value: c }] : undefined,
      });
    },
    () => {
      const a = randInt(max);
      const b = clampIntInclusive(0, a);
      const after = a - b;
      const c = pickNonZero(0, Math.max(0, max - after));
      return finalizeGradeOneQuestion({
        a,
        b,
        op: '-',
        extras: c > 0 ? [{ op: '+', value: c }] : undefined,
      });
    },
    () => generateComplexTernaryPattern(max),
  ];

  // terms に基づいてパターンを選択
  let patterns: Array<() => Question>;
  if (terms === 2) {
    patterns = binaryPatterns;
  } else if (terms === 3) {
    patterns = ternaryPatterns;
  } else {
    // null または未指定の場合は両方を混在
    patterns = [...binaryPatterns, ...ternaryPatterns];
  }

  let question: Question | null = null;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = pick(patterns)();
    const answer = candidate.answer;
    if (answer >= 0 && answer <= max) {
      question = candidate;
      break;
    }
  }

  if (!question) {
    // 5% probability for 0, 95% probability for 1 or higher (for both a and b)
    const minA = Math.random() < 0.05 ? 0 : 1;
    const fallbackA = randIntInclusive(minA, max);
    const minB = Math.random() < 0.05 ? 0 : 1;
    const maxB = max - fallbackA;
    const fallbackB = maxB >= minB ? clampIntInclusive(minB, maxB) : 0;
    question = finalizeGradeOneQuestion({
      a: fallbackA,
      b: fallbackB,
      op: '+',
    });
  }

  return question;
};

export const checkAnswer = (q: Question, input: number) => {
  // 逆算問題の場合は、answerフィールドが正解
  if (q.isInverse) {
    return input === q.answer;
  }
  // 通常の問題の場合も、answerフィールドが正解
  return input === q.answer;
};

export const evaluateQuestion = (
  input: Pick<Question, 'a' | 'b' | 'op'> & { extras?: readonly ExtraStep[] }
) => {
  let result =
    input.op === '+'
      ? input.a + input.b
      : input.op === '-'
        ? input.a - input.b
        : input.a * input.b;

  if (input.extras && input.extras.length > 0) {
    result = input.extras.reduce((acc, step) => {
      return step.op === '+' ? acc + step.value : acc - step.value;
    }, result);
  }

  return result;
};

// Helper function to calculate inverse question result
const calculateInverseResult = (
  input: Pick<Question, 'a' | 'b' | 'op' | 'answer'> & {
    extras?: readonly ExtraStep[];
    inverseSide: 'left' | 'right';
  }
): number => {
  let result: number;
  if (input.op === '+') {
    result =
      input.inverseSide === 'left'
        ? input.answer + input.b
        : input.a + input.answer;
  } else if (input.op === '-') {
    result =
      input.inverseSide === 'left' ? input.answer : input.a - input.answer;
  } else {
    result =
      input.inverseSide === 'left'
        ? input.answer * input.b
        : input.a * input.answer;
  }

  if (input.extras && input.extras.length > 0) {
    result = input.extras.reduce((acc, step) => {
      return step.op === '+' ? acc + step.value : acc - step.value;
    }, result);
  }

  return result;
};

// Helper function to add extras to parts array
const addExtrasToParts = (
  parts: string[],
  extras: readonly ExtraStep[] | undefined
): void => {
  if (extras && extras.length > 0) {
    extras.forEach((step) => {
      parts.push(step.op, String(step.value));
    });
  }
};

// Helper function to format inverse question
const formatInverseQuestion = (
  input: Pick<Question, 'a' | 'b' | 'op' | 'answer'> & {
    extras?: readonly ExtraStep[];
    inverseSide: 'left' | 'right';
  }
): string => {
  const parts = [];
  if (input.inverseSide === 'left') {
    parts.push('?', input.op === '×' ? '×' : input.op, `${input.b}`);
  } else {
    parts.push(`${input.a}`, input.op === '×' ? '×' : input.op, '?');
  }

  addExtrasToParts(parts, input.extras);
  const result = calculateInverseResult(input);
  parts.push('=', `${result}`);

  return parts.join(' ');
};

export const formatQuestion = (
  input: Pick<Question, 'a' | 'b' | 'op' | 'answer'> & {
    extras?: readonly ExtraStep[];
    isInverse?: boolean;
    inverseSide?: 'left' | 'right';
  }
) => {
  if (input.isInverse && input.inverseSide) {
    return formatInverseQuestion({ ...input, inverseSide: input.inverseSide });
  }

  const parts = [`${input.a}`, input.op === '×' ? '×' : input.op, `${input.b}`];
  addExtrasToParts(parts, input.extras);
  return parts.join(' ');
};

// ClockQuest exports
export * from './clock-quest';

export type {
  DifficultyContext,
  DifficultyCreature,
  DifficultyProfile,
} from './difficulty';
export {
  createDifficultyContextFromQuestion,
  deriveDifficultyFromQuestion,
  deriveDifficultyProfile,
} from './difficulty';

// KanjiQuest exports
export * from './kanji-quest';
export * from './kokugo-dictionaries';

// Helper function to generate binary addition inverse question
const generateBinaryAdditionInverse = (
  result: number,
  inverseSide: 'left' | 'right'
): Question => {
  if (inverseSide === 'left') {
    const b = randIntInclusive(0, result);
    const answer = result - b;
    return {
      a: answer,
      b: b,
      op: '+',
      answer: answer,
      isInverse: true,
      inverseSide: 'left',
    };
  } else {
    const a = randIntInclusive(0, result);
    const answer = result - a;
    return {
      a: a,
      b: answer,
      op: '+',
      answer: answer,
      isInverse: true,
      inverseSide: 'right',
    };
  }
};

// Helper function to try generating ternary addition inverse question
const tryGenerateTernaryAdditionInverse = (
  max: number,
  inverseSide: 'left' | 'right'
): Question | null => {
  const resultValue = randIntInclusive(3, max);
  if (inverseSide === 'left') {
    const b = randIntInclusive(1, Math.max(1, Math.floor(resultValue / 2)));
    const remaining = resultValue - b;
    if (remaining >= 2) {
      const c = randIntInclusive(1, remaining - 1);
      const answer = resultValue - b - c;
      if (answer >= 0 && answer <= max) {
        const extras = [{ op: '+', value: c }] as const;
        return {
          a: answer,
          b: b,
          op: '+',
          extras,
          answer: answer,
          isInverse: true,
          inverseSide: 'left',
        };
      }
    }
  } else {
    const a = randIntInclusive(1, Math.max(1, Math.floor(resultValue / 2)));
    const remaining = resultValue - a;
    if (remaining >= 2) {
      const c = randIntInclusive(1, remaining - 1);
      const answer = resultValue - a - c;
      if (answer >= 0 && answer <= max) {
        const extras = [{ op: '+', value: c }] as const;
        return {
          a: a,
          b: answer,
          op: '+',
          extras,
          answer: answer,
          isInverse: true,
          inverseSide: 'right',
        };
      }
    }
  }
  return null;
};

// Helper function to generate fallback ternary addition inverse question
const generateFallbackTernaryAdditionInverse = (
  inverseSide: 'left' | 'right'
): Question => {
  const extras = [{ op: '+', value: 1 }] as const;
  if (inverseSide === 'left') {
    return {
      a: 1,
      b: 1,
      op: '+',
      extras,
      answer: 1,
      isInverse: true,
      inverseSide: 'left',
    };
  } else {
    return {
      a: 1,
      b: 1,
      op: '+',
      extras,
      answer: 1,
      isInverse: true,
      inverseSide: 'right',
    };
  }
};

export const generateInverseQuestion = (
  max: number,
  terms?: 2 | 3 | null
): Question => {
  const result = randIntInclusive(1, max);
  const inverseSide = pick(['left', 'right'] as const);

  if (!terms || terms === 2) {
    return generateBinaryAdditionInverse(result, inverseSide);
  }

  // Try to generate ternary addition inverse question
  for (let attempt = 0; attempt < 20; attempt++) {
    const question = tryGenerateTernaryAdditionInverse(max, inverseSide);
    if (question) {
      return question;
    }
  }

  return generateFallbackTernaryAdditionInverse(inverseSide);
};

// Helper function to generate binary subtraction inverse question
const generateBinarySubtractionInverse = (
  max: number,
  inverseSide: 'left' | 'right'
): Question => {
  if (inverseSide === 'left') {
    const result = randIntInclusive(0, max);
    const b = randIntInclusive(0, max - result);
    const answer = result + b;
    return {
      a: answer,
      b: b,
      op: '-',
      answer: answer,
      isInverse: true,
      inverseSide: 'left',
    };
  } else {
    const a = randIntInclusive(1, max);
    const result = randIntInclusive(0, a);
    const answer = a - result;
    return {
      a: a,
      b: answer,
      op: '-',
      answer: answer,
      isInverse: true,
      inverseSide: 'right',
    };
  }
};

// Helper function to try generating ternary subtraction inverse question
const tryGenerateTernarySubtractionInverse = (
  max: number,
  inverseSide: 'left' | 'right'
): Question | null => {
  if (inverseSide === 'left') {
    const result = randIntInclusive(0, Math.max(0, max - 2));
    const b = randIntInclusive(1, Math.max(1, Math.floor((max - result) / 2)));
    const remaining = max - result - b;
    if (remaining >= 1) {
      const c = randIntInclusive(1, remaining);
      const answer = result + b + c;
      if (answer >= 0 && answer <= max) {
        const extras = [{ op: '-', value: c }] as const;
        return {
          a: answer,
          b: b,
          op: '-',
          extras,
          answer: answer,
          isInverse: true,
          inverseSide: 'left',
        };
      }
    }
  } else {
    const a = randIntInclusive(3, max);
    const result = randIntInclusive(0, Math.max(0, a - 2));
    const remaining = a - result;
    if (remaining >= 2) {
      const c = randIntInclusive(1, remaining - 1);
      const answer = a - result - c;
      if (answer >= 0 && answer <= max) {
        const extras = [{ op: '-', value: c }] as const;
        return {
          a: a,
          b: answer,
          op: '-',
          extras,
          answer: answer,
          isInverse: true,
          inverseSide: 'right',
        };
      }
    }
  }
  return null;
};

// Helper function to generate fallback binary subtraction inverse question
const generateFallbackBinarySubtractionInverse = (
  inverseSide: 'left' | 'right'
): Question => {
  if (inverseSide === 'left') {
    return {
      a: 2,
      b: 1,
      op: '-',
      answer: 2,
      isInverse: true,
      inverseSide: 'left',
    };
  } else {
    return {
      a: 3,
      b: 2,
      op: '-',
      answer: 2,
      isInverse: true,
      inverseSide: 'right',
    };
  }
};

export const generateSubtractionInverseQuestion = (
  max: number,
  terms?: 2 | 3 | null
): Question => {
  const inverseSide = pick(['left', 'right'] as const);

  if (!terms || terms === 2) {
    return generateBinarySubtractionInverse(max, inverseSide);
  }

  // Try to generate ternary subtraction inverse question
  for (let attempt = 0; attempt < 20; attempt++) {
    const question = tryGenerateTernarySubtractionInverse(max, inverseSide);
    if (question) {
      return question;
    }
  }

  return generateFallbackBinarySubtractionInverse(inverseSide);
};
