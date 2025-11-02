import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { Kanji, KanjiGrade } from '@edu-quest/domain';
import { BackToTopLink } from '../components/back-to-top-link';
import { DictionaryLink } from '../components/dictionary-link';
import { Footer } from '../../components/Footer';
import {
  createSchoolGradeParam,
  formatSchoolGradeLabel,
} from '../utils/school-grade';

const KanjiDetailNav: FC<{
  currentUser: CurrentUser | null;
  gradeLabel: string;
  gradeParam: string;
}> = ({ currentUser, gradeLabel, gradeParam }) => (
  <nav class="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-2 shadow-sm backdrop-blur sm:px-8 lg:px-16 xl:px-24">
    <div class="flex items-center gap-2">
      <a
        href="/kanji"
        class="flex items-center gap-2 transition hover:opacity-80"
      >
        <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
          ✏️
        </span>
        <div class="flex flex-col leading-tight">
          <span class="text-sm font-semibold tracking-tight text-[var(--mq-ink)]">
            KanjiQuest
          </span>
          <span class="text-[10px] font-semibold text-[var(--mq-primary-strong)]">
            {gradeLabel} 辞書
          </span>
        </div>
      </a>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <DictionaryLink href={`/kanji/dictionary?grade=${gradeParam}`} />
      <a
        href={`/kanji/select?grade=${gradeParam}`}
        class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
      >
        ← クエスト選択へ戻る
      </a>
      <BackToTopLink />
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

type KanjiDetailProps = {
  currentUser: CurrentUser | null;
  grade: KanjiGrade;
  kanji: Kanji;
};

const formatReadings = (readings: string[]): string =>
  readings.length > 0 ? readings.join('・') : '—';

export const KanjiDetail: FC<KanjiDetailProps> = ({
  currentUser,
  grade,
  kanji,
}) => {
  const gradeLabel = formatSchoolGradeLabel({ stage: '小学', grade });
  const gradeParam = createSchoolGradeParam({ stage: '小学', grade });

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      style="--mq-primary: #9B87D4; --mq-primary-strong: #7B5FBD; --mq-primary-soft: #E8E1F5; --mq-accent: #C5B5E8; --mq-outline: rgba(155, 135, 212, 0.45); --mq-ink: #2c3e50; --mq-surface: rgba(255, 255, 255, 0.95);"
    >
      <KanjiDetailNav
        currentUser={currentUser}
        gradeLabel={gradeLabel}
        gradeParam={gradeParam}
      />
      <div class="flex flex-1 flex-col gap-8 px-4 pb-16 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
          <div class="text-8xl font-extrabold text-[var(--mq-ink)]">
            {kanji.character}
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            {kanji.meanings.map((meaning) => (
              <span
                key={meaning}
                class="inline-flex items-center rounded-full bg-[var(--mq-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--mq-primary-strong)]"
              >
                {meaning}
              </span>
            ))}
          </div>
          <div class="rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mq-primary-strong)] shadow-sm">
            {kanji.strokeCount}画 | {gradeLabel}
          </div>
        </header>

        <div class="grid gap-6 lg:grid-cols-2">
          <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
            <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">読み方</h2>
            <dl class="space-y-4">
              <div>
                <dt class="text-sm font-semibold text-[var(--mq-primary-strong)]">
                  音読み
                </dt>
                <dd class="mt-2 text-2xl font-bold text-[var(--mq-ink)]">
                  {formatReadings(kanji.readings.onyomi)}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-semibold text-[var(--mq-primary-strong)]">
                  訓読み
                </dt>
                <dd class="mt-2 text-2xl font-bold text-[var(--mq-ink)]">
                  {formatReadings(kanji.readings.kunyomi)}
                </dd>
              </div>
            </dl>
          </section>

          <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
            <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">部首</h2>
            <div class="flex flex-wrap gap-2">
              {kanji.radicals.length > 0 ? (
                kanji.radicals.map((radical) => (
                  <span
                    key={radical}
                    class="inline-flex items-center rounded-full border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-2 text-base font-semibold text-[var(--mq-ink)]"
                  >
                    {radical}
                  </span>
                ))
              ) : (
                <span class="text-base text-[#5e718a]">—</span>
              )}
            </div>
          </section>
        </div>

        <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">
            例のことば
          </h2>
          <div class="space-y-3">
            {kanji.examples.map((example) => (
              <div
                key={`${kanji.character}-${example.word}`}
                class="rounded-2xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] p-4"
              >
                <div class="flex items-baseline gap-3">
                  <div class="text-xl font-bold text-[var(--mq-ink)]">
                    {example.word}
                  </div>
                  <div class="text-sm text-[#5e718a]">{example.reading}</div>
                </div>
                <div class="mt-2 text-sm text-[#4f6076]">{example.meaning}</div>
              </div>
            ))}
          </div>
        </section>

        <div class="flex justify-center">
          <a
            href={`/kanji/dictionary?grade=${gradeParam}`}
            class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-6 py-3 text-sm font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
          >
            ← 辞書一覧に戻る
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};
