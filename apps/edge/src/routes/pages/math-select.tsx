import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { SchoolStage } from '../utils/school-grade';
import { formatSchoolGradeLabel } from '../utils/school-grade';
import { gradeLevels, type GradeId } from './grade-presets';

type MathQuestOption = {
  id: 'calc-add' | 'calc-sub' | 'calc-mul' | 'calc-div';
  label: string;
  emoji: string;
  description: string;
  minGrade: number;
};

const mathQuestOptions: readonly MathQuestOption[] = [
  {
    id: 'calc-add',
    label: 'たし算',
    emoji: '➕',
    description: '2つや3つの数をたして計算しましょう。',
    minGrade: 1,
  },
  {
    id: 'calc-sub',
    label: 'ひき算',
    emoji: '➖',
    description: '数をひいて差を求める練習です。',
    minGrade: 1,
  },
  {
    id: 'calc-mul',
    label: 'かけ算',
    emoji: '✖️',
    description: '九九やかけ算の計算にチャレンジ。',
    minGrade: 3,
  },
  {
    id: 'calc-div',
    label: 'わり算',
    emoji: '➗',
    description: 'あまりのないわり算を練習しましょう。',
    minGrade: 4,
  },
] satisfies readonly MathQuestOption[];

const MathNav: FC<{
  currentUser: CurrentUser | null;
  gradeId: GradeId;
  gradeStage: SchoolStage;
}> = ({ currentUser: _currentUser, gradeId, gradeStage }) => {
  const gradeIndex = Math.max(
    gradeLevels.findIndex((grade) => grade.id === gradeId),
    0
  );
  const gradeNumber = gradeIndex + 1;
  const gradeLabel = formatSchoolGradeLabel({ stage: gradeStage, grade: gradeNumber });

  return (
    <nav class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-6 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--mq-primary-soft)] text-base font-bold text-[var(--mq-primary-strong)]">
          MQ
        </span>
        <span class="text-lg font-semibold tracking-tight text-[var(--mq-ink)]">
          MathQuest - {gradeLabel}
        </span>
      </div>
      <div class="flex flex-wrap gap-2">
        <a
          href="/"
          class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
        >
          トップへ戻る
        </a>
        <a
          href="/math"
          class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
        >
          学年選択へ戻る
        </a>
      </div>
    </nav>
  );
};

const MathQuestCard: FC<{
  option: MathQuestOption;
  gradeId: GradeId;
  gradeStage: SchoolStage;
}> = ({ option, gradeId, gradeStage }) => {
  const gradeIndex = Math.max(
    gradeLevels.findIndex((grade) => grade.id === gradeId),
    0
  );
  const gradeNumber = gradeIndex + 1;
  const gradeLabel = formatSchoolGradeLabel({ stage: gradeStage, grade: gradeNumber });
  const isAvailable = gradeNumber >= option.minGrade;

  if (!isAvailable) {
    return (
      <div class="flex flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-left text-[#94a3b8] shadow-inner">
        <div class="text-5xl">{option.emoji}</div>
        <div class="text-2xl font-bold">{option.label}</div>
        <div class="text-sm">{option.description}</div>
        <div class="mt-2 inline-flex items-center gap-2 text-xs font-semibold">
          🔒 {option.label}は小学{option.minGrade}年生から
        </div>
      </div>
    );
  }

  return (
    <a
      href={`/math/start?grade=${encodeURIComponent(gradeId)}&calc=${option.id}`}
      class="flex flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-8 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
    >
      <div class="text-5xl">{option.emoji}</div>
      <div class="text-2xl font-bold text-[var(--mq-ink)]">{option.label}</div>
      <div class="text-sm text-[#5e718a]">{option.description}</div>
      <div class="text-xs font-semibold text-[var(--mq-primary-strong)]">{gradeLabel}向け</div>
    </a>
  );
};

export const MathSelect: FC<{
  currentUser: CurrentUser | null;
  gradeId: GradeId;
  gradeStage: SchoolStage;
}> = ({ currentUser, gradeId, gradeStage }) => {
  const gradeIndex = Math.max(
    gradeLevels.findIndex((grade) => grade.id === gradeId),
    0
  );
  const gradeNumber = gradeIndex + 1;
  const gradeLabel = formatSchoolGradeLabel({ stage: gradeStage, grade: gradeNumber });

  return (
    <div
      class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
      data-user-state={currentUser ? 'known' : 'anonymous'}
      style="--mq-primary: #6B9BD1; --mq-primary-strong: #3B7AC7; --mq-primary-soft: #D6E4F5; --mq-accent: #B7D4F7; --mq-outline: rgba(107, 155, 209, 0.45);"
    >
      <MathNav currentUser={currentUser} gradeId={gradeId} gradeStage={gradeStage} />

      <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
        <span class="text-6xl">🧮</span>
        <div class="space-y-4">
          <h1 class="text-3xl font-extrabold sm:text-4xl">挑戦するミッションを選ぼう</h1>
          <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
            {gradeLabel}向けの算数クエストを用意しました。
            <br />
            今の学年にぴったりの内容から選んで練習をはじめましょう。
          </p>
        </div>
      </header>

      <section>
        <h2 class="mb-6 text-xl font-bold text-[var(--mq-ink)]">クエストを選択</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mathQuestOptions.map((option) => (
            <MathQuestCard
              key={option.id}
              option={option}
              gradeId={gradeId}
              gradeStage={gradeStage}
            />
          ))}
        </div>
      </section>

      <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">クエストの特徴</h2>
        <ul class="space-y-2 text-sm text-[#5e718a]">
          <li>✓ たし算・ひき算は小学1年生から挑戦できます。</li>
          <li>✓ かけ算は小学3年生、わり算は小学4年生から選べます。</li>
          <li>✓ 選んだクエストに合わせておすすめのテーマを表示します。</li>
          <li>✓ あとからほかのクエストに切り替えることもできます。</li>
        </ul>
      </section>
    </div>
  );
};

