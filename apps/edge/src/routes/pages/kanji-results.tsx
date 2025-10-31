import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { BackToTopLink } from '../components/back-to-top-link';

type KanjiResultsProps = {
  currentUser: CurrentUser | null;
  score: number;
  total: number;
  grade: number;
  message: string;
};

export const KanjiResults: FC<KanjiResultsProps> = ({
  currentUser: _currentUser,
  score,
  total,
  grade,
  message,
}) => {
  const percentage = Math.round((score / total) * 100);
  const isPerfect = score === total;
  const isGood = percentage >= 70;

  return (
    <div
      class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
      style="--mq-primary: #9B87D4; --mq-primary-strong: #7B5FBD; --mq-primary-soft: #E8E1F5; --mq-accent: #C5B5E8; --mq-outline: rgba(155, 135, 212, 0.45); --mq-ink: #2c3e50; --mq-surface: rgba(255, 255, 255, 0.95);"
    >
      {/* ナビゲーション */}
      <nav class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-6 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--mq-primary-soft)] text-base">
            ✏️
          </span>
          <span class="text-lg font-semibold tracking-tight text-[var(--mq-ink)]">
            KanjiQuest 小学{grade}年生
          </span>
        </div>
      </nav>

      {/* 結果表示 */}
      <div class="flex flex-col items-center gap-8">
        <div class="w-full max-w-md rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-12 text-center shadow-xl">
          <div class="mb-6 text-6xl">
            {isPerfect ? '🎉' : isGood ? '😊' : '💪'}
          </div>

          <h2 class="mb-4 text-3xl font-extrabold text-[var(--mq-ink)]">
            {message}
          </h2>

          <div class="mb-8 space-y-2">
            <p class="text-5xl font-bold text-[var(--mq-primary-strong)]">
              {score} / {total}
            </p>
            <p class="text-xl font-semibold text-[var(--mq-ink)]">
              正解率: {percentage}%
            </p>
          </div>

          <div class="flex flex-col gap-3">
            <a
              href={`/kanji/start?grade=${grade}`}
              class="rounded-2xl bg-gradient-to-r from-[var(--mq-primary)] to-[var(--mq-primary-strong)] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
            >
              もう一度挑戦
            </a>
            <a
              href="/kanji"
              class="rounded-2xl border-2 border-[var(--mq-outline)] bg-white px-8 py-4 text-lg font-bold text-[var(--mq-ink)] shadow transition hover:-translate-y-1 hover:bg-[var(--mq-surface)] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
            >
              学年を選ぶ
            </a>
            <BackToTopLink variant="text" />
          </div>
        </div>

        {/* 励ましメッセージ */}
        {!isPerfect && (
          <div class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 text-center">
            <p class="text-sm text-[#5e718a]">
              {isGood
                ? '素晴らしい！次はパーフェクトを目指そう！'
                : '練習すればきっと覚えられるよ！頑張ろう！'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
