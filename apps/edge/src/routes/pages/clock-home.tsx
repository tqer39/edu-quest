import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { ClockDifficulty } from '@edu-quest/domain';
import { getDifficultyDescription } from '@edu-quest/domain';

const ClockNav: FC<{ currentUser: CurrentUser | null }> = () => (
  <nav class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-6 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-3">
      <a href="/" class="flex items-center gap-3 transition hover:opacity-80">
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--mq-primary-soft)] text-base">
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
);

type DifficultyCardProps = {
  difficulty: ClockDifficulty;
  onSelect: (difficulty: ClockDifficulty) => void;
};

const DifficultyCard: FC<DifficultyCardProps> = ({ difficulty, onSelect }) => {
  const description = getDifficultyDescription(difficulty);
  const stars = '★'.repeat(difficulty);

  return (
    <button
      type="button"
      onClick={() => onSelect(difficulty)}
      class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
    >
      <div class="text-2xl font-bold text-[var(--mq-ink)]">
        レベル {difficulty}
      </div>
      <div class="text-lg text-[var(--mq-primary-strong)]">{stars}</div>
      <div class="text-sm text-[#5e718a]">{description}</div>
    </button>
  );
};

export const ClockHome: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser,
}) => {
  const difficulties: ClockDifficulty[] = [1, 2, 3, 4, 5];

  return (
    <div
      class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
      style="--mq-primary: #F5A85F; --mq-primary-strong: #E88D3D; --mq-primary-soft: #FEE9D5; --mq-accent: #FFCC99; --mq-outline: rgba(245, 168, 95, 0.45);"
    >
      <ClockNav currentUser={currentUser} />

      <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
        <span class="text-6xl">🕐</span>
        <div class="space-y-4">
          <h1 class="text-3xl font-extrabold sm:text-4xl">ClockQuest</h1>
          <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
            時計の読み方をマスターしよう！
            <br />
            難易度を選んで、楽しく時間の概念を学べます。
          </p>
        </div>
      </header>

      <section>
        <h2 class="mb-6 text-xl font-bold text-[var(--mq-ink)]">
          難易度を選んでください
        </h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {difficulties.map((difficulty) => (
            <DifficultyCard
              key={difficulty}
              difficulty={difficulty}
              onSelect={(d) => {
                // TODO: クイズ開始ロジックを実装
                alert(`レベル ${d} を選択しました（実装予定）`);
              }}
            />
          ))}
        </div>
      </section>

      <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">遊び方</h2>
        <ul class="space-y-2 text-sm text-[#5e718a]">
          <li>
            ✓ <strong>レベル1:</strong> ちょうどの時刻（1時、2時など）
          </li>
          <li>
            ✓ <strong>レベル2:</strong> ちょうどと半（1時、1時半など）
          </li>
          <li>
            ✓ <strong>レベル3:</strong> 15分きざみ（1時15分、1時45分など）
          </li>
          <li>
            ✓ <strong>レベル4:</strong> 5分きざみ（1時5分、1時10分など）
          </li>
          <li>
            ✓ <strong>レベル5:</strong> 1分きざみ（任意の時刻）
          </li>
        </ul>
      </section>
    </div>
  );
};
