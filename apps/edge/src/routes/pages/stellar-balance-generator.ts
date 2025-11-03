import type { GradeId } from './grade-presets';
import type {
  StellarBalancePuzzle,
  StellarBalanceSymbol,
} from './stellar-balance-presets';

/**
 * Stellar Balance パズル生成アルゴリズム
 *
 * ルール:
 * 1. 6x6グリッドに太陽(S)・月(M)・星(N)を配置
 * 2. 各行・各列に各シンボルが2つずつ必要
 * 3. 同じシンボルが隣接してはいけない（上下左右）
 */

const GRID_SIZE = 6;
const SYMBOLS: StellarBalanceSymbol[] = ['S', 'M', 'N'];
const SYMBOLS_PER_LINE = 2;

type Grid = StellarBalanceSymbol[][];

/**
 * 空のグリッドを作成
 */
const createEmptyGrid = (): (StellarBalanceSymbol | null)[][] => {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );
};

/**
 * 指定位置にシンボルを配置できるか検証
 */
const canPlaceSymbol = (
  grid: (StellarBalanceSymbol | null)[][],
  row: number,
  col: number,
  symbol: StellarBalanceSymbol
): boolean => {
  // 隣接チェック（上下左右）
  const neighbors = [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];

  for (const [nRow, nCol] of neighbors) {
    if (nRow >= 0 && nRow < GRID_SIZE && nCol >= 0 && nCol < GRID_SIZE) {
      if (grid[nRow][nCol] === symbol) {
        return false;
      }
    }
  }

  // 行のシンボル数チェック
  const rowCount = grid[row].filter((cell) => cell === symbol).length;
  if (rowCount >= SYMBOLS_PER_LINE) {
    return false;
  }

  // 列のシンボル数チェック
  const colCount = grid.filter((r) => r[col] === symbol).length;
  if (colCount >= SYMBOLS_PER_LINE) {
    return false;
  }

  return true;
};

/**
 * バックトラッキングでグリッドを埋める
 */
const fillGrid = (
  grid: (StellarBalanceSymbol | null)[][],
  row: number,
  col: number
): boolean => {
  // 全セル埋まったら成功
  if (row === GRID_SIZE) {
    return true;
  }

  // 次のセル位置を計算
  const nextRow = col === GRID_SIZE - 1 ? row + 1 : row;
  const nextCol = col === GRID_SIZE - 1 ? 0 : col + 1;

  // シンボルをランダムな順序で試行
  const shuffledSymbols = [...SYMBOLS].sort(() => Math.random() - 0.5);

  for (const symbol of shuffledSymbols) {
    if (canPlaceSymbol(grid, row, col, symbol)) {
      grid[row][col] = symbol;

      if (fillGrid(grid, nextRow, nextCol)) {
        return true;
      }

      grid[row][col] = null;
    }
  }

  return false;
};

/**
 * 完成したグリッドを生成
 */
const generateSolution = (): Grid => {
  const grid = createEmptyGrid();
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    // グリッドをリセット
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        grid[i][j] = null;
      }
    }

    if (fillGrid(grid, 0, 0)) {
      return grid as Grid;
    }

    attempts++;
  }

  // フォールバック: 既知の有効な解答パターン
  return [
    ['S', 'M', 'N', 'S', 'M', 'N'],
    ['N', 'S', 'M', 'N', 'S', 'M'],
    ['M', 'N', 'S', 'M', 'N', 'S'],
    ['S', 'M', 'N', 'S', 'M', 'N'],
    ['N', 'S', 'M', 'N', 'S', 'M'],
    ['M', 'N', 'S', 'M', 'N', 'S'],
  ];
};

/**
 * 難易度に応じてヒントを配置
 */
const createPuzzleFromSolution = (
  solution: Grid,
  difficulty: 'gentle' | 'steady' | 'expert'
): string[] => {
  const puzzle = solution.map((row) => row.map(() => '.'));

  // 難易度別のヒント数設定
  const hintCounts = {
    gentle: 18, // 約50%のヒント
    steady: 12, // 約33%のヒント
    expert: 8, // 約22%のヒント
  };

  const hintCount = hintCounts[difficulty];
  const positions: Array<[number, number]> = [];

  // 全ての位置をリストアップ
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      positions.push([row, col]);
    }
  }

  // ランダムにヒント位置を選択
  const shuffled = positions.sort(() => Math.random() - 0.5);
  const hintPositions = shuffled.slice(0, hintCount);

  // ヒントを配置
  for (const [row, col] of hintPositions) {
    puzzle[row][col] = solution[row][col];
  }

  // 各行に最低1つのヒントを保証（gentle/steadyのみ）
  if (difficulty !== 'expert') {
    for (let row = 0; row < GRID_SIZE; row++) {
      const hasHint = puzzle[row].some((cell) => cell !== '.');
      if (!hasHint) {
        const col = Math.floor(Math.random() * GRID_SIZE);
        puzzle[row][col] = solution[row][col];
      }
    }
  }

  return puzzle.map((row) => row.join(''));
};

/**
 * ランダムな問題を生成
 */
export const generateStellarBalancePuzzle = (
  gradeId: GradeId,
  difficulty: 'gentle' | 'steady' | 'expert' = 'steady'
): StellarBalancePuzzle => {
  const solution = generateSolution();
  const puzzle = createPuzzleFromSolution(solution, difficulty);

  const difficultyLabels = {
    gentle: 'やさしい',
    steady: 'ふつう',
    expert: 'むずかしい',
  };

  const descriptions = {
    gentle: 'ヒントが多めの練習問題。太陽・月・星の配置バランスに慣れよう。',
    steady: 'ヒントは適度。列ごとのアイコン数を数えながら推理してみよう。',
    expert: 'ヒント少なめの挑戦問題。三種類のアイコンが並ぶ規則に注目しよう。',
  };

  return {
    id: `generated-${difficulty}-${Date.now()}`,
    label: `ランダム問題 (${difficultyLabels[difficulty]})`,
    difficulty,
    description: descriptions[difficulty],
    gradeIds: [gradeId],
    puzzle,
    solution: solution.map((row) => row.join('')),
  };
};

/**
 * 学年に応じた適切な難易度を選択
 */
export const getDifficultyForGrade = (
  gradeId: GradeId
): 'gentle' | 'steady' | 'expert' => {
  if (gradeId === 'elem-1') return 'gentle';
  if (gradeId === 'elem-2' || gradeId === 'elem-3') return 'steady';
  return 'expert';
};
