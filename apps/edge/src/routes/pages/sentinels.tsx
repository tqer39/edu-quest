import type { FC } from 'hono/jsx';
import { html } from 'hono/html';
import type { CurrentUser } from '../../application/session/current-user';
import type { GameGradeLevel } from './game-presets';
import type { SentinelPuzzle } from './sentinels-puzzles';
import { renderSentinelsClientScript } from './sentinels.client';

const encode = (value: unknown) => encodeURIComponent(JSON.stringify(value));

const REGION_COLORS = [
  '#FDE68A',
  '#FBCFE8',
  '#C7D2FE',
  '#BFDBFE',
  '#BBF7D0',
  '#FED7AA',
  '#E9D5FF',
  '#FBCFE8',
];

type SentinelsProps = {
  currentUser: CurrentUser | null;
  grade: GameGradeLevel;
  puzzle: SentinelPuzzle;
};

export const Sentinels: FC<SentinelsProps> = ({
  currentUser,
  grade,
  puzzle,
}) => {
  const uniqueRegions = Array.from(
    new Set(puzzle.regionMap.join('').split(''))
  );
  const regionColors = uniqueRegions.reduce<Record<string, string>>(
    (acc, region, index) => ({
      ...acc,
      [region]: REGION_COLORS[index % REGION_COLORS.length],
    }),
    {}
  );

  return (
    <div
      id="sentinel-root"
      class="relative flex min-h-screen flex-col bg-[var(--mq-surface-strong)] text-[var(--mq-ink)]"
      data-user-state={currentUser ? 'known' : 'anonymous'}
      data-grade-id={grade.id}
      data-target-count={puzzle.targetCount}
      data-puzzle={encode(puzzle)}
      data-region-colors={encode(regionColors)}
      data-puzzle-name={puzzle.name}
      data-puzzle-difficulty={puzzle.difficulty}
      style="--mq-primary: #5DB996; --mq-primary-strong: #3AA07A; --mq-primary-soft: #D6F5E7; --mq-accent: #A8EBD0; --mq-outline: rgba(93, 185, 150, 0.45); --mq-ink: #0f172a; --mq-surface: #f8fafc; --mq-surface-strong: #e2e8f0;"
    >
      {html`
        <style>
          .sentinel-layout {
            display: grid;
            gap: 1.5rem;
            grid-template-columns: minmax(0, 1fr);
          }

          @media (min-width: 1024px) {
            .sentinel-layout {
              grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
            }
          }

          .sentinel-grid {
            display: grid;
            gap: 2px;
            border-radius: 1.5rem;
            overflow: hidden;
            background: rgba(15, 23, 42, 0.08);
            padding: 6px;
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
          }

          .sentinel-cell {
            position: relative;
            border: none;
            border-radius: 12px;
            width: 100%;
            aspect-ratio: 1;
            font-size: 2rem;
            font-weight: 700;
            color: #0f172a;
            background: var(--region-color, white);
            display: flex;
            align-items: center;
            justify-content: center;
            transition:
              transform 0.2s ease,
              box-shadow 0.2s ease;
            box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
            cursor: pointer;
          }

          .sentinel-cell[data-state='sentinel'] {
            color: #14532d;
            background: linear-gradient(
              135deg,
              rgba(134, 239, 172, 0.4),
              rgba(74, 222, 128, 0.7)
            );
            box-shadow: inset 0 0 0 2px rgba(34, 197, 94, 0.6);
          }

          .sentinel-cell[data-state='maybe']::after {
            content: '×';
            font-size: 1.75rem;
            color: rgba(15, 23, 42, 0.55);
          }

          .sentinel-cell[data-state='blocked'] {
            color: rgba(15, 23, 42, 0.3);
            background: repeating-linear-gradient(
              135deg,
              rgba(148, 163, 184, 0.15) 0px,
              rgba(148, 163, 184, 0.15) 6px,
              rgba(148, 163, 184, 0.3) 6px,
              rgba(148, 163, 184, 0.3) 12px
            );
            cursor: not-allowed;
          }

          .sentinel-cell[data-hint='true'] {
            box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.6);
            animation: hintPulse 0.8s ease-in-out infinite alternate;
          }

          .sentinel-cell[data-state='given'] {
            background: linear-gradient(
              135deg,
              rgba(59, 130, 246, 0.25),
              rgba(147, 197, 253, 0.35)
            );
            color: #1d4ed8;
            box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.4);
            cursor: default;
          }

          .sentinel-cell[data-error='true'] {
            animation: sentinel-error 0.35s ease-in-out;
            box-shadow: inset 0 0 0 2px rgba(248, 113, 113, 0.8);
          }

          @keyframes hintPulse {
            0% {
              transform: scale(1);
            }
            100% {
              transform: scale(1.04);
            }
          }

          @keyframes sentinel-error {
            0%,
            100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-4px);
            }
            75% {
              transform: translateX(4px);
            }
          }

          .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: linear-gradient(
              135deg,
              rgba(59, 130, 246, 0.12),
              rgba(165, 180, 252, 0.24)
            );
            border-radius: 9999px;
            font-size: 0.85rem;
            font-weight: 700;
            color: #1d4ed8;
          }

          .command-button {
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }

          .command-button::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.35),
              transparent
            );
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .command-button:hover::after {
            opacity: 1;
          }

          .status-chip {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.4rem 0.8rem;
            border-radius: 9999px;
            background: rgba(15, 23, 42, 0.08);
            font-size: 0.85rem;
            font-weight: 600;
            color: rgba(15, 23, 42, 0.7);
          }

          .status-chip[data-state='good'] {
            background: rgba(34, 197, 94, 0.15);
            color: #15803d;
          }

          .status-chip[data-state='warning'] {
            background: rgba(251, 191, 36, 0.18);
            color: #b45309;
          }

          .status-chip[data-state='error'] {
            background: rgba(248, 113, 113, 0.2);
            color: #b91c1c;
          }

          .rule-card {
            border-radius: 1.5rem;
            border: 1px solid rgba(15, 23, 42, 0.08);
            background: white;
            padding: 1.5rem;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          }

          .rule-card h3 {
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            color: rgba(15, 23, 42, 0.8);
          }

          .rule-card ul {
            display: grid;
            gap: 0.5rem;
            font-size: 0.95rem;
            color: rgba(30, 41, 59, 0.82);
          }

          .celebration {
            animation: celebrate-scale 0.6s ease-in-out;
          }

          @keyframes celebrate-scale {
            0% {
              transform: scale(0.95);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
        </style>
      `}

      <header class="sticky top-0 z-40 flex flex-col gap-4 border-b border-[var(--mq-outline)] bg-[var(--mq-surface)]/90 px-4 py-4 backdrop-blur sm:px-8 lg:px-16 xl:px-24">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-col">
            <span class="text-xs font-semibold uppercase tracking-wide text-[#5e718a]">
              GameQuest | {grade.label}
            </span>
            <h1 class="text-2xl font-extrabold text-[var(--mq-ink)]">
              {puzzle.name}
            </h1>
          </div>
          <div class="flex flex-wrap items-center gap-2 text-sm">
            <span class="status-chip" id="sentinel-timer">
              ⏱ 00:00
            </span>
            <span
              class="status-chip"
              id="sentinel-progress"
              data-state="warning"
            >
              🛡️ 0 / {puzzle.targetCount}
            </span>
            <span class="badge">
              難易度: {puzzle.difficulty === 'intro' ? '入門' : '標準'}
            </span>
          </div>
        </div>
        <p class="max-w-4xl text-sm text-[#5e718a]">{puzzle.description}</p>
      </header>

      <main class="sentinel-layout px-4 pb-16 sm:px-8 lg:px-16 xl:px-24">
        <section class="flex flex-col gap-6">
          <div class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-xl">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 class="text-lg font-bold text-[var(--mq-ink)]">
                センチネルを配置しよう
              </h2>
              <div class="flex flex-wrap items-center gap-2 text-xs text-[#5e718a]">
                <span class="status-chip" id="row-status">
                  行: 0 / {puzzle.targetCount}
                </span>
                <span class="status-chip" id="column-status">
                  列: 0 / {puzzle.targetCount}
                </span>
                <span class="status-chip" id="region-status">
                  領域: 0 / {puzzle.targetCount}
                </span>
              </div>
            </div>
            <div
              class="sentinel-grid"
              id="sentinel-grid"
              data-size={puzzle.size}
            ></div>
            <div
              id="sentinel-feedback"
              class="mt-4 min-h-[48px] rounded-2xl bg-[var(--mq-primary-soft)]/60 px-4 py-3 text-center text-sm font-semibold text-[var(--mq-primary-strong)]"
            ></div>
          </div>
        </section>

        <aside class="flex flex-col gap-6">
          <div class="rule-card">
            <h3>ルールと操作</h3>
            <ul>
              <li>各行・各列・各色の領域にセンチネルを 1 体ずつ配置します。</li>
              <li>
                センチネルはナイトのように L
                字にジャンプします。同じナイトの動きで到達できる場所には配置できません。
              </li>
              <li>
                セルをタップすると「配置 → 推論メモ → 空白」と切り替わります。
              </li>
              <li>ブロックされたセル (× 印) にはセンチネルを置けません。</li>
            </ul>
          </div>

          <div class="rule-card space-y-4">
            <h3>アクション</h3>
            <div class="flex flex-col gap-3">
              <button
                id="check-sentinels"
                type="button"
                class="command-button inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--mq-primary)] to-[var(--mq-primary-strong)] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span class="text-lg">✅</span>
                チェックする
              </button>
              <button
                id="hint-sentinels"
                type="button"
                class="command-button inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white px-4 py-3 text-sm font-bold text-amber-700 shadow-md transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
              >
                <span class="text-lg">💡</span>
                推論メモを整理
              </button>
              <button
                id="reset-sentinels"
                type="button"
                class="command-button inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-surface)] px-4 py-3 text-sm font-bold text-[var(--mq-ink)] shadow-md transition hover:-translate-y-1 hover:border-[var(--mq-primary)] hover:shadow-lg"
              >
                <span class="text-lg">🔄</span>
                リセット
              </button>
              <a
                href={`/game/sentinels?grade=${encodeURIComponent(grade.id)}`}
                class="command-button inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-3 text-sm font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-1 hover:bg-[var(--mq-surface)]"
              >
                <span class="text-lg">🎯</span>
                ステージ選択に戻る
              </a>
            </div>
          </div>
        </aside>
      </main>

      {renderSentinelsClientScript()}
    </div>
  );
};
