import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import {
  Features,
  GradeCard,
  GradeSelection,
  QuestHeader,
} from '../components/quest-layout';
import { gameGradeLevels } from './game-presets';

const GameNav: FC<{ currentUser: CurrentUser | null }> = ({ currentUser }) => (
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
      <a
        href="/game"
        class="flex items-center gap-2 transition hover:opacity-80"
      >
        <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
          🎮
        </span>
        <span class="text-sm font-semibold tracking-tight text-[var(--mq-ink)]">
          GameQuest
        </span>
      </a>
    </div>
    <div class="flex items-center gap-2">
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

type GameHomeProps = {
  currentUser: CurrentUser | null;
};

export const GameHome: FC<GameHomeProps> = ({ currentUser }) => {
  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      style="--mq-primary: #5DB996; --mq-primary-strong: #3AA07A; --mq-primary-soft: #D6F5E7; --mq-accent: #A8EBD0; --mq-outline: rgba(93, 185, 150, 0.45);"
    >
      <GameNav currentUser={currentUser} />
      <div class="flex flex-1 flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <QuestHeader
          icon="🎮"
          title="GameQuest"
          description="学年に合わせた数独や Stellar Balance に挑戦しよう。まずは学年をえらんで、ぴったりのゲームを選択してください。"
        />

        <GradeSelection title="学年を選ぶ">
          {gameGradeLevels.map((level) => (
            <GradeCard
              key={level.id}
              label={level.label}
              description={level.description}
              highlight={level.highlight}
              href={`/game/select?grade=${encodeURIComponent(level.id)}`}
              disabled={level.disabled}
            />
          ))}
        </GradeSelection>

        <Features
          title="GameQuest でできること"
          items={[
            { description: '学年に合わせた難易度で論理パズルに挑戦できます' },
            {
              description:
                '数独パズルや新作「Stellar Balance」で思考力を磨けます',
            },
            {
              description:
                '太陽・月・星タイルのバランスを考える空間認識トレーニングができます',
            },
            { description: '4×4 から 9×9 まで段階的にステップアップできます' },
          ]}
        />
      </div>

      <Footer />
    </div>
  );
};
