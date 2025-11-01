import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { ClockGrade } from '@edu-quest/domain';
import { getGradeDescription } from '@edu-quest/domain';
import { BackToTopLink } from '../components/back-to-top-link';
import {
  QuestHeader,
  GradeCard,
  GradeSelection,
  Features,
} from '../components/quest-layout';

const ClockNav: FC<{ currentUser: CurrentUser | null }> = ({ currentUser }) => (
  <nav class="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-2 shadow-sm backdrop-blur sm:px-8 lg:px-16 xl:px-24">
    <div class="flex items-center gap-2">
      <a href="/" class="flex items-center gap-2 transition hover:opacity-80">
        <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
          🕐
        </span>
        <span class="text-sm font-semibold tracking-tight text-[var(--mq-ink)]">
          ClockQuest
        </span>
      </a>
    </div>
    <div class="flex items-center gap-2">
      <BackToTopLink />
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

export const ClockHome: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser,
}) => {
  const grades: ClockGrade[] = [1, 2, 3, 4, 5, 6];

  return (
    <div
      class="flex min-h-screen w-full flex-col gap-10"
      style="--mq-primary: #F5A85F; --mq-primary-strong: #E88D3D; --mq-primary-soft: #FEE9D5; --mq-accent: #FFCC99; --mq-outline: rgba(245, 168, 95, 0.45);"
    >
      <ClockNav currentUser={currentUser} />
      <div class="flex flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <QuestHeader
          icon="🕐"
          title="ClockQuest"
          description="時計の読み方をマスターしよう！"
          subtitle="学年に合わせて、楽しく時間の概念を学べます。"
        />

        <GradeSelection>
          {grades.map((grade) => {
            const description = getGradeDescription(grade);
            const stars = '★'.repeat(grade);
            return (
              <GradeCard
                key={grade}
                gradeNumber={grade}
                stars={stars}
                description={description}
                href={`/clock/select?grade=${grade}`}
              />
            );
          })}
        </GradeSelection>

        <Features
          title="遊び方"
          items={[
            {
              icon: '✓',
              label: 'ステップ1:',
              description: '学年を選んでね',
            },
            {
              icon: '✓',
              label: 'ステップ2:',
              description: '目標にしたいレベルを決めよう',
            },
            {
              icon: '✓',
              label: 'ステップ3:',
              description: '時計を見て正しい時刻を答えよう',
            },
            {
              icon: '✓',
              label: 'ヒント:',
              description: 'レベルが上がるほど細かい時間が出てくるよ',
            },
          ]}
        />
      </div>
    </div>
  );
};
