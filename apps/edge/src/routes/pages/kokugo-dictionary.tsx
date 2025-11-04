import type { Kanji, KanjiGrade, KanjiIndexEntry } from '@edu-quest/domain';
import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { DictionaryLink } from '../components/dictionary-link';
import {
  createSchoolGradeParam,
  formatSchoolGradeLabel,
} from '../utils/school-grade';

const KanjiDictionaryNav: FC<{
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
      <a href="/kokugo" class="transition hover:opacity-80">
        <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
          ✏️
        </span>
      </a>
      <span class="text-xs font-semibold text-[var(--mq-ink)]">
        {gradeLabel} 辞書
      </span>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <DictionaryLink current href={`/kokugo/dictionary?grade=${gradeParam}`} />
      <a
        href={`/kokugo/select?grade=${gradeParam}`}
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

type KanjiSearchIndexEntry = {
  char: string;
  id?: string;
  idx: string;
  grade: KanjiGrade;
};

type KanjiDictionaryProps = {
  currentUser: CurrentUser | null;
  grade: KanjiGrade;
  entries: KanjiIndexEntry[];
  searchIndex: KanjiSearchIndexEntry[];
};

const buildSearchIndex = (kanji: Kanji): string => {
  // 音読みをカタカナと平仮名の両方で検索できるようにする
  const onyomiHiragana = kanji.readings.onyomi.map((reading) =>
    reading.replace(/[\u30A1-\u30F6]/g, (match) =>
      String.fromCharCode(match.charCodeAt(0) - 0x60)
    )
  );

  // 訓読みをカタカナと平仮名の両方で検索できるようにする
  const kunyomiKatakana = kanji.readings.kunyomi.map((reading) =>
    reading.replace(/[\u3041-\u3096]/g, (match) =>
      String.fromCharCode(match.charCodeAt(0) + 0x60)
    )
  );

  const base = [
    kanji.character,
    kanji.strokeCount.toString(),
    ...kanji.readings.onyomi,
    ...onyomiHiragana,
    ...kanji.readings.kunyomi,
    ...kunyomiKatakana,
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

export const createKanjiSearchIndexEntry = (
  kanji: Kanji
): KanjiSearchIndexEntry => ({
  char: kanji.character,
  id: kanji.unicode,
  idx: buildSearchIndex(kanji),
  grade: kanji.grade as KanjiGrade,
});

export const KanjiDictionary: FC<KanjiDictionaryProps> = ({
  currentUser,
  grade,
  entries,
  searchIndex,
}) => {
  const gradeLabel = formatSchoolGradeLabel({ stage: '小学', grade });
  const gradeParam = createSchoolGradeParam({ stage: '小学', grade });
  const totalCount = entries.length;

  // Prepare search data for client-side filtering
  const searchDataJson = JSON.stringify(searchIndex);

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      style="--mq-primary: #9B87D4; --mq-primary-strong: #7B5FBD; --mq-primary-soft: #E8E1F5; --mq-accent: #C5B5E8; --mq-outline: rgba(155, 135, 212, 0.45); --mq-ink: #2c3e50; --mq-surface: rgba(255, 255, 255, 0.95);"
    >
      <KanjiDictionaryNav
        currentUser={currentUser}
        gradeLabel={gradeLabel}
        gradeParam={gradeParam}
      />
      <div class="flex flex-1 flex-col gap-8 px-4 pb-16 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-10 text-[var(--mq-ink)] shadow-xl">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-[var(--mq-primary-strong)]">
                {gradeLabel}向け
              </p>
              <h1 class="text-3xl font-extrabold sm:text-4xl">漢字辞書</h1>
              <p class="mt-2 max-w-2xl text-sm text-[#4f6076]">
                教育漢字の読み方・意味・例をいつでも確認できます。クエストの途中でも辞書を開いて復習しましょう。
              </p>
            </div>
            <div class="rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mq-primary-strong)] shadow-sm">
              全{totalCount}字掲載
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            {([1, 2, 3, 4, 5, 6] as KanjiGrade[]).map((g) => {
              const isActive = g === grade;
              return (
                <button
                  key={g}
                  type="button"
                  class={`grade-filter inline-flex items-center rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'border-[var(--mq-primary)] bg-[var(--mq-primary-soft)] text-[var(--mq-primary-strong)]'
                      : 'border-[var(--mq-outline)] bg-white text-[var(--mq-ink)] hover:-translate-y-0.5 hover:bg-[var(--mq-surface)]'
                  }`}
                  data-grade={g}
                  aria-pressed={isActive ? 'true' : 'false'}
                >
                  小学{g}年生
                </button>
              );
            })}
          </div>
        </header>

        <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-4">
            <label class="flex-1">
              <span class="mb-2 block text-xs font-semibold text-[#5e718a]">
                検索（漢字・読み・意味・例から探せます）
              </span>
              <input
                type="search"
                id="kanji-search"
                placeholder="例：学、がく、まなぶ"
                class="w-full rounded-2xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-3 text-sm text-[var(--mq-ink)] shadow-inner focus:border-[var(--mq-primary)] focus:outline-none"
              />
            </label>
            <p class="text-xs text-[#5e718a]" id="result-count">
              全{totalCount}字を表示しています
            </p>
          </div>
        </section>

        <div
          id="no-results"
          class="rounded-3xl border border-dashed border-[var(--mq-outline)] bg-white p-12 text-center text-sm text-[#5e718a]"
          style="display: none;"
        >
          該当する漢字が見つかりませんでした。別のキーワードを試してみましょう。
        </div>

        <div
          id="kanji-grid"
          style="display: grid; grid-template-columns: repeat(10, 1fr); overflow: hidden; border-radius: 1.5rem; border: 3px solid var(--mq-outline); box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);"
        >
          {entries.map((kanji) => {
            const kanjiId = kanji.unicode;
            return (
              <a
                key={kanji.character}
                href={`/kokugo/dictionary/${kanjiId}?grade=${gradeParam}`}
                class="kanji-item"
                style="display: flex; align-items: center; justify-content: center; aspect-ratio: 1; border-right: 1px solid var(--mq-outline); border-bottom: 1px solid var(--mq-outline); font-size: 2rem; font-weight: bold; color: var(--mq-ink); transition: all 0.2s; background-color: white; cursor: pointer;"
                onmouseover="this.style.backgroundColor='var(--mq-primary-soft)'"
                onmouseout="this.style.backgroundColor='white'"
                data-char={kanji.character}
              >
                {kanji.character}
              </a>
            );
          })}
        </div>

        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: `
              const searchData = ${searchDataJson};
              const searchInput = document.getElementById('kanji-search');
              const kanjiGrid = document.getElementById('kanji-grid');
              const resultCount = document.getElementById('result-count');
              const noResults = document.getElementById('no-results');
              const totalCount = ${totalCount};
              const gradeFilters = document.querySelectorAll('.grade-filter');

              // Track selected grades (initially just the current grade)
              const selectedGrades = new Set([${grade}]);

              // Update filter display
              function updateFilters() {
                const searchQuery = searchInput.value.trim().toLowerCase();

                // Filter by selected grades
                let filtered = searchData;
                if (selectedGrades.size > 0) {
                  filtered = searchData.filter(k => selectedGrades.has(k.grade));
                }

                // Filter by search query
                if (searchQuery) {
                  filtered = filtered.filter(k => k.idx.includes(searchQuery));
                }

                const matchChars = new Set(filtered.map(m => m.char));

                let visibleCount = 0;
                document.querySelectorAll('.kanji-item').forEach(item => {
                  const char = item.dataset.char;
                  if (matchChars.has(char)) {
                    item.style.display = 'flex';
                    visibleCount++;
                  } else {
                    item.style.display = 'none';
                  }
                });

                // Update result count message
                if (visibleCount === 0) {
                  noResults.style.display = 'block';
                  if (searchQuery) {
                    resultCount.textContent = \`「\${searchQuery}」に一致する漢字が見つかりませんでした\`;
                  } else {
                    resultCount.textContent = \`選択した学年の漢字が見つかりませんでした\`;
                  }
                } else {
                  noResults.style.display = 'none';
                  const totalFiltered = filtered.length;
                  if (searchQuery) {
                    resultCount.textContent = \`「\${searchQuery}」に一致する漢字 \${visibleCount} / \${totalFiltered} 字\`;
                  } else {
                    resultCount.textContent = \`全\${visibleCount}字を表示しています\`;
                  }
                }
              }

              // Grade filter click handlers
              gradeFilters.forEach(button => {
                button.addEventListener('click', () => {
                  const grade = parseInt(button.dataset.grade);

                  if (selectedGrades.has(grade)) {
                    selectedGrades.delete(grade);
                    button.classList.remove('border-[var(--mq-primary)]', 'bg-[var(--mq-primary-soft)]', 'text-[var(--mq-primary-strong)]');
                    button.classList.add('border-[var(--mq-outline)]', 'bg-white', 'text-[var(--mq-ink)]');
                    button.setAttribute('aria-pressed', 'false');
                  } else {
                    selectedGrades.add(grade);
                    button.classList.add('border-[var(--mq-primary)]', 'bg-[var(--mq-primary-soft)]', 'text-[var(--mq-primary-strong)]');
                    button.classList.remove('border-[var(--mq-outline)]', 'bg-white', 'text-[var(--mq-ink)]');
                    button.setAttribute('aria-pressed', 'true');
                  }

                  updateFilters();
                });
              });

              // Search input handler
              searchInput.addEventListener('input', () => {
                updateFilters();
              });
            `,
          }}
        />
      </div>
      <Footer />
    </div>
  );
};
