import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { QuestNav } from '../../components/QuestNav';
import type { SchoolStage } from '../utils/school-grade';
import { createSchoolGradeParam } from '../utils/school-grade';
import { type GradeId, gradeLevels } from './grade-presets';

type StepCardProps = {
  number: number;
  title: string;
  description: string;
  example: string;
  color: string;
};

const StepCard: FC<StepCardProps> = ({
  number,
  title,
  description,
  example,
  color,
}) => (
  <div
    class="group relative overflow-hidden rounded-3xl border-2 border-[var(--mq-outline)] bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    style={`animation: fadeInUp 0.6s ease-out ${number * 0.1}s backwards;`}
  >
    <div
      class="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 transition-transform duration-300 group-hover:scale-110"
      style={`background: ${color};`}
    />
    <div class="relative">
      <div class="mb-4 flex items-center gap-4">
        <div
          class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white shadow-lg"
          style={`background: ${color};`}
        >
          {number}
        </div>
        <h3
          class="text-2xl font-bold text-[var(--mq-ink)]"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
      <p
        class="mb-4 text-lg leading-relaxed text-[#4f6076]"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <div
        class="rounded-2xl border-2 border-dashed p-4 text-center text-xl font-bold"
        style={`border-color: ${color}; background: ${color}15;`}
      >
        <span dangerouslySetInnerHTML={{ __html: example }} />
      </div>
    </div>
  </div>
);

type ExampleBoxProps = {
  title: string;
  items: readonly string[];
  icon: string;
  color: string;
};

