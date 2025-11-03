import type { Mode } from '@edu-quest/domain';
import type { GradeId } from './grade-presets';

export type MathPreset = {
  id: string;
  icon: string;
  label: string;
  description: string;
  mode: Mode;
  max: number;
  terms: 2 | 3;
  recommended?: boolean;
};

const createPreset = (preset: MathPreset) => preset;

// たし算のプリセット (calc-add)
const additionPresets: Record<GradeId, readonly MathPreset[]> = {
  'elem-1': [
    createPreset({
      id: 'add-10-2',
      icon: '🌱',
      label: 'たし算（10まで・2つ）',
      description: '1 + 2 のような2つの数のたし算',
      mode: 'add',
      max: 10,
      terms: 2,
      recommended: true,
    }),
    createPreset({
      id: 'add-10-3',
      icon: '🌿',
      label: 'たし算（10まで・3つ）',
      description: '1 + 2 + 3 のような3つの数のたし算',
      mode: 'add',
      max: 10,
      terms: 3,
    }),
    createPreset({
      id: 'add-20-2',
      icon: '🌸',
      label: 'たし算（20まで・2つ）',
      description: '10 + 5 のような2つの数のたし算',
      mode: 'add',
      max: 20,
      terms: 2,
    }),
    createPreset({
      id: 'add-20-3',
      icon: '🌺',
      label: 'たし算（20まで・3つ）',
      description: '5 + 7 + 3 のような3つの数のたし算',
      mode: 'add',
      max: 20,
      terms: 3,
    }),
  ],
  'elem-2': [
    createPreset({
      id: 'add-50-2',
      icon: '🌱',
      label: 'たし算（50まで・2つ）',
      description: '25 + 15 のような2つの数のたし算',
      mode: 'add',
      max: 50,
      terms: 2,
      recommended: true,
    }),
    createPreset({
      id: 'add-50-3',
      icon: '🌿',
      label: 'たし算（50まで・3つ）',
      description: '10 + 15 + 8 のような3つの数のたし算',
      mode: 'add',
      max: 50,
      terms: 3,
    }),
    createPreset({
      id: 'add-100-2',
      icon: '🌸',
      label: 'たし算（100まで・2つ）',
      description: '45 + 38 のような2つの数のたし算',
      mode: 'add',
      max: 100,
      terms: 2,
    }),
    createPreset({
      id: 'add-100-3',
      icon: '🌺',
      label: 'たし算（100まで・3つ）',
      description: '25 + 30 + 12 のような3つの数のたし算',
      mode: 'add',
      max: 100,
      terms: 3,
    }),
  ],
  'elem-3': [
    createPreset({
      id: 'add-200-2',
      icon: '🌱',
      label: 'たし算（200まで・2つ）',
      description: '125 + 48 のような2つの数のたし算',
      mode: 'add',
      max: 200,
      terms: 2,
      recommended: true,
    }),
    createPreset({
      id: 'add-200-3',
      icon: '🌿',
      label: 'たし算（200まで・3つ）',
      description: '50 + 75 + 30 のような3つの数のたし算',
      mode: 'add',
      max: 200,
      terms: 3,
    }),
    createPreset({
      id: 'add-500-2',
      icon: '🌸',
      label: 'たし算（500まで・2つ）',
      description: '235 + 178 のような2つの数のたし算',
      mode: 'add',
      max: 500,
      terms: 2,
    }),
    createPreset({
      id: 'add-500-3',
      icon: '🌺',
      label: 'たし算（500まで・3つ）',
      description: '100 + 200 + 85 のような3つの数のたし算',
      mode: 'add',
      max: 500,
      terms: 3,
    }),
  ],
  'elem-4': [],
  'elem-5': [],
  'elem-6': [],
};

