import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { ClockGrade } from '@edu-quest/domain';
import { AnalogClock } from '../../components/analog-clock';

type ClockQuizProps = {
  currentUser: CurrentUser | null;
  hours: number;
  minutes: number;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  difficulty?: number;
  grade: ClockGrade;
};

export const ClockQuiz: FC<ClockQuizProps> = ({
  currentUser: _currentUser,
  hours,
  minutes,
  questionNumber,
  totalQuestions,
  score,
  difficulty = 1,
  grade,
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
            ClockQuest {grade}年生 レベル{difficulty}
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

          {/* 答え入力ボタン */}
          <div class="flex flex-col gap-6">
            <p class="text-center text-sm font-semibold text-[var(--mq-ink)]">
              何時ですか？
            </p>
            <div class="grid grid-cols-3 gap-3">
              {/* biome-ignore lint/suspicious/noArrayIndexKey: Static buttons 1-12, never reorders */}
              {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                <form method="POST" key={hour}>
                  <input type="hidden" name="hours" value={hour} />
                  <input type="hidden" name="minutes" value="0" />
                  <button
                    type="submit"
                    class="w-full rounded-2xl border-2 border-[var(--mq-outline)] bg-white px-6 py-4 text-2xl font-bold text-[var(--mq-ink)] shadow-md transition hover:-translate-y-1 hover:border-[var(--mq-primary)] hover:bg-[var(--mq-primary-soft)] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
                  >
                    {hour}時
                  </button>
                </form>
              ))}
            </div>
          </div>
        </div>

        {/* ヒント */}
        <div class="rounded-3xl border border-[var(--mq-outline)] bg-white p-4 text-center text-sm text-[#5e718a]">
          💡 レベル1は「ちょうど」の時刻（1時、2時など）だけです
        </div>
      </div>
    </div>
  );
};
