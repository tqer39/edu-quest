import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { GameGradeLevel, SudokuPreset } from './game-presets';
import { BackToTopLink } from '../components/back-to-top-link';

const SudokuNav: FC<{
  currentUser: CurrentUser | null;
  gradeId: string;
  gradeLabel: string;
}> = ({ currentUser, gradeId, gradeLabel }) => (
  <nav class="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-2 shadow-sm backdrop-blur sm:px-8 lg:px-16 xl:px-24">
    <div class="flex items-center gap-2">
      <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
        🎮
      </span>
      <span class="text-sm font-semibold tracking-tight text-[var(--mq-ink)]">
        GameQuest - {gradeLabel} - 数独
      </span>
    </div>
    <div class="flex flex-wrap gap-2">
      <BackToTopLink />
      <a
        href={`/game/select?grade=${gradeId}`}
        class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
      >
        ← ゲーム選択に戻る
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

type SudokuSelectProps = {
  currentUser: CurrentUser | null;
  grade: GameGradeLevel;
  presets: readonly SudokuPreset[];
};

export const SudokuSelect: FC<SudokuSelectProps> = ({
  currentUser,
  grade,
  presets,
}) => {
  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      style="--mq-primary: #5DB996; --mq-primary-strong: #3AA07A; --mq-primary-soft: #D6F5E7; --mq-accent: #A8EBD0; --mq-outline: rgba(93, 185, 150, 0.45); --mq-ink: #0f172a; --mq-surface: #f8fafc; --mq-surface-strong: #e2e8f0;"
    >
      <SudokuNav
        currentUser={currentUser}
        gradeId={grade.id}
        gradeLabel={grade.label}
      />
      <div class="flex flex-1 flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
          <span class="text-6xl">🧩</span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">
              レベルを選んでください
            </h1>
            <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
              {grade.label}向けのおすすめ:
              <br />
              {grade.highlight}
            </p>
          </div>
        </header>

        <section class="space-y-6">
          <h2 class="text-xl font-bold text-[var(--mq-ink)]">数独パズル</h2>
          {presets.length === 0 ? (
            <div class="rounded-2xl border border-[var(--mq-outline)] bg-white p-6 text-sm text-[#5e718a] shadow-sm">
              この学年向けのプリセットは準備中です。
              <a
                href="/game"
                class="ml-2 font-semibold text-[var(--mq-primary-strong)] underline"
              >
                GameQuest に戻る
              </a>
            </div>
          ) : (
            <div class="grid gap-3 sm:grid-cols-2">
              {presets.map((preset) => (
                <a
                  key={preset.id}
                  href={`/game/sudoku/play?grade=${encodeURIComponent(
                    grade.id
                  )}&size=${preset.size}&difficulty=${preset.difficulty}`}
                  class="flex flex-col gap-3 rounded-2xl border-2 border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-surface)] p-4 text-left transition hover:-translate-y-1 hover:border-[var(--mq-primary)] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-3xl">{preset.icon}</span>
                    <div class="flex flex-col">
                      <div class="text-base font-bold text-[var(--mq-ink)]">
                        {preset.label}
                      </div>
                      <div class="text-xs text-[#5e718a]">
                        {preset.description}
                      </div>
                    </div>
                  </div>
                  {preset.recommended && (
                    <span class="mt-2 inline-flex w-fit items-center gap-1 rounded-xl bg-[var(--mq-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--mq-primary-strong)]">
                      おすすめ
                    </span>
                  )}
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
