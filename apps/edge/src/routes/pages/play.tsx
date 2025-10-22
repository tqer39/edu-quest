import type { FC } from 'hono/jsx';
import { html } from 'hono/html';
import type { CurrentUser } from '../../application/session/current-user';
import { renderPlayClientScript } from './play.client';
import { gradePresets } from './grade-presets';

export const Play: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser,
}) => (
  <div
    id="play-root"
    class="relative flex min-h-screen flex-col overflow-hidden bg-[var(--mq-surface-strong)] text-[var(--mq-ink)]"
    data-user-state={currentUser ? 'known' : 'anonymous'}
    style="min-height: 100svh;"
  >
    {html`
      <style>
        .setting-toggle--on,
        .setting-toggle[data-state='on'] {
          background: var(--mq-primary-soft) !important;
          border-color: var(--mq-primary) !important;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
          transform: translateY(-1px);
        }

        .setting-toggle--on span:first-child,
        .setting-toggle[data-state='on'] span:first-child {
          color: var(--mq-primary-strong) !important;
        }

        .keypad-button {
          transition:
            transform 0.18s ease,
            background-color 0.18s ease,
            color 0.18s ease,
            opacity 0.18s ease;
        }

        .keypad-button--disabled,
        .keypad-button[aria-disabled='true'] {
          background: rgba(148, 163, 184, 0.25) !important;
          color: rgba(100, 116, 139, 0.7) !important;
          border-color: rgba(148, 163, 184, 0.35) !important;
          box-shadow: none !important;
          transform: none !important;
          pointer-events: none;
          cursor: default;
          opacity: 0.65;
        }
      </style>
    `}
    <nav class="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-4 shadow-sm sm:px-8 lg:px-16 xl:px-24">
      <div class="flex flex-col">
        <span class="text-xs font-semibold uppercase tracking-[0.3em] text-[#6c7c90]">
          PLAY MODE
        </span>
        <span id="play-grade-label" class="text-lg font-semibold">
          {gradePresets[0].label}
        </span>
        <span id="play-context-label" class="text-sm text-[#5e718a]"></span>
      </div>
      <button
        id="endBtn"
        type="button"
        class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
      >
        やめる
      </button>
    </nav>

    {/* カウントダウンオーバーレイ */}
    <div
      id="countdown-overlay"
      class="hidden fixed inset-0 z-50 flex items-center justify-center bg-[var(--mq-surface-strong)] bg-opacity-95"
    >
      <div
        id="countdown-number"
        class="text-9xl font-extrabold text-[var(--mq-primary-strong)] animate-pulse"
      >
        3
      </div>
    </div>

    <main class="flex flex-1 flex-col overflow-hidden px-4 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-6 lg:px-16 xl:px-24">
      <div class="grid h-full flex-1 grid-rows-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-4 sm:gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-rows-none lg:gap-6 xl:gap-8">
        <section class="flex min-h-0 flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] p-4 shadow-lg sm:p-6">
          <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--mq-primary-soft)] px-4 py-3">
            <div class="flex items-center gap-4 text-sm font-semibold text-[var(--mq-primary-strong)]">
              <span>
                Q <span id="qIndex">0</span>/<span id="qTotal">0</span>
              </span>
              <span>
                正解 <span id="correct">0</span>
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button
                id="toggle-sound"
                type="button"
                data-state="on"
                class="setting-toggle inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)]"
              >
                <span>🔊 効果音</span>
              </button>
              <button
                id="toggle-steps"
                type="button"
                data-state="on"
                class="setting-toggle inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)]"
              >
                <span>🧮 途中式</span>
              </button>
            </div>
          </div>

          <div class="flex min-h-0 flex-1 flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-white p-4 shadow-sm sm:p-6">
            <p class="text-sm font-semibold text-[#5e718a]">もんだい</p>
            <div
              id="question"
              class="flex flex-1 items-center justify-center text-center text-4xl font-extrabold tracking-[0.25em] sm:text-5xl sm:tracking-[0.35em]"
            >
              ？ + ？
            </div>
            <div class="mt-auto flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <label class="sr-only" htmlFor="answer">
                答え
              </label>
              <input
                id="answer"
                type="text"
                inputMode="numeric"
                class="w-full max-w-xs rounded-2xl border border-[var(--mq-outline)] px-4 py-3 text-center text-2xl font-semibold shadow-sm focus:border-[var(--mq-primary)] focus:outline-none"
              />
              <button
                id="submitBtn"
                type="button"
                class="inline-flex items-center justify-center rounded-2xl bg-[var(--mq-primary)] px-5 py-3 text-lg font-semibold text-[var(--mq-ink)] shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-strong)] hover:text-white"
              >
                こたえる
              </button>
            </div>
            <div
              id="feedback"
              class="flex min-h-[48px] items-center justify-center rounded-2xl text-center text-sm font-semibold text-[var(--mq-primary-strong)]"
            ></div>
            <div class="flex justify-center">
              <button
                id="skipBtn"
                type="button"
                class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-secondary)]"
              >
                スキップ
              </button>
            </div>
            <div
              id="working-container"
              class="rounded-2xl border border-[var(--mq-outline)] bg-white/80 p-4 text-[var(--mq-ink)] shadow-sm sm:p-5"
            >
              <p class="text-sm font-semibold text-[#5e718a]">途中式</p>
              <p
                id="working-empty"
                class="mt-3 rounded-2xl bg-white/60 px-4 py-3 text-center text-xs font-medium text-[#6c7c90]"
              >
                こたえを送信すると、計算の流れがここに出るよ。
              </p>
              <div id="working-steps" class="mt-3 max-h-32 overflow-y-auto text-sm"></div>
            </div>
          </div>
        </section>

        <aside class="flex min-h-0 flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] p-4 shadow-lg sm:p-6">
          <div class="rounded-3xl border border-[var(--mq-outline)] bg-white p-4 text-center shadow-sm sm:p-6">
            <p class="text-sm font-semibold text-[#5e718a]">あなたのこたえ</p>
            <p
              id="answer-display"
              class="mt-2 text-center text-4xl font-extrabold tracking-[0.25em] text-[var(--mq-ink)] sm:text-5xl sm:tracking-[0.35em]"
            >
              ？
            </p>
          </div>
          <div class="flex min-h-0 flex-1 flex-col rounded-3xl border border-[var(--mq-outline)] bg-white p-4 shadow-sm sm:p-6">
            <p class="text-sm font-semibold text-[#5e718a]">テンキー</p>
            <div class="mt-3 grid flex-1 grid-cols-4 gap-2 sm:gap-3">
              {[7, 8, 9].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  class="keypad-button h-full rounded-2xl bg-[var(--mq-surface-strong)] px-3 py-4 text-2xl font-extrabold text-[var(--mq-ink)] shadow transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)] sm:px-4 sm:py-5"
                  data-key={digit}
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                class="keypad-button h-full rounded-2xl border border-red-200 bg-red-50 px-3 py-4 text-xl font-extrabold text-red-600 shadow transition hover:-translate-y-0.5 hover:bg-red-100 sm:px-4 sm:py-5"
                data-key="backspace"
                title="1文字削除"
              >
                ⌫
              </button>
              {[4, 5, 6].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  class="keypad-button h-full rounded-2xl bg-[var(--mq-surface-strong)] px-3 py-4 text-2xl font-extrabold text-[var(--mq-ink)] shadow transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)] sm:px-4 sm:py-5"
                  data-key={digit}
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                class="keypad-button h-full rounded-2xl bg-[var(--mq-surface-strong)] px-3 py-4 text-xl font-semibold text-[var(--mq-ink)] shadow transition hover:-translate-y-0.5 hover:bg-[var(--mq-secondary)] sm:px-4 sm:py-5"
                data-key="plusminus"
                title="符号を変更"
              >
                +/−
              </button>
              {[1, 2, 3].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  class="keypad-button h-full rounded-2xl bg-[var(--mq-surface-strong)] px-3 py-4 text-2xl font-extrabold text-[var(--mq-ink)] shadow transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)] sm:px-4 sm:py-5"
                  data-key={digit}
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                class="keypad-button h-full rounded-2xl bg-[var(--mq-surface-strong)] px-3 py-4 text-2xl font-extrabold text-[var(--mq-ink)] shadow transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)] sm:px-4 sm:py-5"
                data-key="."
                title="小数点"
              >
                .
              </button>
              <button
                type="button"
                class="keypad-button col-span-2 h-full rounded-2xl bg-[var(--mq-surface-strong)] px-3 py-4 text-2xl font-extrabold text-[var(--mq-ink)] shadow transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)] sm:px-4 sm:py-5"
                data-key="0"
              >
                0
              </button>
            </div>
            <div class="mt-3">
              <button
                type="button"
                class="keypad-button h-14 w-full rounded-2xl bg-[var(--mq-primary)] px-4 text-2xl font-extrabold text-[var(--mq-ink)] shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-strong)] hover:text-white sm:h-16"
                data-key="submit"
              >
                =
              </button>
            </div>
          </div>

          <div class="space-y-3 rounded-3xl border border-[var(--mq-outline)] bg-white p-4 shadow-sm sm:p-6">
            <h2 class="text-lg font-semibold text-[var(--mq-ink)]">結果</h2>
            <p class="text-sm text-[#4f6076]">
              正解 <span id="result-correct">0</span> /{' '}
              <span id="result-total">0</span>
            </p>
            <div id="result-actions" class="hidden flex flex-col gap-2">
              <button
                id="againBtn"
                type="button"
                class="w-full rounded-2xl bg-[var(--mq-primary)] px-4 py-2 text-sm font-semibold text-[var(--mq-ink)] shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-strong)] hover:text-white"
              >
                もういちど練習する
              </button>
              <button
                id="endResultBtn"
                type="button"
                class="w-full rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface-strong)]"
              >
                やめる
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>

    {renderPlayClientScript()}
  </div>
);
