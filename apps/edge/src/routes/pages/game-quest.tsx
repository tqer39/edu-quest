import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { GradeDropdown } from '../../components/GradeDropdown';
import { gameGradeLevels, getGameGradeById } from './game-presets';
import type { GradeId } from './grade-presets';
import type { SchoolStage } from '../utils/school-grade';

const GameNav: FC<{
  currentUser: CurrentUser | null;
  gradeId: GradeId;
}> = ({ currentUser, gradeId }) => {
  // GradeIdからgrade numberに変換
  const gradeIndex = gameGradeLevels.findIndex((level) => level.id === gradeId);
  const gradeNumber = gradeIndex >= 0 ? gradeIndex + 1 : 1;

  // 利用可能な学年リスト（小学1-6年生）
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
          baseUrl="/game/quest"
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

type GameType = {
  id: string;
  title: string;
  icon: string;
  description: string;
  href: string;
};

const GameTypeCard: FC<{ game: GameType }> = ({ game }) => (
  <a
    href={game.href}
    class="flex h-full flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-8 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
  >
    <span class="text-5xl" aria-hidden="true">
      {game.icon}
    </span>
    <div class="space-y-2">
      <div class="text-2xl font-bold text-[var(--mq-ink)]">{game.title}</div>
      <p class="text-sm leading-relaxed text-[#5e718a]">{game.description}</p>
    </div>
    <span class="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--mq-primary-strong)]">
      選択する →
    </span>
  </a>
);

export const GameQuest: FC<{
  currentUser: CurrentUser | null;
  gradeId: GradeId;
}> = ({ currentUser, gradeId }) => {
  const grade = getGameGradeById(gradeId);

  const gameTypes: GameType[] = [
    {
      id: 'sudoku',
      title: '数独',
      icon: '🧩',
      description:
        '論理パズルで集中力アップ。数字を使った推理ゲームに挑戦しよう。',
      href: `/game/sudoku?grade=${gradeId}`,
    },
    {
      id: 'stellar-balance',
      title: 'Stellar Balance',
      icon: '🌌',
      description:
        '太陽・月・星のタイルで宇宙のバランスを整える新作ロジックパズル。',
      href: `/game/stellar-balance?grade=${gradeId}`,
    },
    {
      id: 'sentinels',
      title: 'センチネル配置',
      icon: '🛡️',
      description:
        'ナイトの動きで守護者を配置する新作パズル。色つき領域をすべて守ろう。',
      href: `/game/sentinels?grade=${gradeId}`,
    },
  ];

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      style="--mq-primary: #5DB996; --mq-primary-strong: #3AA07A; --mq-primary-soft: #D6F5E7; --mq-accent: #A8EBD0; --mq-outline: rgba(93, 185, 150, 0.45);"
    >
      <GameNav currentUser={currentUser} gradeId={gradeId} />
      <div class="flex flex-1 flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
          <span class="text-6xl">🎮</span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">
              ゲームを選んでください
            </h1>
            <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
              {grade.label}向けのおすすめ:
              <br />
              {grade.highlight}
            </p>
          </div>
        </header>

        <section>
          <h2 class="mb-6 text-xl font-bold text-[var(--mq-ink)]">
            遊べるゲーム
          </h2>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gameTypes.map((game) => (
              <GameTypeCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};
