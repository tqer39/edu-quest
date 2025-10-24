import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { AnalogClock } from '../../components/analog-clock';

type ClockQuizProps = {
  currentUser: CurrentUser | null;
  hours: number;
  minutes: number;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  difficulty?: number;
};

export const ClockQuiz: FC<ClockQuizProps> = ({
  currentUser: _currentUser,
  hours,
  minutes,
  questionNumber,
  totalQuestions,
  score,
  difficulty = 1,
}) => {
  return (
    <div
      class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
      style="--mq-primary: #F5A85F; --mq-primary-strong: #E88D3D; --mq-primary-soft: #FEE9D5; --mq-accent: #FFCC99; --mq-outline: rgba(245, 168, 95, 0.45); --mq-ink: #2c3e50; --mq-surface: rgba(255, 255, 255, 0.95);"
    >
      {/* ナビゲーション */}
      <nav class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-6 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--mq-primary-soft)] text-base">
            🕐
          </span>
          <span class="text-lg font-semibold tracking-tight text-[var(--mq-ink)]">
            ClockQuest レベル{difficulty}
          </span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm font-semibold text-[var(--mq-ink)]">
            問題 {questionNumber} / {totalQuestions}
          </span>
          <span class="text-sm font-semibold text-[var(--mq-primary-strong)]">
            正解数: {score}
          </span>
        </div>
      </nav>

      {/* クイズコンテンツ */}
      <div class="flex flex-col items-center gap-8">
        <div class="w-full max-w-md rounded-3xl border border-[var(--mq-outline)] bg-white p-8 shadow-xl">
          <h2 class="mb-6 text-center text-xl font-bold text-[var(--mq-ink)]">
            この時計は何時ですか？
          </h2>

          {/* アナログ時計 */}
          <div class="mb-8">
            <AnalogClock hours={hours} minutes={minutes} />
          </div>

          {/* 答え入力フォーム */}
          <form method="POST" class="flex flex-col gap-4">
            <div class="flex items-center justify-center gap-4">
              <div class="flex flex-col gap-2">
                <label
                  for="hours-input"
                  class="text-sm font-semibold text-[var(--mq-ink)]"
                >
                  時
                </label>
                <input
                  id="hours-input"
                  name="hours"
                  type="number"
                  min="1"
                  max="12"
                  required
                  class="w-20 rounded-2xl border-2 border-[var(--mq-outline)] px-4 py-3 text-center text-2xl font-bold text-[var(--mq-ink)] transition focus:border-[var(--mq-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--mq-primary-soft)]"
                  autofocus
                />
              </div>
              <div class="flex flex-col gap-2">
                <label
                  for="minutes-input"
                  class="text-sm font-semibold text-[var(--mq-ink)]"
                >
                  分
                </label>
                <input
                  id="minutes-input"
                  name="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value="0"
                  required
                  class="w-20 rounded-2xl border-2 border-[var(--mq-outline)] px-4 py-3 text-center text-2xl font-bold text-[var(--mq-ink)] transition focus:border-[var(--mq-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--mq-primary-soft)]"
                  readonly
                />
              </div>
            </div>

            <button
              type="submit"
              class="mt-4 rounded-2xl bg-gradient-to-r from-[var(--mq-primary)] to-[var(--mq-primary-strong)] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
            >
              答える
            </button>
          </form>
        </div>

        {/* ヒント */}
        <div class="rounded-3xl border border-[var(--mq-outline)] bg-white p-4 text-center text-sm text-[#5e718a]">
          💡 レベル1は「ちょうど」の時刻（1時、2時など）だけです
        </div>
      </div>
    </div>
  );
};
