export type SentinelPuzzle = {
  id: string;
  name: string;
  size: number;
  targetCount: number;
  difficulty: 'intro' | 'standard' | 'hard';
  description: string;
  regionMap: readonly string[];
  blockedCells: readonly [number, number][];
  givenSentinels: readonly [number, number][];
  solution: readonly [number, number][];
};

const createPuzzle = (puzzle: SentinelPuzzle) => puzzle;

export const sentinelPuzzles = [
  createPuzzle({
    id: 'sentinel-6x6-intro',
    name: 'ナイト見張り 6×6 (入門)',
    size: 6,
    targetCount: 6,
    difficulty: 'intro',
    description:
      'ナイトの動きで守るセンチネルを配置する入門パズル。基本ルールの確認にぴったりです。',
    regionMap: ['AAABBB', 'ACCBBB', 'AACCCE', 'DDDFCE', 'EDDDEE', 'EFFFFF'],
    blockedCells: [
      [0, 0],
      [0, 5],
      [1, 0],
      [1, 2],
      [2, 2],
      [2, 3],
      [3, 0],
      [3, 2],
      [4, 2],
      [4, 5],
      [5, 1],
      [5, 4],
    ],
    givenSentinels: [
      [1, 5],
      [4, 0],
    ],
    solution: [
      [0, 2],
      [1, 5],
      [2, 4],
      [3, 1],
      [4, 0],
      [5, 3],
    ],
  }),
  createPuzzle({
    id: 'sentinel-6x6-standard',
    name: 'ナイト見張り 6×6 (標準)',
    size: 6,
    targetCount: 6,
    difficulty: 'standard',
    description:
      '推理ステップが増える標準レベル。推論メモを活用しながらセンチネルの位置を決めよう。',
    regionMap: ['AAAAFF', 'BBAACC', 'BBBDCC', 'EBDDCC', 'EEDDDF', 'EEEFFF'],
    blockedCells: [
      [0, 1],
      [0, 4],
      [1, 3],
      [2, 1],
      [2, 3],
      [3, 2],
      [3, 5],
      [4, 4],
      [5, 0],
      [5, 2],
    ],
    givenSentinels: [
      [0, 3],
    ],
    solution: [
      [0, 3],
      [1, 0],
      [2, 5],
      [3, 2],
      [4, 1],
      [5, 4],
    ],
  }),
] as const;

export type SentinelPuzzleId = (typeof sentinelPuzzles)[number]['id'];

export const getSentinelPuzzleById = (
  puzzleId: SentinelPuzzleId
): SentinelPuzzle =>
  sentinelPuzzles.find((puzzle) => puzzle.id === puzzleId) || sentinelPuzzles[0];
