import type { KanjiGrade } from './kokugo-quest';

import eduquest from './data/kokugo-dictionaries/eduquest-kanji.json';
import eduquestVocabulary from './data/kokugo-dictionaries/eduquest-vocabulary.json';
import gakkenRainbow from './data/kokugo-dictionaries/gakken-rainbow.json';
import mextCourseOfStudy from './data/kokugo-dictionaries/mext-course-of-study.json';
import mextTextbook from './data/kokugo-dictionaries/mext-textbook.json';

export type KokugoDictionaryCategory = 'internal' | 'official' | 'private';

export interface KokugoDictionaryResource {
  id: string;
  type: KokugoDictionaryCategory;
  title: string;
  provider: string;
  description: string;
  gradeRange: { min: KanjiGrade; max: KanjiGrade };
  features: string[];
  link: string;
  cta: string;
  source: {
    label: string;
    url: string;
  };
}

type RawDictionary = Omit<KokugoDictionaryResource, 'gradeRange'> & {
  gradeRange: { min: number; max: number };
};

const rawDictionaries: RawDictionary[] = [
  eduquest as RawDictionary,
  eduquestVocabulary as RawDictionary,
  mextTextbook as RawDictionary,
  mextCourseOfStudy as RawDictionary,
  gakkenRainbow as RawDictionary,
];

const clampGrade = (value: number): KanjiGrade => {
  const normalized = Math.min(Math.max(Math.round(value), 1), 6) as KanjiGrade;
  return normalized;
};

const dictionaries: KokugoDictionaryResource[] = rawDictionaries.map(
  (entry) => ({
    ...entry,
    gradeRange: {
      min: clampGrade(entry.gradeRange.min),
      max: clampGrade(entry.gradeRange.max),
    },
  })
);

export const getAllKokugoDictionaries = (): KokugoDictionaryResource[] =>
  dictionaries.map((dictionary) => ({ ...dictionary }));

export const getKokugoDictionariesByGrade = (
  grade: KanjiGrade
): KokugoDictionaryResource[] => {
  return dictionaries
    .filter(
      (dictionary) =>
        grade >= dictionary.gradeRange.min && grade <= dictionary.gradeRange.max
    )
    .map((dictionary) => ({ ...dictionary }));
};
