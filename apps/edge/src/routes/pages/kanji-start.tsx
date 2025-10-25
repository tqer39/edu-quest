import type { FC } from 'hono/jsx';
import { html } from 'hono/html';
import type { CurrentUser } from '../../application/session/current-user';
import {
  kanjiGrades,
  kanjiQuestionTypes,
  getKanjiGradeTypeMap,
} from '../../application/usecases/kanji-quiz';
import { renderKanjiStartClientScript } from './kanji-start.client';

const questionCountOptions = [5, 10, 15] as const;

export const KanjiStart: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser,
}) => (
  <div
    id="kanji-start-root"
    class="flex min-h-screen w-full flex-col gap-8 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
    style="--mq-primary: #9B7EC8; --mq-primary-strong: #7B5DB8; --mq-primary-soft: #E5DDF5; --mq-accent: #C4B5E8; --mq-outline: rgba(155, 126, 200, 0.45);"
    data-user-state={currentUser ? 'known' : 'anonymous'}
  >
    {html`
      <style>
        .selection-card--selected {
          background: var(--mq-primary-soft) !important;
          border-color: var(--mq-primary) !important;
          box-shadow: 0 12px 28px rgba(80, 54, 120, 0.18);
        }
        .kanji-option--disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
      </style>
    `}

    <nav class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-6 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--mq-primary-soft)] text-base font-bold text-[var(--mq-primary-strong)]">
          📝
        </span>
        <span class="text-lg font-semibold tracking-tight text-[var(--mq-ink)]">
          KanjiQuest れんしゅうじゅんび
        </span>
      </div>
      <a
        href="/kanji"
        class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)]"
      >
        ← もどる
      </a>
    </nav>

    <div class="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section class="space-y-6">
        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[#6c7c90]">
            STEP 1
          </p>
          <h2 class="text-2xl font-extrabold text-[var(--mq-ink)]">学年をえらぼう</h2>
          <p class="text-sm text-[#5e718a]">出題する漢字のレベルが変わるよ。</p>
        </div>
        <div class="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {kanjiGrades.map((grade) => (
            <button
              key={grade.id}
              type="button"
              data-grade-id={grade.id}
              class="grade-card rounded-2xl border-2 border-transparent bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--mq-primary)]"
            >
              <p class="text-sm font-bold text-[var(--mq-primary-strong)]">{grade.label}</p>
              <p class="text-xs font-semibold text-[var(--mq-ink)]">{grade.description}</p>
            </button>
          ))}
        </div>
      </section>

      <aside class="space-y-4 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] p-6 shadow-lg">
        <h3 class="text-lg font-semibold text-[var(--mq-ink)]">今日のミッション</h3>
        <p class="text-sm text-[#5e718a]">
          学年と出題形式を選ぶと、漢字の読み当てや穴あき問題に挑戦できます。選んだ設定は次回もつづきから始められるよ。
        </p>
        <div class="space-y-2 text-sm text-[#5e718a]">
          <p>・読み当てクイズは1つだけ選ぶものと、すべて選ぶものの2種類</p>
          <p>・ことば・文章の穴あきは正しい漢字を選ぶよ</p>
        </div>
      </aside>
    </div>

    <section class="space-y-6 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] p-6 shadow-lg">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[#6c7c90]">
          STEP 2
        </p>
        <h2 class="text-2xl font-extrabold text-[var(--mq-ink)]">出題形式をえらぼう</h2>
        <p id="kanji-type-hint" class="text-sm text-[#5e718a]">
          先に学年を選ぶと出題形式が表示されます。
        </p>
      </div>
      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {kanjiQuestionTypes.map((item) => (
          <button
            key={item.id}
            type="button"
            data-type-id={item.id}
            class="kanji-type-card flex flex-col gap-2 rounded-2xl border-2 border-transparent bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--mq-primary)]"
          >
            <span class="text-sm font-bold text-[var(--mq-primary-strong)]">{item.label}</span>
            <span class="text-xs font-semibold text-[#5e718a]">{item.description}</span>
          </button>
        ))}
      </div>
    </section>

    <section class="space-y-6 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] p-6 shadow-lg">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[#6c7c90]">
          STEP 3
        </p>
        <h2 class="text-2xl font-extrabold text-[var(--mq-ink)]">問題数をきめよう</h2>
        <p class="text-sm text-[#5e718a]">集中できる回数を選んでね。</p>
      </div>
      <fieldset class="grid gap-3 sm:grid-cols-3">
        <legend class="sr-only">問題数</legend>
        {questionCountOptions.map((count) => (
          <label
            key={count}
            class="flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-transparent bg-white px-4 py-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--mq-primary)]"
          >
            <input
              type="radio"
              name="kanji-question-count"
              value={count}
              class="sr-only"
              checked={count === questionCountOptions[0]}
            />
            <span class="text-lg font-semibold text-[var(--mq-primary-strong)]">{count}問</span>
            <span class="text-xs font-semibold text-[#5e718a]">
              {count === 5 ? 'おためし' : count === 10 ? 'ふつう' : 'たっぷり'}
            </span>
          </label>
        ))}
      </fieldset>
    </section>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        id="kanji-reset-button"
        type="button"
        class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)]"
      >
        リセット
      </button>
      <button
        id="kanji-start-button"
        type="button"
        class="inline-flex items-center justify-center rounded-2xl bg-[var(--mq-primary)] px-6 py-3 text-lg font-semibold text-[var(--mq-ink)] shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-strong)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled
      >
        クイズをはじめる
      </button>
    </div>

    {renderKanjiStartClientScript(
      kanjiGrades,
      kanjiQuestionTypes,
      getKanjiGradeTypeMap(),
      questionCountOptions,
    )}
  </div>
);
