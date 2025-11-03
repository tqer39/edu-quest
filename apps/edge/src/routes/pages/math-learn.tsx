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

type GradeLessonContent = {
  focus: string;
  numberRange: string;
  challenge: string;
  keyPoints: { title: string; icon: string; description: string }[];
  stepGuide: {
    heading: string;
    introduction: string;
    steps: readonly string[];
    exampleTitle: string;
    exampleSteps: readonly string[];
  };
  dailyScenes: readonly string[];
  practiceIdeas: readonly string[];
  reviewChecklist: readonly string[];
};

const lessonContentByGrade: Record<GradeId, GradeLessonContent> = {
  'elem-1': {
    focus: '10までの数を使って、数を合わせる感覚を身につけましょう。',
    numberRange: '1桁どうしのたし算（1 + 4 や 7 + 2 など）',
    challenge: '10をつくる組み合わせ（3 + 7、4 + 6など）を覚えると計算がぐっと速くなります。',
    keyPoints: [
      {
        title: '「あわせる」イメージをつくろう',
        icon: '🧱',
        description:
          'ブロックやおはじきを使って、ふたつのかたまりを合わせる様子を目で確かめましょう。',
      },
      {
        title: 'ことばと式をむすびつける',
        icon: '🗣️',
        description:
          '「りんごが3こあり、2こもらった」→「3 + 2 = 5」のように、状況を式に変換する練習をしましょう。',
      },
      {
        title: '10になる仲間を覚える',
        icon: '🎯',
        description:
          '6と4、7と3など10になる組み合わせを暗記しておくと、複数の数を足すときに強い味方になります。',
      },
    ],
    stepGuide: {
      heading: 'ブロックで考えるたし算の手順',
      introduction:
        '目に見えるものを動かしながら考えると、繰り上がりがない計算の流れがつかめます。',
      steps: [
        '足したいものを2つのグループに分けて並べる。',
        '片方からもう一方へ順に移動させて、全部でいくつになったかを数える。',
        '数を数えたら、式と答えを声に出して確認する。',
      ],
      exampleTitle: '例：5 + 3 の考え方',
      exampleSteps: [
        '5こあるブロックの列の横に3こ並べる。',
        '1こずつ動かして数えると全部で8こになる。',
        '式にすると 5 + 3 = 8。',
      ],
    },
    dailyScenes: [
      'おやつの数を合わせて全体の個数を数える。',
      '10マスの表を使って、シールを貼りながら合計を確かめる。',
      '時間割で、今日勉強する教科の数を足して確認する。',
    ],
    practiceIdeas: [
      '10になるカードゲームで、ペアを素早く探す。',
      'サイコロを2つ振って出た目を足し、先に20に到達した人が勝ち。',
      '家にあるものを「5こ＋〇こ」の式にして数える。',
    ],
    reviewChecklist: [
      '式と答えを声に出して確認できましたか？',
      '10になる組み合わせを使って計算を楽にできましたか？',
      '文章で書かれた問題を図にして考えられましたか？',
    ],
  },
  'elem-2': {
    focus: '繰り上がりのある計算にもチャレンジしながら、計算のきまりを理解しましょう。',
    numberRange: '2桁のたし算（38 + 26 など）',
    challenge: '10ごとにまとめて考えると、繰り上がりがわかりやすくなります。',
    keyPoints: [
      {
        title: '位ごとに分けて考える',
        icon: '📊',
        description:
          '十のくらいと一のくらいに分けて足し、最後に合わせるとミスが減ります。',
      },
      {
        title: '繰り上がりの仕組みを理解する',
        icon: '🔁',
        description:
          '一のくらいの合計が10以上になったら、十のくらいに1を渡すことを図で確認しましょう。',
      },
      {
        title: '計算のきまりを利用する',
        icon: '🧠',
        description:
          '「順番を入れかえても同じ」「かたまりにして考える」などの性質を使うと計算が速くなります。',
      },
    ],
    stepGuide: {
      heading: '繰り上がりのある筆算の手順',
      introduction: '筆算の配置と順番を守れば、どの問題でも同じ流れで解けます。',
      steps: [
        '数を位がそろうように縦に並べ、筆算の形を整える。',
        '一のくらいから計算し、10以上なら十のくらいに1を繰り上げる。',
        '十のくらい、百のくらい…と左に進みながら足す。',
      ],
      exampleTitle: '例：48 + 27 の筆算',
      exampleSteps: [
        '一のくらい：8 + 7 = 15 → 5を書き、1を十のくらいに繰り上げ。',
        '十のくらい：4 + 2 + 繰り上げ1 = 7 → 答えは75。',
        'もう一度全体を確認して、桁がずれていないかチェック。',
      ],
    },
    dailyScenes: [
      'おこづかい帳で、数日分の金額を合計する。',
      '買いもののレシートを見ながら合計金額を確かめる。',
      '読書のページ数を足して、1週間で読んだページ数を出す。',
    ],
    practiceIdeas: [
      '繰り上がりの有無を意識した計算カードでタイムアタック。',
      '十のくらいと一のくらいに分けて頭の中で計算する練習。',
      '文章問題を自分で作って、家族に出題してみる。',
    ],
    reviewChecklist: [
      '筆算で位を正しくそろえられましたか？',
      '繰り上がりを書き忘れていませんか？',
      '答えがもとの数より大きくなっているか確認しましたか？',
    ],
  },
  'elem-3': {
    focus: '大きな数の扱いに慣れ、文章問題で状況を整理しながら計算できるようにしましょう。',
    numberRange: '3桁のたし算（245 + 378 など）',
    challenge:
      '「百のくらい」「十のくらい」「一のくらい」をそろえて、筆算の手順を確かめましょう。',
    keyPoints: [
      {
        title: '数の大きさをイメージする',
        icon: '🏗️',
        description:
          '100ごと、10ごとにブロックをまとめて考えると、桁の大きな計算も怖くありません。',
      },
      {
        title: '文章問題を図で整理する',
        icon: '📝',
        description:
          '「だれが」「いくつ」「どうなった」を表に書き出し、式を立てる前に状況を整理しましょう。',
      },
      {
        title: '概数で答えを見積もる',
        icon: '🔍',
        description:
          'おおよその値を先に出しておくと、計算結果の妥当性をチェックできます。',
      },
    ],
    stepGuide: {
      heading: '3桁のたし算を正確に行うコツ',
      introduction: '筆算の基本を守りつつ、途中で答えを見直す工夫を取り入れましょう。',
      steps: [
        '数を桁ごとに区切り、必要に応じてブロック図を描く。',
        '筆算を行いながら、途中で概数（400 + 400 など）を計算して見通しを立てる。',
        '答えが概数と大きくずれていないかを最後に確認する。',
      ],
      exampleTitle: '例：368 + 457 の考え方',
      exampleSteps: [
        '概数で 400 + 500 ≒ 900 と予想。',
        '筆算で一のくらい → 十のくらい → 百のくらいの順に計算。',
        '答え 825 は予想と近いので妥当。',
      ],
    },
    dailyScenes: [
      '学校のイベントで、クラス全員の人数を学年ごとに足し合わせる。',
      '図書室で借りた本のページ数を合計する。',
      '貯金箱に入っているお金を100円・10円単位で整理する。',
    ],
    practiceIdeas: [
      '概数を使った見積もりゲームで、実際の計算結果との誤差を比べる。',
      '文章問題を図にする練習ノートを作る。',
      '百マス計算で、3桁同士のたし算にチャレンジする。',
    ],
    reviewChecklist: [
      '概数で答えの大きさを予想しましたか？',
      '筆算の途中で桁を間違えていませんか？',
      '文章問題の条件を読み落としていませんか？',
    ],
  },
  'elem-4': {
    focus: '小数や分数にもたし算の考え方を広げ、単位をそろえて計算する力を伸ばします。',
    numberRange: '小数や分数のたし算（2.4 + 1.8、1/4 + 2/4 など）',
    challenge: '位をそろえる／分母をそろえる工夫をして、計算のルールを確認しましょう。',
    keyPoints: [
      {
        title: '小数点をそろえる',
        icon: '📐',
        description:
          '小数の筆算は小数点の位置をきっちりそろえることが第一歩です。',
      },
      {
        title: '分母をそろえる',
        icon: '⚖️',
        description:
          '分数のたし算では通分をして分母を同じにし、分子だけを足します。',
      },
      {
        title: '単位をそろえる',
        icon: '🧪',
        description:
          '長さや時間など単位が混ざるときは、同じ単位に直してから計算しましょう。',
      },
    ],
    stepGuide: {
      heading: '小数・分数の計算手順',
      introduction:
        '整数のたし算と同じ流れですが、「そろえる」作業を最初に行うことがポイントです。',
      steps: [
        '小数なら小数点、分数なら分母をそろえる準備をする。',
        'そろったら、位や分子どうしを足す。',
        '必要に応じて約分や単位の変換を行う。',
      ],
      exampleTitle: '例：2.4 + 1.85 と 1/3 + 1/6',
      exampleSteps: [
        '小数：小数点をそろえて筆算し、途中のメモ（2.40 + 1.85 など）も丁寧に書く。',
        '分数：1/3 と 1/6 を6分のいくつかにそろえる → 2/6 + 1/6 = 3/6 = 1/2。',
        '単位：必要なら答えを帯分数やミリリットルなどに直す。',
      ],
    },
    dailyScenes: [
      '料理で使う水の量をミリリットル単位で足し合わせる。',
      '長さをセンチメートルとミリメートルにそろえて計算する。',
      '分数のピザを分け合う場面を図で表す。',
    ],
    practiceIdeas: [
      '小数の足し算カードで、繰り上がりが出る問題に挑戦する。',
      '分数の通分練習として、分母の最小公倍数を探すゲームをする。',
      '単位変換クイズを家族と出し合う。',
    ],
    reviewChecklist: [
      '小数点・分母・単位をきちんとそろえましたか？',
      '約分できる分数をそのままにしていませんか？',
      '答えの単位を問題の指示に合わせましたか？',
    ],
  },
  'elem-5': {
    focus: '割合や単位量の考えと組み合わせて、問題の意味を整理して計算できるようにします。',
    numberRange: '単位量や割合がからむたし算',
    challenge: '「求めたいものは何か？」を言葉にしながら式を立てると、ミスを防げます。',
    keyPoints: [
      {
        title: '単位量の意味を押さえる',
        icon: '⚙️',
        description:
          '1あたり量や割合を理解し、どの数を足すのか判断できるようにしましょう。',
      },
      {
        title: '数量の関係を図式化する',
        icon: '🧭',
        description:
          '帯グラフや線分図で状況を整理すると、式を立てやすくなります。',
      },
      {
        title: 'まとめ方を工夫する',
        icon: '🧮',
        description:
          '同じ種類の数量ごとにまとめてから足すと、複雑な問題も解決しやすくなります。',
      },
    ],
    stepGuide: {
      heading: '文章問題を整理する手順',
      introduction:
        '問題文を読みながら「何を足せばよいのか」を明確にし、式に落とし込みましょう。',
      steps: [
        '登場する数量をすべて書き出し、単位をそろえる。',
        '線分図などを使って数量の関係を見える化する。',
        '求めたい量に関係する数だけを選び、順番に足す。',
      ],
      exampleTitle: '例：水そうに水を入れる問題',
      exampleSteps: [
        '毎分2Lのホースと毎分1.5Lのじょうろで10分間水を入れる。',
        '単位をLにそろえて 2×10 = 20L、1.5×10 = 15L と計算。',
        '20L + 15L = 35L が合計量。',
      ],
    },
    dailyScenes: [
      '買い物で税込み価格を足し、合計金額を求める。',
      '歩数計の記録を合計して、一日の運動量を確認する。',
      '料理のレシピを倍量にするときに材料を足し合わせる。',
    ],
    practiceIdeas: [
      '割合を使った文章問題を、図や表で説明する練習。',
      '単位量あたりを計算してから合計を求める問題に挑戦する。',
      'ニュースや統計のグラフから必要な数値を読み取って足す活動。',
    ],
    reviewChecklist: [
      '単位量・割合の意味を正しく捉えましたか？',
      '必要な数量だけを選んで式を立てましたか？',
      '答えが現実の状況に合っているか振り返りましたか？',
    ],
  },
  'elem-6': {
    focus: '複雑な文章問題や図形の問題の中で、必要な情報を見つけてたし算を使う力を養います。',
    numberRange: '複数の数量を整理するたし算',
    challenge: '図や表に整理して、「足りないもの」「わかっているもの」を書き出しましょう。',
    keyPoints: [
      {
        title: '条件整理からスタート',
        icon: '🧾',
        description:
          '問題文の条件を箇条書きにし、「求める量」「与えられている量」を明確にします。',
      },
      {
        title: '複数の計算をつなげる',
        icon: '🔗',
        description:
          'たし算だけでなく、ひき算やかけ算と組み合わせながら解く場面を想定しましょう。',
      },
      {
        title: '検算をルーティン化',
        icon: '✅',
        description:
          '概数や逆算を使った検算を習慣にすると、入試問題でも安心です。',
      },
    ],
    stepGuide: {
      heading: '多段階の問題を解くときの流れ',
      introduction:
        '一度で答えが出ない問題でも、図や表にまとめると順序立てて考えられます。',
      steps: [
        '問題を部分ごとに分け、必要な計算を順番にメモする。',
        '途中の結果を表やグラフに記録し、次の計算に引き継ぐ。',
        '最後に全体を見直し、答えが妥当か概数でチェックする。',
      ],
      exampleTitle: '例：旅行計画の合計時間',
      exampleSteps: [
        'バスで1時間20分、電車で45分、徒歩で18分移動する。',
        '分にそろえて 80分 + 45分 + 18分 = 143分。',
        '143分 = 2時間23分。概数で 1.5時間 + 0.75時間 + 0.3時間 ≒ 2.55時間 と比較し妥当性を確認。',
      ],
    },
    dailyScenes: [
      '学習計画を立てるために、教科ごとの勉強時間を合計する。',
      'クラブ活動のメンバー人数を学年ごとに足し合わせて集計表を作る。',
      '統計グラフのデータから必要な値を読み取り、合計値を求める。',
    ],
    practiceIdeas: [
      '複数の資料をまたぐ文章問題を解き、計算の流れをノートにまとめる。',
      '概数や逆算による検算を取り入れた計算練習。',
      '友達や家族と役割分担をして、表計算ソフトで合計を求める活動。',
    ],
    reviewChecklist: [
      '情報を整理する表・図を使いましたか？',
      '途中の計算結果を次のステップに正しく引き継ぎましたか？',
      '概数や別解で検算しましたか？',
    ],
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
  const lessonContent =
    lessonContentByGrade[gradeId] ?? lessonContentByGrade['elem-1'];

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
              <p>{lessonContent.focus}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-semibold text-[var(--mq-primary-strong)]">扱う数の範囲</p>
              <p>{lessonContent.numberRange}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-semibold text-[var(--mq-primary-strong)]">チャレンジのコツ</p>
              <p>{lessonContent.challenge}</p>
            </div>
          </div>
        </header>

        <section class="grid gap-6 md:grid-cols-2">
          {lessonContent.keyPoints.map((point) => (
            <KeyPointCard
              key={point.title}
              title={point.title}
              icon={point.icon}
              description={point.description}
            />
          ))}
        </section>

        <section class="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div class="rounded-3xl border border-[var(--mq-outline)] bg-white/90 p-8 shadow-sm">
            <h2 class="text-2xl font-bold text-[var(--mq-ink)]">
              {lessonContent.stepGuide.heading}
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-[#4f6076]">
              {lessonContent.stepGuide.introduction}
            </p>
            <div class="mt-6 space-y-4 rounded-2xl bg-[var(--mq-primary-soft)]/60 p-6">
              <StepList
                steps={lessonContent.stepGuide.steps}
              />
              <div class="rounded-2xl border border-dashed border-[var(--mq-outline)] bg-white p-5 text-sm text-[#3b4a62]">
                <p class="font-semibold text-[var(--mq-primary-strong)]">
                  {lessonContent.stepGuide.exampleTitle}
                </p>
                <ul class="mt-2 list-disc space-y-1 pl-5">
                  {lessonContent.stepGuide.exampleSteps.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-6">
            <div class="rounded-3xl border border-[var(--mq-outline)] bg-white/90 p-6 shadow-sm">
              <h2 class="text-xl font-bold text-[var(--mq-ink)]">生活の中のたし算</h2>
              <ul class="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#4f6076]">
                {lessonContent.dailyScenes.map((scene) => (
                  <li key={scene}>{scene}</li>
                ))}
              </ul>
            </div>
            <div class="rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-primary-soft)]/60 p-6 shadow-inner">
              <h2 class="text-xl font-bold text-[var(--mq-ink)]">練習のアイデア</h2>
              <ul class="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#4f6076]">
                {lessonContent.practiceIdeas.map((idea) => (
                  <li key={idea}>{idea}</li>
                ))}
              </ul>
            </div>
            <div class="rounded-3xl border border-[var(--mq-outline)] bg-white/90 p-6 shadow-sm">
              <h2 class="text-xl font-bold text-[var(--mq-ink)]">振り返りチェック</h2>
              <ul class="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#4f6076]">
                {lessonContent.reviewChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
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
