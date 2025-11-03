import type { KanjiGrade } from '@edu-quest/domain';
import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { DictionaryLink } from '../components/dictionary-link';
import {
  createSchoolGradeParam,
  formatSchoolGradeLabel,
} from '../utils/school-grade';

/**
 * Vocabulary entry structure
 * Contains information about a word including its kanji composition
 */
export interface VocabularyEntry {
  word: string;
  reading: string;
  meaning: string;
  relatedKanji: Array<{
    character: string;
    unicode: string;
    reading: string;
  }>;
}

const VocabularyNav: FC<{
  currentUser: CurrentUser | null;
  gradeLabel: string;
  gradeParam: string;
}> = ({ currentUser, gradeLabel, gradeParam }) => (
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
      <span class="text-xs font-semibold text-[var(--mq-ink)]">
        {gradeLabel} 用語辞典
      </span>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <DictionaryLink href={`/kanji/dictionary?grade=${gradeParam}`} />
      <a
        href={`/kanji/select?grade=${gradeParam}`}
        class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
      >
        ← クエスト選択へ戻る
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

type VocabularyDetailProps = {
  currentUser: CurrentUser | null;
  grade: KanjiGrade;
  vocabulary: VocabularyEntry;
};

export const VocabularyDetail: FC<VocabularyDetailProps> = ({
  currentUser,
  grade,
  vocabulary,
}) => {
  const gradeLabel = formatSchoolGradeLabel({ stage: '小学', grade });
  const gradeParam = createSchoolGradeParam({ stage: '小学', grade });

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      style="--mq-primary: #9B87D4; --mq-primary-strong: #7B5FBD; --mq-primary-soft: #E8E1F5; --mq-accent: #C5B5E8; --mq-outline: rgba(155, 135, 212, 0.45); --mq-ink: #2c3e50; --mq-surface: rgba(255, 255, 255, 0.95);"
    >
      <VocabularyNav
        currentUser={currentUser}
        gradeLabel={gradeLabel}
        gradeParam={gradeParam}
      />
      <div class="flex flex-1 flex-col gap-8 px-4 pb-16 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
          <div class="text-6xl font-extrabold text-[var(--mq-ink)]">
            {vocabulary.word}
          </div>
          <div class="text-2xl text-[#5e718a]">{vocabulary.reading}</div>
          <div class="rounded-2xl border border-[var(--mq-outline)] bg-white px-6 py-3 text-base font-semibold text-[var(--mq-primary-strong)] shadow-sm">
            {gradeLabel}
          </div>
        </header>

        <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">意味</h2>
          <p class="text-lg text-[#4f6076]">{vocabulary.meaning}</p>
        </section>

        {vocabulary.relatedKanji.length > 0 && (
          <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
            <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">
              使われている漢字
            </h2>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vocabulary.relatedKanji.map((kanji) => (
                <a
                  key={kanji.unicode}
                  href={`/kanji/detail/${kanji.unicode}?grade=${gradeParam}`}
                  class="flex items-center gap-4 rounded-2xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] p-4 transition hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
                >
                  <div class="text-4xl font-bold text-[var(--mq-ink)]">
                    {kanji.character}
                  </div>
                  <div class="flex-1">
                    <div class="text-sm text-[#5e718a]">{kanji.reading}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <div class="flex justify-center gap-4">
          <a
            href={`/kanji/dictionary?grade=${gradeParam}`}
            class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-6 py-3 text-sm font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
          >
            ← 漢字辞書に戻る
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};
