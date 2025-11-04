import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../application/session/current-user';
import type { SchoolStage } from '../routes/utils/school-grade';
import { GradeDropdown } from './GradeDropdown';

type QuestNavProps = {
  currentUser: CurrentUser | null;
  questIcon: string;
  questHomeUrl: string;
  currentGrade: number;
  currentStage: SchoolStage;
  availableGrades: readonly {
    stage: SchoolStage;
    grade: number;
    disabled?: boolean;
  }[];
  dropdownBaseUrl: string;
  rightButtons?: JSX.Element;
};

export const QuestNav: FC<QuestNavProps> = ({
  currentUser,
  questIcon,
  questHomeUrl,
  currentGrade,
  currentStage,
  availableGrades,
  dropdownBaseUrl,
  rightButtons,
}) => {
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
        <a href={questHomeUrl} class="transition hover:opacity-80">
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
            {questIcon}
          </span>
        </a>
        <span class="text-[var(--mq-outline)]">|</span>
        <GradeDropdown
          currentGrade={currentGrade}
          currentStage={currentStage}
          availableGrades={availableGrades}
          baseUrl={dropdownBaseUrl}
        />
      </div>
      <div class="flex flex-wrap gap-2">
        {rightButtons}
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
