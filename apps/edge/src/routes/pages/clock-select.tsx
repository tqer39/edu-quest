import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { ClockDifficulty, ClockGrade } from '@edu-quest/domain';
import { getDifficultyDescription, getGradeDescription } from '@edu-quest/domain';

const ClockNav: FC<{ currentUser: CurrentUser | null; grade: ClockGrade }> = ({
  currentUser: _currentUser,
  grade,
}) => (
  <nav class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-6 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-3">
      <a
        href="/clock"
        class="flex items-center gap-3 transition hover:opacity-80"
      >
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--mq-primary-soft)] text-base">
          🕐
        </span>
        <span class="text-lg font-semibold tracking-tight text-[var(--mq-ink)]">
          ClockQuest - {grade}年生
        </span>
      </a>
    </div>
    <a
      href="/clock"
      class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
    >
      ← 学年選択に戻る
    </a>
  </nav>
);

type DifficultyCardProps = {
  grade: ClockGrade;
  difficulty: ClockDifficulty;
};

const DifficultyCard: FC<DifficultyCardProps> = ({ grade, difficulty }) => {
  const description = getDifficultyDescription(difficulty);
  const stars = '★'.repeat(difficulty);

  return (
    <a
      href={`/clock/start?grade=${grade}&difficulty=${difficulty}`}
      class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
    >
      <div class="text-2xl font-bold text-[var(--mq-ink)]">
        レベル {difficulty}
      </div>
      <div class="text-lg text-[var(--mq-primary-strong)]">{stars}</div>
      <div class="text-sm text-[#5e718a]">{description}</div>
    </a>
  );
};

export const ClockSelect: FC<{
  currentUser: CurrentUser | null;
  grade: ClockGrade;
}> = ({ currentUser: _currentUser, grade }) => {
  const difficulties: ClockDifficulty[] = [1, 2, 3, 4, 5];
  const gradeDescription = getGradeDescription(grade);

  return (
    <div
      class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
      style="--mq-primary: #F5A85F; --mq-primary-strong: #E88D3D; --mq-primary-soft: #FEE9D5; --mq-accent: #FFCC99; --mq-outline: rgba(245, 168, 95, 0.45);"
    >
      <ClockNav currentUser={_currentUser} grade={grade} />

      <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
        <span class="text-6xl">🕐</span>
        <div class="space-y-4">
          <h1 class="text-3xl font-extrabold sm:text-4xl">
            レベルを選んでください
          </h1>
          <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
            {grade}年生向けのおすすめ:
            <br />
            {gradeDescription}
          </p>
        </div>
      </header>

      <section>
        <h2 class="mb-6 text-xl font-bold text-[var(--mq-ink)]">
          チャレンジするレベル
        </h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {difficulties.map((difficulty) => (
            <DifficultyCard
              key={difficulty}
              grade={grade}
              difficulty={difficulty}
            />
          ))}
        </div>
      </section>

      <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">レベルについて</h2>
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
