import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { KanjiGrade, KanjiQuestType } from '@edu-quest/domain';
import { BackToTopLink } from '../components/back-to-top-link';
import type { SchoolStage } from '../utils/school-grade';
import { formatSchoolGradeLabel } from '../utils/school-grade';

const KanjiNav: FC<{
  currentUser: CurrentUser | null;
  grade: KanjiGrade;
  stage: SchoolStage;
}> = ({ currentUser: _currentUser, grade, stage }) => {
  const gradeLabel = formatSchoolGradeLabel({ stage, grade });

  return (
    <nav class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-6 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--mq-primary-soft)] text-base">
          ✏️
        </span>
        <span class="text-lg font-semibold tracking-tight text-[var(--mq-ink)]">
          KanjiQuest - {gradeLabel}
        </span>
      </div>
      <div class="flex flex-wrap gap-2">
        <BackToTopLink />
        <a
          href="/kanji"
          class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
        >
          学年選択へ戻る
        </a>
      </div>
    </nav>
  );
};

type QuestTypeCardProps = {
  questType: KanjiQuestType;
  grade: KanjiGrade;
};

const getQuestTypeInfo = (
  questType: KanjiQuestType
): {
  title: string;
  emoji: string;
  description: string;
} => {
  switch (questType) {
    case 'reading':
      return {
        title: '読みクエスト',
        emoji: '📖',
        description: '漢字の音読み・訓読みを答えます',
      };
    case 'stroke-count':
      return {
        title: '画数クエスト',
        emoji: '✍️',
        description: '漢字の画数を数えて答えます',
      };
  }
};

const QuestTypeCard: FC<QuestTypeCardProps> = ({ questType, grade }) => {
  const info = getQuestTypeInfo(questType);

  return (
    <a
      href={`/kanji/start?grade=${grade}&questType=${questType}`}
      class="flex flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
    >
      <div class="text-5xl">{info.emoji}</div>
      <div class="text-2xl font-bold text-[var(--mq-ink)]">{info.title}</div>
      <div class="text-sm text-[#5e718a]">{info.description}</div>
    </a>
  );
};

export const KanjiSelect: FC<{
  currentUser: CurrentUser | null;
  grade: KanjiGrade;
  gradeStage: SchoolStage;
}> = ({ currentUser: _currentUser, grade, gradeStage }) => {
  const questTypes: KanjiQuestType[] = ['reading', 'stroke-count'];
  const gradeLabel = formatSchoolGradeLabel({ stage: gradeStage, grade });

  return (
    <div
      class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
      style="--mq-primary: #9B87D4; --mq-primary-strong: #7B5FBD; --mq-primary-soft: #E8E1F5; --mq-accent: #C5B5E8; --mq-outline: rgba(155, 135, 212, 0.45);"
    >
      <KanjiNav currentUser={_currentUser} grade={grade} stage={gradeStage} />

      <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
        <span class="text-6xl">✏️</span>
        <div class="space-y-4">
          <h1 class="text-3xl font-extrabold sm:text-4xl">
            クエストを選んでください
          </h1>
          <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
            {gradeLabel}の漢字で遊びましょう！
            <br />
            挑戦したいクエストを選んでください。
          </p>
        </div>
      </header>

      <section>
        <h2 class="mb-6 text-xl font-bold text-[var(--mq-ink)]">
          クエストタイプ
        </h2>
        <div class="grid gap-6 sm:grid-cols-2">
          {questTypes.map((questType) => (
            <QuestTypeCard
              key={questType}
              questType={questType}
              grade={grade}
            />
          ))}
        </div>
      </section>

      <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">
          クエストについて
        </h2>
        <ul class="space-y-2 text-sm text-[#5e718a]">
          <li>
            ✓ <strong>読みクエスト:</strong>{' '}
            漢字の音読み・訓読みを4択から選びます
          </li>
          <li>
            ✓ <strong>画数クエスト:</strong> 漢字の画数を数えて4択から選びます
          </li>
          <li>
            ✓ <strong>問題数:</strong> 各クエスト10問で構成されています
          </li>
          <li>
            ✓ <strong>スコア:</strong> 正解率に応じてメッセージが変わります
          </li>
        </ul>
      </section>
    </div>
  );
};
