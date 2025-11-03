import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { GradeDropdown } from '../../components/GradeDropdown';
import type { SchoolStage } from '../utils/school-grade';
import { formatSchoolGradeLabel } from '../utils/school-grade';
import { type GradeId, gradeLevels } from './grade-presets';

const MathNav: FC<{
  currentUser: CurrentUser | null;
  gradeId: GradeId;
  gradeStage: SchoolStage;
}> = ({ currentUser, gradeId, gradeStage }) => {
  const gradeIndex = Math.max(
    gradeLevels.findIndex((grade) => grade.id === gradeId),
    0
  );
  const gradeNumber = gradeIndex + 1;

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
        <a href="/math" class="transition hover:opacity-80">
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--mq-primary-soft)] text-sm">
            🔢
          </span>
        </a>
        <GradeDropdown
          currentGrade={gradeNumber}
          currentStage={gradeStage}
          availableGrades={availableGrades}
          baseUrl="/math/learn"
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

const additionFocusByGrade: Record<GradeId, {
  focus: string;
  numberRange: string;
  challenge: string;
}> = {
  'elem-1': {
    focus: '10までの数を使って、数を合わせる感覚を身につけましょう。',
    numberRange: '1桁どうしのたし算（1 + 4 や 7 + 2 など）',
    challenge: '10をつくる組み合わせ（3 + 7、4 + 6など）を覚えると計算がぐっと速くなります。',
  },
  'elem-2': {
    focus: '繰り上がりのある計算にもチャレンジしながら、計算のきまりを理解しましょう。',
    numberRange: '2桁のたし算（38 + 26 など）',
    challenge: '10ごとにまとめて考えると、繰り上がりがわかりやすくなります。',
  },
  'elem-3': {
    focus: '大きな数の扱いに慣れ、文章問題で状況を整理しながら計算できるようにしましょう。',
    numberRange: '3桁のたし算（245 + 378 など）',
    challenge: '「百のくらい」「十のくらい」「一のくらい」をそろえて、筆算の手順を確かめましょう。',
  },
  'elem-4': {
    focus: '小数や分数にもたし算の考え方を広げ、単位をそろえて計算する力を伸ばします。',
    numberRange: '小数や分数のたし算（2.4 + 1.8、1/4 + 2/4 など）',
    challenge: '位をそろえる／分母をそろえる工夫をして、計算のルールを確認しましょう。',
  },
  'elem-5': {
    focus: '割合や単位量の考えと組み合わせて、問題の意味を整理して計算できるようにします。',
    numberRange: '単位量や割合がからむたし算',
    challenge: '「求めたいものは何か？」を言葉にしながら式を立てると、ミスを防げます。',
  },
  'elem-6': {
    focus: '複雑な文章問題や図形の問題の中で、必要な情報を見つけてたし算を使う力を養います。',
    numberRange: '複数の数量を整理するたし算',
    challenge: '図や表に整理して、「足りないもの」「わかっているもの」を書き出しましょう。',
  },
};

const KeyPointCard: FC<{ title: string; icon: string; description: string }>
  = ({ title, icon, description }) => (
    <div class="flex flex-col gap-3 rounded-2xl border border-[var(--mq-outline)] bg-white/70 p-6 text-left shadow-sm backdrop-blur">
      <div class="flex items-center gap-3">
        <span class="text-3xl" aria-hidden="true">
          {icon}
        </span>
        <h3 class="text-lg font-semibold text-[var(--mq-ink)]">{title}</h3>
      </div>
      <p class="text-sm leading-relaxed text-[#4f6076]">{description}</p>
    </div>
  );

