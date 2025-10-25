import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';

export const KanjiHome: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser,
}) => (
  <div
    class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
    style="--mq-primary: #9B7EC8; --mq-primary-strong: #7B5DB8; --mq-primary-soft: #E5DDF5; --mq-accent: #C4B5E8; --mq-outline: rgba(155, 126, 200, 0.45);"
  >
    <nav class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-6 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <a href="/" class="flex items-center gap-3 transition hover:opacity-80">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--mq-primary-soft)] text-base font-bold text-[var(--mq-primary-strong)]">
            📝
          </span>
          <span class="text-lg font-semibold tracking-tight text-[var(--mq-ink)]">
            KanjiQuest
          </span>
        </a>
      </div>
      <div class="flex items-center gap-3">
        {currentUser && (
          <span class="hidden text-sm font-semibold text-[var(--mq-ink)] sm:inline-flex sm:items-center sm:gap-2">
            <span
              class="inline-flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold text-white"
              style={`background:${currentUser.avatarColor}`}
            >
              {currentUser.displayName.slice(0, 1)}
            </span>
            {currentUser.displayName}
          </span>
        )}
        <a
          href="/"
          class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
        >
          ← トップに戻る
        </a>
      </div>
    </nav>

    <header class="flex flex-col gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-10 text-[var(--mq-ink)] shadow-xl lg:flex-row lg:items-center lg:justify-between">
      <div class="space-y-4">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[#6c7c90]">
          読み・ことば・ぶんしょう
        </p>
        <h1 class="text-3xl font-extrabold sm:text-4xl">KanjiQuest</h1>
        <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
          学年をえらんで漢字クイズに挑戦。読み当てや穴あき問題を通じて、読み方と使い方をいっしょに学べます。
          選んだ設定はブラウザに保存されるので、つづきから挑戦できるよ。
        </p>
      </div>
      <a
        href="/kanji/start"
        class="inline-flex items-center justify-center rounded-2xl bg-[var(--mq-primary)] px-6 py-3 text-lg font-semibold text-[var(--mq-ink)] shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-strong)] hover:text-white"
      >
        クイズをはじめる
      </a>
    </header>

    <section class="grid gap-6 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-6 py-8 text-[var(--mq-ink)] shadow-lg md:grid-cols-3">
      <div class="space-y-2">
        <h2 class="text-xl font-semibold">学年プリセット</h2>
        <p class="text-sm text-[#5e718a]">
          小1から小6までの漢字をカバー。選んだ学年にあわせて読み当てや穴あき問題が出題されます。
        </p>
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-semibold">4つの出題形式</h2>
        <p class="text-sm text-[#5e718a]">
          1つ選ぶ読みクイズ、複数選ぶ読みクイズ、ことばの穴あき、文章の穴あきの4タイプを自由に組み合わせられます。
        </p>
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-semibold">記録は自動保存</h2>
        <p class="text-sm text-[#5e718a]">
          ブラウザに挑戦回数と正解数を保存。アカウントを作成すれば、学習履歴をクラウドに同期できます。
        </p>
      </div>
    </section>

    <section class="grid gap-6 rounded-3xl border border-[var(--mq-outline)] bg-white px-6 py-8 shadow-lg lg:grid-cols-2">
      <div class="space-y-3">
        <h2 class="text-xl font-semibold text-[var(--mq-primary-strong)]">出題される問題</h2>
        <ul class="space-y-2 text-sm text-[#5e718a]">
          <li>・なんのかんじ？ → 4択から正しい読みをえらぶよ</li>
          <li>・よみをぜんぶあてる → 正解の読み方を複数選択</li>
          <li>・ことばの穴あき → □に入る漢字をひとつ選択</li>
          <li>・文章の穴あき → 文脈に合う漢字をえらんで完成させよう</li>
        </ul>
      </div>
      <div class="space-y-3">
        <h2 class="text-xl font-semibold text-[var(--mq-primary-strong)]">プレイの流れ</h2>
        <ol class="space-y-2 text-sm text-[#5e718a]">
          <li>1. 学年と出題形式を選んでスタート</li>
          <li>2. 選択肢をタップして「こたえる」を押す</li>
          <li>3. 正解と解説を確認して次の問題へ</li>
          <li>4. ぜんぶ解き終えたら、結果パネルで達成度をチェック</li>
        </ol>
      </div>
    </section>
  </div>
);
