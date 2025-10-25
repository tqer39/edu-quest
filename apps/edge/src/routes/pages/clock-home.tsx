import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';

export const ClockHome: FC<{ currentUser: CurrentUser | null }> = () => (
  <div
    class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
    style="--mq-primary: #F5A85F; --mq-primary-strong: #E88D3D; --mq-primary-soft: #FEE9D5; --mq-accent: #FFCC99; --mq-outline: rgba(245, 168, 95, 0.45);"
  >
    <nav class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-6 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <a href="/" class="flex items-center gap-3 transition hover:opacity-80">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--mq-primary-soft)] text-base font-bold">
            🕐
          </span>
          <span class="text-lg font-semibold tracking-tight text-[var(--mq-ink)]">
            ClockQuest
          </span>
        </a>
      </div>
      <a
        href="/"
        class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
      >
        ← トップに戻る
      </a>
    </nav>

    <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
      <span class="text-6xl">🕐</span>
      <div class="space-y-4">
        <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[#6c7c90]">
          Coming Soon
        </p>
        <h1 class="text-3xl font-extrabold sm:text-4xl">ClockQuest</h1>
        <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
          時計の読み方をマスターできる機能を準備中です。アナログ時計とデジタル時計の両方を使って、楽しく時間の概念を学べます。
        </p>
      </div>
    </header>
  </div>
);
