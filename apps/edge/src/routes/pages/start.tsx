import type { FC } from 'hono/jsx';
import { html } from 'hono/html';
import type { CurrentUser } from '../../application/session/current-user';
import { BackToTopLink } from '../components/back-to-top-link';
import {
  gradeLevels,
  calculationTypes,
  practiceThemes,
  gradePresets,
  gradeCalculationTypes,
  type GradeId,
} from './grade-presets';
import { renderStartClientScript } from './start.client';

const baseQuestionCountOptions = [10, 20, 30] as const;
const isDevelopment = true;
const questionCountOptions = (
  isDevelopment ? [1, ...baseQuestionCountOptions] : baseQuestionCountOptions
) as readonly number[];

type StartProps = {
  currentUser: CurrentUser | null;
  selectedGradeId: GradeId;
  initialActivity?: 'math' | 'game';
  initialCalculationTypeId?: string;
};

export const Start: FC<StartProps> = ({
  currentUser,
  selectedGradeId,
  initialActivity,
  initialCalculationTypeId,
}) => {
  const selectedGrade =
    gradeLevels.find((grade) => grade.id === selectedGradeId) ?? gradeLevels[0];

  return (
    <div
      id="start-root"
      class="flex min-h-screen w-full flex-col gap-8 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
      data-user-state={currentUser ? 'known' : 'anonymous'}
      data-selected-grade={selectedGrade.id}
      data-selected-activity={initialActivity ?? ''}
      data-selected-calculation-type={initialCalculationTypeId ?? ''}
    >
      {html`
        <style>
          .step-hidden {
            display: none !important;
          }
          .selection-card--selected {
            background: var(--mq-primary-soft) !important;
            border-color: var(--mq-primary) !important;
            box-shadow: 0 12px 28px rgba(15, 23, 42, 0.16);
            transform: translateY(-2px);
          }
          .setting-toggle--on {
            background: var(--mq-primary-soft) !important;
            border-color: var(--mq-primary) !important;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          }
          .setting-toggle {
            position: relative;
          }
          .setting-toggle::after {
            content: 'OFF';
            position: absolute;
            top: 0.75rem;
            right: 1rem;
            font-size: 0.75rem;
            font-weight: 700;
            color: #94a3b8;
            transition: all 0.2s;
          }
          .setting-toggle--on::after {
            content: 'ON';
            color: var(--mq-primary-strong);
          }
        </style>
      `}

      <nav class="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-3 shadow-sm sm:flex-nowrap sm:gap-4 sm:px-6">
        <div class="flex items-center gap-3">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--mq-primary-soft)] text-base font-bold text-[var(--mq-primary-strong)]">
            MQ
          </span>
          <span class="text-lg font-semibold tracking-tight text-[var(--mq-ink)]">
            れんしゅうの じゅんび
          </span>
        </div>
        <BackToTopLink class="hover:bg-[var(--mq-primary-soft)]" />
      </nav>

      <div class="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section id="main-steps" class="space-y-8">
          {/* STEP 1: 学年の確認 */}
          <div id="step-1-grade" class="space-y-4">
            <div>
              <p class="step-number text-xs font-semibold uppercase tracking-[0.35em] text-[#6c7c90]">
                STEP 1
              </p>
              <h2 class="text-2xl font-extrabold text-[var(--mq-ink)]">
                選んだ学年
              </h2>
              <p class="mt-1 text-sm text-[#5e718a]">
                学年にもとづいて、おすすめの計算種類とテーマを表示します。
              </p>
            </div>
            <div
              id="grade-summary"
              data-grade-id={selectedGrade.id}
              class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm"
            >
              <div class="flex flex-col gap-1">
                <p class="text-sm font-semibold text-[#5e718a]">現在の学年</p>
                <p
                  data-role="grade-label"
                  class="text-2xl font-extrabold text-[var(--mq-ink)]"
                >
                  {selectedGrade.label}
                </p>
                <p
                  data-role="grade-description"
                  class="text-sm font-semibold text-[var(--mq-primary-strong)]"
                >
                  {selectedGrade.description}
                </p>
              </div>
              <a
                href="/math"
                class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-2 text-sm font-semibold text-[var(--mq-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)]"
              >
                ↩ 学年を変更する
              </a>
            </div>
          </div>

          {/* STEP 2: 活動選択 */}
          <div id="step-2-activity" class="space-y-4">
            <div>
              <p class="step-number text-xs font-semibold uppercase tracking-[0.35em] text-[#6c7c90]"></p>
              <h2 class="text-2xl font-extrabold text-[var(--mq-ink)]">
                クエストを選ぶ
              </h2>
              <p class="mt-1 text-sm text-[#5e718a]">
                やりたいクエストをえらんでスタートしよう。
              </p>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                data-activity="math"
                class="activity-btn rounded-3xl border-2 border-transparent bg-white p-6 text-left shadow-md transition hover:-translate-y-1 hover:border-[var(--mq-primary)]"
              >
                <p class="text-xl font-bold text-[var(--mq-primary-strong)]">
                  🧮 さんすうクエスト
                </p>
                <p class="mt-2 text-sm text-[var(--mq-ink)]">
                  算数の問題を解こう
                </p>
              </button>
              <button
                type="button"
                data-activity="game"
                class="activity-btn rounded-3xl border-2 border-transparent bg-white p-6 text-left shadow-md transition hover:-translate-y-1 hover:border-[var(--mq-primary)]"
              >
                <p class="text-xl font-bold text-[var(--mq-primary-strong)]">
                  🎮 ゲームする
                </p>
                <p class="mt-2 text-sm text-[var(--mq-ink)]">
                  数独などで遊ぼう
                </p>
              </button>
            </div>
          </div>

          {/* 計算の種類選択 */}
          <div id="step-3-calc-type" class="step-hidden space-y-4">
            <div>
              <p class="step-number text-xs font-semibold uppercase tracking-[0.35em] text-[#6c7c90]"></p>
              <h2 class="text-2xl font-extrabold text-[var(--mq-ink)]">
                計算の種類をえらぼう
              </h2>
            </div>
            <div
              id="calculation-type-grid"
              class="grid gap-3 sm:grid-cols-3 xl:grid-cols-5"
            >
              {/* JavaScriptで動的に生成 */}
            </div>
          </div>

          {/* カスタム設定 */}
          <div id="step-4-custom" class="step-hidden space-y-4">
            <div>
              <p class="step-number text-xs font-semibold uppercase tracking-[0.35em] text-[#6c7c90]"></p>
              <h2 class="text-2xl font-extrabold text-[var(--mq-ink)]">
                カスタム設定
              </h2>
              <p class="text-sm text-[#5e718a]">
                計算の種類・項数・答えの上限値を自由に設定できます
              </p>
            </div>
            <div class="space-y-6">
              {/* 計算の種類 */}
              <fieldset class="space-y-3">
                <legend class="text-sm font-semibold text-[var(--mq-ink)]">
                  計算の種類をえらぶ（複数選択OK）
                </legend>
                <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <label class="inline-flex items-center gap-2 rounded-xl border border-[var(--mq-outline)] bg-white px-3 py-2 shadow-sm transition hover:border-[var(--mq-primary)] cursor-pointer">
                    <input
                      type="checkbox"
                      id="custom-op-add"
                      value="add"
                      class="h-4 w-4 accent-[var(--mq-primary-strong)]"
                    />
                    <span class="text-sm font-semibold">たし算</span>
                  </label>
                  <label class="inline-flex items-center gap-2 rounded-xl border border-[var(--mq-outline)] bg-white px-3 py-2 shadow-sm transition hover:border-[var(--mq-primary)] cursor-pointer">
                    <input
                      type="checkbox"
                      id="custom-op-sub"
                      value="sub"
                      class="h-4 w-4 accent-[var(--mq-primary-strong)]"
                    />
                    <span class="text-sm font-semibold">ひき算</span>
                  </label>
                  <label class="inline-flex items-center gap-2 rounded-xl border border-[var(--mq-outline)] bg-white px-3 py-2 shadow-sm transition hover:border-[var(--mq-primary)] cursor-pointer">
                    <input
                      type="checkbox"
                      id="custom-op-mix"
                      value="mix"
                      class="h-4 w-4 accent-[var(--mq-primary-strong)]"
                    />
                    <span class="text-sm font-semibold">
                      たし算・ひき算の混合
                    </span>
                  </label>
                  <label class="inline-flex items-center gap-2 rounded-xl border border-[var(--mq-outline)] bg-white px-3 py-2 shadow-sm transition hover:border-[var(--mq-primary)] cursor-pointer">
                    <input
                      type="checkbox"
                      id="custom-op-mul"
                      value="mul"
                      class="h-4 w-4 accent-[var(--mq-primary-strong)]"
                    />
                    <span class="text-sm font-semibold">かけ算</span>
                  </label>
                  <label class="inline-flex items-center gap-2 rounded-xl border border-[var(--mq-outline)] bg-white px-3 py-2 shadow-sm transition hover:border-[var(--mq-primary)] cursor-pointer">
                    <input
                      type="checkbox"
                      id="custom-op-div"
                      value="div"
                      class="h-4 w-4 accent-[var(--mq-primary-strong)]"
                    />
                    <span class="text-sm font-semibold">わり算</span>
                  </label>
                  <label class="inline-flex items-center gap-2 rounded-xl border border-[var(--mq-outline)] bg-white px-3 py-2 shadow-sm transition hover:border-[var(--mq-primary)] cursor-pointer">
                    <input
                      type="checkbox"
                      id="custom-op-add-inverse"
                      value="add-inverse"
                      class="h-4 w-4 accent-[var(--mq-primary-strong)]"
                    />
                    <span class="text-sm font-semibold">
                      ぎゃくさん（たし算）
                    </span>
                  </label>
                  <label class="inline-flex items-center gap-2 rounded-xl border border-[var(--mq-outline)] bg-white px-3 py-2 shadow-sm transition hover:border-[var(--mq-primary)] cursor-pointer">
                    <input
                      type="checkbox"
                      id="custom-op-sub-inverse"
                      value="sub-inverse"
                      class="h-4 w-4 accent-[var(--mq-primary-strong)]"
                    />
                    <span class="text-sm font-semibold">
                      ぎゃくさん（ひき算）
                    </span>
                  </label>
                </div>
              </fieldset>

              {/* 項数 */}
              <fieldset class="space-y-3">
                <legend class="text-sm font-semibold text-[var(--mq-ink)]">
                  項数（いくつの数を使うか）
                </legend>
                <div class="flex flex-wrap gap-3">
                  {[2, 3, 4, 5].map((terms) => (
                    <label
                      key={terms}
                      class="inline-flex items-center gap-2 rounded-xl border border-[var(--mq-outline)] bg-white px-3 py-2 shadow-sm transition hover:border-[var(--mq-primary)] cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="custom-terms"
                        value={terms}
                        defaultChecked={terms === 2}
                        class="h-4 w-4 accent-[var(--mq-primary-strong)]"
                      />
                      <span class="text-sm font-semibold">{terms}つ</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* 答えの上限値 */}
              <fieldset class="space-y-3">
                <legend class="text-sm font-semibold text-[var(--mq-ink)]">
                  答えの上限値
                </legend>
                <div class="flex flex-wrap gap-3">
                  {[10, 20, 50, 100, 200, 500, 1000].map((max) => (
                    <label
                      key={max}
                      class="inline-flex items-center gap-2 rounded-xl border border-[var(--mq-outline)] bg-white px-3 py-2 shadow-sm transition hover:border-[var(--mq-primary)] cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="custom-max"
                        value={max}
                        defaultChecked={max === 100}
                        class="h-4 w-4 accent-[var(--mq-primary-strong)]"
                      />
                      <span class="text-sm font-semibold">{max}まで</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          {/* テーマ選択 */}
          <div id="step-4-theme" class="step-hidden space-y-4">
            <div>
              <p class="step-number text-xs font-semibold uppercase tracking-[0.35em] text-[#6c7c90]"></p>
              <h2 class="text-2xl font-extrabold text-[var(--mq-ink)]">
                テーマをえらぼう（えらばなくてもOK）
              </h2>
              <p class="text-sm text-[#5e718a]">
                集中して取り組みたいテーマがあれば選択してください
              </p>
            </div>
            <div
              id="theme-grid"
              class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
            >
              {practiceThemes.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  data-theme-id={preset.id}
                  data-mode={preset.mode}
                  data-max={preset.max}
                  data-min-grade={preset.minGrade}
                  class="theme-btn rounded-2xl border-2 border-[var(--mq-outline)] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--mq-primary)]"
                >
                  <p class="text-sm font-bold text-[#5e718a]">{preset.label}</p>
                  <p class="text-sm font-semibold text-[var(--mq-ink)]">
                    {preset.description}
                  </p>
                  <div class="mt-3 flex items-center justify-between text-xs font-semibold text-[#5e718a]">
                    <span>
                      <span aria-hidden="true">
                        {preset.difficulty.creature.emoji}
                      </span>{' '}
                      {preset.difficulty.creature.name}
                    </span>
                    <span>Lv {preset.difficulty.value}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ゲーム選択 */}
          <div id="step-4-game" class="step-hidden space-y-4">
            <div>
              <p class="step-number text-xs font-semibold uppercase tracking-[0.35em] text-[#6c7c90]"></p>
              <h2 class="text-2xl font-extrabold text-[var(--mq-ink)]">
                ゲームをえらぼう
              </h2>
            </div>
            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <button
                type="button"
                data-game="sudoku"
                class="game-btn rounded-3xl border-2 border-transparent bg-white p-6 text-left shadow-md transition hover:-translate-y-1 hover:border-[var(--mq-primary)]"
              >
                <p class="text-xl font-bold text-[var(--mq-primary-strong)]">
                  🔢 数独
                </p>
                <p class="mt-2 text-sm text-[var(--mq-ink)]">
                  論理的思考力を鍛えよう
                </p>
              </button>
            </div>
          </div>
        </section>

        {/* 右サイドバー: 設定 */}
        <section
          id="settings-step"
          class="space-y-5 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] p-6 shadow-lg self-start sticky top-8"
        >
          <h2 class="text-xl font-semibold text-[var(--mq-ink)]">プレイ設定</h2>

          <fieldset
            id="question-count-fieldset"
            class="space-y-3"
            style="display: none;"
          >
            <legend class="text-xs font-semibold uppercase tracking-wide text-[#6c7c90]">
              問題数
            </legend>
            <div class="flex flex-wrap gap-3 text-sm font-semibold">
              {questionCountOptions.map((count) => (
                <label
                  key={count}
                  class="inline-flex items-center gap-2 rounded-xl border border-transparent bg-white px-3 py-2 shadow-sm transition hover:border-[var(--mq-primary)] cursor-pointer"
                >
                  <input
                    type="radio"
                    name="question-count"
                    value={count}
                    defaultChecked={count === 10}
                    class="h-4 w-4 accent-[var(--mq-primary-strong)]"
                  />
                  {count}問
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset class="space-y-3">
            <legend class="text-xs font-semibold uppercase tracking-wide text-[#6c7c90]">
              ON / OFF 設定
            </legend>
            <div class="grid gap-3">
              <button
                id="toggle-sound"
                type="button"
                data-state="off"
                class="setting-toggle inline-flex flex-col gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-3 text-left text-sm font-semibold transition hover:bg-[var(--mq-primary-soft)]"
              >
                <span>🔊 効果音</span>
                <span class="text-xs text-[#5e718a]">
                  キー操作や正解時のサウンド
                </span>
              </button>
              <button
                id="toggle-countdown"
                type="button"
                data-state="on"
                class="setting-toggle setting-toggle--on inline-flex flex-col gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-3 text-left text-sm font-semibold transition hover:bg-[var(--mq-primary-soft)]"
              >
                <span>⏱️ カウントダウン</span>
                <span class="text-xs text-[#5e718a]">
                  ゲーム開始前のカウントダウン
                </span>
              </button>
              <button
                id="toggle-steps"
                type="button"
                data-state="off"
                class="setting-toggle inline-flex flex-col gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-3 text-left text-sm font-semibold transition hover:bg-[var(--mq-primary-soft)]"
                style="display: none;"
              >
                <span>🧮 途中式</span>
                <span class="text-xs text-[#5e718a]">
                  計算の流れを自動で表示
                </span>
              </button>
            </div>
          </fieldset>

          <button
            id="start-session"
            type="button"
            disabled
            class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--mq-primary)] px-6 py-3 text-lg font-semibold text-[var(--mq-ink)] shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-strong)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            はじめる
          </button>

          <button
            id="clear-selections"
            type="button"
            class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mq-ink)] shadow-sm transition hover:bg-red-50 hover:border-red-300 hover:text-red-700"
          >
            🗑️ リセット
          </button>
        </section>
      </div>

      {renderStartClientScript(gradePresets, calculationTypes, gradeLevels, {
        ...gradeCalculationTypes,
        default: gradeCalculationTypes['grade-1'] ?? [],
      })}
    </div>
  );
};
