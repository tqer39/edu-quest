import type { GradeId } from './grade-presets';

export type GameGradeLevel = {
  id: GradeId;
  label: string;
  description: string;
  highlight: string;
  disabled?: boolean;
};

export const gameGradeLevels: readonly GameGradeLevel[] = [
  {
    id: 'grade-1',
    label: '小学1年生',
    description: '数字 1〜4 の 4×4 パズルからスタート',
    highlight: '4×4 かんたん',
  },
  {
    id: 'grade-2',
    label: '小学2年生',
    description: '4×4 を仕上げて 6×6 にチャレンジ',
    highlight: '4×4 ふつう・6×6 かんたん',
  },
  {
    id: 'grade-3',
    label: '小学3年生',
    description: '6×6 の論理パズルで集中力をアップ',
    highlight: '6×6 ふつう',
    disabled: true,
  },
  {
    id: 'grade-4',
    label: '小学4年生',
    description: '6×6 を極めて 9×9 にステップアップ',
    highlight: '9×9 かんたん',
    disabled: true,
  },
  {
    id: 'grade-5',
    label: '小学5年生',
    description: '9×9 の標準レベルで推理力を鍛える',
    highlight: '9×9 ふつう',
    disabled: true,
  },
  {
    id: 'grade-6',
    label: '小学6年生',
    description: '9×9 の難問でロジックを磨こう',
    highlight: '9×9 むずかしい',
    disabled: true,
  },
] as const;

export type SudokuDifficulty = 'easy' | 'medium' | 'hard';
export type SudokuGridSize = 4 | 6 | 9;

export type SudokuPreset = {
  id: string;
  icon: string;
  label: string;
  description: string;
  size: SudokuGridSize;
  difficulty: SudokuDifficulty;
  recommended?: boolean;
};

const createPreset = (preset: SudokuPreset) => preset;

export const sudokuPresetsByGrade: Record<GradeId, readonly SudokuPreset[]> = {
  'grade-1': [
    createPreset({
      id: 'grade-1-4x4-easy',
      icon: '🌱',
      label: '4×4 かんたん',
      description: 'はじめての数独にぴったり',
      size: 4,
      difficulty: 'easy',
      recommended: true,
    }),
    createPreset({
      id: 'grade-1-4x4-medium',
      icon: '🌿',
      label: '4×4 ふつう',
      description: 'すこし難しい 4×4 に挑戦',
      size: 4,
      difficulty: 'medium',
    }),
  ],
  'grade-2': [
    createPreset({
      id: 'grade-2-4x4-medium',
      icon: '🌿',
      label: '4×4 ふつう',
      description: '4×4 の総仕上げ',
      size: 4,
      difficulty: 'medium',
      recommended: true,
    }),
    createPreset({
      id: 'grade-2-6x6-easy',
      icon: '🌸',
      label: '6×6 かんたん',
      description: '6×6 入門レベル',
      size: 6,
      difficulty: 'easy',
    }),
    createPreset({
      id: 'grade-2-6x6-medium',
      icon: '🌺',
      label: '6×6 ふつう',
      description: '慣れてきたら次のレベルへ',
      size: 6,
      difficulty: 'medium',
    }),
  ],
  'grade-3': [
    createPreset({
      id: 'grade-3-6x6-easy',
      icon: '🌸',
      label: '6×6 かんたん',
      description: 'ウォームアップに最適',
      size: 6,
      difficulty: 'easy',
      recommended: true,
    }),
    createPreset({
      id: 'grade-3-6x6-medium',
      icon: '🌺',
      label: '6×6 ふつう',
      description: '推理力をさらにアップ',
      size: 6,
      difficulty: 'medium',
    }),
    createPreset({
      id: 'grade-3-6x6-hard',
      icon: '🌹',
      label: '6×6 むずかしい',
      description: 'しっかり考えてみよう',
      size: 6,
      difficulty: 'hard',
    }),
  ],
  'grade-4': [
    createPreset({
      id: 'grade-4-6x6-medium',
      icon: '🌺',
      label: '6×6 ふつう',
      description: '定番レベルで頭をほぐそう',
      size: 6,
      difficulty: 'medium',
      recommended: true,
    }),
    createPreset({
      id: 'grade-4-6x6-hard',
      icon: '🌹',
      label: '6×6 むずかしい',
      description: 'スピードと正確さを鍛える',
      size: 6,
      difficulty: 'hard',
    }),
    createPreset({
      id: 'grade-4-9x9-easy',
      icon: '⭐',
      label: '9×9 かんたん',
      description: '初めての 9×9 に挑戦',
      size: 9,
      difficulty: 'easy',
    }),
  ],
  'grade-5': [
    createPreset({
      id: 'grade-5-9x9-easy',
      icon: '⭐',
      label: '9×9 かんたん',
      description: '9×9 の基礎固め',
      size: 9,
      difficulty: 'easy',
      recommended: true,
    }),
    createPreset({
      id: 'grade-5-9x9-medium',
      icon: '🌟',
      label: '9×9 ふつう',
      description: '集中力と根気をきたえよう',
      size: 9,
      difficulty: 'medium',
    }),
    createPreset({
      id: 'grade-5-9x9-hard',
      icon: '💫',
      label: '9×9 むずかしい',
      description: '本格的な数独に挑戦',
      size: 9,
      difficulty: 'hard',
    }),
  ],
  'grade-6': [
    createPreset({
      id: 'grade-6-9x9-medium',
      icon: '🌟',
      label: '9×9 ふつう',
      description: '標準問題でウォームアップ',
      size: 9,
      difficulty: 'medium',
      recommended: true,
    }),
    createPreset({
      id: 'grade-6-9x9-hard',
      icon: '💫',
      label: '9×9 むずかしい',
      description: '集中して解いてみよう',
      size: 9,
      difficulty: 'hard',
    }),
  ],
};

export const getGameGradeById = (gradeId: GradeId): GameGradeLevel =>
  gameGradeLevels.find((level) => level.id === gradeId) || gameGradeLevels[0];

export const getSudokuPresetsForGrade = (
  gradeId: GradeId
): readonly SudokuPreset[] =>
  sudokuPresetsByGrade[gradeId] || sudokuPresetsByGrade['grade-1'];
