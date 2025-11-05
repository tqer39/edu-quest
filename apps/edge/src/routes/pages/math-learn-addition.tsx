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
        {example}
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

export const MathLearnAddition: FC<{
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
      title: 'たし<ruby>算<rt>ざん</rt></ruby>ってなに？',
      description:
        'たし<ruby>算<rt>ざん</rt></ruby>は、<ruby>数<rt>かず</rt></ruby>と<ruby>数<rt>かず</rt></ruby>を<ruby>合<rt>あ</rt></ruby>わせることだよ！<br/><ruby>2個<rt>にこ</rt></ruby>のりんごと<ruby>3個<rt>さんこ</rt></ruby>のりんごを<ruby>合<rt>あ</rt></ruby>わせると、<ruby>全部<rt>ぜんぶ</rt></ruby>で<ruby>何個<rt>なんこ</rt></ruby>になるかな？',
      example: '2 + 3 = 5',
      color: '#FF6B9D',
    },
    {
      title:
        '<ruby>式<rt>しき</rt></ruby>の<ruby>読<rt>よ</rt></ruby>み<ruby>方<rt>かた</rt></ruby>',
      description:
        '「+」は「たす」、「=」は「は」と<ruby>読<rt>よ</rt></ruby>むよ。<br/>だから「2 + 3 = 5」は「<ruby>2<rt>に</rt></ruby>たす<ruby>3<rt>さん</rt></ruby>は<ruby>5<rt>ご</rt></ruby>」と<ruby>読<rt>よ</rt></ruby>むんだ！',
      example: '2 + 3 = 5 → にたすさんはご',
      color: '#4ECDC4',
    },
    {
      title:
        '<ruby>指<rt>ゆび</rt></ruby>を<ruby>使<rt>つか</rt></ruby>って<ruby>計算<rt>けいさん</rt></ruby>しよう',
      description:
        '<ruby>指<rt>ゆび</rt></ruby>を<ruby>折<rt>お</rt></ruby>りながら<ruby>数<rt>かぞ</rt></ruby>えると、まちがえないよ！<br/><ruby>左手<rt>ひだりて</rt></ruby>で<ruby>2本<rt>にほん</rt></ruby>、<ruby>右手<rt>みぎて</rt></ruby>で<ruby>3本<rt>さんぼん</rt></ruby>の<ruby>指<rt>ゆび</rt></ruby>を<ruby>立<rt>た</rt></ruby>てたら、<ruby>全部<rt>ぜんぶ</rt></ruby>で<ruby>5本<rt>ごほん</rt></ruby>だね！',
      example: '👆👆 + 👆👆👆 = 5本',
      color: '#95E1D3',
    },
    {
      title: 'おはじきで<ruby>確<rt>たし</rt></ruby>かめよう',
      description:
        'おはじきやブロックを<ruby>使<rt>つか</rt></ruby>うと、もっとわかりやすいよ！<br/><ruby>2個<rt>にこ</rt></ruby>の<ruby>山<rt>やま</rt></ruby>と<ruby>3個<rt>さんこ</rt></ruby>の<ruby>山<rt>やま</rt></ruby>をくっつけて、<ruby>全部<rt>ぜんぶ</rt></ruby><ruby>数<rt>かぞ</rt></ruby>えてみよう！',
      example: '●● + ●●● = ●●●●●',
      color: '#F38181',
    },
  ];

  const dailyExamples = [
    '<ruby>朝<rt>あさ</rt></ruby>ごはんで<ruby>2個<rt>にこ</rt></ruby>、おやつで<ruby>3個<rt>さんこ</rt></ruby>のクッキーを<ruby>食<rt>た</rt></ruby>べたら、<ruby>今日<rt>きょう</rt></ruby>は<ruby>全部<rt>ぜんぶ</rt></ruby>で<ruby>何個<rt>なんこ</rt></ruby><ruby>食<rt>た</rt></ruby>べたかな？',
    '<ruby>赤<rt>あか</rt></ruby>いボールが<ruby>4個<rt>よんこ</rt></ruby>、<ruby>青<rt>あお</rt></ruby>いボールが<ruby>2個<rt>にこ</rt></ruby>あるよ。ボールは<ruby>全部<rt>ぜんぶ</rt></ruby>で<ruby>何個<rt>なんこ</rt></ruby>あるかな？',
    '<ruby>公園<rt>こうえん</rt></ruby>で<ruby>3人<rt>さんにん</rt></ruby>のお<ruby>友達<rt>ともだち</rt></ruby>と<ruby>遊<rt>あそ</rt></ruby>んでいたら、<ruby>2人<rt>ふたり</rt></ruby>きたよ。<ruby>今<rt>いま</rt></ruby>は<ruby>何人<rt>なんにん</rt></ruby>で<ruby>遊<rt>あそ</rt></ruby>んでいるかな？',
  ];

  const practiceIdeas = [
    '<ruby>家族<rt>かぞく</rt></ruby>の<ruby>人数<rt>にんずう</rt></ruby>を<ruby>数<rt>かぞ</rt></ruby>えて、たし<ruby>算<rt>ざん</rt></ruby>の<ruby>式<rt>しき</rt></ruby>を<ruby>作<rt>つく</rt></ruby>ってみよう！',
    'おもちゃやお<ruby>菓子<rt>かし</rt></ruby>を<ruby>使<rt>つか</rt></ruby>って、たし<ruby>算<rt>ざん</rt></ruby>クイズをしてみよう！',
    '<ruby>10<rt>じゅう</rt></ruby>までの<ruby>数<rt>かず</rt></ruby>で、いろいろなたし<ruby>算<rt>ざん</rt></ruby>を<ruby>考<rt>かんが</rt></ruby>えてみよう！',
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
        dropdownBaseUrl="/math/learn/addition"
        selectUrl={`/math/select?grade=${gradeParam}`}
        learnUrl={`/math/learn?grade=${gradeParam}`}
      />
      <div class="flex flex-1 flex-col gap-12 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header
          class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl"
          style="animation: fadeInUp 0.6s ease-out; margin-bottom: 2rem;"
        >
          <span class="text-6xl" style="animation: bounce 2s infinite;">
            ➕
          </span>
          <div class="space-y-4">
            <h1 class="text-3xl font-extrabold sm:text-4xl">
              たし
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
                数<rt>かず</rt>
              </ruby>
              と
              <ruby>
                数<rt>かず</rt>
              </ruby>
              を
              <ruby>
                合<rt>あ</rt>
              </ruby>
              わせて、
              <ruby>
                新<rt>あたら</rt>
              </ruby>
              しい
              <ruby>
                数<rt>かず</rt>
              </ruby>
              を
              <ruby>
                見<rt>み</rt>
              </ruby>
              つけよう！
            </p>
          </div>
        </header>

        <section class="space-y-8">
          <h2
            class="mb-8 text-center text-xl font-bold text-[var(--mq-ink)] sm:text-2xl"
            style="animation: fadeIn 0.8s ease-out 0.2s backwards;"
          >
            たし
            <ruby>
              算<rt>ざん</rt>
            </ruby>
            の
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
            title="まいにちの たしざん"
            items={dailyExamples}
            icon="🏠"
            color="#FF6B9D"
          />
          <ExampleBox
            title="れんしゅうのアイデア"
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
            たし
            <ruby>
              算<rt>ざん</rt>
            </ruby>
            のやり
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
