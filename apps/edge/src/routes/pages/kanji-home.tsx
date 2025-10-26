import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { KanjiGrade } from '@edu-quest/domain';

const KanjiNav: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser: _currentUser,
}) => (
  <nav class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-6 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-3">
      <a href="/" class="flex items-center gap-3 transition hover:opacity-80">
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--mq-primary-soft)] text-base">
          ✏️
        </span>
        <span class="text-lg font-semibold tracking-tight text-[var(--mq-ink)]">
          KanjiQuest
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

type GradeCardProps = {
  grade: KanjiGrade;
};

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

const GradeCard: FC<GradeCardProps> = ({ grade }) => {
  const description = getGradeDescription(grade);
  const stars = '★'.repeat(grade);

  return (
    <a
      href={`/kanji/start?grade=${grade}`}
      class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
    >
      <div class="text-2xl font-bold text-[var(--mq-ink)]">{grade}年生</div>
      <div class="text-lg text-[var(--mq-primary-strong)]">{stars}</div>
      <div class="text-sm text-[#5e718a]">{description}</div>
    </a>
  );
};

export const KanjiHome: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser: _currentUser,
}) => {
  const grades: KanjiGrade[] = [1, 2, 3, 4, 5, 6];

  return (
    <div
      class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
      style="--mq-primary: #9B87D4; --mq-primary-strong: #7B5FBD; --mq-primary-soft: #E8E1F5; --mq-accent: #C5B5E8; --mq-outline: rgba(155, 135, 212, 0.45);"
    >
      <KanjiNav currentUser={_currentUser} />

      <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
        <span class="text-6xl">✏️</span>
        <div class="space-y-4">
          <h1 class="text-3xl font-extrabold sm:text-4xl">KanjiQuest</h1>
          <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
            漢字の読み方を学ぼう！
            <br />
            学年を選んで、楽しく漢字を覚えられます。
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
            ✓ <strong>読みクエスト:</strong> 漢字の音読み・訓読みを答えます
          </li>
          <li>
            ✓ <strong>学年別:</strong> 小学1年生から6年生までの教育漢字を収録
          </li>
          <li>
            ✓ <strong>4択問題:</strong> 4つの選択肢から正しい読み方を選びます
          </li>
          <li>
            ✓ <strong>スコア表示:</strong> 正解率に応じてメッセージが変わります
          </li>
        </ul>
      </section>
    </div>
  );
};
