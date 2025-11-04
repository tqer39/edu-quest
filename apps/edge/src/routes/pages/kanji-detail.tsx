import type { Kanji, KanjiGrade } from '@edu-quest/domain';
import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { DictionaryLink } from '../components/dictionary-link';
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
        {gradeLabel} 辞書
      </span>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <DictionaryLink gradeParam={gradeParam} />
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

type KanjiDetailProps = {
  currentUser: CurrentUser | null;
  grade: KanjiGrade;
  kanji: Kanji;
};

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
                <dd class="mt-2 flex flex-wrap gap-2">
                  {kanji.readings.onyomi.length > 0 ? (
                    kanji.readings.onyomi.map((reading) => (
                      <button
                        key={reading}
                        type="button"
                        class="reading-filter rounded-full border border-[var(--mq-outline)] bg-white px-4 py-2 text-xl font-bold text-[var(--mq-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
                        data-reading={reading}
                      >
                        {reading}
                      </button>
                    ))
                  ) : (
                    <span class="text-2xl font-bold text-[var(--mq-ink)]">
                      —
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-semibold text-[var(--mq-primary-strong)]">
                  訓読み
                </dt>
                <dd class="mt-2 flex flex-wrap gap-2">
                  {kanji.readings.kunyomi.length > 0 ? (
                    kanji.readings.kunyomi.map((reading) => (
                      <button
                        key={reading}
                        type="button"
                        class="reading-filter rounded-full border border-[var(--mq-outline)] bg-white px-4 py-2 text-xl font-bold text-[var(--mq-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
                        data-reading={reading}
                      >
                        {reading}
                      </button>
                    ))
                  ) : (
                    <span class="text-2xl font-bold text-[var(--mq-ink)]">
                      —
                    </span>
                  )}
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
          <div
            id="no-examples-message"
            class="rounded-2xl border border-dashed border-[var(--mq-outline)] bg-[var(--mq-surface)] p-8 text-center text-sm text-[#5e718a]"
            style="display: none;"
          >
            この読み方を使った例文は小学1年生レベルではあまり使われません。
          </div>
          <div id="regular-example-list" class="space-y-3">
            {kanji.examples.map((example) => (
              <div
                key={`${kanji.character}-${example.word}`}
                class="example-item rounded-2xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] p-4 transition-all"
                data-reading={example.reading}
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

        {kanji.specialExamples.length > 0 && (
          <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
            <h2 class="mb-2 text-xl font-bold text-[var(--mq-ink)]">
              特殊な読み方のことば
            </h2>
            <p class="mb-4 text-sm text-[#5e718a]">
              音便や慣用読みなど、少し変わった読み方で覚えたい単語です。
            </p>
            <div class="space-y-3">
              {kanji.specialExamples.map((example) => (
                <div
                  key={`${kanji.character}-special-${example.word}-${example.reading}`}
                  class="rounded-2xl border border-dashed border-[var(--mq-primary)] bg-[var(--mq-surface)] p-4"
                >
                  <div class="flex items-baseline gap-3">
                    <div class="text-xl font-bold text-[var(--mq-primary-strong)]">
                      {example.word}
                    </div>
                    <div class="text-sm text-[#5e718a]">{example.reading}</div>
                  </div>
                  <div class="mt-2 text-sm text-[#4f6076]">
                    {example.meaning}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: `
              const readingButtons = document.querySelectorAll('.reading-filter');
              const exampleList = document.getElementById('regular-example-list');
              const exampleItems = exampleList ? exampleList.querySelectorAll('.example-item') : [];
              const noExamplesMessage = document.getElementById('no-examples-message');
              if (!exampleList || exampleItems.length === 0 || !noExamplesMessage) {
                return;
              }
              let activeFilter = null;

              // Helper functions for kana conversion
              function toHiragana(str) {
                return str.replace(/[\u30A1-\u30F6]/g, (match) =>
                  String.fromCharCode(match.charCodeAt(0) - 0x60)
                );
              }

              function toKatakana(str) {
                return str.replace(/[\u3041-\u3096]/g, (match) =>
                  String.fromCharCode(match.charCodeAt(0) + 0x60)
                );
              }

              function normalizeReading(reading) {
                return reading.replace(/-/g, '').toLowerCase();
              }

              function matchesReading(itemReading, filterReading) {
                const normalizedItem = normalizeReading(itemReading);
                const normalizedFilter = normalizeReading(filterReading);

                // Try direct match
                if (normalizedItem.includes(normalizedFilter)) return true;

                // Try hiragana match - convert both to hiragana
                const hiraganaItem = toHiragana(normalizedItem);
                const hiraganaFilter = toHiragana(normalizedFilter);
                if (hiraganaItem.includes(hiraganaFilter)) return true;

                // Try katakana match - convert both to katakana
                const katakanaItem = toKatakana(normalizedItem);
                const katakanaFilter = toKatakana(normalizedFilter);
                if (katakanaItem.includes(katakanaFilter)) return true;

                return false;
              }

              readingButtons.forEach(button => {
                button.addEventListener('click', () => {
                  const reading = button.dataset.reading;

                  // Toggle filter
                  if (activeFilter === reading) {
                    // Reset filter
                    activeFilter = null;
                    exampleItems.forEach(item => {
                      item.style.display = 'block';
                      item.style.opacity = '1';
                    });
                    readingButtons.forEach(btn => {
                      btn.style.backgroundColor = 'white';
                      btn.style.borderColor = 'var(--mq-outline)';
                    });
                    exampleList.style.display = 'block';
                    noExamplesMessage.style.display = 'none';
                  } else {
                    // Apply filter
                    activeFilter = reading;

                    let visibleCount = 0;
                    exampleItems.forEach(item => {
                      const itemReading = item.dataset.reading;
                      if (matchesReading(itemReading, reading)) {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                        visibleCount++;
                      } else {
                        item.style.display = 'none';
                        item.style.opacity = '0';
                      }
                    });

                    // Update button states
                    readingButtons.forEach(btn => {
                      if (btn.dataset.reading === reading) {
                        btn.style.backgroundColor = 'var(--mq-primary-soft)';
                        btn.style.borderColor = 'var(--mq-primary)';
                      } else {
                        btn.style.backgroundColor = 'white';
                        btn.style.borderColor = 'var(--mq-outline)';
                      }
                    });

                    // Show/hide no-examples message based on visible count
                    if (visibleCount === 0) {
                      exampleList.style.display = 'none';
                      noExamplesMessage.style.display = 'block';
                    } else {
                      exampleList.style.display = 'block';
                      noExamplesMessage.style.display = 'none';
                    }
                  }
                });
              });
            `,
          }}
        />

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
