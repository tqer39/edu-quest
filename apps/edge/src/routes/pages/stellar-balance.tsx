import type { FC } from 'hono/jsx';
import { html } from 'hono/html';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { GradeDropdown } from '../../components/GradeDropdown';
import { gameGradeLevels, type GameGradeLevel } from './game-presets';
import type { StellarBalancePuzzle } from './stellar-balance-presets';
import { renderStellarBalanceClientScript } from './stellar-balance.client';
import type { SchoolStage } from '../utils/school-grade';
import type { GradeId } from './grade-presets';

const SYMBOL_MAP = {
  S: { icon: '☀️', label: '太陽' },
  M: { icon: '🌙', label: '月' },
  N: { icon: '⭐', label: '星' },
} as const;

const GameNav: FC<{
  currentUser: CurrentUser | null;
  gradeId: GradeId;
}> = ({ currentUser, gradeId }) => {
  const gradeIndex = gameGradeLevels.findIndex((level) => level.id === gradeId);
  const gradeNumber = gradeIndex >= 0 ? gradeIndex + 1 : 1;

  const availableGrades = gameGradeLevels.map((level, index) => ({
    stage: '小学' as SchoolStage,
    grade: index + 1,
    disabled: level.disabled,
  }));

  return (
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
        <a href="/game" class="transition hover:opacity-80">
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
            🎮
          </span>
        </a>
        <GradeDropdown
          currentGrade={gradeNumber}
          currentStage="小学"
          availableGrades={availableGrades}
          baseUrl="/game/stellar-balance"
        />
      </div>
      <div class="flex flex-wrap gap-2">
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

type StellarBalanceProps = {
  currentUser: CurrentUser | null;
  grade: GameGradeLevel;
  puzzle: StellarBalancePuzzle;
};

export const StellarBalance: FC<StellarBalanceProps> = ({
  currentUser,
  grade,
  puzzle,
}) => {
  const puzzleData = JSON.stringify(puzzle);

  return (
    <div
      id="stellar-balance-root"
      class="flex min-h-screen w-full flex-col"
      data-user-state={currentUser ? 'known' : 'anonymous'}
      data-grade-id={grade.id}
      data-puzzle={puzzleData}
      style="--mq-primary: #5DB996; --mq-primary-strong: #3AA07A; --mq-primary-soft: #D6F5E7; --mq-accent: #A8EBD0; --mq-outline: rgba(93, 185, 150, 0.45); --mq-ink: #0f172a; --mq-surface: #f8fafc; --mq-surface-strong: #e2e8f0;"
    >
      {html`
        <style>
          .stellar-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 1px;
            padding: 0;
            border-radius: 0.5rem;
            background: rgba(148, 163, 184, 0.3);
            border: 2px solid rgba(148, 163, 184, 0.5);
            overflow: hidden;
          }

          .stellar-cell {
            width: 100%;
            aspect-ratio: 1;
            border: none;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: clamp(2rem, 6vw, 3.5rem);
            font-weight: 700;
            color: #0f172a;
            cursor: pointer;
            transition:
              transform 0.15s ease,
              background-color 0.15s ease;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }

          .stellar-cell:hover:not([data-locked='true']) {
            background: rgba(214, 245, 231, 0.5);
          }

          .stellar-cell[data-locked='true'] {
            background: rgba(214, 245, 231, 0.6);
            cursor: default;
          }

          .stellar-cell[data-hinted='true'] {
            background: rgba(254, 243, 199, 0.8);
          }

          .stellar-cell[data-state='error'] {
            background: rgba(254, 226, 226, 0.9);
            box-shadow: inset 0 0 0 3px rgba(239, 68, 68, 0.6);
          }

          .stellar-cell[data-state='complete'] {
            background: rgba(220, 252, 231, 0.8);
          }

          @media (min-width: 640px) {
            .stellar-grid {
              gap: 2px;
              border-radius: 0.75rem;
            }
          }

          .stellar-feedback {
            margin-top: 1rem;
            border-radius: 1rem;
            padding: 0.75rem 1rem;
            border: 1px solid rgba(148, 163, 184, 0.35);
            background: rgba(255, 255, 255, 0.85);
            font-size: 0.875rem;
            line-height: 1.5;
            text-align: center;
          }

          .stellar-feedback[data-variant='success'] {
            border-color: rgba(34, 197, 94, 0.6);
            background: rgba(220, 252, 231, 0.85);
            color: #047857;
          }

          .stellar-feedback[data-variant='warning'] {
            border-color: rgba(248, 113, 113, 0.6);
            background: rgba(254, 226, 226, 0.9);
            color: #b91c1c;
          }

          .stellar-actions {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            margin-top: 1rem;
          }

          .stellar-actions button {
            border-radius: 1rem;
            padding: 0.75rem 1rem;
            font-weight: 700;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            border: 2px solid rgba(148, 163, 184, 0.4);
            background: white;
            transition:
              transform 0.2s ease,
              box-shadow 0.2s ease,
              border-color 0.2s ease;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }

          .stellar-actions button:hover:not(:disabled) {
            transform: translateY(-2px);
            border-color: rgba(58, 160, 122, 0.8);
            box-shadow: 0 8px 16px rgba(15, 23, 42, 0.12);
          }

          .stellar-actions button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        </style>
      `}

      <GameNav currentUser={currentUser} gradeId={grade.id} />

      <main class="flex flex-1 flex-col gap-4 px-4 py-4 sm:px-8 sm:py-6 lg:px-16 xl:px-24">
        <div class="rounded-2xl border border-[var(--mq-outline)] bg-white p-4 shadow-lg sm:p-6">
          <div class="mb-4 flex flex-col gap-2">
            <h1 class="text-xl font-bold text-[var(--mq-ink)] sm:text-2xl">
              🌌 Stellar Balance
            </h1>
            <p class="text-xs text-[#475569] sm:text-sm">
              太陽・月・星のタイルでバランスを整えよう
            </p>
          </div>

          {/* biome-ignore lint/a11y/useSemanticElements: Interactive game grid, not a data table */}
          <div
            class="stellar-grid"
            id="stellar-grid"
            role="grid"
            aria-label="ステラ・バランスのグリッド"
          >
            {puzzle.puzzle.map((row, rowIndex) =>
              row.split('').map((cell, columnIndex) => {
                const symbolInfo = SYMBOL_MAP[cell as keyof typeof SYMBOL_MAP];
                const isLocked = cell !== '.';

                return (
                  <button
                    type="button"
                    key={`${rowIndex}-${columnIndex}`}
                    class="stellar-cell"
                    data-row={rowIndex}
                    data-col={columnIndex}
                    data-locked={isLocked}
                    data-symbol={isLocked && symbolInfo ? cell : ''}
                    aria-label={
                      isLocked && symbolInfo
                        ? `${symbolInfo.label}`
                        : `行${rowIndex + 1} 列${columnIndex + 1}`
                    }
                  >
                    {symbolInfo ? (
                      <span aria-hidden="true">{symbolInfo.icon}</span>
                    ) : (
                      <span class="text-sm font-semibold text-slate-400">
                        ？
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* biome-ignore lint/a11y/useSemanticElements: Dynamic status messages for game feedback */}
          <div
            id="stellar-feedback"
            class="stellar-feedback"
            role="status"
            aria-live="polite"
          >
            タイルをタップして配置しよう。もう一度タップすると次のタイルに変わります。
          </div>

          <div class="stellar-actions">
            <button
              type="button"
              id="stellar-check"
              class="bg-gradient-to-r from-[var(--mq-primary-soft)] to-[var(--mq-accent)]"
            >
              ✅ 判定
            </button>
            <button type="button" id="stellar-hint">
              💡 ヒント
            </button>
            <button type="button" id="stellar-reset">
              🔄 リセット
            </button>
            <button type="button" id="stellar-new">
              🆕 新しい問題
            </button>
          </div>
        </div>
      </main>

      <Footer />
      {renderStellarBalanceClientScript()}
    </div>
  );
};