// ひき算のプリセット (calc-sub)
const subtractionPresets: Record<GradeId, readonly MathPreset[]> = {
  'elem-1': [
    createPreset({
      id: 'sub-10-2',
      icon: '🌱',
      label: 'ひき算（10まで・2つ）',
      description: '5 - 2 のような2つの数のひき算',
      mode: 'sub',
      max: 10,
      terms: 2,
      recommended: true,
    }),
    createPreset({
      id: 'sub-10-3',
      icon: '🌿',
      label: 'ひき算（10まで・3つ）',
      description: '10 - 3 - 2 のような3つの数のひき算',
      mode: 'sub',
      max: 10,
      terms: 3,
    }),
    createPreset({
      id: 'sub-20-2',
      icon: '🌸',
      label: 'ひき算（20まで・2つ）',
      description: '15 - 8 のような2つの数のひき算',
      mode: 'sub',
      max: 20,
      terms: 2,
    }),
    createPreset({
      id: 'sub-20-3',
      icon: '🌺',
      label: 'ひき算（20まで・3つ）',
      description: '20 - 7 - 5 のような3つの数のひき算',
      mode: 'sub',
      max: 20,
      terms: 3,
    }),
  ],
  'elem-2': [
    createPreset({
      id: 'sub-50-2',
      icon: '🌱',
      label: 'ひき算（50まで・2つ）',
      description: '40 - 18 のような2つの数のひき算',
      mode: 'sub',
      max: 50,
      terms: 2,
      recommended: true,
    }),
    createPreset({
      id: 'sub-50-3',
      icon: '🌿',
      label: 'ひき算（50まで・3つ）',
      description: '50 - 20 - 10 のような3つの数のひき算',
      mode: 'sub',
      max: 50,
      terms: 3,
    }),
    createPreset({
      id: 'sub-100-2',
      icon: '🌸',
      label: 'ひき算（100まで・2つ）',
      description: '73 - 29 のような2つの数のひき算',
      mode: 'sub',
      max: 100,
      terms: 2,
    }),
    createPreset({
      id: 'sub-100-3',
      icon: '🌺',
      label: 'ひき算（100まで・3つ）',
      description: '100 - 40 - 25 のような3つの数のひき算',
      mode: 'sub',
      max: 100,
      terms: 3,
    }),
  ],
  'elem-3': [
    createPreset({
      id: 'sub-200-2',
      icon: '🌱',
      label: 'ひき算（200まで・2つ）',
      description: '150 - 73 のような2つの数のひき算',
      mode: 'sub',
      max: 200,
      terms: 2,
      recommended: true,
    }),
    createPreset({
      id: 'sub-200-3',
      icon: '🌿',
      label: 'ひき算（200まで・3つ）',
      description: '200 - 80 - 50 のような3つの数のひき算',
      mode: 'sub',
      max: 200,
      terms: 3,
    }),
    createPreset({
      id: 'sub-500-2',
      icon: '🌸',
      label: 'ひき算（500まで・2つ）',
      description: '380 - 145 のような2つの数のひき算',
      mode: 'sub',
      max: 500,
      terms: 2,
    }),
    createPreset({
      id: 'sub-500-3',
      icon: '🌺',
      label: 'ひき算（500まで・3つ）',
      description: '500 - 200 - 100 のような3つの数のひき算',
      mode: 'sub',
      max: 500,
      terms: 3,
    }),
  ],
  'elem-4': [],
  'elem-5': [],
  'elem-6': [],
};

