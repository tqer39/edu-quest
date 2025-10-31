import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../application/session/current-user';

export const Header: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser,
}) => (
  <nav class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-6 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-3">
      <img
        src="/logo.svg"
        alt="EduQuest Logo"
        class="h-10 w-10"
        width="40"
        height="40"
      />
      <span class="text-lg font-semibold tracking-tight text-[var(--mq-ink)]">
        EduQuest
      </span>
    </div>
    <div class="flex items-center gap-3 sm:gap-4">
      <p class="hidden text-sm font-medium text-[#5e718a] sm:block">
        小学生の学びを、遊ぶように楽しもう
      </p>
      {currentUser ? (
        <>
          <span class="hidden text-sm font-semibold text-[var(--mq-ink)] sm:inline-flex sm:items-center sm:gap-2">
            <span
              class="inline-flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold text-white"
              style={`background:${currentUser.avatarColor}`}
            >
              {currentUser.displayName.slice(0, 1)}
            </span>
            {currentUser.displayName}
          </span>
          <a
            href="/auth/logout"
            class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
          >
            ログアウト
          </a>
        </>
      ) : (
        <a
          href="/auth/login"
          class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
        >
          ログイン
        </a>
      )}
    </div>
  </nav>
);
