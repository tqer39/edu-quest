import type { ClockGrade } from '@edu-quest/domain';
import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { GradeDropdown } from '../../components/GradeDropdown';
import type { SchoolStage } from '../utils/school-grade';
import {
  createSchoolGradeParam,
  formatSchoolGradeLabel,
} from '../utils/school-grade';

const ClockNav: FC<{ currentUser: CurrentUser | null; grade: ClockGrade }> = ({
  currentUser,
  grade,
}) => {
  const availableGrades: readonly {
    stage: SchoolStage;
    grade: number;
    disabled?: boolean;
  }[] = [
    { stage: '小学', grade: 1 },
    { stage: '小学', grade: 2 },
    { stage: '小学', grade: 3 },
    { stage: '小学', grade: 4 },
    { stage: '小学', grade: 5 },
    { stage: '小学', grade: 6 },
  ];

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
        <a href="/clock" class="transition hover:opacity-80">
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
            🕐
          </span>
        </a>
        <span class="text-[var(--mq-outline)]">|</span>
        <GradeDropdown
          currentGrade={grade}
          currentStage="小学"
          availableGrades={availableGrades}
          baseUrl="/clock/select"
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

export const ClockSelect: FC<{
  currentUser: CurrentUser | null;
  grade: ClockGrade;
}> = ({ currentUser, grade }) => {
  const gradeLabel = formatSchoolGradeLabel({ stage: '小学', grade });
  const gradeParam = createSchoolGradeParam({ stage: '小学', grade });

  const modeOptions: ModeOption[] = [
    {
      id: 'learn',
      title: '学ぶ',
      icon: '📚',
      description:
        '時計の読み方を学びましょう。アナログとデジタルの両方をわかりやすく説明します。',
      href: `/clock/learn?grade=${encodeURIComponent(gradeParam)}`,
    },
    {
      id: 'quest',
      title: 'クエストに挑戦する',
      icon: '⚔️',
      description:
        '問題を解いて時計をマスター！楽しく学習して時間の感覚を身につけましょう。',
      href: `/clock/quest?grade=${encodeURIComponent(gradeParam)}`,
    },
  ];

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      style="--mq-primary: #F5A85F; --mq-primary-strong: #E88D3D; --mq-primary-soft: #FEE9D5; --mq-accent: #FFCC99; --mq-outline: rgba(245, 168, 95, 0.45);"
    >
      <ClockNav currentUser={currentUser} grade={grade} />
      <div class="flex flex-1 flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
          <span class="text-6xl">🧭</span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">
              学習方法を選んでください
            </h1>
            <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
              {gradeLabel}向けの時計学習を始めましょう。
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
