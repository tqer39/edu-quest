import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

type SectionHeadingProps = {
  id: string;
  icon: string;
  title: string;
  description?: string;
};

const SectionHeading: FC<SectionHeadingProps> = ({
  id,
  icon,
  title,
  description,
}) => (
  <div class="flex flex-col gap-3" id={id}>
    <div class="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.35em] text-[#5e718a]">
      <span aria-hidden="true" class="text-lg">
        {icon}
      </span>
      <span>{title}</span>
    </div>
    {description ? (
      <p class="max-w-3xl text-base leading-relaxed text-[#4f6076]">
        {description}
      </p>
    ) : null}
  </div>
);

type Feature = {
  title: string;
  description: string;
};

const FeatureList: FC<{ features: Feature[] }> = ({ features }) => (
  <ul class="grid gap-4 text-sm text-[#1f2937] sm:grid-cols-2">
    {features.map((feature) => (
      <li class="flex items-start gap-3 rounded-2xl  bg-white/80 p-4 shadow-sm">
        <span aria-hidden="true" class="mt-1 text-base">
          ✔
        </span>
        <span>
          <span class="font-semibold text-[var(--mq-ink)]">
            {feature.title}
          </span>
          <span class="block text-[#4f6076]">{feature.description}</span>
        </span>
      </li>
    ))}
  </ul>
);

