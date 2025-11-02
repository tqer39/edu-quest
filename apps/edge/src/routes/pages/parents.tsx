import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import { Footer } from '../../components/Footer';
import { BackToTopLink } from '../components/back-to-top-link';

const ParentsNav: FC<{ currentUser: CurrentUser | null }> = ({
  currentUser,
}) => (
  <nav class="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-2 backdrop-blur sm:px-8 lg:px-16 xl:px-24">
    <div class="flex items-center gap-2">
      <img
        src="/logo.svg"
        alt="EduQuest Logo"
        class="h-7 w-7"
        width="28"
        height="28"
      />
      <span class="text-sm font-semibold tracking-tight text-[var(--mq-ink)]">
        EduQuest
      </span>
    </div>
    <div class="flex items-center gap-2">
      <BackToTopLink />
      {currentUser ? (
        <a
          href="/auth/logout"
          class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
        >
          ログアウト
        </a>
      ) : (
        <a
          href="/auth/login"
          class="inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
        >
          ログイン
        </a>
      )}
    </div>
  </nav>
);

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
  <div class="flex flex-col gap-4" id={id}>
    <h2 class="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#dbeafe] to-transparent px-6 py-4 text-2xl font-bold text-[var(--mq-ink)] sm:text-3xl">
      <span aria-hidden="true" class="text-3xl">
        {icon}
      </span>
      <span class="border-b-4 border-[var(--mq-primary)] pb-1">{title}</span>
    </h2>
    {description ? (
      <p
        class="mb-8 max-w-3xl px-6 text-lg leading-relaxed text-[#334155]"
        style="line-height: 1.75;"
      >
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
  <ul class="grid gap-4 space-y-3 text-sm text-[#1f2937] sm:grid-cols-2">
    {features.map((feature) => (
      <li class="flex items-start gap-3 rounded-2xl bg-white/80 p-4">
        <span
          aria-hidden="true"
          class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--mq-primary)] text-xs font-bold text-white"
        >
          ✓
        </span>
        <span>
          <span class="block font-semibold text-[var(--mq-ink)]">
            {feature.title}
          </span>
          <span class="block text-[#334155]" style="line-height: 1.7;">
            {feature.description}
          </span>
        </span>
      </li>
    ))}
  </ul>
);

const SectionDivider: FC = () => (
  <div class="relative flex items-center justify-center py-4">
    <div class="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[var(--mq-outline)] to-transparent"></div>
    <div class="relative flex h-3 w-3 items-center justify-center rounded-full bg-[var(--mq-primary-soft)]">
      <div class="h-1.5 w-1.5 rounded-full bg-[var(--mq-primary)]"></div>
    </div>
  </div>
);

