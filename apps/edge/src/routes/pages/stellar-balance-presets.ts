import type { GradeId } from './grade-presets';

export type StellarBalanceSymbol = 'S' | 'M' | 'N';

export type StellarBalancePuzzle = {
  id: string;
  label: string;
  difficulty: 'gentle' | 'steady' | 'expert';
  description: string;
  recommended?: boolean;
  gradeIds: readonly GradeId[];
  puzzle: readonly string[];
  solution: readonly string[];
};

const createPuzzle = (puzzle: StellarBalancePuzzle) => puzzle;

const puzzles = [
  createPuzzle({
    id: 'aurora-gentle-1',
    label: 'オーロラ入門セット',
    difficulty: 'gentle',
    description:
      'ヒントが多めのウォームアップパズル。太陽・月・星の配置バランスに慣れよう。',
    recommended: true,
    gradeIds: ['elem-1', 'elem-2'],
    puzzle: ['S.NS.N', 'N.MN.M', 'M.S.NS', 'S.N.M.', 'N.M.S.', 'M..MN.'],
    solution: ['SMNSMN', 'NSMNSM', 'MNSMNS', 'SMNSMN', 'NSMNSM', 'MNSMNS'],
  }),
  createPuzzle({
    id: 'aurora-steady-1',
    label: '星図バランス',
    difficulty: 'steady',
    description:
      'ヒントは少なめ。列ごとのアイコン数を数えながら推理してみよう。',
    gradeIds: ['elem-2', 'elem-3', 'elem-4', 'elem-5', 'elem-6'],
    puzzle: ['.M.SMN', 'N..NS.', '..S.NS', '.M..MN', '...NSM', 'M..M.S'],
    solution: ['SMNSMN', 'NSMNSM', 'MNSMNS', 'SMNSMN', 'NSMNSM', 'MNSMNS'],
  }),
  createPuzzle({
    id: 'aurora-expert-1',
    label: '観測者の挑戦',
    difficulty: 'expert',
    description:
      '最少ヒントの高難度セット。三種類のアイコンがならぶ規則に注目しよう。',
    gradeIds: ['elem-2', 'elem-3', 'elem-4', 'elem-5', 'elem-6'],
    puzzle: ['..NS..', 'N....M', '...M.S', '.M....', '...N..', 'M....S'],
    solution: ['SMNSMN', 'NSMNSM', 'MNSMNS', 'SMNSMN', 'NSMNSM', 'MNSMNS'],
  }),
] as const;

export const getStellarBalancePuzzlesForGrade = (gradeId: GradeId) =>
  puzzles.filter((puzzle) => puzzle.gradeIds.includes(gradeId));

export const pickRandomStellarBalancePuzzle = (gradeId: GradeId) => {
  const available = getStellarBalancePuzzlesForGrade(gradeId);
  if (available.length === 0) {
    return puzzles[0];
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
};
