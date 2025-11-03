import type { FC } from 'hono/jsx';
import { html } from 'hono/html';
import type { CurrentUser } from '../../application/session/current-user';
import type { GameGradeLevel } from './game-presets';
import type { StellarBalancePuzzle } from './stellar-balance-presets';
import { renderStellarBalanceClientScript } from './stellar-balance.client';

const SYMBOL_MAP = {
  S: { icon: '☀️', label: '太陽タイル' },
  M: { icon: '🌙', label: '月タイル' },
  N: { icon: '⭐', label: '星タイル' },
} as const;

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
      class="relative flex min-h-screen flex-col bg-[var(--mq-surface-strong)] text-[var(--mq-ink)]"
      data-user-state={currentUser ? 'known' : 'anonymous'}
      data-grade-id={grade.id}
      data-puzzle={puzzleData}
      style="--mq-primary: #5DB996; --mq-primary-strong: #3AA07A; --mq-primary-soft: #D6F5E7; --mq-accent: #A8EBD0; --mq-outline: rgba(93, 185, 150, 0.45); --mq-ink: #0f172a; --mq-surface: #f8fafc; --mq-surface-strong: #e2e8f0;"
    >
      {html`
        <style>
          .stellar-layout {
            display: grid;
            gap: 2.5rem;
          }

          @media (min-width: 1024px) {
            .stellar-layout {
              grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr);
              align-items: start;
            }
          }

          .stellar-card {
            background: white;
            border-radius: 1.75rem;
            border: 1px solid rgba(93, 185, 150, 0.25);
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.1);
          }

          .stellar-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 6px;
            padding: 1.5rem;
            border-radius: 1.5rem;
            background: linear-gradient(
              135deg,
              rgba(214, 245, 231, 0.8),
              rgba(168, 235, 208, 0.65)
            );
            border: 1px solid rgba(93, 185, 150, 0.4);
            backdrop-filter: blur(6px);
          }

          .stellar-cell {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 1rem;
            border: 2px solid rgba(15, 23, 42, 0.08);
            background: rgba(255, 255, 255, 0.92);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.875rem;
            font-weight: 700;
            color: #0f172a;
            position: relative;
            cursor: pointer;
            transition:
              transform 0.2s ease,
              box-shadow 0.2s ease,
              border-color 0.2s ease;
          }

          .stellar-cell:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
            border-color: rgba(58, 160, 122, 0.7);
            background: white;
          }

          .stellar-cell[data-locked='true'] {
            background: linear-gradient(135deg, #d6f5e7 0%, #c0ebd9 100%);
            border-color: rgba(58, 160, 122, 0.8);
            cursor: default;
          }

          .stellar-cell[data-hinted='true'] {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-color: rgba(217, 119, 6, 0.8);
          }

          .stellar-cell[data-state='error'] {
            border-color: rgba(239, 68, 68, 0.85);
            box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.35);
          }

          .stellar-cell[data-state='complete'] {
            background: linear-gradient(
              135deg,
              rgba(167, 243, 208, 0.4),
              rgba(134, 239, 172, 0.4)
            );
            border-color: rgba(16, 185, 129, 0.85);
          }

          .stellar-toolbar {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 0.75rem;
            margin-top: 1.5rem;
          }

          .stellar-toolbar button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            border-radius: 1rem;
            border: 2px solid rgba(148, 163, 184, 0.35);
            background: white;
            font-weight: 700;
            font-size: 1rem;
            padding: 0.65rem 0.5rem;
            transition:
              transform 0.2s ease,
              border-color 0.2s ease,
              box-shadow 0.2s ease;
          }

          .stellar-toolbar button[data-active='true'] {
            border-color: rgba(58, 160, 122, 0.8);
            background: rgba(214, 245, 231, 0.9);
            box-shadow: 0 10px 20px rgba(59, 130, 246, 0.15);
          }

          .stellar-toolbar button:hover {
            transform: translateY(-2px);
            border-color: rgba(58, 160, 122, 0.7);
          }

          .stellar-counts {
            margin-top: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .stellar-count-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            border-radius: 1rem;
            background: rgba(15, 23, 42, 0.04);
            font-weight: 600;
          }

          .stellar-feedback {
            margin-top: 1.5rem;
            border-radius: 1.5rem;
            padding: 1.25rem;
            border: 1px solid rgba(148, 163, 184, 0.35);
            background: rgba(255, 255, 255, 0.85);
            font-size: 0.95rem;
            line-height: 1.6;
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
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .stellar-actions button {
            width: 100%;
            border-radius: 1.25rem;
            padding: 0.85rem 1rem;
            font-weight: 700;
            font-size: 0.95rem;
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
          }

          .stellar-actions button:hover:not(:disabled) {
            transform: translateY(-2px);
            border-color: rgba(58, 160, 122, 0.8);
            box-shadow: 0 14px 25px rgba(15, 23, 42, 0.18);
          }

          .stellar-actions button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .stellar-instruction-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .stellar-instruction-item {
            display: flex;
            gap: 0.75rem;
            align-items: flex-start;
          }
        </style>
      `}
      <header class="bg-white/90 shadow-lg">
        <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-8 lg:px-12">
          <div class="flex flex-col gap-2">
            <span class="inline-flex w-fit items-center gap-2 rounded-2xl bg-[var(--mq-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--mq-primary-strong)]">
              🌌 新作ロジックパズル
            </span>
            <h1 class="text-3xl font-extrabold tracking-tight text-[var(--mq-ink)] sm:text-4xl">
              Stellar Balance（ステラ・バランス）
            </h1>
            <p class="max-w-3xl text-sm leading-relaxed text-[#475569] sm:text-base">
              {grade.label}
              向けのスペースタイルパズルに挑戦しよう。太陽・月・星のタイルをならべて、宇宙観測士のリクエストどおりにグリッドのバランスを整えます。
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2 text-sm text-[#475569]">
            <span class="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-[var(--mq-primary-strong)]">
              🎯 {puzzle.label}
            </span>
            <span class="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-[#0f172a]">
              📏 6×6 グリッド
            </span>
            <span class="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-[#0f172a]">
              🧭 難易度:{' '}
              {puzzle.difficulty === 'gentle'
                ? 'やさしい'
                : puzzle.difficulty === 'steady'
                  ? 'ふつう'
                  : 'チャレンジ'}
            </span>
          </div>
        </div>
      </header>

      <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-8 lg:px-12">
        <div class="stellar-layout">
          <section class="stellar-card p-6 sm:p-8">
            <div class="flex flex-col gap-6">
              <div>
                <h2 class="text-xl font-bold text-[var(--mq-ink)]">
                  タイルを配置しよう
                </h2>
                <p class="mt-2 text-sm text-[#475569]">
                  マスを選んで、下のツールバーから置きたいタイルをえらびます。各行・各列には太陽・月・星がそれぞれ
                  2 つずつ入ります。
                </p>
              </div>

              <div
                class="stellar-grid"
                id="stellar-grid"
                role="grid"
                aria-label="ステラ・バランスのグリッド"
              >
                {puzzle.puzzle.map((row, rowIndex) =>
                  row.split('').map((cell, columnIndex) => {
                    const symbolInfo =
                      SYMBOL_MAP[cell as keyof typeof SYMBOL_MAP];
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

              <div
                class="stellar-toolbar"
                role="group"
                aria-label="タイルパレット"
              >
                <button
                  type="button"
                  class="stellar-toolbar__button"
                  data-stellar-symbol="S"
                  data-active="true"
                >
                  <span class="text-2xl" aria-hidden="true">
                    {SYMBOL_MAP.S.icon}
                  </span>
                  <span class="text-xs font-semibold text-[#475569]">太陽</span>
                </button>
                <button
                  type="button"
                  class="stellar-toolbar__button"
                  data-stellar-symbol="M"
                >
                  <span class="text-2xl" aria-hidden="true">
                    {SYMBOL_MAP.M.icon}
                  </span>
                  <span class="text-xs font-semibold text-[#475569]">月</span>
                </button>
                <button
                  type="button"
                  class="stellar-toolbar__button"
                  data-stellar-symbol="N"
                >
                  <span class="text-2xl" aria-hidden="true">
                    {SYMBOL_MAP.N.icon}
                  </span>
                  <span class="text-xs font-semibold text-[#475569]">星</span>
                </button>
                <button
                  type="button"
                  class="stellar-toolbar__button"
                  data-stellar-symbol="."
                >
                  <span class="text-2xl" aria-hidden="true">
                    🧽
                  </span>
                  <span class="text-xs font-semibold text-[#475569]">
                    消しゴム
                  </span>
                </button>
              </div>

              <div class="stellar-counts" id="stellar-counts">
                {Object.entries(SYMBOL_MAP).map(([symbol, info]) => (
                  <div
                    key={symbol}
                    class="stellar-count-row"
                    data-symbol={symbol}
                  >
                    <div class="flex items-center gap-2 text-[var(--mq-ink)]">
                      <span class="text-2xl" aria-hidden="true">
                        {info.icon}
                      </span>
                      <span class="text-sm font-semibold">{info.label}</span>
                    </div>
                    <div class="text-sm text-[#475569]">
                      <span class="font-bold" data-role="current">
                        0
                      </span>
                      <span class="mx-1">/</span>
                      <span data-role="target">12</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside class="stellar-card flex flex-col gap-6 p-6 sm:p-8">
            <div>
              <h2 class="text-xl font-bold text-[var(--mq-ink)]">遊び方</h2>
              <div class="mt-4 stellar-instruction-list text-sm text-[#475569]">
                <div class="stellar-instruction-item">
                  <span class="text-xl" aria-hidden="true">
                    ①
                  </span>
                  <p>
                    3 種類のタイル（{SYMBOL_MAP.S.icon}・{SYMBOL_MAP.M.icon}・
                    {SYMBOL_MAP.N.icon}
                    ）でグリッドをうめます。各行と各列には同じタイルが 2
                    つずつ入ります。
                  </p>
                </div>
                <div class="stellar-instruction-item">
                  <span class="text-xl" aria-hidden="true">
                    ②
                  </span>
                  <p>
                    同じタイルがタテ・ヨコでならんでしまわないようにしましょう。隣り合うマスはちがうタイルになるよう調整します。
                  </p>
                </div>
                <div class="stellar-instruction-item">
                  <span class="text-xl" aria-hidden="true">
                    ③
                  </span>
                  <p>
                    すべての条件をみたすとクリア！観測チームからのレポートに合わせたバランスが整えば成功です。
                  </p>
                </div>
              </div>
            </div>

            <div class="stellar-feedback" id="stellar-feedback">
              太陽・月・星のバランスをチェックしながら進めてみましょう。ヒントボタンを押すと
              1 マスだけ正解が表示されます。
            </div>

            <div class="stellar-actions">
              <button
                type="button"
                id="stellar-check"
                class="border-[var(--mq-primary)] bg-[var(--mq-primary-soft)] text-[var(--mq-primary-strong)]"
              >
                <span aria-hidden="true">✅</span>
                バランスを判定
              </button>
              <button
                type="button"
                id="stellar-hint"
                class="border-amber-200 bg-amber-50 text-amber-700"
              >
                <span aria-hidden="true">💡</span>1 マスだけヒント
              </button>
              <button type="button" id="stellar-reset">
                <span aria-hidden="true">🔄</span>
                最初の状態にもどす
              </button>
              <button
                type="button"
                id="stellar-new"
                class="border-slate-300 bg-white text-[var(--mq-ink)]"
              >
                <span aria-hidden="true">🎲</span>
                べつの星図を読み込む
              </button>
            </div>

            <div class="rounded-2xl bg-[var(--mq-primary-soft)]/60 p-4 text-sm text-[var(--mq-ink)]">
              <p class="font-semibold">今回のミッション</p>
              <p class="mt-1 leading-relaxed">{puzzle.description}</p>
            </div>
          </aside>
        </div>
      </main>

      {renderStellarBalanceClientScript()}
    </div>
  );
};