const TableOfContents: FC = () => {
  const sections = [
    { id: 'safety', icon: '🔒', title: '安心して使える設計' },
    { id: 'effect', icon: '📈', title: '楽しく学び、しっかり身につく' },
    { id: 'easy-start', icon: '⚡', title: 'すぐに使い始められます' },
    { id: 'transparency', icon: '🪪', title: 'オープンで誠実な運営' },
    { id: 'use-cases', icon: '🏡', title: 'ご家庭での活用シーン' },
    { id: 'faq', icon: '❓', title: 'よくある質問' },
  ];

  return (
    <nav class="rounded-3xl  bg-white/90 p-6 shadow-sm">
      <h2 class="mb-4 text-sm font-semibold text-[#1f2937]">📑 目次</h2>
      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <li>
            <a
              href={`#${section.id}`}
              class="flex items-center gap-2 rounded-xl  bg-white/80 px-4 py-3 text-sm font-medium text-[#1f2937] transition hover:-translate-y-0.5 hover:bg-[#f0f9ff] hover:shadow-md"
            >
              <span aria-hidden="true" class="text-base">
                {section.icon}
              </span>
              <span>{section.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const UseCaseCard: FC<{
  title: string;
  description: string;
  accent: string;
}> = ({ title, description, accent }) => (
  <article
    class="flex min-h-[200px] w-full min-w-[260px] flex-col justify-between gap-6 rounded-3xl  bg-white/90 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-sm"
    style={`--accent: ${accent};`}
  >
    <header>
      <h3 class="text-lg font-semibold text-[var(--mq-ink)]">{title}</h3>
      <div class="mt-2 h-1 w-12 rounded-full bg-[var(--accent)]"></div>
    </header>
    <p class="text-sm leading-relaxed text-[#4f6076]">{description}</p>
  </article>
);

const faqItems = [
  {
    question: 'Q1. 会員登録は必要ですか？',
    answer: 'いいえ。匿名のまま、すぐに学習を始められます。',
  },
  {
    question: 'Q2. 料金はかかりますか？',
    answer: 'いいえ。現在提供しているすべての学習コンテンツは無料です。',
  },
  {
    question: 'Q3. どの端末で使えますか？',
    answer:
      'PC・タブレット・スマートフォンなど、ブラウザが動作する端末であればご利用いただけます。',
  },
  {
    question: 'Q4. 広告や個人情報の心配は？',
    answer:
      '広告は表示せず、通信はすべてHTTPSで暗号化。個人情報の入力も不要です。',
  },
];

export const ParentsPage: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser,
}) => (
  <main
    id="parents-root"
    class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
  >
    <Header currentUser={currentUser} />
    <section
      id="parents-hero"
      class="relative overflow-hidden rounded-[32px]  bg-gradient-to-br from-[#ecf5ff] via-white to-[#e0f8f0] px-6 py-12 text-[var(--mq-ink)] shadow-md sm:px-10 sm:py-16"
    >
      <div class="absolute inset-y-0 right-0 hidden w-1/2 opacity-80 sm:block">
        <div class="h-full w-full rounded-l-full bg-[radial-gradient(circle_at_top,#d1fae5,transparent_60%)]"></div>
      </div>
      <div class="relative flex flex-col gap-10 sm:flex-row sm:items-center">
        <div class="flex-1 space-y-6">
          <span class="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#3b82f6] shadow-sm">
            安心して任せられる学びの場
          </span>
          <h1 class="text-3xl font-extrabold leading-tight sm:text-4xl">
            👪 保護者の方へ — 楽しく学べて、安心して使えるEduQuest
          </h1>
          <p class="max-w-xl text-base leading-relaxed text-[#4f6076]">
            EduQuestは、小学生のお子さまが“遊びながら学ぶ”ことを目指した無料の学習プラットフォームです。安全性・教育的効果・使いやすさの3つを大切に設計しています。
          </p>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              id="parents-primary-cta"
              href="/"
              class="inline-flex items-center justify-center rounded-2xl bg-[#3b82f6] px-6 py-3 text-sm font-semibold !text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
            >
              今すぐ体験する
            </a>
            <a
              href="/"
              class="inline-flex items-center justify-center rounded-2xl bg-white/80 px-6 py-3 text-sm font-semibold text-[#1f2937] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93c5fd]"
            >
              学習ステージを見る
            </a>
          </div>
        </div>
        <div class="flex flex-1 justify-center">
          <div class="relative mt-8 w-full max-w-sm rounded-3xl bg-white/80 p-6 shadow-sm backdrop-blur">
            <div class="absolute -right-6 -top-6 hidden h-20 w-20 rounded-full bg-gradient-to-br from-[#22c55e]/80 to-[#3b82f6]/80 blur-0 sm:block"></div>
            <p class="text-sm font-semibold text-[#1f2937]">
              ご家庭での安心ポイント
            </p>
            <ul class="mt-4 space-y-3 text-sm text-[#4f6076]">
              <li class="flex items-start gap-2">
                <span aria-hidden="true" class="mt-1 text-base text-[#22c55e]">
                  ●
                </span>
                匿名で始められ、個人情報の入力は不要。
              </li>
              <li class="flex items-start gap-2">
                <span aria-hidden="true" class="mt-1 text-base text-[#22c55e]">
                  ●
                </span>
                広告や外部リンクがなく、学習に集中できます。
              </li>
              <li class="flex items-start gap-2">
                <span aria-hidden="true" class="mt-1 text-base text-[#22c55e]">
                  ●
                </span>
                進捗は端末内に保存され、プライバシーを守ります。
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <TableOfContents />

    <section class="rounded-[32px]  bg-white/90 p-8 shadow-sm">
      <SectionHeading
        id="safety"
        icon="🔒"
        title="安心して使える設計"
        description="EduQuestは収集データを最小限に抑え、子どもが集中できる環境を最優先しています。"
      />
      <div class="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <FeatureList
          features={[
            {
              title: '匿名ですぐに体験可能',
              description:
                'アカウント登録なしで体験を開始できます。学習履歴を保存する場合はアカウント登録が必要です。',
            },
            {
              title: '広告・外部リンクなし',
              description:
                'アプリ内に広告や誘導リンクがなく、安心して任せられます。',
            },
            {
              title: '学習進捗は端末内に保存',
              description:
                'ローカルストレージに保存され、サーバーに個人情報を送信しません。',
            },
            {
              title: '通信はすべてHTTPSで暗号化',
              description:
                '常に暗号化された通信で、第三者からの盗聴や改ざんを防ぎます。',
            },
            {
              title: '利用時間制限機能（開発中）',
              description:
                'ご家庭のルールに合わせた利用時間のコントロールを提供予定です。',
            },
          ]}
        />
        <aside class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1f2937] via-[#1f2937] to-[#2563eb] p-8 text-white shadow-md">
          <h3 class="text-lg font-semibold">セキュリティ対策も透明に</h3>
          <p class="mt-4 text-sm leading-relaxed text-white/90">
            定期的にコードレビューとセキュリティチェックを実施し、安全な状態を維持しています。詳細な技術資料は順次公開予定です。
          </p>
          <a
            href="/trust-and-safety"
            class="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            セキュリティ対策を詳しく見る
            <span aria-hidden="true">→</span>
          </a>
          <div class="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-[radial-gradient(circle,#22c55e,transparent_65%)] opacity-70"></div>
        </aside>
      </div>
    </section>

    <section class="rounded-[32px]  bg-white/95 p-8 shadow-sm">
      <SectionHeading
        id="effect"
        icon="📈"
        title="楽しく学び、しっかり身につく"
        description="文部科学省の学習指導要領に沿いながら、フィードバックでモチベーションを高める仕組みを備えています。"
      />
      <div class="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <FeatureList
          features={[
            {
              title: '教科書準拠の出題',
              description:
                '学校で習う単元をもとにした問題で、授業との連携がしやすい構成です。',
            },
            {
              title: '段階的に難度が上昇',
              description:
                'ステップアップ方式で、成功体験を重ねながら確かな理解へつなげます。',
            },
            {
              title: 'AIが苦手単元を分析',
              description:
                '誤答データをもとに自動で復習問題を提示し、弱点克服をサポートします。',
            },
            {
              title: 'ゲーミフィケーション要素',
              description:
                'ポイントや称号、連続チャレンジなど、自発的な学習を促す仕掛けを用意。',
            },
            {
              title: '自己決定理論に基づいた設計',
              description:
                '自律性・有能感・関係性を満たす体験で、継続的な学習意欲を引き出します。',
            },
          ]}
        />
        <div class="rounded-3xl bg-[#f9fafb] p-6 shadow-inner">
          <h3 class="text-base font-semibold text-[var(--mq-ink)]">
            学びの循環サイクル
          </h3>
          <ol class="mt-4 space-y-3 text-sm text-[#4f6076]">
            <li class="flex items-start gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#3b82f6]/15 text-sm font-semibold text-[#1d4ed8]">
                1
              </span>
              問題を解く
            </li>
            <li class="flex items-start gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#3b82f6]/15 text-sm font-semibold text-[#1d4ed8]">
                2
              </span>
              フィードバックを受ける
            </li>
            <li class="flex items-start gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#3b82f6]/15 text-sm font-semibold text-[#1d4ed8]">
                3
              </span>
              理解が深まる
            </li>
            <li class="flex items-start gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#3b82f6]/15 text-sm font-semibold text-[#1d4ed8]">
                4
              </span>
              モチベーション向上
            </li>
            <li class="flex items-start gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#3b82f6]/15 text-sm font-semibold text-[#1d4ed8]">
                5
              </span>
              再び問題に挑戦
            </li>
          </ol>
          <a
            href="/math"
            class="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-[#16a34a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e]"
          >
            算数チャレンジを見る
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>

    <section class="rounded-[32px]  bg-white/95 p-8 shadow-sm">
      <SectionHeading
        id="easy-start"
        icon="💻"
        title="すぐに使い始められます"
        description="インストール不要で、すでにあるデバイスからすぐに学習を開始できます。"
      />
      <div class="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <FeatureList
          features={[
            {
              title: 'ブラウザだけで利用可能',
              description:
                'ChromeやSafariなど、お使いのブラウザがあれば追加インストールは不要です。',
            },
            {
              title: 'PC／タブレット／スマホ対応',
              description:
                '画面サイズに合わせたレイアウトで、どの端末でも見やすく操作できます。',
            },
            {
              title: '1クリックで学習開始',
              description:
                'トップページのミッションからワンクリックで問題に挑戦できます。',
            },
            {
              title: '進捗は自動保存',
              description:
                '途中で中断しても、次回アクセス時に前回の状態から再開できます。',
            },
            {
              title: '家庭・学校・学習塾でも利用可能',
              description:
                '複数アカウントを用意しなくても、各端末ごとに学習履歴を管理できます。',
            },
          ]}
        />
        <div class="flex flex-col items-start gap-6 rounded-3xl bg-gradient-to-br from-[#ecfdf5] via-white to-[#d1fae5] p-8 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow">
              <span class="text-3xl" aria-hidden="true">
                📱
              </span>
            </div>
            <p class="text-sm leading-relaxed text-[#0f172a]">
              デスクトップ・タブレット・スマホが並ぶイメージで、どのデバイスからでも同じ体験をご提供します。
            </p>
          </div>
          <a
            href="#parents-hero"
            class="inline-flex items-center gap-2 rounded-xl bg-white/90 px-5 py-2 text-sm font-semibold text-[#0f172a] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]"
          >
            学習を始める位置に戻る
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </section>

    <section class="rounded-[32px]  bg-white/95 p-8 shadow-sm">
      <SectionHeading
        id="transparency"
        icon="🪪"
        title="オープンで誠実な運営"
      />
      <div class="mt-8 grid gap-6 sm:grid-cols-2">
        <article class="rounded-3xl bg-gradient-to-br from-[#eef2ff] via-white to-[#c7d2fe] p-6 shadow-sm">
          <h3 class="text-base font-semibold text-[#312e81]">運営情報</h3>
          <ul class="mt-4 space-y-3 text-sm text-[#4338ca]">
            <li>
              開発運営：<span class="font-semibold">EduQuest Project</span>
            </li>
            <li>
              リードエンジニア：
              <a
                href="https://github.com/tqer39"
                class="underline decoration-[#4338ca]/50 underline-offset-2 transition hover:text-[#1d4ed8]"
                target="_blank"
                rel="noreferrer"
              >
                tqer39（教育系SRE）
              </a>
            </li>
            <li>
              ソースコード：
              <a
                href="https://github.com/tqer39/edu-quest"
                class="underline decoration-[#4338ca]/50 underline-offset-2 transition hover:text-[#1d4ed8]"
                target="_blank"
                rel="noreferrer"
              >
                GitHub Repository
              </a>
            </li>
          </ul>
        </article>
        <article class="rounded-3xl bg-white/95 p-6 shadow-sm">
          <h3 class="text-base font-semibold text-[#312e81]">
            お問い合わせとポリシー
          </h3>
          <ul class="mt-4 space-y-3 text-sm text-[#4338ca]">
            <li>
              プライバシーポリシー：
              <a
                href="/privacy"
                class="underline decoration-[#4338ca]/50 underline-offset-2 transition hover:text-[#1d4ed8]"
              >
                準備中（公開予定）
              </a>
            </li>
            <li>
              お問い合わせ：
              <a
                href="mailto:contact@eduquest.app"
                class="underline decoration-[#4338ca]/50 underline-offset-2 transition hover:text-[#1d4ed8]"
              >
                contact@eduquest.app
              </a>
            </li>
            <li>透明性レポート：現在準備中です。</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="rounded-[32px]  bg-white/95 p-8 shadow-sm">
      <SectionHeading
        id="use-cases"
        icon="🏡"
        title="ご家庭での活用シーン"
        description="毎日の生活に取り入れやすい具体的な利用例をご紹介します。"
      />
      <div class="mt-12 flex gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible">
        <UseCaseCard
          title="宿題後の10分復習"
          description="宿題が終わったあとに短時間で確認テスト。間違えた問題は自動的に復習へ。"
          accent="#3b82f6"
        />
        <UseCaseCard
          title="親子で一緒にチャレンジ"
          description="画面を見ながら親子で話し合って問題を解くことで、学びの時間がコミュニケーションに。"
          accent="#22c55e"
        />
        <UseCaseCard
          title="登校前・就寝前の短時間学習"
          description="スキマ時間に1〜2ステージだけチャレンジ。習慣化しやすいUIを提供します。"
          accent="#f97316"
        />
        <UseCaseCard
          title="兄弟姉妹での競争"
          description="端末ごとに記録できるので、家族みんなで称号を目指して挑戦できます。"
          accent="#a855f7"
        />
        <UseCaseCard
          title="連続チャレンジで習慣化"
          description="学習連続日数が可視化されるステータスカードで、やる気を維持できます。"
          accent="#0ea5e9"
        />
      </div>
    </section>

    <section class="rounded-[32px]  bg-white/95 p-8 shadow-sm">
      <SectionHeading id="faq" icon="❓" title="よくある質問" />
      <div class="mt-10 space-y-6">
        {faqItems.map((item) => (
          <details
            open
            class="group rounded-2xl bg-white/90 p-6 shadow-sm transition"
          >
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#1f2937]">
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                class="text-lg text-[#3b82f6] transition group-open:rotate-90"
              >
                ›
              </span>
            </summary>
            <p class="mt-4 text-sm leading-relaxed text-[#4f6076]">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>

    <section class="rounded-[32px]  bg-gradient-to-br from-[#dbeafe] via-white to-[#bbf7d0] p-8 text-[var(--mq-ink)] shadow-md">
      <div class="flex flex-col gap-6 text-center">
        <h2 class="text-2xl font-extrabold">さあ、EduQuestをはじめましょう</h2>
        <p class="mx-auto max-w-2xl text-sm leading-relaxed text-[#4f6076]">
          安心・教育的・導入しやすい学習体験を、ご家庭の毎日に取り入れてみませんか？
        </p>
        <div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/"
            class="inline-flex items-center justify-center rounded-2xl bg-[#3b82f6] px-6 py-3 text-sm font-semibold !text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
          >
            トップページで体験する
          </a>
          <a
            href="/"
            class="inline-flex items-center justify-center rounded-2xl bg-white/90 px-6 py-3 text-sm font-semibold text-[#1f2937] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93c5fd]"
          >
            学習ステージ一覧
          </a>
        </div>
      </div>
    </section>

    <Footer />
  </main>
);
