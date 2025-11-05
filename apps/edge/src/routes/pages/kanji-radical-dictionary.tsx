import type { Kanji, KanjiGrade } from '@edu-quest/domain';
import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { DictionaryLink } from '../components/dictionary-link';
import {
  createSchoolGradeParam,
  formatSchoolGradeLabel,
} from '../utils/school-grade';

export type RadicalKanjiSummary = {
  character: string;
  unicode: string;
  grade: KanjiGrade;
  meanings: string[];
};

export type KanjiRadicalDictionaryEntry = {
  radical: string;
  grades: KanjiGrade[];
  kanji: RadicalKanjiSummary[];
};

export type KanjiRadicalSearchIndexEntry = {
  radical: string;
  grades: KanjiGrade[];
  idx: string;
};

export const buildKanjiRadicalDictionary = (
  kanjiList: Kanji[]
): {
  entries: KanjiRadicalDictionaryEntry[];
  searchIndex: KanjiRadicalSearchIndexEntry[];
} => {
  const radicalMap = new Map<
    string,
    {
      radical: string;
      grades: Set<KanjiGrade>;
      kanji: Map<string, RadicalKanjiSummary>;
    }
  >();

  for (const kanji of kanjiList) {
    const grade = kanji.grade as KanjiGrade;
    for (const radical of kanji.radicals) {
      if (!radicalMap.has(radical)) {
        radicalMap.set(radical, {
          radical,
          grades: new Set<KanjiGrade>(),
          kanji: new Map<string, RadicalKanjiSummary>(),
        });
      }

      const entry = radicalMap.get(radical)!;
      entry.grades.add(grade);
      if (!entry.kanji.has(kanji.unicode)) {
        entry.kanji.set(kanji.unicode, {
          character: kanji.character,
          unicode: kanji.unicode,
          grade,
          meanings: [...kanji.meanings],
        });
      }
    }
  }

  const entries: KanjiRadicalDictionaryEntry[] = Array.from(radicalMap.values())
    .map((entry) => ({
      radical: entry.radical,
      grades: Array.from(entry.grades).sort((a, b) => a - b),
      kanji: Array.from(entry.kanji.values()).sort((a, b) => {
        if (a.grade === b.grade) {
          return a.character.localeCompare(b.character, 'ja');
        }
        return a.grade - b.grade;
      }),
    }))
    .sort((a, b) => a.radical.localeCompare(b.radical, 'ja'));

  const searchIndex: KanjiRadicalSearchIndexEntry[] = entries.map((entry) => {
    const tokens = [
      entry.radical,
      ...entry.kanji.flatMap((kanji) => [kanji.character, ...kanji.meanings]),
    ];

    return {
      radical: entry.radical,
      grades: entry.grades,
      idx: tokens.join(' ').toLowerCase(),
    };
  });

  return { entries, searchIndex };
};

