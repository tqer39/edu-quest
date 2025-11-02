import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import type { SchoolStage } from '../utils/school-grade';
import {
  formatSchoolGradeLabel,
  formatSchoolGradeLabelNav,
} from '../utils/school-grade';
import { type GradeId, gradeLevels } from './grade-presets';

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
}> = ({ currentUser, gradeId, gradeStage }) => {
  const gradeIndex = Math.max(
    gradeLevels.findIndex((grade) => grade.id === gradeId),
    0
  );
  const gradeNumber = gradeIndex + 1;
  // ナビゲーションでは最短形式を使用（例：「小1」）
  const gradeLabel = formatSchoolGradeLabelNav({
    stage: gradeStage,
    grade: gradeNumber,
  });

  return (
    <nav class="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-2 shadow-sm backdrop-blur sm:px-8 lg:px-16 xl:px-24">
      <div class="flex items-center gap-2">
        <a href="/" class="transition hover:opacity-80">
          <img
            src="/logo.svg"
            alt="EduQuest Logo"
            class="h-7 w-7"
            width="28"
            height="28"
          />
        </a>
        <span class="text-[var(--mq-outline)]">|</span>
        <a href="/math" class="transition hover:opacity-80">
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
            🔢
          </span>
        </a>
        <span class="text-xs font-semibold text-[var(--mq-ink)]">
          {gradeLabel}
        </span>
      </div>
      <div class="flex flex-wrap gap-2">
        <a
          href="/math"
          class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
        >
          ← 学年選択へ戻る
        </a>
        {currentUser ? (
          <a
            href="/auth/logout"
            class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
          >
            ログアウト
          </a>
        ) : (
          <a
            href="/auth/login"
            class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
          >
            ログイン
          </a>
        )}
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
  const gradeLabel = formatSchoolGradeLabel({
    stage: gradeStage,
    grade: gradeNumber,
  });
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
      href={`/math/start?grade=${encodeURIComponent(gradeId)}&calc=${
        option.id
      }`}
      class="flex flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-8 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
    >
      <div class="text-5xl">{option.emoji}</div>
      <div class="text-2xl font-bold text-[var(--mq-ink)]">{option.label}</div>
      <div class="text-sm text-[#5e718a]">{option.description}</div>
      <div class="text-xs font-semibold text-[var(--mq-primary-strong)]">
        {gradeLabel}向け
      </div>
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
  const gradeLabel = formatSchoolGradeLabel({
    stage: gradeStage,
    grade: gradeNumber,
  });

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      data-user-state={currentUser ? 'known' : 'anonymous'}
      style="--mq-primary: #6B9BD1; --mq-primary-strong: #3B7AC7; --mq-primary-soft: #D6E4F5; --mq-accent: #B7D4F7; --mq-outline: rgba(107, 155, 209, 0.45);"
    >
      <MathNav
        currentUser={currentUser}
        gradeId={gradeId}
        gradeStage={gradeStage}
      />
      <div class="flex flex-1 flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
          <span class="text-6xl">🔢</span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">
              クエストを選んでください
            </h1>
            <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
              {gradeLabel}向けの算数クエストを用意しました。
              <br />
              今の学年にぴったりの内容から選んで練習をはじめましょう。
            </p>
          </div>
        </header>

        <section>
          <h2 class="mb-6 text-xl font-bold text-[var(--mq-ink)]">
            クエストを選択
          </h2>
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
          <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">
            クエストの特徴
          </h2>
          <ul class="space-y-2 text-sm text-[#5e718a]">
            <li>✓ たし算・ひき算は小学1年生から挑戦できます。</li>
            <li>✓ かけ算は小学3年生、わり算は小学4年生から選べます。</li>
            <li>✓ 選んだクエストに合わせておすすめのテーマを表示します。</li>
            <li>✓ あとからほかのクエストに切り替えることもできます。</li>
          </ul>
        </section>
      </div>

      <Footer />
    </div>
  );
};
