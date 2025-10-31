import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';

const HomeNav: FC<{ currentUser: CurrentUser | null }> = ({ currentUser }) => (
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

type QuestCardProps = {
  title: string;
  description: string;
  icon: string;
  href: string;
  available: boolean;
  themeColor: {
    primary: string;
    primaryStrong: string;
    primarySoft: string;
    outline: string;
  };
};

const QuestCard: FC<QuestCardProps> = ({
  title,
  description,
  icon,
  href,
  available,
  themeColor,
}) => (
  <a
    href={available ? href : '#'}
    class={`group flex flex-col gap-4 rounded-3xl border p-6 shadow-lg transition ${
      available
        ? 'hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
        : 'cursor-not-allowed opacity-60'
    }`}
    style={`border-color: ${
      themeColor.outline
    }; background: linear-gradient(to bottom right, white, ${
      themeColor.primarySoft
    }); ${available ? `--focus-outline-color: ${themeColor.primary};` : ''}`}
  >
    <div class="flex items-center gap-4">
      <span
        class="inline-flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
        style={`background-color: ${themeColor.primarySoft};`}
      >
        {icon}
      </span>
      <div class="flex-1">
        <h2 class="text-2xl font-bold text-[var(--mq-ink)]">{title}</h2>
        {!available && (
          <span class="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
            Coming Soon
          </span>
        )}
      </div>
    </div>
    <p class="text-sm text-[#5e718a]">{description}</p>
    {available && (
      <div
        class="mt-2 flex items-center gap-2 text-sm font-semibold transition group-hover:gap-3"
        style={`color: ${themeColor.primaryStrong};`}
      >
        はじめる
        <span class="text-lg">→</span>
      </div>
    )}
  </a>
);

const HomeFooter: FC = () => (
  <nav class="rounded-3xl border border-[rgba(148,163,184,0.25)] bg-white/90 p-6 shadow-sm">
    <h2 class="text-sm font-semibold text-[#1f2937]">関連リンク</h2>
    <ul class="mt-3 flex flex-wrap gap-4 text-sm text-[#3b82f6]">
      <li>
        <a class="transition hover:text-[#1d4ed8]" href="/">
          ホーム
        </a>
      </li>
      <li>
        <a class="transition hover:text-[#1d4ed8]" href="/parents">
          保護者の方へ
        </a>
      </li>
      <li>
        <a
          class="transition hover:text-[#1d4ed8]"
          href="https://github.com/tqer39/edu-quest"
          target="_blank"
          rel="noreferrer"
        >
          GitHub Repository
        </a>
      </li>
    </ul>
  </nav>
);

export const Home: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser,
}) => (
  <div
    id="home-root"
    class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
    data-user-state={
      currentUser
        ? currentUser.id.startsWith('guest-')
          ? 'guest'
          : 'member'
        : 'none'
    }
  >
    <HomeNav currentUser={currentUser} />

    <header class="flex flex-col gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-8 text-[var(--mq-ink)] shadow-xl">
      <div class="space-y-4">
        <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[#6c7c90]">
          じぶんのペースで楽しく学習
        </p>
        <h1 class="text-3xl font-extrabold sm:text-4xl">EduQuest</h1>
        <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
          小学生向けの学習プラットフォーム。算数、漢字、時計の読み方など、様々な学びを遊ぶように楽しめます。
        </p>
      </div>
    </header>

    <section class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <QuestCard
        title="MathQuest"
        description="算数の四則演算を楽しく練習。学年別のプリセットや、逆算問題など、多彩な問題で計算力をアップ。"
        icon="🔢"
        href="/math"
        available={true}
        themeColor={{
          primary: '#6B9BD1',
          primaryStrong: '#3B7AC7',
          primarySoft: '#D6E4F5',
          outline: 'rgba(107, 155, 209, 0.45)',
        }}
      />
      <QuestCard
        title="KanjiQuest"
        description="小学校で習う漢字を学年ごとに学習。読み・書き・意味を楽しく覚えよう。"
        icon="✏️"
        href="/kanji"
        available={true}
        themeColor={{
          primary: '#9B87D4',
          primaryStrong: '#7B5FBD',
          primarySoft: '#E8E1F5',
          outline: 'rgba(155, 135, 212, 0.45)',
        }}
      />
      <QuestCard
        title="ClockQuest"
        description="時計の読み方をマスター。アナログ時計とデジタル時計の両方を練習できます。"
        icon="🕐"
        href="/clock"
        available={true}
        themeColor={{
          primary: '#F5A85F',
          primaryStrong: '#E88D3D',
          primarySoft: '#FEE9D5',
          outline: 'rgba(245, 168, 95, 0.45)',
        }}
      />
    </section>

    <HomeFooter />
  </div>
);
