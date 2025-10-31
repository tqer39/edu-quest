import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { GradeId } from './grade-presets';
import {
  gameGradeLevels,
  getGameGradeById,
  getSudokuPresetsForGrade,
} from './game-presets';

const GameNav: FC<{ currentUser: CurrentUser | null }> = ({
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
          GameQuest
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

type GameHomeProps = {
  currentUser: CurrentUser | null;
  selectedGradeId: GradeId | null;
};

export const GameHome: FC<GameHomeProps> = ({ currentUser, selectedGradeId }) => {
  const grade = selectedGradeId ? getGameGradeById(selectedGradeId) : null;

  return (
    <div
      class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
      data-user-state={currentUser ? 'known' : 'anonymous'}
      data-selected-grade={grade?.id ?? ''}
      style="--mq-primary: #5DB996; --mq-primary-strong: #3AA07A; --mq-primary-soft: #D6F5E7; --mq-accent: #A8EBD0; --mq-outline: rgba(93, 185, 150, 0.45);"
    >
      <GameNav currentUser={currentUser} />

      <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
        <span class="text-6xl">🎮</span>
        <div class="space-y-4">
          <h1 class="text-3xl font-extrabold sm:text-4xl">GameQuest</h1>
          <p class="max-w-xl text-sm text-[#4f6076] sm:text-base">
            学年に合わせた脳トレゲームに挑戦しよう。まずは学年をえらんで、ぴったりのゲームを選択してください。
          </p>
        </div>
      </header>

      <section class="space-y-6">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-xl font-bold text-[var(--mq-ink)]">学年を選ぶ</h2>
          {grade ? (
            <div class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm">
              <span class="rounded-xl bg-[var(--mq-primary-soft)] px-2 py-1 text-[var(--mq-primary-strong)]">
                {grade.label}
              </span>
              <span class="text-[#5e718a]">{grade.description}</span>
            </div>
          ) : null}
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gameGradeLevels.map(level => (
            <a
              key={level.id}
              href={`/game?grade=${encodeURIComponent(level.id)}`}
              class={`flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)] ${
                grade?.id === level.id
                  ? 'bg-gradient-to-br from-[var(--mq-primary-soft)] to-white'
                  : 'bg-gradient-to-br from-white to-[var(--mq-primary-soft)]'
              }`}
            >
              <div class="text-2xl font-bold text-[var(--mq-ink)]">{level.label}</div>
              <div class="text-sm text-[#5e718a]">{level.description}</div>
              <div class="text-xs font-semibold uppercase tracking-wide text-[var(--mq-primary-strong)]">
                {level.highlight}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section class="space-y-4 rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-xl font-bold text-[var(--mq-ink)]">ゲームを選ぶ</h2>
          {grade ? (
            <span class="text-xs font-semibold uppercase tracking-[0.3em] text-[#6c7c90]">
              {grade.label}向けおすすめ
            </span>
          ) : null}
        </div>

        {!grade ? (
          <p class="text-sm text-[#5e718a]">
            ゲームを選ぶ前に、まずは学年を選択してください。
          </p>
        ) : (
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href={`/game/sudoku?grade=${encodeURIComponent(grade.id)}`}
              class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
            >
              <div class="flex items-center gap-3">
                <span class="text-3xl">🧩</span>
                <div>
                  <div class="text-lg font-bold text-[var(--mq-ink)]">数独</div>
                  <div class="text-xs text-[#5e718a]">論理パズルで集中力アップ</div>
                </div>
              </div>
              <div class="space-y-1 text-xs text-[#5e718a]">
                {getSudokuPresetsForGrade(grade.id).map(preset => (
                  <div key={preset.id} class="flex items-center gap-2">
                    <span>{preset.icon}</span>
                    <span class="font-semibold text-[var(--mq-ink)]">
                      {preset.label}
                    </span>
                    {preset.recommended ? (
                      <span class="rounded-lg bg-[var(--mq-primary-soft)] px-2 py-0.5 text-[var(--mq-primary-strong)]">
                        おすすめ
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </a>
          </div>
        )}
      </section>
    </div>
  );
};
