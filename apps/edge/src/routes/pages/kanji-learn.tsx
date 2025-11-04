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
          baseUrl="/kanji/learn"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <DictionaryLink gradeParam={gradeParam} />
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

type LearnOption = {
  id: 'kanji-dictionary' | 'radical-dictionary';
  title: string;
  icon: string;
  description: string;
  href: string;
};

const LearnCard: FC<{ option: LearnOption }> = ({ option }) => (
  <a
    href={option.href}
    class="flex h-full flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-8 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
  >
    <span class="text-5xl" aria-hidden="true">
      {option.icon}
    </span>
    <div class="space-y-2">
      <div class="text-2xl font-bold text-[var(--mq-ink)]">{option.title}</div>
      <p class="text-sm leading-relaxed text-[#5e718a]">{option.description}</p>
    </div>
    <span class="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--mq-primary-strong)]">
      開く →
    </span>
  </a>
);

export const KanjiLearn: FC<{
  currentUser: CurrentUser | null;
  grade: KanjiGrade;
  gradeStage: SchoolStage;
}> = ({ currentUser, grade, gradeStage }) => {
  const gradeLabel = formatSchoolGradeLabel({ stage: gradeStage, grade });
  const gradeParam = createSchoolGradeParam({ stage: gradeStage, grade });

  const learnOptions: LearnOption[] = [
    {
      id: 'kanji-dictionary',
      title: '漢字辞書',
      icon: '📖',
      description:
        '読み方・意味・例文をまとめた漢字辞書です。学習の復習や確認に使いましょう。',
      href: `/kanji/dictionary?grade=${encodeURIComponent(gradeParam)}`,
    },
    {
      id: 'radical-dictionary',
      title: '部首辞書',
      icon: '🧩',
      description:
        '漢字を構成する部首を調べられます。同じ部首を持つ漢字や特徴を確認しましょう。',
      href: `/kanji/dictionary/radicals?grade=${encodeURIComponent(gradeParam)}`,
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
          <span class="text-6xl">📚</span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">
              {gradeLabel}の学習方法
            </h1>
            <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
              調べたい内容に合わせて辞書を選びましょう。
              <br />
              漢字辞書では読み方や意味を、部首辞書では漢字の成り立ちを確認できます。
            </p>
          </div>
        </header>

        <section>
          <h2 class="mb-6 text-xl font-bold text-[var(--mq-ink)]">
            辞書を選択
          </h2>
          <div class="grid gap-6 sm:grid-cols-2">
            {learnOptions.map((option) => (
              <LearnCard key={option.id} option={option} />
            ))}
          </div>
        </section>

        <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">
            使い分けのヒント
          </h2>
          <ul class="space-y-2 text-sm text-[#5e718a]">
            <li>✓ 漢字辞書: 読み方・意味・例文を確認したいときに便利です。</li>
            <li>✓ 部首辞書: 同じ部首を持つ漢字をまとめて覚えたいときに活用しましょう。</li>
            <li>✓ クエスト中でも辞書メニューからいつでも開けます。</li>
          </ul>
        </section>
      </div>

      <Footer />
    </div>
  );
};
