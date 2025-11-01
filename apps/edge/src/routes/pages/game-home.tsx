import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { gameGradeLevels } from './game-presets';

const GameNav: FC<{ currentUser: CurrentUser | null }> = ({ currentUser }) => (
  <nav class="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-2 shadow-sm backdrop-blur sm:px-8 lg:px-16 xl:px-24">
    <div class="flex items-center gap-2">
      <a href="/" class="flex items-center gap-2 transition hover:opacity-80">
        <img
          src="/gamequest-logo.svg"
          alt="GameQuest Logo"
          class="h-7 w-7"
          width="28"
          height="28"
        />
        <span class="text-sm font-semibold tracking-tight text-[var(--mq-ink)]">
          GameQuest
        </span>
      </a>
    </div>
    <div class="flex items-center gap-2">
      <a
        href="/"
        class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
      >
        ← トップに戻る
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

type GameHomeProps = {
  currentUser: CurrentUser | null;
};

export const GameHome: FC<GameHomeProps> = ({ currentUser }) => {
  return (
    <div
      class="flex min-h-screen w-full flex-col gap-10"
      style="--mq-primary: #5DB996; --mq-primary-strong: #3AA07A; --mq-primary-soft: #D6F5E7; --mq-accent: #A8EBD0; --mq-outline: rgba(93, 185, 150, 0.45);"
    >
      <GameNav currentUser={currentUser} />
      <div class="flex flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
          <span class="text-6xl">🎮</span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">GameQuest</h1>
            <p class="max-w-xl text-sm text-[#4f6076] sm:text-base">
              学年に合わせた脳トレゲームに挑戦しよう。まずは学年をえらんで、ぴったりのゲームを選択してください。
            </p>
          </div>
        </header>

        <section class="space-y-6">
          <h2 class="text-xl font-bold text-[var(--mq-ink)]">学年を選ぶ</h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gameGradeLevels.map((level) => (
              <a
                key={level.id}
                href={`/game/select?grade=${encodeURIComponent(level.id)}`}
                class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
              >
                <div class="text-2xl font-bold text-[var(--mq-ink)]">
                  {level.label}
                </div>
                <div class="text-sm text-[#5e718a]">{level.description}</div>
                <div class="text-xs font-semibold uppercase tracking-wide text-[var(--mq-primary-strong)]">
                  {level.highlight}
                </div>
              </a>
            ))}
          </div>
        </section>

        <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">
            GameQuest でできること
          </h2>
          <ul class="space-y-2 text-sm text-[#5e718a]">
            <li>✓ 学年に合わせた難易度で論理パズルに挑戦できます</li>
            <li>✓ 数独パズルで集中力と推理力を鍛えられます</li>
            <li>✓ 4×4 から 9×9 まで段階的にステップアップできます</li>
            <li>✓ 楽しみながら論理的思考力を育てられます</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