const LayerDivider: FC<{ label: string }> = ({ label }) => (
  <div class="relative flex items-center justify-center py-8">
    <div class="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-[var(--mq-primary)]/30 to-transparent"></div>
    <div class="relative rounded-full bg-[var(--mq-primary-soft)] px-6 py-2">
      <span class="text-sm font-bold text-[var(--mq-primary-strong)]">
        {label}
      </span>
    </div>
  </div>
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
  <main id="parents-root" class="flex min-h-screen w-full flex-col gap-16">
    <ParentsNav currentUser={currentUser} />
    <div class="flex flex-col gap-16 px-4 sm:px-8 lg:px-16 xl:px-24">
      <section
        id="parents-hero"
        class="relative mt-16 overflow-hidden rounded-[32px]  bg-gradient-to-br from-[#ecf5ff] via-white to-[#e0f8f0] px-6 py-12 text-[var(--mq-ink)] sm:px-10 sm:py-16"
      >
        <div class="absolute inset-y-0 right-0 hidden w-1/2 opacity-80 sm:block">
          <div class="h-full w-full rounded-l-full bg-[radial-gradient(circle_at_top,#d1fae5,transparent_60%)]"></div>
        </div>
        <div class="relative flex flex-col gap-10 sm:flex-row sm:items-center">
          <div class="flex-1 space-y-6">
            <span class="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#3b82f6]">
              安心して任せられる学びの場
            </span>
            <h1 class="text-3xl font-extrabold leading-tight sm:text-4xl">
              保護者の方へ — 楽しく学べて、安心して使えるEduQuest
            </h1>
            <p
              class="max-w-xl text-base text-[#334155]"
              style="line-height: 1.75;"
            >
              EduQuestは、小学生のお子さまが"遊びながら学ぶ"ことを目指した無料の学習プラットフォームです。安全性・教育的効果・使いやすさの3つを大切に設計しています。
            </p>
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                id="parents-primary-cta"
                href="/"
                class="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--mq-primary)] px-8 py-4 text-base font-bold !text-white transition-all hover:-translate-y-1 hover:scale-105 hover:bg-[var(--mq-primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
              >
                今すぐ体験する
                <span aria-hidden="true" class="text-lg">
                  →
                </span>
              </a>
            </div>
          </div>
          <div class="flex flex-1 justify-center">
            <div class="relative mt-8 w-full max-w-sm rounded-3xl bg-white/80 p-8 backdrop-blur">
              <div class="absolute -right-6 -top-6 hidden h-20 w-20 rounded-full bg-gradient-to-br from-[#22c55e]/80 to-[#3b82f6]/80 blur-0 sm:block"></div>
              <p class="mb-6 text-sm font-semibold text-[#1f2937]">
                ご家庭での安心ポイント
              </p>
              <ul class="list-inside list-disc space-y-3 pl-2 text-sm leading-relaxed text-gray-700 marker:text-blue-600 sm:pl-4">
                <li>匿名で始められ、個人情報の入力は不要。</li>
                <li>広告や外部リンクがなく、学習に集中できます。</li>
                <li>進捗は端末内に保存され、プライバシーを守ります。</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <LayerDivider label="安心・楽しく・簡単" />

      <section>
        <SectionHeading
          id="safety"
          icon="🔒"
          title="安心して使える設計"
          description="EduQuestは収集データを最小限に抑え、子どもが集中できる環境を最優先しています。"
        />
        <div class="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
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
          <aside class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-white p-8">
            <h3 class="text-xl font-bold text-blue-800">
              セキュリティ対策も透明に
            </h3>
            <p class="mt-4 text-sm leading-relaxed text-gray-700 border-l-4 border-blue-200 pl-4">
              定期的にコードレビューとセキュリティチェックを実施し、安全な状態を維持しています。詳細な技術資料は順次公開予定です。
            </p>
            <a
              href="/trust-and-safety"
              class="mt-6 inline-block !text-blue-700 font-semibold underline transition hover:!text-blue-900"
            >
              セキュリティ対策を詳しく見る →
            </a>
          </aside>
        </div>
      </section>

      <SectionDivider />

      <section>
        <SectionHeading
          id="effect"
          icon="📈"
          title="楽しく学び、しっかり身につく"
          description="文部科学省の学習指導要領に沿いながら、フィードバックでモチベーションを高める仕組みを備えています。"
        />
        <div class="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
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
          <div class="rounded-3xl bg-blue-50 p-8">
            <h3 class="mb-10 flex items-center justify-center gap-2 text-2xl font-bold text-blue-800">
              🌀 学びの循環サイクル
            </h3>
            <div class="mx-auto max-w-3xl rounded-2xl bg-white p-8">
              <div class="grid grid-cols-1 items-center gap-4 text-center sm:grid-cols-5 sm:gap-6">
                <div class="flex flex-col items-center">
                  <span class="mb-2 text-3xl">🎯</span>
                  <p class="font-semibold text-gray-900">問題を解く</p>
                  <p class="text-sm text-gray-600">挑戦する</p>
                </div>

                <div class="flex items-center justify-center">
                  <span class="text-2xl text-blue-500 sm:inline">
                    <span class="inline sm:hidden">↓</span>
                    <span class="hidden sm:inline">→</span>
                  </span>
                </div>

                <div class="flex flex-col items-center">
                  <span class="mb-2 text-3xl">💡</span>
                  <p class="font-semibold text-gray-900">
                    フィードバックを受ける
                  </p>
                  <p class="text-sm text-gray-600">理解と気づき</p>
                </div>

                <div class="flex items-center justify-center">
                  <span class="text-2xl text-blue-500">
                    <span class="inline sm:hidden">↓</span>
                    <span class="hidden sm:inline">→</span>
                  </span>
                </div>

                <div class="flex flex-col items-center">
                  <span class="mb-2 text-3xl">📚</span>
                  <p class="font-semibold text-gray-900">理解が深まる</p>
                  <p class="text-sm text-gray-600">有能感の向上</p>
                </div>

                <div class="flex items-center justify-center sm:order-last sm:col-start-5">
                  <span class="text-2xl text-blue-500">
                    <span class="inline sm:hidden">↓</span>
                    <span class="hidden sm:inline">↑</span>
                  </span>
                </div>

                <div class="flex flex-col items-center sm:order-last sm:col-start-3">
                  <span class="mb-2 text-3xl">🔄</span>
                  <p class="font-semibold text-gray-900">再び問題に挑戦</p>
                  <p class="text-sm text-gray-600">成長の循環</p>
                </div>

                <div class="flex items-center justify-center">
                  <span class="text-2xl text-blue-500">
                    <span class="inline sm:hidden">↓</span>
                    <span class="hidden sm:inline">←</span>
                  </span>
                </div>

                <div class="flex flex-col items-center">
                  <span class="mb-2 text-3xl">🔥</span>
                  <p class="font-semibold text-gray-900">モチベーション向上</p>
                  <p class="text-sm text-gray-600">自律的な学びへ</p>
                </div>

                <div class="flex items-center justify-center">
                  <span class="text-2xl text-blue-500">↓</span>
                </div>
              </div>
            </div>
            <p class="mx-auto mt-12 max-w-prose px-4 text-center leading-relaxed text-gray-700">
              EduQuestでは、この「学びの循環」を自然に体験できるように設計されています。ただ解くだけでなく、
              <strong>理解 → 挑戦 → 成長</strong>
              のサイクルを繰り返すことで、自発的に学び続ける力を育みます。
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section>
        <SectionHeading
          id="easy-start"
          icon="💻"
          title="すぐに使い始められます"
          description="インストール不要で、すでにあるデバイスからすぐに学習を開始できます。"
        />
        <div class="mt-12 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
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
          <div class="flex flex-col items-start gap-6 rounded-3xl bg-gradient-to-br from-[#ecfdf5] via-white to-[#d1fae5] p-8">
            <p class="text-sm leading-relaxed text-[#1f2937]">
              PC・タブレット・スマートフォンなど、お使いのデバイスからいつでもアクセス可能。どの端末でも同じ快適な学習体験をご提供します。
            </p>
            <a
              href="#parents-hero"
              class="inline-flex items-center gap-2 rounded-xl bg-white/90 px-5 py-3 text-sm font-bold text-[#0f172a] transition-all hover:-translate-y-1 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]"
            >
              学習を始める位置に戻る
              <span aria-hidden="true" class="text-base">
                ↑
              </span>
            </a>
          </div>
        </div>
      </section>

      <LayerDivider label="ご利用にあたって" />

      <section>
        <SectionHeading
          id="home-usage"
          icon="🏡"
          title="ご家庭での活用シーン"
          description="毎日の生活に取り入れやすい具体的な利用例をご紹介します。"
        />
        <div class="mt-12 grid gap-8 lg:grid-cols-2">
          <FeatureList
            features={[
              {
                title: '宿題後の10分復習',
                description:
                  '宿題が終わったあとに短時間で確認テスト。間違えた問題は自動的に復習へ。',
              },
              {
                title: '親子で一緒にチャレンジ',
                description:
                  '画面を見ながら親子で話し合って問題を解くことで、学びの時間がコミュニケーションに。',
              },
              {
                title: '登校前・就寝前の短時間学習',
                description:
                  'スキマ時間に1〜2ステージだけチャレンジ。習慣化しやすいUIを提供します。',
              },
              {
                title: '兄弟姉妹での競争',
                description:
                  '端末ごとに記録できるので、家族みんなで称号を目指して挑戦できます。',
              },
              {
                title: '連続チャレンジで習慣化',
                description:
                  '学習連続日数が可視化されるステータスカードで、やる気を維持できます。',
              },
            ]}
          />
          <div class="flex flex-col items-start gap-6 rounded-3xl bg-gradient-to-br from-[#fef3c7] via-white to-[#fde68a] p-8">
            <p class="text-sm leading-relaxed text-[#1f2937]">
              PC・タブレット・スマートフォンなど、お使いのデバイスからいつでもアクセス可能。どの端末でも同じ快適な学習体験をご提供します。
            </p>
            <a
              href="#parents-hero"
              class="inline-flex items-center gap-2 rounded-xl bg-white/90 px-5 py-3 text-sm font-bold text-[#0f172a] transition-all hover:-translate-y-1 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
            >
              学習を始める位置に戻る
              <span aria-hidden="true" class="text-base">
                ↑
              </span>
            </a>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section>
        <SectionHeading id="faq" icon="❓" title="よくある質問" />
        <div class="mt-10 space-y-6">
          {faqItems.map((item) => (
            <article class="py-4">
              <h3 class="text-base font-semibold text-[#1f2937]">
                {item.question}
              </h3>
              <p class="mt-4 text-sm text-[#334155]" style="line-height: 1.7;">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </section>

      <SectionDivider />

      <section>
        <SectionHeading
          id="transparency"
          icon="🪪"
          title="オープンで誠実な運営"
        />
        <div class="mt-8 grid gap-6 sm:grid-cols-2">
          <article>
            <h3 class="text-xl font-bold text-[#312e81]">運営情報</h3>
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
                  rel="noopener noreferrer"
                >
                  tqer39（Embedded SRE）
                </a>
              </li>
              <li>
                ソースコード：
                <a
                  href="https://github.com/tqer39/edu-quest"
                  class="underline decoration-[#4338ca]/50 underline-offset-2 transition hover:text-[#1d4ed8]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </article>
          <article>
            <h3 class="text-xl font-bold text-[#312e81]">
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
              <li>お問い合わせ：準備中（公開予定）</li>
              <li>透明性レポート：現在準備中です。</li>
            </ul>
          </article>
        </div>
      </section>

      <SectionDivider />

      <section class="rounded-[32px]  bg-gradient-to-br from-[#dbeafe] via-white to-[#bbf7d0] p-8 text-[var(--mq-ink)]">
        <div class="flex flex-col gap-6 text-center">
          <h2 class="text-2xl font-bold sm:text-3xl">
            さあ、EduQuestをはじめましょう
          </h2>
          <p
            class="mx-auto max-w-2xl text-base text-[#334155]"
            style="line-height: 1.75;"
          >
            安心・教育的・導入しやすい学習体験を、ご家庭の毎日に取り入れてみませんか？
          </p>
          <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/"
              class="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--mq-primary)] px-8 py-4 text-base font-bold !text-white transition-all hover:-translate-y-1 hover:scale-105 hover:bg-[var(--mq-primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
            >
              トップページで体験する
              <span aria-hidden="true" class="text-lg">
                →
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>

    <Footer />
  </main>
);
