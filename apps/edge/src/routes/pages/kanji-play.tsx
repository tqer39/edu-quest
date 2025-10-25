import type { FC } from 'hono/jsx';
import { html } from 'hono/html';
import type { CurrentUser } from '../../application/session/current-user';
import { kanjiQuestionTypes } from '../../application/usecases/kanji-quiz';
import { renderKanjiPlayClientScript } from './kanji-play.client';

export const KanjiPlay: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser,
}) => (
  <div
    id="kanji-play-root"
    class="flex min-h-screen flex-col bg-[var(--mq-surface-strong)] text-[var(--mq-ink)]"
    style="--mq-primary: #9B7EC8; --mq-primary-strong: #7B5DB8; --mq-primary-soft: #E5DDF5; --mq-accent: #C4B5E8; --mq-outline: rgba(155, 126, 200, 0.45);"
    data-user-state={currentUser ? 'known' : 'anonymous'}
  >
    {html`
      <style>
        .kanji-choice {
          transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
        }
        .kanji-choice[data-selected='true'] {
          background: var(--mq-primary-soft);
          border-color: var(--mq-primary);
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(55, 35, 95, 0.18);
        }
        .kanji-choice[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .kanji-feedback[data-state='success'] {
          color: #166534;
        }
        .kanji-feedback[data-state='error'] {
          color: #b91c1c;
        }
        .kanji-feedback[data-state='info'] {
          color: #4338ca;
        }
      </style>
    `}

    <nav class="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-4 shadow-sm sm:px-8 lg:px-16 xl:px-24">
      <div class="flex flex-col">
        <span class="text-xs font-semibold uppercase tracking-[0.3em] text-[#6c7c90]">KANJI PLAY</span>
        <span id="kanji-play-grade" class="text-lg font-semibold">学年未設定</span>
        <span id="kanji-selected-types" class="text-sm text-[#5e718a]"></span>
      </div>
      <a
        id="kanji-exit-button"
        href="/kanji"
        class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)]"
      >
        やめる
      </a>
    </nav>

    <main class="grid flex-1 gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:px-16 xl:px-24">
      <section class="flex flex-col gap-6">
        <div class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-4 text-sm font-semibold text-[var(--mq-primary-strong)]">
            <span>
              Q <span id="kanji-progress-current">0</span>/<span id="kanji-progress-total">0</span>
            </span>
            <span>
              正解 <span id="kanji-score-correct">0</span>
            </span>
          </div>
          <div class="text-xs text-[#5e718a]">
            <span id="kanji-progress-message">漢字クイズに挑戦しよう！</span>
          </div>
        </div>

        <div class="space-y-4 rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-lg">
          <div class="space-y-2">
            <p id="kanji-question-prompt" class="text-sm font-semibold text-[#5e718a]">
              クイズを読み込み中…
            </p>
            <div class="flex flex-col items-center gap-3 text-center">
              <span id="kanji-question-main" class="min-h-[3rem] text-5xl font-extrabold tracking-[0.3em]"></span>
              <p id="kanji-question-word" class="hidden text-lg font-semibold"></p>
              <p id="kanji-question-word-kana" class="hidden text-sm text-[#5e718a]"></p>
              <p id="kanji-question-sentence" class="hidden text-base font-semibold"></p>
              <p id="kanji-question-sentence-kana" class="hidden text-sm text-[#5e718a]"></p>
              <p id="kanji-question-note" class="hidden text-xs font-semibold text-[#7b5db8]"></p>
            </div>
          </div>

          <div
            id="kanji-choice-list"
            class="grid gap-3 sm:grid-cols-2"
          ></div>

          <div
            id="kanji-feedback"
            class="kanji-feedback min-h-[1.5rem] text-center text-sm font-semibold"
            data-state="info"
          ></div>

          <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              id="kanji-submit-button"
              type="button"
              class="inline-flex items-center justify-center rounded-2xl bg-[var(--mq-primary)] px-5 py-3 text-lg font-semibold text-[var(--mq-ink)] shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-strong)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled
            >
              こたえる
            </button>
            <button
              id="kanji-next-button"
              type="button"
              class="hidden inline-flex items-center justify-center rounded-2xl border border-[var(--mq-outline)] bg-white px-5 py-3 text-lg font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)]"
            >
              つぎのもんだい
            </button>
          </div>

          <div class="space-y-2">
            <p class="text-xs font-semibold text-[#5e718a]">せいかい</p>
            <div id="kanji-correct-answers" class="rounded-2xl bg-[var(--mq-surface)] px-4 py-3 text-sm font-semibold text-[var(--mq-primary-strong)]"></div>
            <p id="kanji-explanation" class="text-xs text-[#5e718a]"></p>
          </div>
        </div>
      </section>

      <aside class="flex flex-col gap-6">
        <div class="space-y-3 rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-[var(--mq-ink)]">セッション記録</h3>
          <p class="text-sm text-[#5e718a]">
            進捗はブラウザに保存されます。クイズを続けて挑戦すると、連続正解もカウントされるよ。
          </p>
          <div class="rounded-2xl bg-[var(--mq-primary-soft)] px-4 py-3 text-sm text-[var(--mq-primary-strong)]">
            <p>今日の正解数: <span id="kanji-today-correct">0</span></p>
            <p>最後に解いた日: <span id="kanji-last-played">-</span></p>
          </div>
        </div>

        <div
          id="kanji-result-panel"
          class="hidden space-y-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] p-6 text-center shadow-lg"
        >
          <h3 class="text-lg font-semibold text-[var(--mq-primary-strong)]">おつかれさま！</h3>
          <p class="text-sm text-[#5e718a]">
            <span id="kanji-result-message"></span>
          </p>
          <div class="flex flex-col gap-2">
            <a
              href="/kanji/start"
              class="inline-flex items-center justify-center rounded-2xl bg-[var(--mq-primary)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-strong)]"
            >
              もう一度設定する
            </a>
            <button
              id="kanji-retry-button"
              type="button"
              class="inline-flex items-center justify-center rounded-2xl border border-[var(--mq-outline)] bg-white px-5 py-2 text-sm font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)]"
            >
              もう一度プレイ
            </button>
          </div>
        </div>
      </aside>
    </main>

    {renderKanjiPlayClientScript(kanjiQuestionTypes)}
  </div>
);
