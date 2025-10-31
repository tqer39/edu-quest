export type SchoolStage = '小学' | '中学';

export type SchoolGrade = {
  stage: SchoolStage;
  grade: number;
};

const stageGradeBounds: Record<SchoolStage, { min: number; max: number }> = {
  小学: { min: 1, max: 6 },
  中学: { min: 1, max: 3 },
};

export const parseSchoolGradeParam = (
  value: string | null | undefined
): SchoolGrade | null => {
  if (value == null || value === '') {
    return null;
  }

  const match = value.match(/^(小学|中学)-(\d)$/);
  if (match == null) {
    return null;
  }

  const stage = match[1] as SchoolStage;
  const grade = Number(match[2]);
  const bounds = stageGradeBounds[stage];

  if (Number.isInteger(grade) === false || grade < bounds.min || grade > bounds.max) {
    return null;
  }

  return { stage, grade };
};

export const formatSchoolGradeLabel = ({ stage, grade }: SchoolGrade) =>
  `${stage}${grade}年生`;

export const createSchoolGradeParam = ({ stage, grade }: SchoolGrade) =>
  `${stage}-${grade}`;
