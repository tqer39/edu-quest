import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { GradeDropdown } from '../../components/GradeDropdown';
import type { SchoolStage } from '../utils/school-grade';
import { formatSchoolGradeLabel } from '../utils/school-grade';
import { type GradeId, gradeLevels } from './grade-presets';

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

  // 利用可能な学年リスト（小学1-6年生）
  const availableGrades = gradeLevels
    .filter((level) => !level.disabled)
    .map((level) => {
      const idx = gradeLevels.findIndex((g) => g.id === level.id);
      return {
        stage: '小学' as SchoolStage,
        grade: idx + 1,
        disabled: level.disabled,
      };
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
        <GradeDropdown
          currentGrade={gradeNumber}
          currentStage={gradeStage}
          availableGrades={availableGrades}
          baseUrl="/math/select"
        />
      </div>
      <div class="flex flex-wrap gap-2">
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

type ModeOption = {
  id: 'learn' | 'quest';
  title: string;
  icon: string;
  description: string;
  href: string;
};

const ModeCard: FC<{ mode: ModeOption }> = ({ mode }) => (
  <a
    href={mode.href}
    class="flex h-full flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-8 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
  >
    <span class="text-5xl" aria-hidden="true">
      {mode.icon}
    </span>
    <div class="space-y-2">
      <div class="text-2xl font-bold text-[var(--mq-ink)]">{mode.title}</div>
      <p class="text-sm leading-relaxed text-[#5e718a]">{mode.description}</p>
    </div>
    <span class="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--mq-primary-strong)]">
      選択する →
    </span>
  </a>
);

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

  const modeOptions: ModeOption[] = [
    {
      id: 'learn',
      title: '学ぶ',
      icon: '📚',
      description:
        '算数の基本を学びましょう。わかりやすい説明で、しっかり理解できます。',
      href: `/math/learn?grade=${encodeURIComponent(gradeId)}`,
    },
    {
      id: 'quest',
      title: 'クエストに挑戦する',
      icon: '🎯',
      description: '問題を解いてスキルアップ！楽しく算数の力を伸ばしましょう。',
      href: `/math/quest?grade=${encodeURIComponent(gradeId)}`,
    },
  ];

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
              学習方法を選んでください
            </h1>
            <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
              {gradeLabel}向けの算数学習を始めましょう。
              <br />
              「学ぶ」で基礎を理解してから、「クエストに挑戦する」で実践しましょう。
            </p>
          </div>
        </header>

        <section>
          <h2 class="mb-6 text-xl font-bold text-[var(--mq-ink)]">
            学習モードを選択
          </h2>
          <div class="grid gap-6 sm:grid-cols-2">
            {modeOptions.map((mode) => (
              <ModeCard key={mode.id} mode={mode} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};
