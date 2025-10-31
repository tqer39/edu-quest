import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { ClockGrade } from '@edu-quest/domain';
import { getGradeDescription } from '@edu-quest/domain';
import { BackToTopLink } from '../components/back-to-top-link';

const ClockNav: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser: _currentUser,
}) => (
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
    <BackToTopLink />
  </nav>
);

type GradeCardProps = {
  grade: ClockGrade;
};

const GradeCard: FC<GradeCardProps> = ({ grade }) => {
  const description = getGradeDescription(grade);
  const stars = '★'.repeat(grade);

  return (
    <a
      href={`/clock/select?grade=${grade}`}
      class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
    >
      <div class="text-2xl font-bold text-[var(--mq-ink)]">{grade}年生</div>
      <div class="text-lg text-[var(--mq-primary-strong)]">{stars}</div>
      <div class="text-sm text-[#5e718a]">{description}</div>
    </a>
  );
};

export const ClockHome: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser: _currentUser,
}) => {
  const grades: ClockGrade[] = [1, 2, 3, 4, 5, 6];

  return (
    <div
      class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
      style="--mq-primary: #F5A85F; --mq-primary-strong: #E88D3D; --mq-primary-soft: #FEE9D5; --mq-accent: #FFCC99; --mq-outline: rgba(245, 168, 95, 0.45);"
    >
      <ClockNav currentUser={_currentUser} />

      <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
        <span class="text-6xl">🕐</span>
        <div class="space-y-4">
          <h1 class="text-3xl font-extrabold sm:text-4xl">ClockQuest</h1>
          <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
            時計の読み方をマスターしよう！
            <br />
            学年に合わせて、楽しく時間の概念を学べます。
          </p>
        </div>
      </header>

      <section>
        <h2 class="mb-6 text-xl font-bold text-[var(--mq-ink)]">
          学年を選んでください
        </h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grades.map((grade) => (
            <GradeCard key={grade} grade={grade} />
          ))}
        </div>
      </section>

      <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">遊び方</h2>
        <ul class="space-y-2 text-sm text-[#5e718a]">
          <li>
            ✓ <strong>ステップ1:</strong> 学年を選んでね
          </li>
          <li>
            ✓ <strong>ステップ2:</strong> 目標にしたいレベルを決めよう
          </li>
          <li>
            ✓ <strong>ステップ3:</strong> 時計を見て正しい時刻を答えよう
          </li>
          <li>
            ✓ <strong>ヒント:</strong> レベルが上がるほど細かい時間が出てくるよ
          </li>
        </ul>
      </section>
    </div>
  );
};
