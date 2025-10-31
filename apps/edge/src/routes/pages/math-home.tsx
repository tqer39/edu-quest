import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { gradeLevels, type GradeId } from './grade-presets';

const MathNav: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser: _currentUser,
}) => (
  <nav class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-6 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-3">
      <a href="/" class="flex items-center gap-3 transition hover:opacity-80">
        <img
          src="/logo.svg"
          alt="EduQuest Logo"
          class="h-10 w-10"
          width="40"
          height="40"
        />
        <span class="text-lg font-semibold tracking-tight text-[var(--mq-ink)]">
          MathQuest
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

const getGradeStars = (grade: GradeId): string => {
  const order = gradeLevels.findIndex((level) => level.id === grade) + 1;
  return '★'.repeat(order);
};

export const MathHome: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser,
}) => (
  <div
    class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
    data-user-state={currentUser ? 'known' : 'anonymous'}
    style="--mq-primary: #6B9BD1; --mq-primary-strong: #3B7AC7; --mq-primary-soft: #D6E4F5; --mq-accent: #B7D4F7; --mq-outline: rgba(107, 155, 209, 0.45);"
  >
    <MathNav currentUser={currentUser} />

    <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
      <span class="text-6xl">🧮</span>
      <div class="space-y-4">
        <h1 class="text-3xl font-extrabold sm:text-4xl">MathQuest</h1>
        <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
          学年をえらんで算数のれんしゅうをはじめよう。
          <br />
          たし算・ひき算だけでなく、逆算やテーマ学習にも挑戦できます。
        </p>
      </div>
    </header>

    <section>
      <h2 class="mb-6 text-xl font-bold text-[var(--mq-ink)]">
        学年を選んでください
      </h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gradeLevels.map((grade, index) => {
          const gradeNumber = index + 1;
          if (grade.disabled) {
            return (
              <div
                key={grade.id}
                class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-left text-gray-500 shadow-lg opacity-60"
              >
                <div class="text-2xl font-bold">{grade.label}</div>
                <div class="text-lg">{getGradeStars(grade.id)}</div>
                <div class="text-sm">{grade.description}</div>
                <div class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                  🔒 準備中
                </div>
              </div>
            );
          }

          return (
            <a
              key={grade.id}
              href={`/math/start?grade=${gradeNumber}`}
              class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
            >
              <div class="text-2xl font-bold text-[var(--mq-ink)]">
                {grade.label}
              </div>
              <div class="text-lg text-[var(--mq-primary-strong)]">
                {getGradeStars(grade.id)}
              </div>
              <div class="text-sm text-[#5e718a]">{grade.description}</div>
            </a>
          );
        })}
      </div>
    </section>

    <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
      <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">
        MathQuest でできること
      </h2>
      <ul class="space-y-2 text-sm text-[#5e718a]">
        <li>✓ 学年プリセットで学ぶ範囲をしぼって練習できます</li>
        <li>✓ たし算・ひき算だけでなく逆算やテーマ学習にも挑戦できます</li>
        <li>✓ 効果音・カウントダウンなどの設定をカスタマイズできます</li>
        <li>✓ 数独などのゲームで頭の体操も楽しめます</li>
      </ul>
    </section>
  </div>
);
