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
        <DictionaryLink
          current
          href={`/kanji/learn?grade=${gradeParam}`}
        />
        <a
          href={`/kanji/quest?grade=${gradeParam}`}
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

const badgeClasses: Record<KokugoDictionaryResource['type'], string> = {
  internal:
    'bg-[var(--mq-primary-soft)] text-[var(--mq-primary-strong)] border-[var(--mq-primary)]',
  official:
    'bg-[#e6f2ff] text-[#1f4b99] border-[#8ab5ff]',
  private: 'bg-[#fdf0d5] text-[#9c4221] border-[#f0b27a]',
};

const badgeLabel: Record<KokugoDictionaryResource['type'], string> = {
  internal: 'EduQuest',
  official: '公式資料',
  private: '民間資料',
};

const DictionaryCard: FC<DictionaryCardProps> = ({ dictionary, gradeParam }) => {
  const isExternalLink = dictionary.link.startsWith('http');
  const href = isExternalLink
    ? dictionary.link
    : `${dictionary.link}?grade=${encodeURIComponent(gradeParam)}`;

  return (
    <article class="flex h-full flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-6 shadow-lg">
      <div class="flex items-center justify-between gap-4">
        <span class={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${badgeClasses[dictionary.type]}`}>
          {badgeLabel[dictionary.type]}
        </span>
        <span class="text-xs font-semibold text-[#5e718a]">
          小学{dictionary.gradeRange.min}～{dictionary.gradeRange.max}年生向け
        </span>
      </div>
      <header class="space-y-2">
        <h3 class="text-xl font-bold text-[var(--mq-ink)]">{dictionary.title}</h3>
        <p class="text-xs font-semibold text-[#5e718a]">提供: {dictionary.provider}</p>
        <p class="text-sm leading-relaxed text-[#4f6076]">{dictionary.description}</p>
      </header>
      <ul class="space-y-2 text-sm text-[#4f6076]">
        {dictionary.features.map((feature) => (
          <li key={feature} class="flex items-start gap-2">
            <span aria-hidden="true">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div class="mt-auto flex flex-col gap-3">
        <a
          href={href}
          target={isExternalLink ? '_blank' : undefined}
          rel={isExternalLink ? 'noreferrer' : undefined}
          class="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--mq-primary)] bg-[var(--mq-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--mq-primary-strong)] shadow-sm transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
        >
          {dictionary.cta}
          <span aria-hidden="true">{isExternalLink ? '↗' : '→'}</span>
        </a>
        <a
          href={dictionary.source.url}
          target="_blank"
          rel="noreferrer"
          class="inline-flex items-center gap-2 text-xs font-semibold text-[#5e718a] underline decoration-dotted underline-offset-2"
        >
          出典: {dictionary.source.label}
        </a>
      </div>
    </article>
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
      <KanjiLearnNav currentUser={currentUser} grade={grade} stage={gradeStage} />
      <div class="flex flex-1 flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-[var(--mq-ink)] shadow-xl">
          <div class="flex flex-wrap items-start justify-between gap-6">
            <div class="space-y-4">
              <span class="inline-flex items-center gap-2 rounded-full border border-[var(--mq-primary)] bg-[var(--mq-primary-soft)] px-4 py-1 text-xs font-semibold text-[var(--mq-primary-strong)]">
                学習サポート
              </span>
              <div class="space-y-3">
                <h1 class="text-3xl font-extrabold sm:text-4xl">
                  {gradeLabel}向け 国語辞典セレクション
                </h1>
                <p class="max-w-2xl text-sm sm:text-base text-[#4f6076]">
                  公的な資料と民間の学習辞典を組み合わせて、語彙の理解を深めましょう。必要に応じて教科書や辞典を開いて予習・復習に活用できます。
                </p>
              </div>
            </div>
            <div class="rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-3 text-sm font-semibold text-[var(--mq-primary-strong)] shadow-sm">
              利用可能: {dictionaries.length}件
            </div>
          </div>
          <p class="text-xs text-[#5e718a]">
            ※ 出典リンクは新しいタブで開きます。
          </p>
        </header>

        <section class="flex flex-col gap-6">
          <h2 class="text-xl font-bold text-[var(--mq-ink)]">
            辞典・資料を選択
          </h2>
          {dictionaries.length === 0 ? (
            <p class="rounded-3xl border border-dashed border-[var(--mq-outline)] bg-white/60 p-6 text-sm text-[#5e718a]">
              この学年向けに登録された資料がまだありません。追加の資料が公開されたら、ここでお知らせします。
            </p>
          ) : (
            <div class="grid gap-6 lg:grid-cols-2">
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
