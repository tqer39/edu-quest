import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { formatSchoolGradeLabelShort } from '../utils/school-grade';
import type { GradeId } from './grade-presets';
import { gradeLevels } from './grade-presets';
import type { MathPreset } from './math-presets';

type CalcTypeInfo = {
  id: string;
  label: string;
  emoji: string;
};

const MathPresetNav: FC<{
  currentUser: CurrentUser | null;
  gradeId: GradeId;
  calcType: CalcTypeInfo;
}> = ({ currentUser, gradeId, calcType }) => {
  const gradeIndex = Math.max(
    gradeLevels.findIndex((grade) => grade.id === gradeId),
    0
  );
  const gradeNumber = gradeIndex + 1;
  const gradeLabel = formatSchoolGradeLabelShort({
    stage: '小学',
    grade: gradeNumber,
  });

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
        <a href="/math" class="transition hover:opacity-80">
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
            🔢
          </span>
        </a>
        <span class="text-xs font-semibold text-[var(--mq-ink)]">
          {gradeLabel}
        </span>
      </div>
      <div class="flex flex-wrap gap-2">
        <a
          href={`/math/select?grade=${gradeId}`}
          class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
        >
          ← クエスト選択へ戻る
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

type MathPresetSelectProps = {
  currentUser: CurrentUser | null;
  gradeId: GradeId;
  calcType: CalcTypeInfo;
  presets: readonly MathPreset[];
};

export const MathPresetSelect: FC<MathPresetSelectProps> = ({
  currentUser,
  gradeId,
  calcType,
  presets,
}) => {
  const gradeIndex = Math.max(
    gradeLevels.findIndex((grade) => grade.id === gradeId),
    0
  );
  const gradeNumber = gradeIndex + 1;
  const gradeLabel = formatSchoolGradeLabelShort({
    stage: '小学',
    grade: gradeNumber,
  });

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      style="--mq-primary: #6B9BD1; --mq-primary-strong: #3B7AC7; --mq-primary-soft: #D6E4F5; --mq-accent: #B7D4F7; --mq-outline: rgba(107, 155, 209, 0.45); --mq-ink: #0f172a; --mq-surface: #f8fafc; --mq-surface-strong: #e2e8f0;"
    >
      <MathPresetNav
        currentUser={currentUser}
        gradeId={gradeId}
        calcType={calcType}
      />
      <div class="flex flex-1 flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
          <span class="text-6xl">{calcType.emoji}</span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">
              {calcType.label}のテーマを選んでください
            </h1>
            <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
              {gradeLabel}向けのおすすめテーマから選んで、練習をはじめましょう。
            </p>
          </div>
        </header>

        {/* プレイ設定セクション */}
        <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">
            プレイ設定
          </h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-[var(--mq-ink)]">
                  問題数
                </div>
                <div class="text-xs text-[#5e718a]">
                  1セッションの問題数を選択
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="setting-button rounded-xl border-2 border-[var(--mq-primary)] bg-[var(--mq-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--mq-primary-strong)] transition"
                  data-setting="count"
                  data-value="5"
                >
                  5問
                </button>
                <button
                  type="button"
                  class="setting-button rounded-xl border border-[var(--mq-outline)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mq-ink)] transition hover:bg-[var(--mq-surface)]"
                  data-setting="count"
                  data-value="10"
                >
                  10問
                </button>
                <button
                  type="button"
                  class="setting-button rounded-xl border border-[var(--mq-outline)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mq-ink)] transition hover:bg-[var(--mq-surface)]"
                  data-setting="count"
                  data-value="20"
                >
                  20問
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-[var(--mq-ink)]">
                  効果音
                </div>
                <div class="text-xs text-[#5e718a]">正解・不正解の音を再生</div>
              </div>
              <button
                type="button"
                class="toggle-button inline-flex items-center gap-2 rounded-xl border-2 border-[var(--mq-primary)] bg-[var(--mq-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--mq-primary-strong)] transition"
                data-setting="sound"
                data-value="true"
              >
                <span class="toggle-icon">✓</span>
                <span>ON</span>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-[var(--mq-ink)]">
                  カウントダウン
                </div>
                <div class="text-xs text-[#5e718a]">
                  問題開始前に3秒カウント
                </div>
              </div>
              <button
                type="button"
                class="toggle-button inline-flex items-center gap-2 rounded-xl border-2 border-[var(--mq-primary)] bg-[var(--mq-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--mq-primary-strong)] transition"
                data-setting="countdown"
                data-value="true"
              >
                <span class="toggle-icon">✓</span>
                <span>ON</span>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-[var(--mq-ink)]">
                  逆算式
                </div>
                <div class="text-xs text-[#5e718a]">
                  1 + ? = 10 のような形式
                </div>
              </div>
              <button
                type="button"
                class="toggle-button inline-flex items-center gap-2 rounded-xl border border-[var(--mq-outline)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mq-ink)] transition hover:bg-[var(--mq-surface)]"
                data-setting="inverse"
                data-value="false"
              >
                <span class="toggle-icon" style="opacity: 0;">
                  ✓
                </span>
                <span>OFF</span>
              </button>
            </div>
          </div>
        </section>

        {/* プリセット選択セクション */}
        <section class="space-y-6">
          <h2 class="text-xl font-bold text-[var(--mq-ink)]">テーマを選択</h2>
          {presets.length === 0 ? (
            <div class="rounded-2xl border border-[var(--mq-outline)] bg-white p-6 text-sm text-[#5e718a] shadow-sm">
              この学年向けのテーマは準備中です。
              <a
                href="/math"
                class="ml-2 font-semibold text-[var(--mq-primary-strong)] underline"
              >
                MathQuest に戻る
              </a>
            </div>
          ) : (
            <div class="grid gap-3 sm:grid-cols-2">
              {presets.map((preset) => (
                <a
                  key={preset.id}
                  href={`/math/play?grade=${encodeURIComponent(gradeId)}&calc=${
                    calcType.id
                  }&preset=${
                    preset.id
                  }&count=5&sound=true&countdown=true&inverse=false`}
                  class="preset-link flex flex-col gap-3 rounded-2xl border-2 border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-surface)] p-4 text-left transition hover:-translate-y-1 hover:border-[var(--mq-primary)] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
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

      <Footer />

      {/* クライアントサイドスクリプト：設定変更とURL更新 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const settings = {
                count: '5',
                sound: 'true',
                countdown: 'true',
                inverse: 'false'
              };

              // 設定ボタンのクリックハンドラ
              document.querySelectorAll('.setting-button').forEach(button => {
                button.addEventListener('click', () => {
                  const setting = button.dataset.setting;
                  const value = button.dataset.value;

                  // 同じ設定グループのボタンから active クラスを削除
                  document.querySelectorAll(\`.setting-button[data-setting="\${setting}"]\`).forEach(btn => {
                    btn.classList.remove('border-[var(--mq-primary)]', 'bg-[var(--mq-primary-soft)]', 'text-[var(--mq-primary-strong)]');
                    btn.classList.add('border-[var(--mq-outline)]', 'bg-white', 'text-[var(--mq-ink)]');
                  });

                  // クリックされたボタンに active クラスを追加
                  button.classList.add('border-[var(--mq-primary)]', 'bg-[var(--mq-primary-soft)]', 'text-[var(--mq-primary-strong)]');
                  button.classList.remove('border-[var(--mq-outline)]', 'bg-white', 'text-[var(--mq-ink)]');

                  settings[setting] = value;
                  updatePresetLinks();
                });
              });

              // トグルボタンのクリックハンドラ
              document.querySelectorAll('.toggle-button').forEach(button => {
                button.addEventListener('click', () => {
                  const setting = button.dataset.setting;
                  const currentValue = button.dataset.value;
                  const newValue = currentValue === 'true' ? 'false' : 'true';

                  button.dataset.value = newValue;
                  settings[setting] = newValue;

                  const icon = button.querySelector('.toggle-icon');
                  const text = button.querySelector('span:last-child');

                  if (newValue === 'true') {
                    button.classList.add('border-[var(--mq-primary)]', 'bg-[var(--mq-primary-soft)]', 'text-[var(--mq-primary-strong)]');
                    button.classList.remove('border-[var(--mq-outline)]', 'bg-white', 'text-[var(--mq-ink)]');
                    icon.style.opacity = '1';
                    text.textContent = 'ON';
                  } else {
                    button.classList.remove('border-[var(--mq-primary)]', 'bg-[var(--mq-primary-soft)]', 'text-[var(--mq-primary-strong)]');
                    button.classList.add('border-[var(--mq-outline)]', 'bg-white', 'text-[var(--mq-ink)]');
                    icon.style.opacity = '0';
                    text.textContent = 'OFF';
                  }

                  updatePresetLinks();
                });
              });

              // プリセットリンクのURL更新
              function updatePresetLinks() {
                document.querySelectorAll('.preset-link').forEach(link => {
                  const url = new URL(link.href);
                  url.searchParams.set('count', settings.count);
                  url.searchParams.set('sound', settings.sound);
                  url.searchParams.set('countdown', settings.countdown);
                  url.searchParams.set('inverse', settings.inverse);
                  link.href = url.toString();
                });
              }
            })();
          `,
        }}
      />
    </div>
  );
};
