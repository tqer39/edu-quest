import type { KanjiGrade } from '@edu-quest/domain';
import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { GradeDropdown } from '../../components/GradeDropdown';
import { DictionaryLink } from '../components/dictionary-link';
import type { SchoolStage } from '../utils/school-grade';
import {
  createSchoolGradeParam,
  formatSchoolGradeLabel,
} from '../utils/school-grade';

const KanjiNav: FC<{
  currentUser: CurrentUser | null;
  grade: KanjiGrade;
  stage: SchoolStage;
}> = ({ currentUser, grade, stage }) => {
  const gradeParam = createSchoolGradeParam({ stage, grade });

  // 利用可能な学年リスト（小学1-2年生のみ、KanjiQuestは現在1-2年生のみ対応）
  const availableGrades: readonly {
    stage: SchoolStage;
    grade: number;
    disabled?: boolean;
  }[] = [
    { stage: '小学', grade: 1 },
    { stage: '小学', grade: 2 },
    { stage: '小学', grade: 3, disabled: true },
    { stage: '小学', grade: 4, disabled: true },
    { stage: '小学', grade: 5, disabled: true },
    { stage: '小学', grade: 6, disabled: true },
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
        <a href="/kanji" class="transition hover:opacity-80">
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
            ✏️
          </span>
        </a>
        <GradeDropdown
          currentGrade={grade}
          currentStage={stage}
          availableGrades={availableGrades}
          baseUrl="/kanji/select"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <DictionaryLink href={`/kanji/dictionary?grade=${gradeParam}`} />
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

export const KanjiSelect: FC<{
  currentUser: CurrentUser | null;
  grade: KanjiGrade;
  gradeStage: SchoolStage;
}> = ({ currentUser, grade, gradeStage }) => {
  const gradeLabel = formatSchoolGradeLabel({ stage: gradeStage, grade });
  const gradeParam = createSchoolGradeParam({ stage: gradeStage, grade });

  const modeOptions: ModeOption[] = [
    {
      id: 'learn',
      title: '学ぶ',
      icon: '📚',
      description:
        '漢字の読み方や書き方を学びましょう。わかりやすい説明で、しっかり覚えられます。',
      href: `/kanji/learn?grade=${encodeURIComponent(gradeParam)}`,
    },
    {
      id: 'quest',
      title: 'クエストに挑戦する',
      icon: '🎯',
      description:
        '問題を解いて漢字をマスター！楽しく学習して実力をつけましょう。',
      href: `/kanji/quest?grade=${encodeURIComponent(gradeParam)}`,
    },
  ];

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      style="--mq-primary: #9B87D4; --mq-primary-strong: #7B5FBD; --mq-primary-soft: #E8E1F5; --mq-accent: #C5B5E8; --mq-outline: rgba(155, 135, 212, 0.45);"
    >
      <KanjiNav currentUser={currentUser} grade={grade} stage={gradeStage} />
      <div class="flex flex-1 flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
          <span class="text-6xl">✏️</span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">
              学習方法を選んでください
            </h1>
            <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
              {gradeLabel}の漢字学習を始めましょう。
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
