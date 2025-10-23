export type Mode =
  | 'add'
  | 'sub'
  | 'mul'
  | 'div'
  | 'add-sub-mix'
  | 'mix'
  | 'add-inverse'
  | 'sub-inverse';

export type QuizConfig = {
  mode: Mode;
  max: number;
  terms?: 2 | 3 | null;
};

export type ExtraStep = {
  op: '+' | '-';
  value: number;
};

export type Question = {
  a: number;
  b: number;
  op: '+' | '-' | '×';
  extras?: readonly ExtraStep[];
  answer: number;
  isInverse?: boolean;
  inverseSide?: 'left' | 'right';
};
