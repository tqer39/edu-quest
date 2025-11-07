import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { QuestNav } from '../../components/QuestNav';
import type { SchoolStage } from '../utils/school-grade';
import {
  createSchoolGradeParam,
  formatSchoolGradeLabel,
} from '../utils/school-grade';
import { type GradeId, gradeLevels } from './grade-presets';

type MathTopic = {
  id: string;
  title: string;
  icon: string;
  description: string;
};

const mathTopics: readonly MathTopic[] = [
  {
    id: 'addition',
    title: 'たし算の基礎',
    icon: '➕',
    description:
      '数を合わせる考え方を学びます。ブロックやおはじきを使いながら、たし算の意味と計算方法を理解しましょう。',
  },
  {
    id: 'addition-carry',
    title: '繰り上がりのあるたし算',
    icon: '🔟',
    description:
      '答えが10より大きくなるたし算を学びます。10のまとまりを作る考え方で、繰り上がりのあるたし算をマスターしましょう。',
  },
  {
    id: 'subtraction',
    title: 'ひき算の基礎',
    icon: '➖',
    description:
      '数を減らす考え方を学びます。残りの数を求めたり、違いを比べたりする場面で使うひき算をマスターしましょう。',
  },
] as const;

type TopicCardProps = {
  topic: MathTopic;
  gradeId: GradeId;
};

const TopicCard: FC<TopicCardProps> = ({ topic, gradeId }) => {
  const href = `/math/learn/${topic.id}?grade=${encodeURIComponent(gradeId)}`;

  return (
    <a
      href={href}
      class="flex flex-col gap-4 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
    >
      <div class="text-5xl">{topic.icon}</div>
      <div class="text-2xl font-bold text-[var(--mq-ink)]">{topic.title}</div>
      <div class="text-sm text-[#5e718a]">{topic.description}</div>
    </a>
  );
};

export const MathLearn: FC<{
  currentUser: CurrentUser | null;
  gradeId: GradeId;
  gradeStage: SchoolStage;
}> = ({ currentUser, gradeId, gradeStage }) => {
  const gradeIndex = Math.max(
    gradeLevels.findIndex((grade) => grade.id === gradeId),
    0
  );
  const gradeNumber = gradeIndex + 1;
  const gradeLabel = formatSchoolGradeLabel({
    stage: gradeStage,
    grade: gradeNumber,
  });
  const gradeParam = createSchoolGradeParam({
    stage: gradeStage,
    grade: gradeNumber,
  });

  const availableGrades = gradeLevels
    .filter((level) => !level.disabled)
    .map((level) => {
      const idx = gradeLevels.findIndex((g) => g.id === level.id);
      return {
        stage: '小学' as SchoolStage,
        grade: idx + 1,
        disabled: level.disabled,
      };
    });

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      data-user-state={currentUser ? 'known' : 'anonymous'}
      style="--mq-primary: #6B9BD1; --mq-primary-strong: #3B7AC7; --mq-primary-soft: #D6E4F5; --mq-accent: #B7D4F7; --mq-outline: rgba(107, 155, 209, 0.45);"
    >
      <QuestNav
        currentUser={currentUser}
        questIcon="🔢"
        questHomeUrl="/math"
        currentGrade={gradeNumber}
        currentStage={gradeStage}
        availableGrades={availableGrades}
        dropdownBaseUrl="/math/learn"
        selectUrl={`/math/select?grade=${gradeParam}`}
      />
      <div class="flex flex-1 flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
          <span class="text-6xl">📚</span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">
              {gradeLabel}の算数を学ぼう
            </h1>
            <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
              学習したい内容を選んでください。
              <br />
              基礎から丁寧に説明するので、じっくり理解を深めましょう。
            </p>
          </div>
        </header>

        <section>
          <h2 class="mb-6 text-xl font-bold text-[var(--mq-ink)]">
            学習トピック
          </h2>
          <div class="grid gap-6 sm:grid-cols-2">
            {mathTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} gradeId={gradeId} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};