const StepList: FC<{ steps: readonly string[] }> = ({ steps }) => (
  <ol class="space-y-3 text-left text-sm leading-relaxed text-[#4f6076]">
    {steps.map((step, index) => (
      <li key={step} class="flex items-start gap-3">
        <span class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--mq-primary-soft)] text-xs font-bold text-[var(--mq-primary-strong)]">
          {index + 1}
        </span>
        <span class="flex-1">{step}</span>
      </li>
    ))}
  </ol>
);

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
  const additionFocus = additionFocusByGrade[gradeId] ?? additionFocusByGrade['elem-1'];

  return (
    <div
      class="flex flex-1 w-full flex-col gap-10"
      data-user-state={currentUser ? 'known' : 'anonymous'}
      style="--mq-primary: #6B9BD1; --mq-primary-strong: #3B7AC7; --mq-primary-soft: #D6E4F5; --mq-accent: #B7D4F7; --mq-outline: rgba(107, 155, 209, 0.45);"
    >
      <MathNav currentUser={currentUser} gradeId={gradeId} gradeStage={gradeStage} />
      <div class="flex flex-1 flex-col gap-10 px-4 sm:px-8 lg:px-16 xl:px-24">
        <header class="flex flex-col gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-10 text-[var(--mq-ink)] shadow-xl">
          <div class="flex flex-col items-start gap-4 text-left sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-3">
              <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--mq-primary-strong)]">MathQuest Learning</p>
              <h1 class="text-3xl font-extrabold sm:text-4xl">
                {gradeLabel}の「たし算」を学習しよう
              </h1>
              <p class="max-w-2xl text-sm leading-relaxed text-[#4f6076]">
                たし算は数をまとめて新しい数をつくる計算です。ここでは、考え方・計算の手順・生活の中での活用例を順番に確認して、理解を深めましょう。
              </p>
            </div>
            <a
              href={`/math/start?grade=${encodeURIComponent(gradeId)}&calc=calc-add`}
              class="inline-flex items-center gap-2 rounded-3xl bg-[var(--mq-primary-strong)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#2f69b3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary-strong)]"
            >
              クエストで練習してみる →
            </a>
          </div>
          <div class="grid gap-4 rounded-2xl bg-white/80 p-6 text-sm text-[#4f6076] shadow-inner sm:grid-cols-3">
            <div class="space-y-1">
              <p class="text-xs font-semibold text-[var(--mq-primary-strong)]">重点ポイント</p>
              <p>{additionFocus.focus}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-semibold text-[var(--mq-primary-strong)]">扱う数の範囲</p>
              <p>{additionFocus.numberRange}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-semibold text-[var(--mq-primary-strong)]">チャレンジのコツ</p>
              <p>{additionFocus.challenge}</p>
            </div>
          </div>
        </header>

        <section class="grid gap-6 md:grid-cols-2">
          <KeyPointCard
            title="たし算ってどんな計算？"
            icon="➕"
            description="2つ以上の数をあわせて、全体でいくつになるかを求める計算です。ブロックやえんぴつなど身の回りのものを使って「合わせる」イメージをつかみましょう。"
          />
          <KeyPointCard
            title="ことばと式をむすびつけよう"
            icon="🗣️"
            description="『リンゴが3こありました。2こもらいました。全部でなんこ？』のように、言葉で表された状況を図にしたり、式（3 + 2 = 5）にしたりする練習をしましょう。"
          />
          <KeyPointCard
            title="順番を入れかえても同じ"
            icon="🔄"
            description="たし算は順番を入れかえても答えが同じ（3 + 5 と 5 + 3 は同じ）という性質があります。この性質を使うと、計算をしやすい順番に並べ替えることができます。"
          />
          <KeyPointCard
            title="10をつくると考えやすい"
            icon="🎯"
            description="たくさんの数を足すときは、10になる組み合わせを先に見つけると計算がスムーズです。『6 + 4』『7 + 3』など、よく使う組み合わせを覚えておきましょう。"
          />
        </section>

        <section class="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div class="rounded-3xl border border-[var(--mq-outline)] bg-white/90 p-8 shadow-sm">
            <h2 class="text-2xl font-bold text-[var(--mq-ink)]">筆算の進め方</h2>
            <p class="mt-3 text-sm leading-relaxed text-[#4f6076]">
              繰り上がりのある計算でもあわてずに進められるよう、手順を確認しましょう。
            </p>
            <div class="mt-6 space-y-4 rounded-2xl bg-[var(--mq-primary-soft)]/60 p-6">
              <StepList
                steps={[
                  '一のくらいどうしを足して、答えを書きます。10以上になったら、一のくらいに答えを書き、十のくらいに繰り上げの数字を用意します。',
                  '十のくらいを足します。繰り上げがある場合は、その数字も忘れずに足しましょう。',
                  '百のくらいなど、位が増えても同じように左へ進みながら計算します。',
                ]}
              />
              <div class="rounded-2xl border border-dashed border-[var(--mq-outline)] bg-white p-5 text-sm text-[#3b4a62]">
                <p class="font-semibold text-[var(--mq-primary-strong)]">例： 48 + 27</p>
                <ul class="mt-2 list-disc space-y-1 pl-5">
                  <li>一のくらい：8 + 7 = 15 → 5を書いて、1を十のくらいに繰り上げ。</li>
                  <li>十のくらい：4 + 2 + 繰り上げの1 = 7 → 答えは75。</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-6">
            <div class="rounded-3xl border border-[var(--mq-outline)] bg-white/90 p-6 shadow-sm">
              <h2 class="text-xl font-bold text-[var(--mq-ink)]">生活の中のたし算</h2>
              <ul class="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#4f6076]">
                <li>買いものの合計金額を計算する。</li>
                <li>時間を合わせて、どれくらい遊べるかを考える。</li>
                <li>カードやポイントを集めて合計枚数を数える。</li>
              </ul>
            </div>
            <div class="rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-primary-soft)]/60 p-6 shadow-inner">
              <h2 class="text-xl font-bold text-[var(--mq-ink)]">練習のアイデア</h2>
              <ul class="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#4f6076]">
                <li>たし算カードやアプリを使って、10になる組み合わせクイズをする。</li>
                <li>サイコロを2個ふって出た数を足し、誰が先に20に到達するか競争する。</li>
                <li>身の回りのものをグループに分けて数を足し合わせ、表やグラフにまとめてみる。</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="rounded-3xl border border-[var(--mq-outline)] bg-white/90 p-8 text-center shadow-sm">
          <h2 class="text-2xl font-bold text-[var(--mq-ink)]">次のステップ</h2>
          <p class="mt-3 text-sm leading-relaxed text-[#4f6076]">
            理解できたら、演習で定着させましょう。MathQuestのクエストモードでは、学年に合わせたたし算の問題を自動で出題します。
          </p>
          <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`/math/quest?grade=${encodeURIComponent(gradeId)}`}
              class="inline-flex items-center gap-2 rounded-3xl border border-[var(--mq-primary-strong)] bg-white px-6 py-3 text-sm font-semibold text-[var(--mq-primary-strong)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary-strong)]"
            >
              クエストを選ぶ
            </a>
            <a
              href={`/math/select?grade=${encodeURIComponent(gradeId)}`}
              class="inline-flex items-center gap-2 rounded-3xl border border-[var(--mq-outline)] bg-white px-6 py-3 text-sm font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
            >
              学習方法にもどる
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};