const KanjiRadicalDictionaryNav: FC<{
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
        {gradeLabel} 部首辞書
      </span>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <DictionaryLink gradeParam={gradeParam} active="radical" />
      <a
        href={`/kanji/learn?grade=${encodeURIComponent(gradeParam)}`}
        class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
      >
        ← 学習方法に戻る
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

type KanjiRadicalDictionaryProps = {
  currentUser: CurrentUser | null;
  grade: KanjiGrade;
  entries: KanjiRadicalDictionaryEntry[];
  searchIndex: KanjiRadicalSearchIndexEntry[];
};

export const KanjiRadicalDictionary: FC<KanjiRadicalDictionaryProps> = ({
  currentUser,
  grade,
  entries,
  searchIndex,
}) => {
  const gradeLabel = formatSchoolGradeLabel({ stage: '小学', grade });
  const gradeParam = createSchoolGradeParam({ stage: '小学', grade });
  const totalCount = entries.length;
  const searchDataJson = JSON.stringify(searchIndex);
  const availableGrades = Array.from(
    new Set<KanjiGrade>([...entries.flatMap((entry) => entry.grades), grade])
  )
    .filter((value): value is KanjiGrade => value >= 1 && value <= 6)
    .sort((a, b) => a - b);

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      style="--mq-primary: #9B87D4; --mq-primary-strong: #7B5FBD; --mq-primary-soft: #E8E1F5; --mq-accent: #C5B5E8; --mq-outline: rgba(155, 135, 212, 0.45); --mq-ink: #2c3e50; --mq-surface: rgba(255, 255, 255, 0.95);"
    >
      <KanjiRadicalDictionaryNav
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
              <h1 class="text-3xl font-extrabold sm:text-4xl">部首辞書</h1>
              <p class="mt-2 max-w-2xl text-sm text-[#4f6076]">
                漢字を構成する部首ごとに、関連する漢字を一覧できます。読みに迷ったときや漢字の成り立ちを確認したいときに活用しましょう。
              </p>
            </div>
            <div class="rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mq-primary-strong)] shadow-sm">
              全{totalCount}件掲載
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            {availableGrades.map((g) => {
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
                検索（部首・漢字・意味から探せます）
              </span>
              <input
                type="search"
                id="radical-search"
                placeholder="例：さんずい、氵、水"
                class="w-full rounded-2xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-3 text-sm text-[var(--mq-ink)] shadow-inner focus:border-[var(--mq-primary)] focus:outline-none"
              />
            </label>
            <p class="text-xs text-[#5e718a]" id="radical-result-count">
              全{totalCount}件を表示しています
            </p>
          </div>
        </section>

        <div
          id="radical-no-results"
          class="rounded-3xl border border-dashed border-[var(--mq-outline)] bg-white p-12 text-center text-sm text-[#5e718a]"
          style="display: none;"
        >
          該当する部首が見つかりませんでした。別のキーワードを試してみましょう。
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => {
            return (
              <div
                key={entry.radical}
                class="radical-card flex flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm transition"
                data-radical={entry.radical}
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--mq-primary-soft)] text-3xl font-bold text-[var(--mq-ink)]">
                      {entry.radical}
                    </span>
                    <div class="text-sm text-[#5e718a]">
                      <div>掲載漢字: {entry.kanji.length}字</div>
                      <div>
                        対応学年: {entry.grades.map((g) => `小${g}`).join('・')}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-wrap gap-2">
                  {entry.kanji.slice(0, 12).map((kanji) => {
                    const kanjiGradeParam = createSchoolGradeParam({
                      stage: '小学',
                      grade: kanji.grade,
                    });
                    return (
                      <a
                        key={kanji.unicode}
                        href={`/kanji/dictionary/${kanji.unicode}?grade=${kanjiGradeParam}`}
                        class="inline-flex items-center rounded-xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-3 py-2 text-sm font-semibold text-[var(--mq-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)]"
                      >
                        {kanji.character}
                      </a>
                    );
                  })}
                  {entry.kanji.length > 12 ? (
                    <span class="inline-flex items-center rounded-xl border border-dashed border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[#5e718a]">
                      ほか{entry.kanji.length - 12}字
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const searchData = ${searchDataJson};
                const searchInput = document.getElementById('radical-search');
                const cards = Array.from(document.querySelectorAll('.radical-card'));
                const resultCount = document.getElementById('radical-result-count');
                const noResults = document.getElementById('radical-no-results');
                const gradeFilters = Array.from(document.querySelectorAll('.grade-filter'));
                const selectedGrades = new Set([${grade}]);
                const activeClasses = ['border-[var(--mq-primary)]', 'bg-[var(--mq-primary-soft)]', 'text-[var(--mq-primary-strong)]'];
                const inactiveClasses = ['border-[var(--mq-outline)]', 'bg-white', 'text-[var(--mq-ink)]', 'hover:-translate-y-0.5', 'hover:bg-[var(--mq-surface)]'];

                if (!searchInput || cards.length === 0 || !resultCount || !noResults) {
                  return;
                }

                const setButtonState = (button, isActive) => {
                  if (!(button instanceof HTMLElement)) {
                    return;
                  }
                  button.classList.remove(...(isActive ? inactiveClasses : activeClasses));
                  button.classList.add(...(isActive ? activeClasses : inactiveClasses));
                  button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
                };

                const updateFilters = () => {
                  const query = searchInput.value.trim().toLowerCase();
                  let filteredEntries = searchData;

                  if (selectedGrades.size > 0) {
                    filteredEntries = filteredEntries.filter((entry) =>
                      entry.grades.some((grade) => selectedGrades.has(grade))
                    );
                  }

                  if (query) {
                    filteredEntries = filteredEntries.filter((entry) =>
                      entry.idx.includes(query)
                    );
                  }

                  const matchingRadicals = new Set(filteredEntries.map((entry) => entry.radical));
                  let visibleCount = 0;

                  cards.forEach((card) => {
                    const radical = card.dataset.radical ?? '';
                    if (matchingRadicals.has(radical)) {
                      card.style.display = 'flex';
                      visibleCount += 1;
                    } else {
                      card.style.display = 'none';
                    }
                  });

                  if (visibleCount === 0) {
                    noResults.style.display = 'block';
                    if (query) {
                      resultCount.textContent = '「' + query + '」に一致する部首が見つかりませんでした';
                    } else if (selectedGrades.size > 0) {
                      resultCount.textContent = '選択した学年に該当する部首が見つかりませんでした';
                    } else {
                      resultCount.textContent = '該当する部首が見つかりませんでした';
                    }
                  } else {
                    noResults.style.display = 'none';
                    if (query) {
                      resultCount.textContent = '「' + query + '」に一致する部首 ' + visibleCount + '件を表示しています';
                    } else if (selectedGrades.size === 0) {
                      resultCount.textContent = '全' + visibleCount + '件を表示しています';
                    } else {
                      resultCount.textContent = '選択した学年の部首 ' + visibleCount + '件を表示しています';
                    }
                  }
                };

                gradeFilters.forEach((button) => {
                  const gradeValue = Number.parseInt(button.dataset.grade ?? '', 10);
                  if (!Number.isNaN(gradeValue) && gradeValue === ${grade}) {
                    setButtonState(button, true);
                  }

                  button.addEventListener('click', () => {
                    const parsed = Number.parseInt(button.dataset.grade ?? '', 10);
                    if (Number.isNaN(parsed)) {
                      return;
                    }

                    if (selectedGrades.has(parsed)) {
                      selectedGrades.delete(parsed);
                      setButtonState(button, false);
                    } else {
                      selectedGrades.add(parsed);
                      setButtonState(button, true);
                    }

                    updateFilters();
                  });
                });

                searchInput.addEventListener('input', updateFilters);

                updateFilters();
              })();
            `,
          }}
        />
      </div>
      <Footer />
    </div>
  );
};
