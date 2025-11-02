import type { FC } from 'hono/jsx';
import type { SchoolStage } from '../routes/utils/school-grade';
import {
  createSchoolGradeParam,
  formatSchoolGradeLabelNav,
} from '../routes/utils/school-grade';

type GradeOption = {
  stage: SchoolStage;
  grade: number;
  disabled?: boolean;
};

type GradeDropdownProps = {
  currentGrade: number;
  currentStage: SchoolStage;
  availableGrades: readonly GradeOption[];
  baseUrl: string; // e.g., "/math/select", "/kanji/select"
};

export const GradeDropdown: FC<GradeDropdownProps> = ({
  currentGrade,
  currentStage,
  availableGrades,
  baseUrl,
}) => {
  const currentLabel = formatSchoolGradeLabelNav({
    stage: currentStage,
    grade: currentGrade,
  });

  return (
    <div class="grade-dropdown relative inline-block flex-shrink-0">
      <button
        type="button"
        class="grade-dropdown-button inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-[var(--mq-primary-soft)] px-2 py-1 text-xs font-semibold text-[var(--mq-ink)] transition hover:bg-[var(--mq-primary)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
        aria-label="学年を変更"
        aria-expanded="false"
        aria-haspopup="true"
      >
        <span>{currentLabel}</span>
        <svg
          class="grade-dropdown-icon h-3 w-3 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          role="img"
          aria-labelledby="dropdown-icon-title"
        >
          <title id="dropdown-icon-title">学年選択を開く</title>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        class="grade-dropdown-menu absolute right-0 mt-2 hidden w-40 origin-top-right rounded-xl border border-[var(--mq-outline)] bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
      >
        <div class="py-1">
          {availableGrades.map((option) => {
            const gradeLabel = formatSchoolGradeLabelNav({
              stage: option.stage,
              grade: option.grade,
            });
            const gradeParam = createSchoolGradeParam({
              stage: option.stage,
              grade: option.grade,
            });
            const isCurrentGrade =
              option.stage === currentStage && option.grade === currentGrade;

            if (option.disabled) {
              return (
                <div
                  key={`${option.stage}-${option.grade}`}
                  class="block whitespace-nowrap px-4 py-2 text-xs text-gray-400"
                  role="menuitem"
                  tabIndex={-1}
                >
                  {gradeLabel}
                  <span class="ml-1 text-xs">🔒</span>
                </div>
              );
            }

            return (
              <a
                key={`${option.stage}-${option.grade}`}
                href={`${baseUrl}?grade=${encodeURIComponent(gradeParam)}`}
                class={`block whitespace-nowrap px-4 py-2 text-xs transition hover:bg-[var(--mq-surface)] ${
                  isCurrentGrade
                    ? 'bg-[var(--mq-primary-soft)] font-semibold text-[var(--mq-primary-strong)]'
                    : 'text-[var(--mq-ink)]'
                }`}
                role="menuitem"
              >
                {gradeLabel}
                {isCurrentGrade && <span class="ml-1">✓</span>}
              </a>
            );
          })}
        </div>
      </div>

      {/* クライアントサイドスクリプト */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const dropdown = document.currentScript.closest('.grade-dropdown');
              if (!dropdown) return;

              const button = dropdown.querySelector('.grade-dropdown-button');
              const menu = dropdown.querySelector('.grade-dropdown-menu');
              const icon = dropdown.querySelector('.grade-dropdown-icon');

              if (!button || !menu || !icon) return;

              let isOpen = false;

              const openMenu = () => {
                isOpen = true;
                menu.classList.remove('hidden');
                button.setAttribute('aria-expanded', 'true');
                icon.style.transform = 'rotate(180deg)';
              };

              const closeMenu = () => {
                isOpen = false;
                menu.classList.add('hidden');
                button.setAttribute('aria-expanded', 'false');
                icon.style.transform = 'rotate(0deg)';
              };

              const toggleMenu = () => {
                if (isOpen) {
                  closeMenu();
                } else {
                  openMenu();
                }
              };

              button.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMenu();
              });

              // クリックアウトサイドで閉じる
              document.addEventListener('click', (e) => {
                if (isOpen && !dropdown.contains(e.target)) {
                  closeMenu();
                }
              });

              // Escapeキーで閉じる
              document.addEventListener('keydown', (e) => {
                if (isOpen && e.key === 'Escape') {
                  closeMenu();
                  button.focus();
                }
              });
            })();
          `,
        }}
      />
    </div>
  );
};
