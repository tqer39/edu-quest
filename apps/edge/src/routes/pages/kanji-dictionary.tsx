import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { Kanji, KanjiGrade } from '@edu-quest/domain';
import { BackToTopLink } from '../components/back-to-top-link';
import { DictionaryLink } from '../components/dictionary-link';
import { Footer } from '../../components/Footer';
import { createSchoolGradeParam, formatSchoolGradeLabel } from '../utils/school-grade';

const KanjiDictionaryNav: FC<{ currentUser: CurrentUser | null; gradeLabel: string }> = ({
  currentUser,
  gradeLabel,
}) => (
  <nav class="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-2 shadow-sm backdrop-blur sm:px-8 lg:px-16 xl:px-24">
    <div class="flex items-center gap-2">
      <a href="/kanji" class="flex items-center gap-2 transition hover:opacity-80">
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
      <DictionaryLink current />
      <BackToTopLink href="/kanji" />
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

type KanjiDictionaryProps = {
  currentUser: CurrentUser | null;
  grade: KanjiGrade;
  entries: Kanji[];
  query: string;
};

const formatReadings = (readings: string[]): string =>
  readings.length > 0 ? readings.join('・') : '—';

const buildSearchIndex = (kanji: Kanji): string => {
  const base = [
    kanji.character,
    kanji.strokeCount.toString(),
    ...kanji.readings.onyomi,
    ...kanji.readings.kunyomi,
    ...kanji.meanings,
    ...kanji.radicals,
  ];

  const exampleTokens = kanji.examples.flatMap((example) => [
    example.word,
    example.reading,
    example.meaning,
  ]);

  return [...base, ...exampleTokens].join(' ').toLowerCase();
};

export const KanjiDictionary: FC<KanjiDictionaryProps> = ({
  currentUser,
  grade,
  entries,
  query,
}) => {
  const gradeLabel = formatSchoolGradeLabel({ stage: '小学', grade });
  const gradeParam = createSchoolGradeParam({ stage: '小学', grade });
  const normalizedQuery = query.trim().toLowerCase();
  const totalCount = entries.length;
  const filteredEntries = normalizedQuery
    ? entries.filter((entry) => buildSearchIndex(entry).includes(normalizedQuery))
    : entries;

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      style="--mq-primary: #9B87D4; --mq-primary-strong: #7B5FBD; --mq-primary-soft: #E8E1F5; --mq-accent: #C5B5E8; --mq-outline: rgba(155, 135, 212, 0.45); --mq-ink: #2c3e50; --mq-surface: rgba(255, 255, 255, 0.95);"
    >
      <KanjiDictionaryNav currentUser={currentUser} gradeLabel={gradeLabel} />
      <div class="flex flex-1 flex-col gap-8 px-4 pb-16 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-10 text-[var(--mq-ink)] shadow-xl">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-[var(--mq-primary-strong)]">小学1年生向け</p>
              <h1 class="text-3xl font-extrabold sm:text-4xl">
                {gradeLabel} 漢字辞書
              </h1>
              <p class="mt-2 max-w-2xl text-sm text-[#4f6076]">
                教育漢字80字の読み方・意味・例をいつでも確認できます。クエストの途中でも辞書を開いて復習しましょう。
              </p>
            </div>
            <div class="rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mq-primary-strong)] shadow-sm">
              全{totalCount}字掲載
            </div>
          </div>
        </header>

        <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
          <form class="flex flex-col gap-4 sm:flex-row sm:items-center" method="GET">
            <input type="hidden" name="grade" value={gradeParam} />
            <label class="flex-1">
              <span class="mb-2 block text-xs font-semibold text-[#5e718a]">
                検索（漢字・読み・意味・例から探せます）
              </span>
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="例：学、がく、まなぶ"
                class="w-full rounded-2xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-3 text-sm text-[var(--mq-ink)] shadow-inner focus:border-[var(--mq-primary)] focus:outline-none"
              />
            </label>
            <div class="flex gap-2">
              <button
                type="submit"
                class="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--mq-primary)] to-[var(--mq-primary-strong)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
              >
                検索
              </button>
              {normalizedQuery && (
                <a
                  href={`/kanji/dictionary?grade=${gradeParam}`}
                  class="inline-flex items-center justify-center rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-3 text-sm font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)]"
                >
                  リセット
                </a>
              )}
            </div>
          </form>
          <p class="mt-4 text-xs text-[#5e718a]">
            {normalizedQuery ? (
              <>
                「{query}」に一致する漢字 {filteredEntries.length} / {totalCount} 字
              </>
            ) : (
              <>全{totalCount}字を表示しています</>
            )}
          </p>
        </section>

        {filteredEntries.length === 0 ? (
          <div class="rounded-3xl border border-dashed border-[var(--mq-outline)] bg-white p-12 text-center text-sm text-[#5e718a]">
            該当する漢字が見つかりませんでした。別のキーワードを試してみましょう。
          </div>
        ) : (
          <section class="grid gap-6 lg:grid-cols-2">
            {filteredEntries.map((kanji) => (
              <article
                key={kanji.character}
                class="flex flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <div class="text-5xl font-extrabold text-[var(--mq-ink)]">
                      {kanji.character}
                    </div>
                    <div class="mt-2 flex flex-wrap gap-2 text-xs text-[var(--mq-primary-strong)]">
                      {kanji.meanings.map((meaning) => (
                        <span
                          key={meaning}
                          class="inline-flex items-center rounded-full bg-[var(--mq-primary-soft)] px-3 py-1"
                        >
                          {meaning}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div class="rounded-2xl border border-[var(--mq-outline)] bg-[var(--mq-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--mq-primary-strong)]">
                    {kanji.strokeCount}画
                  </div>
                </div>

                <dl class="space-y-3 text-sm text-[#4f6076]">
                  <div>
                    <dt class="text-xs font-semibold text-[var(--mq-primary-strong)]">音読み</dt>
                    <dd class="mt-1 text-base text-[var(--mq-ink)]">{formatReadings(kanji.readings.onyomi)}</dd>
                  </div>
                  <div>
                    <dt class="text-xs font-semibold text-[var(--mq-primary-strong)]">訓読み</dt>
                    <dd class="mt-1 text-base text-[var(--mq-ink)]">{formatReadings(kanji.readings.kunyomi)}</dd>
                  </div>
                  <div>
                    <dt class="text-xs font-semibold text-[var(--mq-primary-strong)]">部首</dt>
                    <dd class="mt-1 flex flex-wrap gap-2">
                      {kanji.radicals.length > 0 ? (
                        kanji.radicals.map((radical) => (
                          <span
                            key={radical}
                            class="inline-flex items-center rounded-full border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-3 py-1 text-xs"
                          >
                            {radical}
                          </span>
                        ))
                      ) : (
                        <span class="text-base text-[var(--mq-ink)]">—</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-xs font-semibold text-[var(--mq-primary-strong)]">例のことば</dt>
                    <dd class="mt-2 space-y-2">
                      {kanji.examples.map((example) => (
                        <div
                          key={`${kanji.character}-${example.word}`}
                          class="rounded-2xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-3 py-2 text-xs text-[var(--mq-ink)]"
                        >
                          <div class="font-semibold">
                            {example.word}
                            <span class="ml-2 text-[11px] text-[#5e718a]">{example.reading}</span>
                          </div>
                          <div class="mt-1 text-[11px] text-[#5e718a]">{example.meaning}</div>
                        </div>
                      ))}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
};
