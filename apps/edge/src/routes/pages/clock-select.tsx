import type { ClockDifficulty, ClockGrade } from '@edu-quest/domain';
import { getGradeDescription } from '@edu-quest/domain';
import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';

const ClockNav: FC<{ currentUser: CurrentUser | null; grade: ClockGrade }> = ({
  currentUser,
  grade,
}) => (
  <nav class="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-2 shadow-sm backdrop-blur sm:px-8 lg:px-16 xl:px-24">
    <div class="flex items-center gap-2">
      <a href="/" class="transition hover:opacity-80">
        <img
          src="/logo.svg"
          alt="EduQuest Logo"
          class="h-7 w-7"
          width="28"
          height="28"
        />
      </a>
      <span class="text-[var(--mq-outline)]">|</span>
      <a href="/clock" class="transition hover:opacity-80">
        <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
          🕐
        </span>
      </a>
      <span class="text-xs font-semibold text-[var(--mq-ink)]">小{grade}</span>
    </div>
    <div class="flex flex-wrap gap-2">
      <a
        href="/clock"
        class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
      >
        ← 学年選択に戻る
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

const questOptions: {
  id: 'reading' | 'conversion' | 'arithmetic' | 'variety';
  title: string;
  description: string;
  icon: string;
  difficulty: ClockDifficulty;
}[] = [
  {
    id: 'reading',
    title: 'アナログ・デジタル時計の読み問題',
    description:
      '長針・短針やデジタル表示を読み取って、正しい時刻を答えるクエストです。',
    icon: '🕒',
    difficulty: 1,
  },
  {
    id: 'conversion',
    title: 'アナログ・デジタルの変換問題',
    description:
      'アナログ表示とデジタル表示を切り替えながら、同じ時刻を表す力を鍛えます。',
    icon: '🔄',
    difficulty: 2,
  },
  {
    id: 'arithmetic',
    title: '時間のたし算・引き算',
    description:
      '○時△分からの経過時間や、合計時間を求める計算問題に挑戦しましょう。',
    icon: '➕',
    difficulty: 4,
  },
  {
    id: 'variety',
    title: 'その他色々',
    description:
      'カレンダーや日常生活のスケジュールなど、多彩な時計クイズをランダムに出題します。',
    icon: '✨',
    difficulty: 5,
  },
];

const QuestCard: FC<{
  grade: ClockGrade;
  option: (typeof questOptions)[number];
}> = ({ grade, option }) => (
  <a
    href={`/clock/start?grade=elem-${grade}&type=${option.id}&difficulty=${option.difficulty}`}
    class="flex h-full flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
  >
    <span class="text-4xl" aria-hidden="true">
      {option.icon}
    </span>
    <div class="space-y-2">
      <div class="text-xl font-bold text-[var(--mq-ink)]">{option.title}</div>
      <p class="text-sm leading-relaxed text-[#5e718a]">{option.description}</p>
    </div>
    <span class="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--mq-primary-strong)]">
      クエスト開始 →
    </span>
  </a>
);

export const ClockSelect: FC<{
  currentUser: CurrentUser | null;
  grade: ClockGrade;
}> = ({ currentUser, grade }) => {
  const gradeDescription = getGradeDescription(grade);

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      style="--mq-primary: #F5A85F; --mq-primary-strong: #E88D3D; --mq-primary-soft: #FEE9D5; --mq-accent: #FFCC99; --mq-outline: rgba(245, 168, 95, 0.45);"
    >
      <ClockNav currentUser={currentUser} grade={grade} />
      <div class="flex flex-1 flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
          <span class="text-6xl">🕐</span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">
              クエストを選んでください
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
            チャレンジするクエスト
          </h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {questOptions.map((option) => (
              <QuestCard key={option.id} grade={grade} option={option} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};
