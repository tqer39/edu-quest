import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { KanjiGrade } from '@edu-quest/domain';
import { BackToTopLink } from '../components/back-to-top-link';
import { createSchoolGradeParam } from '../utils/school-grade';
import {
  QuestHeader,
  GradeCard,
  GradeSelection,
  Features,
} from '../components/quest-layout';

const KanjiNav: FC<{ currentUser: CurrentUser | null }> = ({ currentUser }) => (
  <nav class="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-2 shadow-sm backdrop-blur sm:px-8 lg:px-16 xl:px-24">
    <div class="flex items-center gap-2">
      <a href="/" class="flex items-center gap-2 transition hover:opacity-80">
        <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
          ✏️
        </span>
        <span class="text-sm font-semibold tracking-tight text-[var(--mq-ink)]">
          KanjiQuest
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

const getGradeDescription = (grade: KanjiGrade): string => {
  const descriptions: Record<KanjiGrade, string> = {
    1: '小学1年生で習う80字の漢字',
    2: '小学2年生で習う160字の漢字',
    3: '小学3年生で習う200字の漢字',
    4: '小学4年生で習う200字の漢字',
    5: '小学5年生で習う185字の漢字',
    6: '小学6年生で習う181字の漢字',
  };
  return descriptions[grade];
};

export const KanjiHome: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser,
}) => {
  const grades: KanjiGrade[] = [1, 2, 3, 4, 5, 6];

  return (
    <div
      class="flex min-h-screen w-full flex-col gap-10"
      style="--mq-primary: #9B87D4; --mq-primary-strong: #7B5FBD; --mq-primary-soft: #E8E1F5; --mq-accent: #C5B5E8; --mq-outline: rgba(155, 135, 212, 0.45);"
    >
      <KanjiNav currentUser={currentUser} />
      <div class="flex flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <QuestHeader
          icon="✏️"
          title="KanjiQuest"
          description="漢字の読み方を学ぼう！"
          subtitle="学年を選んで、楽しく漢字を覚えられます。"
        />

        <GradeSelection>
          {grades.map((grade) => {
            const description = getGradeDescription(grade);
            const gradeParam = createSchoolGradeParam({ stage: '小学', grade });
            const href = `/kanji/select?grade=${gradeParam}`;
            const disabled = grade > 2;

            return (
              <GradeCard
                key={grade}
                gradeNumber={grade}
                description={description}
                href={href}
                disabled={disabled}
              />
            );
          })}
        </GradeSelection>

        <Features
          title="遊び方"
          items={[
            {
              label: '読みクエスト:',
              description: '漢字の音読み・訓読みを答えます',
            },
            {
              label: '学年別:',
              description: '小学1年生から6年生までの教育漢字を収録',
            },
            {
              label: '4択問題:',
              description: '4つの選択肢から正しい読み方を選びます',
            },
            {
              label: 'スコア表示:',
              description: '正解率に応じてメッセージが変わります',
            },
          ]}
        />
      </div>
    </div>
  );
};
