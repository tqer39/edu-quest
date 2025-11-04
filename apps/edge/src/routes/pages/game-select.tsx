import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { QuestNav } from '../../components/QuestNav';
import type { SchoolStage } from '../utils/school-grade';
import { formatSchoolGradeLabel } from '../utils/school-grade';
import { type GradeId, gameGradeLevels } from './game-presets';

const GameNav: FC<{
  currentUser: CurrentUser | null;
  gradeId: GradeId;
}> = ({ currentUser, gradeId }) => {
  const gradeIndex = gameGradeLevels.findIndex((level) => level.id === gradeId);
  const gradeNumber = gradeIndex >= 0 ? gradeIndex + 1 : 1;

  const availableGrades = gameGradeLevels.map((level, index) => ({
    stage: '小学' as SchoolStage,
    grade: index + 1,
    disabled: level.disabled,
  }));

  return (
    <QuestNav
      currentUser={currentUser}
      questIcon="🎮"
      questHomeUrl="/game"
      currentGrade={gradeNumber}
      currentStage="小学"
      availableGrades={availableGrades}
      dropdownBaseUrl="/game/select"
    />
  );
};

type ModeOption = {
  id: 'learn' | 'quest';
  title: string;
  icon: string;
  description: string;
  href: string;
};

const ModeCard: FC<{ mode: ModeOption }> = ({ mode }) => (
  <a
    href={mode.href}
    class="flex h-full flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-8 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
  >
    <span class="text-5xl" aria-hidden="true">
      {mode.icon}
    </span>
    <div class="space-y-2">
      <div class="text-2xl font-bold text-[var(--mq-ink)]">{mode.title}</div>
      <p class="text-sm leading-relaxed text-[#5e718a]">{mode.description}</p>
    </div>
    <span class="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--mq-primary-strong)]">
      選択する →
    </span>
  </a>
);

export const GameSelect: FC<{
  currentUser: CurrentUser | null;
  gradeId: GradeId;
}> = ({ currentUser, gradeId }) => {
  const gradeIndex = gameGradeLevels.findIndex((level) => level.id === gradeId);
  const gradeNumber = gradeIndex >= 0 ? gradeIndex + 1 : 1;
  const gradeLabel = formatSchoolGradeLabel({
    stage: '小学',
    grade: gradeNumber,
  });

  const modeOptions: ModeOption[] = [
    {
      id: 'learn',
      title: '学ぶ',
      icon: '📚',
      description:
        'ゲームのルールや遊び方を学びましょう。わかりやすい説明で楽しく始められます。',
      href: `/game/learn?grade=${encodeURIComponent(gradeId)}`,
    },
    {
      id: 'quest',
      title: 'ゲームで遊ぶ',
      icon: '⚔️',
      description:
        '楽しいゲームで遊びながら学習！集中力と論理的思考を鍛えましょう。',
      href: `/game/quest?grade=${encodeURIComponent(gradeId)}`,
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
          <span class="text-6xl">🧭</span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">
              学習方法を選んでください
            </h1>
            <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
              {gradeLabel}向けのゲーム学習を始めましょう。
              <br />
              「学ぶ」でルールを理解してから、「ゲームで遊ぶ」で楽しく学習しましょう。
            </p>
          </div>
        </header>

        <section>
          <h2 class="mb-6 text-xl font-bold text-[var(--mq-ink)]">
            学習モードを選択
          </h2>
          <div class="grid gap-6 sm:grid-cols-2">
            {modeOptions.map((mode) => (
              <ModeCard key={mode.id} mode={mode} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};
