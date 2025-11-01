import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { gradeLevels } from './grade-presets';
import { createSchoolGradeParam } from '../utils/school-grade';
import { BackToTopLink } from '../components/back-to-top-link';
import {
  QuestHeader,
  GradeCard,
  GradeSelection,
  Features,
} from '../components/quest-layout';

const MathNav: FC<{ currentUser: CurrentUser | null }> = ({ currentUser }) => (
  <nav class="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-2 shadow-sm backdrop-blur sm:px-8 lg:px-16 xl:px-24">
    <div class="flex items-center gap-2">
      <a href="/" class="flex items-center gap-2 transition hover:opacity-80">
        <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
          🔢
        </span>
        <span class="text-sm font-semibold tracking-tight text-[var(--mq-ink)]">
          MathQuest
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

export const MathHome: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser,
}) => (
  <div
    class="flex min-h-screen w-full flex-col gap-10"
    data-user-state={currentUser ? 'known' : 'anonymous'}
    style="--mq-primary: #6B9BD1; --mq-primary-strong: #3B7AC7; --mq-primary-soft: #D6E4F5; --mq-accent: #B7D4F7; --mq-outline: rgba(107, 155, 209, 0.45);"
  >
    <MathNav currentUser={currentUser} />
    <div class="flex flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
      <QuestHeader
        icon="🔢"
        title="MathQuest"
        description="学年をえらんで算数のれんしゅうをはじめよう。"
        subtitle="たし算・ひき算だけでなく、逆算やテーマ学習にも挑戦できます。"
      />

      <GradeSelection>
        {gradeLevels.map((grade, index) => {
          const gradeNumber = index + 1;
          const href = `/math/select?grade=${encodeURIComponent(
            createSchoolGradeParam({ stage: '小学', grade: gradeNumber })
          )}`;

          return (
            <GradeCard
              key={grade.id}
              gradeNumber={gradeNumber}
              description={grade.description}
              href={href}
              disabled={grade.disabled}
            />
          );
        })}
      </GradeSelection>

      <Features
        title="MathQuest でできること"
        items={[
          { description: '学年プリセットで学ぶ範囲をしぼって練習できます' },
          {
            description:
              'たし算・ひき算だけでなく逆算やテーマ学習にも挑戦できます',
          },
          {
            description:
              '効果音・カウントダウンなどの設定をカスタマイズできます',
          },
          { description: '数独などのゲームで頭の体操も楽しめます' },
        ]}
      />
    </div>
  </div>
);