const ExampleBox: FC<ExampleBoxProps> = ({ title, items, icon, color }) => (
  <div
    class="rounded-3xl border-2 border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    style="animation: fadeIn 0.8s ease-out 0.4s backwards;"
  >
    <div class="mb-6 flex items-center gap-3">
      <span class="text-5xl" style="animation: bounce 2s infinite;">
        {icon}
      </span>
      <h3 class="text-2xl font-bold text-[var(--mq-ink)]">{title}</h3>
    </div>
    <ul class="space-y-4">
      {items.map((item, index) => (
        <li
          key={item}
          class="flex items-start gap-3 text-lg leading-relaxed text-[#4f6076]"
          style={`animation: slideInLeft 0.5s ease-out ${
            0.6 + index * 0.1
          }s backwards;`}
        >
          <div
            class="mt-1 h-3 w-3 flex-shrink-0 rounded-full"
            style={`background: ${color};`}
          />
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  </div>
);

export const MathLearnAdditionCarry: FC<{
  currentUser: CurrentUser | null;
  gradeId: GradeId;
  gradeStage: SchoolStage;
}> = ({ currentUser, gradeId, gradeStage }) => {
  const gradeIndex = Math.max(
    gradeLevels.findIndex((grade) => grade.id === gradeId),
    0
  );
  const gradeNumber = gradeIndex + 1;
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

  const steps = [
    {
      title: '<ruby>繰<rt>く</rt></ruby>り<ruby>上<rt>あ</rt></ruby>がりってなに？',
      description:
        'たし<ruby>算<rt>ざん</rt></ruby>で、<ruby>答<rt>こた</rt></ruby>えが<ruby>10<rt>じゅう</rt></ruby>より<ruby>大<rt>おお</rt></ruby>きくなるとき、<ruby>10<rt>じゅう</rt></ruby>の<ruby>位<rt>くらい</rt></ruby>に<ruby>1<rt>いち</rt></ruby>を<ruby>繰<rt>く</rt></ruby>り<ruby>上<rt>あ</rt></ruby>げることだよ！<br/><ruby>9<rt>きゅう</rt></ruby> + <ruby>3<rt>さん</rt></ruby> = <ruby>12<rt>じゅうに</rt></ruby>のとき、<ruby>一<rt>いち</rt></ruby>の<ruby>位<rt>くらい</rt></ruby>は<ruby>2<rt>に</rt></ruby>で、<ruby>10<rt>じゅう</rt></ruby>の<ruby>位<rt>くらい</rt></ruby>に<ruby>1<rt>いち</rt></ruby>が<ruby>繰<rt>く</rt></ruby>り<ruby>上<rt>あ</rt></ruby>がるんだ。',
      example: '9 + 3 = 12<br/><small>(一の位: 2、十の位: 1)</small>',
      color: '#FF6B9D',
    },
    {
      title: '<ruby>10<rt>じゅう</rt></ruby>のまとまりを<ruby>作<rt>つく</rt></ruby>ろう',
      description:
        '<ruby>繰<rt>く</rt></ruby>り<ruby>上<rt>あ</rt></ruby>がりのたし<ruby>算<rt>ざん</rt></ruby>は、まず<ruby>10<rt>じゅう</rt></ruby>のまとまりを<ruby>作<rt>つく</rt></ruby>るのがコツ！<br/><ruby>8<rt>はち</rt></ruby> + <ruby>5<rt>ご</rt></ruby>なら、<ruby>8<rt>はち</rt></ruby>に<ruby>2<rt>に</rt></ruby>を<ruby>足<rt>た</rt></ruby>して<ruby>10<rt>じゅう</rt></ruby>を<ruby>作<rt>つく</rt></ruby>り、<ruby>残<rt>のこ</rt></ruby>りの<ruby>3<rt>さん</rt></ruby>を<ruby>足<rt>た</rt></ruby>すと<ruby>13<rt>じゅうさん</rt></ruby>になるよ。',
      example: '8 + 5 = (8 + 2) + 3 = 10 + 3 = 13',
      color: '#4ECDC4',
    },
    {
      title: '<ruby>指<rt>ゆび</rt></ruby>や<ruby>絵<rt>え</rt></ruby>で<ruby>確<rt>たし</rt></ruby>かめよう',
      description:
        '<ruby>最初<rt>さいしょ</rt></ruby>は<ruby>指<rt>ゆび</rt></ruby>やおはじきを<ruby>使<rt>つか</rt></ruby>って<ruby>確<rt>たし</rt></ruby>かめるといいよ！<br/><ruby>7<rt>なな</rt></ruby> + <ruby>6<rt>ろく</rt></ruby>なら、<ruby>7<rt>なな</rt></ruby>に<ruby>3<rt>さん</rt></ruby>を<ruby>足<rt>た</rt></ruby>して<ruby>10<rt>じゅう</rt></ruby>にして、<ruby>残<rt>のこ</rt></ruby>りの<ruby>3<rt>さん</rt></ruby>を<ruby>足<rt>た</rt></ruby>すと<ruby>13<rt>じゅうさん</rt></ruby>だね。',
      example: '7 + 6 = (7 + 3) + 3 = 10 + 3 = 13',
      color: '#95E1D3',
    },
    {
      title: '<ruby>練習<rt>れんしゅう</rt></ruby>して<ruby>速<rt>はや</rt></ruby>くなろう',
      description:
        '<ruby>何度<rt>なんど</rt></ruby>も<ruby>練習<rt>れんしゅう</rt></ruby>すると、だんだん<ruby>速<rt>はや</rt></ruby>く<ruby>計算<rt>けいさん</rt></ruby>できるようになるよ！<br/><ruby>9<rt>きゅう</rt></ruby> + <ruby>4<rt>よん</rt></ruby>、<ruby>8<rt>はち</rt></ruby> + <ruby>7<rt>なな</rt></ruby>、<ruby>6<rt>ろく</rt></ruby> + <ruby>8<rt>はち</rt></ruby>など、いろいろな<ruby>問題<rt>もんだい</rt></ruby>に<ruby>挑戦<rt>ちょうせん</rt></ruby>してみよう！',
      example: '9 + 4 = 13、8 + 7 = 15、6 + 8 = 14',
      color: '#F38181',
    },
  ];

  const dailyExamples = [
    '<ruby>赤<rt>あか</rt></ruby>いボールが<ruby>9個<rt>きゅうこ</rt></ruby>、<ruby>青<rt>あお</rt></ruby>いボールが<ruby>4個<rt>よんこ</rt></ruby>あるよ。<ruby>全部<rt>ぜんぶ</rt></ruby>で<ruby>何個<rt>なんこ</rt></ruby>あるかな？（9 + 4 = 13個）',
    '<ruby>朝<rt>あさ</rt></ruby>ごはんで<ruby>7個<rt>ななこ</rt></ruby>、おやつで<ruby>5個<rt>ごこ</rt></ruby>のいちごを<ruby>食<rt>た</rt></ruby>べたら、<ruby>今日<rt>きょう</rt></ruby>は<ruby>全部<rt>ぜんぶ</rt></ruby>で<ruby>何個<rt>なんこ</rt></ruby><ruby>食<rt>た</rt></ruby>べたかな？（7 + 5 = 12個）',
    '<ruby>公園<rt>こうえん</rt></ruby>で<ruby>8人<rt>はちにん</rt></ruby>のお<ruby>友達<rt>ともだち</rt></ruby>と<ruby>遊<rt>あそ</rt></ruby>んでいたら、<ruby>6人<rt>ろくにん</rt></ruby>きたよ。<ruby>今<rt>いま</rt></ruby>は<ruby>何人<rt>なんにん</rt></ruby>で<ruby>遊<rt>あそ</rt></ruby>んでいるかな？（8 + 6 = 14人）',
  ];

  const practiceIdeas = [
    'まず<ruby>10<rt>じゅう</rt></ruby>を<ruby>作<rt>つく</rt></ruby>ることを<ruby>意識<rt>いしき</rt></ruby>しよう！（<ruby>8<rt>はち</rt></ruby> + <ruby>5<rt>ご</rt></ruby>なら、<ruby>8<rt>はち</rt></ruby>に<ruby>2<rt>に</rt></ruby>を<ruby>足<rt>た</rt></ruby>して<ruby>10<rt>じゅう</rt></ruby>、<ruby>残<rt>のこ</rt></ruby>りの<ruby>3<rt>さん</rt></ruby>を<ruby>足<rt>た</rt></ruby>す）',
    'おはじきやブロックで<ruby>実際<rt>じっさい</rt></ruby>に<ruby>10<rt>じゅう</rt></ruby>のまとまりを<ruby>作<rt>つく</rt></ruby>ってみよう！',
    '<ruby>9<rt>きゅう</rt></ruby>や<ruby>8<rt>はち</rt></ruby>、<ruby>7<rt>なな</rt></ruby>から<ruby>始<rt>はじ</rt></ruby>まる<ruby>問題<rt>もんだい</rt></ruby>をたくさん<ruby>練習<rt>れんしゅう</rt></ruby>しよう！',
  ];

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      data-user-state={currentUser ? 'known' : 'anonymous'}
      style="--mq-primary: #6B9BD1; --mq-primary-strong: #3B7AC7; --mq-primary-soft: #D6E4F5; --mq-accent: #B7D4F7; --mq-outline: rgba(107, 155, 209, 0.45);"
    >
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}
      </style>
      <QuestNav
        currentUser={currentUser}
        questIcon="🔢"
        questHomeUrl="/math"
        currentGrade={gradeNumber}
        currentStage={gradeStage}
        availableGrades={availableGrades}
        dropdownBaseUrl="/math/learn/addition-carry"
        selectUrl={`/math/select?grade=${gradeParam}`}
        learnUrl={`/math/learn?grade=${gradeParam}`}
      />
      <div class="flex flex-1 flex-col gap-12 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header
          class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl"
          style="animation: fadeInUp 0.6s ease-out; margin-bottom: 2rem;"
        >
          <span class="text-6xl" style="animation: bounce 2s infinite;">
            🔟
          </span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">
              <ruby>
                繰<rt>く</rt>
              </ruby>
              り
              <ruby>
                上<rt>あ</rt>
              </ruby>
              がりのあるたし
              <ruby>
                算<rt>ざん</rt>
              </ruby>
              を
              <ruby>
                学<rt>まな</rt>
              </ruby>
              ぼう
            </h1>
            <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
              <ruby>
                答<rt>こた</rt>
              </ruby>
              えが
              <ruby>
                10<rt>じゅう</rt>
              </ruby>
              より
              <ruby>
                大<rt>おお</rt>
              </ruby>
              きくなるたし
              <ruby>
                算<rt>ざん</rt>
              </ruby>
              に
              <ruby>
                挑戦<rt>ちょうせん</rt>
              </ruby>
              しよう！
            </p>
          </div>
        </header>

        <section class="space-y-8">
          <h2
            class="mb-8 text-center text-xl font-bold text-[var(--mq-ink)] sm:text-2xl"
            style="animation: fadeIn 0.8s ease-out 0.2s backwards;"
          >
            <ruby>
              繰<rt>く</rt>
            </ruby>
            り
            <ruby>
              上<rt>あ</rt>
            </ruby>
            がりの
            <ruby>
              4<rt>よん</rt>
            </ruby>
            つのステップ
          </h2>
          <div class="grid gap-8 lg:grid-cols-2" style="margin-bottom: 2rem">
            {steps.map((step, index) => (
              <StepCard
                key={step.title}
                number={index + 1}
                title={step.title}
                description={step.description}
                example={step.example}
                color={step.color}
              />
            ))}
          </div>
        </section>

        <section class="grid gap-8 lg:grid-cols-2" style="margin-bottom: 2rem">
          <ExampleBox
            title="まいにちの くりあがり"
            items={dailyExamples}
            icon="🏠"
            color="#FF6B9D"
          />
          <ExampleBox
            title="れんしゅうのコツ"
            items={practiceIdeas}
            icon="💡"
            color="#4ECDC4"
          />
        </section>

        <section
          class="rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-[var(--mq-primary-soft)] to-white p-12 text-center shadow-xl"
          style="animation: fadeInUp 0.8s ease-out 0.6s backwards;"
        >
          <div class="mb-6 flex justify-center">
            <span class="text-6xl" style="animation: bounce 2s infinite;">
              🎮
            </span>
          </div>
          <h2 class="mb-4 text-2xl font-bold text-[var(--mq-ink)] sm:text-3xl">
            さあ、クエストで
            <ruby>
              練習<rt>れんしゅう</rt>
            </ruby>
            してみよう！
          </h2>
          <p class="mx-auto mb-8 max-w-xl text-base leading-relaxed text-[#4f6076]">
            <ruby>
              繰<rt>く</rt>
            </ruby>
            り
            <ruby>
              上<rt>あ</rt>
            </ruby>
            がりのやり
            <ruby>
              方<rt>かた</rt>
            </ruby>
            がわかったら、クエストで
            <ruby>
              実際<rt>じっさい</rt>
            </ruby>
            に
            <ruby>
              問題<rt>もんだい</rt>
            </ruby>
            を
            <ruby>
              解<rt>と</rt>
            </ruby>
            いてみよう！
          </p>
          <a
            href={`/math/start?grade=${encodeURIComponent(
              gradeId
            )}&calc=calc-add`}
            class="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[var(--mq-primary)] to-[var(--mq-primary-strong)] px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:text-lg"
          >
            <span class="text-2xl">⚔️</span>
            たし
            <ruby>
              算<rt>ざん</rt>
            </ruby>
            クエストに
            <ruby>
              挑戦<rt>ちょうせん</rt>
            </ruby>
          </a>
        </section>
      </div>
      <Footer />
    </div>
  );
};