// かけ算のプリセット (calc-mul)
const multiplicationPresets: Record<GradeId, readonly MathPreset[]> = {
  'elem-1': [],
  'elem-2': [],
  'elem-3': [
    createPreset({
      id: 'mul-easy',
      icon: '🌱',
      label: 'かけ算（やさしい）',
      description: '答えが25以下のかけ算',
      mode: 'mul',
      max: 25,
      terms: 2,
      recommended: true,
    }),
    createPreset({
      id: 'mul-table',
      icon: '🌿',
      label: 'かけ算（九九）',
      description: '答えが81以下のかけ算',
      mode: 'mul',
      max: 81,
      terms: 2,
    }),
    createPreset({
      id: 'mul-hard',
      icon: '🌸',
      label: 'かけ算（むずかしい）',
      description: '答えが180以下のかけ算',
      mode: 'mul',
      max: 180,
      terms: 2,
    }),
    createPreset({
      id: 'mul-double',
      icon: '🌺',
      label: 'かけ算（とてもむずかしい）',
      description: '答えが400以下のかけ算',
      mode: 'mul',
      max: 400,
      terms: 2,
    }),
  ],
  'elem-4': [
    createPreset({
      id: 'mul-easy',
      icon: '🌱',
      label: 'かけ算（やさしい）',
      description: '答えが25以下のかけ算',
      mode: 'mul',
      max: 25,
      terms: 2,
      recommended: true,
    }),
    createPreset({
      id: 'mul-table',
      icon: '🌿',
      label: 'かけ算（九九）',
      description: '答えが81以下のかけ算',
      mode: 'mul',
      max: 81,
      terms: 2,
    }),
    createPreset({
      id: 'mul-hard',
      icon: '🌸',
      label: 'かけ算（むずかしい）',
      description: '答えが180以下のかけ算',
      mode: 'mul',
      max: 180,
      terms: 2,
    }),
    createPreset({
      id: 'mul-double',
      icon: '🌺',
      label: 'かけ算（とてもむずかしい）',
      description: '答えが400以下のかけ算',
      mode: 'mul',
      max: 400,
      terms: 2,
    }),
  ],
  'elem-5': [],
  'elem-6': [],
};

// わり算のプリセット (calc-div)
const divisionPresets: Record<GradeId, readonly MathPreset[]> = {
  'elem-1': [],
  'elem-2': [],
  'elem-3': [],
  'elem-4': [
    createPreset({
      id: 'div-basic',
      icon: '🌱',
      label: 'わり算（基礎）',
      description: 'あまりのないわり算',
      mode: 'div',
      max: 81,
      terms: 2,
      recommended: true,
    }),
  ],
  'elem-5': [],
  'elem-6': [],
};

type CalcTypeId =
  | 'calc-add'
  | 'calc-sub'
  | 'calc-mul'
  | 'calc-div'
  | 'calc-add-sub-mix'
  | 'calc-add-inverse'
  | 'calc-sub-inverse'
  | 'calc-mix';

// 計算タイプごとのプリセットマップ
const presetsByCalcType: Record<
  CalcTypeId,
  Record<GradeId, readonly MathPreset[]>
> = {
  'calc-add': additionPresets,
  'calc-sub': subtractionPresets,
  'calc-mul': multiplicationPresets,
  'calc-div': divisionPresets,
  'calc-add-sub-mix': {
    'elem-1': [],
    'elem-2': [],
    'elem-3': [],
    'elem-4': [],
    'elem-5': [],
    'elem-6': [],
  },
  'calc-add-inverse': {
    'elem-1': [],
    'elem-2': [],
    'elem-3': [],
    'elem-4': [],
    'elem-5': [],
    'elem-6': [],
  },
  'calc-sub-inverse': {
    'elem-1': [],
    'elem-2': [],
    'elem-3': [],
    'elem-4': [],
    'elem-5': [],
    'elem-6': [],
  },
  'calc-mix': {
    'elem-1': [],
    'elem-2': [],
    'elem-3': [],
    'elem-4': [],
    'elem-5': [],
    'elem-6': [],
  },
};

export const getMathPresetsForGradeAndCalc = (
  gradeId: GradeId,
  calcTypeId: string
): readonly MathPreset[] => {
  const calcPresets = presetsByCalcType[calcTypeId as CalcTypeId];
  if (!calcPresets) return [];
  return calcPresets[gradeId] || [];
};
