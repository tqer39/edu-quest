export type SchoolStage = '小学' | '中学';

export type SchoolGrade = {
  stage: SchoolStage;
  grade: number;
};

const stageGradeBounds: Record<SchoolStage, { min: number; max: number }> = {
  小学: { min: 1, max: 6 },
  中学: { min: 1, max: 3 },
};

// URL用の英語パラメータマッピング
const stageToUrlParam: Record<SchoolStage, string> = {
  小学: 'elem',
  中学: 'junior',
};

const urlParamToStage: Record<string, SchoolStage> = {
  elem: '小学',
  junior: '中学',
};

export const parseSchoolGradeParam = (
  value: string | null | undefined
): SchoolGrade | null => {
  if (value == null || value === '') {
    return null;
  }

  const match = value.match(/^(elem|junior)-(\d)$/);
  if (match == null) {
    return null;
  }

  const urlParam = match[1];
  const stage = urlParamToStage[urlParam];
  if (!stage) {
    return null;
  }

  const grade = Number(match[2]);
  const bounds = stageGradeBounds[stage];

  if (
    Number.isInteger(grade) === false ||
    grade < bounds.min ||
    grade > bounds.max
  ) {
    return null;
  }

  return { stage, grade };
};

export const formatSchoolGradeLabel = ({ stage, grade }: SchoolGrade) =>
  `${stage}${grade}年生`;

export const createSchoolGradeParam = ({ stage, grade }: SchoolGrade) => {
  const urlParam = stageToUrlParam[stage];
  return `${urlParam}-${grade}`;
};
