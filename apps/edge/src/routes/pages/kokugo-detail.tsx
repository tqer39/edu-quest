import type { Kanji, KanjiGrade } from '@edu-quest/domain';
import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { QuestNav } from '../../components/QuestNav';
import {
  createSchoolGradeParam,
  formatSchoolGradeLabel,
} from '../utils/school-grade';
import type { SchoolStage } from '../utils/school-grade';

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
    <div
      class="flex flex-1 w-full flex-col gap-10"
      style="--mq-primary: #9B87D4; --mq-primary-strong: #7B5FBD; --mq-primary-soft: #E8E1F5; --mq-accent: #C5B5E8; --mq-outline: rgba(155, 135, 212, 0.45); --mq-ink: #2c3e50; --mq-surface: rgba(255, 255, 255, 0.95);"
    >
      <QuestNav
        currentUser={currentUser}
        questIcon="✏️"
        questHomeUrl="/kokugo"
        currentGrade={grade}
        currentStage="小学"
        availableGrades={availableGrades}
        dropdownBaseUrl={`/kokugo/dictionary/${kanji.unicode}`}
        selectUrl={`/kokugo/select?grade=${gradeParam}`}
        learnUrl={`/kokugo/learn?grade=${gradeParam}`}
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
              <a
                key={`${kanji.character}-${example.word}`}
                href={`/kokugo/vocabulary/${encodeURIComponent(
                  example.word
                )}?grade=${gradeParam}`}
                class="example-item block rounded-2xl border border-dashed border-[var(--mq-outline)] bg-[var(--mq-surface)] p-4 transition-all hover:border-[var(--mq-primary)] hover:border-solid hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
                data-reading={example.reading}
              >
                <div class="flex items-baseline gap-3">
                  <div class="text-xl font-bold text-[var(--mq-ink)] underline decoration-dashed decoration-[var(--mq-primary)] decoration-2 underline-offset-4">
                    {example.word}
                  </div>
                  <div class="text-sm text-[#5e718a]">{example.reading}</div>
                  <div class="ml-auto flex-shrink-0 text-[var(--mq-primary)] opacity-60">
                    →
                  </div>
                </div>
                <div class="mt-2 text-sm text-[#4f6076]">{example.meaning}</div>
              </a>
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
                <a
                  key={`${kanji.character}-special-${example.word}-${example.reading}`}
                  href={`/kokugo/vocabulary/${encodeURIComponent(
                    example.word
                  )}?grade=${gradeParam}`}
                  class="block rounded-2xl border border-dashed border-[var(--mq-primary)] bg-[var(--mq-surface)] p-4 transition hover:border-solid hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
                >
                  <div class="flex items-baseline gap-3">
                    <div class="text-xl font-bold text-[var(--mq-primary-strong)] underline decoration-dashed decoration-[var(--mq-primary)] decoration-2 underline-offset-4">
                      {example.word}
                    </div>
                    <div class="text-sm text-[#5e718a]">{example.reading}</div>
                    <div class="ml-auto flex-shrink-0 text-[var(--mq-primary)] opacity-60">
                      →
                    </div>
                  </div>
                  <div class="mt-2 text-sm text-[#4f6076]">
                    {example.meaning}
                  </div>
                </a>
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
            href={`/kokugo/dictionary?grade=${gradeParam}`}
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
