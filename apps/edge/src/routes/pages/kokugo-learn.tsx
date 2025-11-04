import type { KanjiGrade, KokugoDictionaryResource } from '@edu-quest/domain';
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

type KanjiLearnNavProps = {
  currentUser: CurrentUser | null;
  grade: KanjiGrade;
  stage: SchoolStage;
};

const KanjiLearnNav: FC<KanjiLearnNavProps> = ({
  currentUser,
  grade,
  stage,
}) => {
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
        <a href="/kokugo" class="transition hover:opacity-80">
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
        <DictionaryLink current href={`/kokugo/learn?grade=${gradeParam}`} />
        <a
          href={`/kokugo/quest?grade=${gradeParam}`}
          class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
        >
          クエストに戻る
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

type DictionaryCardProps = {
  dictionary: KokugoDictionaryResource;
  gradeParam: string;
};

const dictionaryIcons: Record<string, string> = {
  'eduquest-kanji': '📖',
  'eduquest-vocabulary': '📝',
  'eduquest-bushu': '🧩',
};

const DictionaryCard: FC<DictionaryCardProps> = ({
  dictionary,
  gradeParam,
}) => {
  const isExternalLink = dictionary.link.startsWith('http');
  const href = isExternalLink
    ? dictionary.link
    : `${dictionary.link}?grade=${encodeURIComponent(gradeParam)}`;
  const icon = dictionaryIcons[dictionary.id] || '📚';

  return (
    <a
      href={href}
      target={isExternalLink ? '_blank' : undefined}
      rel={isExternalLink ? 'noreferrer' : undefined}
      class="flex flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
    >
      <div class="text-5xl">{icon}</div>
      <div class="text-2xl font-bold text-[var(--mq-ink)]">
        {dictionary.title}
      </div>
      <div class="text-sm text-[#5e718a]">{dictionary.description}</div>
    </a>
  );
};

type KanjiLearnProps = {
  currentUser: CurrentUser | null;
  grade: KanjiGrade;
  gradeStage: SchoolStage;
  dictionaries: KokugoDictionaryResource[];
};

export const KanjiLearn: FC<KanjiLearnProps> = ({
  currentUser,
  grade,
  gradeStage,
  dictionaries,
}) => {
  const gradeLabel = formatSchoolGradeLabel({ stage: gradeStage, grade });
  const gradeParam = createSchoolGradeParam({ stage: gradeStage, grade });

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      style="--mq-primary: #9B87D4; --mq-primary-strong: #7B5FBD; --mq-primary-soft: #E8E1F5; --mq-accent: #C5B5E8; --mq-outline: rgba(155, 135, 212, 0.45);"
    >
      <KanjiLearnNav
        currentUser={currentUser}
        grade={grade}
        stage={gradeStage}
      />
      <div class="flex flex-1 flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
          <span class="text-6xl">📚</span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">
              辞書を選んでください
            </h1>
            <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
              {gradeLabel}の漢字や言葉を学習できます。
              <br />
              使いたい辞書を選んでください。
            </p>
          </div>
        </header>

        <section>
          <h2 class="mb-6 text-xl font-bold text-[var(--mq-ink)]">辞書</h2>
          {dictionaries.length === 0 ? (
            <p class="rounded-3xl border border-dashed border-[var(--mq-outline)] bg-white/60 p-6 text-sm text-[#5e718a]">
              この学年向けの辞書がまだありません。
            </p>
          ) : (
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dictionaries.map((dictionary) => (
                <DictionaryCard
                  key={dictionary.id}
                  dictionary={dictionary}
                  gradeParam={gradeParam}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};
