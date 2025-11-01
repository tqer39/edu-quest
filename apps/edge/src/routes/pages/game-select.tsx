import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { GradeId } from './grade-presets';
import {
  getGameGradeById,
  getSudokuPresetsForGrade,
  type SudokuPreset,
} from './game-presets';
import { BackToTopLink } from '../components/back-to-top-link';

const GameNav: FC<{
  currentUser: CurrentUser | null;
  gradeId: GradeId;
}> = ({ currentUser, gradeId }) => {
  const grade = getGameGradeById(gradeId);

  return (
    <nav class="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-2 shadow-sm backdrop-blur sm:px-8 lg:px-16 xl:px-24">
      <div class="flex items-center gap-2">
        <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
          🎮
        </span>
        <span class="text-sm font-semibold tracking-tight text-[var(--mq-ink)]">
          GameQuest - {grade.label}
        </span>
      </div>
      <div class="flex flex-wrap gap-2">
        <BackToTopLink />
        <a
          href="/game"
          class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
        >
          ← 学年選択へ戻る
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
};

const GameCard: FC<{
  gradeId: GradeId;
  preset: SudokuPreset;
}> = ({ gradeId, preset }) => (
  <a
    href={`/game/sudoku?grade=${gradeId}&preset=${preset.id}`}
    class="flex h-full flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
  >
    <span class="text-4xl" aria-hidden="true">
      {preset.icon}
    </span>
    <div class="space-y-2">
      <div class="text-xl font-bold text-[var(--mq-ink)]">{preset.label}</div>
      <p class="text-sm leading-relaxed text-[#5e718a]">{preset.description}</p>
      {preset.recommended && (
        <span class="inline-block rounded-lg bg-[var(--mq-primary-soft)] px-2 py-1 text-xs font-semibold text-[var(--mq-primary-strong)]">
          おすすめ
        </span>
      )}
    </div>
    <span class="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--mq-primary-strong)]">
      ゲーム開始 →
    </span>
  </a>
);

export const GameSelect: FC<{
  currentUser: CurrentUser | null;
  gradeId: GradeId;
}> = ({ currentUser, gradeId }) => {
  const grade = getGameGradeById(gradeId);
  const presets = getSudokuPresetsForGrade(gradeId);

  return (
    <div
      class="flex min-h-screen w-full flex-col gap-10"
      style="--mq-primary: #5DB996; --mq-primary-strong: #3AA07A; --mq-primary-soft: #D6F5E7; --mq-accent: #A8EBD0; --mq-outline: rgba(93, 185, 150, 0.45);"
    >
      <GameNav currentUser={currentUser} gradeId={gradeId} />
      <div class="flex flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
          <span class="text-6xl">🎮</span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">
              ゲームを選んでください
            </h1>
            <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
              {grade.label}向けのおすすめ:
              <br />
              {grade.highlight}
            </p>
          </div>
        </header>

        <section>
          <h2 class="mb-6 text-xl font-bold text-[var(--mq-ink)]">
            数独パズル
          </h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {presets.map((preset) => (
              <GameCard key={preset.id} gradeId={gradeId} preset={preset} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
