# EduQuest 移行計画

## 概要

このドキュメントは、算数特化の **MathQuest** から複数教科を扱う **EduQuest** へ移行するための詳細な計画をまとめています。

**ステータス:** 計画策定中
**完了目標:** 未定
**現行ドメイン:** mathquest.app
**移行先ドメイン:** edu-quest.app

---

## 目次

1. [ビジョンと目標](#ビジョンと目標)
2. [アーキテクチャ概要](#アーキテクチャ概要)
3. [移行フェーズ](#移行フェーズ)
4. [技術的実装](#技術的実装)
5. [データベーススキーマの進化](#データベーススキーマの進化)
6. [デプロイ戦略](#デプロイ戦略)
7. [ロールバック計画](#ロールバック計画)
8. [成功指標](#成功指標)

---

## ビジョンと目標

### 現状

- **MathQuest:** 小学生向け算数練習アプリ
- 単一ドメイン: `mathquest.app`
- コンテンツは算数のみ（たし算・ひき算・かけ算・わり算）
- 日次アクティブユーザー約 1,000（仮指標）

### 目標像

- **EduQuest:** 総合学習プラットフォーム
- 教科ごとのサブドメインを持つマルチドメイン構成
- 対応教科: 算数・漢字・かな（将来的な教科も想定）
- 共通認証による統一 UX

### 成功条件

- ダウンタイムなし
- ユーザーデータの損失なし
- 現行パフォーマンス指標の維持または向上
- 教科をまたいだシームレスな体験

---

## アーキテクチャ概要

### 現行アーキテクチャ

```text
mathquest.app
└── Cloudflare Workers (Hono SSR)
    ├── /start
    ├── /play
    └── /apis/quiz
```

### 目標アーキテクチャ

```text
edu-quest.app (ポータル - Cloudflare Pages)
├── / (教科選択付きランディング)
├── /about
└── /account

math.edu-quest.app (算数アプリ - Cloudflare Workers)
├── /start
├── /play
└── /apis/quiz

kanji.edu-quest.app (漢字アプリ - Cloudflare Workers)
├── /start
├── /play
└── /apis/quiz

kana.edu-quest.app (かなアプリ - Cloudflare Workers)
├── /start
├── /play
└── /apis/quiz
```

### 想定スタック

```text
ポータル (edu-quest.app):
  - Cloudflare Pages 上の Next.js
  - ランディングページは静的生成
  - 共通認証サービス

教科アプリ (*.edu-quest.app):
  - Cloudflare Workers 上の Hono（現行スタック）
  - D1 データベース（教科別 or 共有）
  - KV（セッション、レート制限）
```

---

## 移行フェーズ

### フェーズ1: 基盤整備（1〜2週）

**目的:** ドメイン取得と基盤構築

**タスク:**

- [ ] `edu-quest.app` ドメイン取得
- [ ] Cloudflare アカウントへドメイン追加
- [ ] DNS レコード設定

  ```text
  edu-quest.app           → Cloudflare Pages
  *.edu-quest.app         → ワイルドカード SSL
  math.edu-quest.app      → Cloudflare Workers
  www.edu-quest.app       → edu-quest.app へリダイレクト
  ```

- [ ] Terraform で DNS 管理を構築
- [ ] サブドメインルーティングの動作確認

**成果物:**

- 正しく機能する DNS 設定
- 全サブドメイン用 SSL 証明書
- `infra/terraform/dns.tf` 内の Terraform スクリプト

**検証:**

- [ ] `edu-quest.app` が正しく解決する
- [ ] `math.edu-quest.app` が正しく解決する
- [ ] SSL 証明書が有効

---

### フェーズ2: MathQuest 移行（3〜4週）

**目的:** 現行アプリを math.edu-quest.app に移設

**タスク:**

- [ ] `math.edu-quest.app` 用 `wrangler.toml` 作成
- [ ] 環境変数・シークレット更新
- [ ] 新サブドメインへデプロイ
- [ ] 全機能の動作テスト
- [ ] `mathquest.app` → `math.edu-quest.app` の 301 リダイレクト
- [ ] 分析・モニタリング更新

**コード変更例:**

```typescript
// infra/terraform/redirects.tf
resource "cloudflare_worker_route" "mathquest_redirect" {
  zone_id     = var.cloudflare_zone_id_mathquest
  pattern     = "mathquest.app/*"
  script_name = "mathquest-redirect"
}

// apps/mathquest-redirect/src/index.ts
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const newUrl = `https://math.edu-quest.app${url.pathname}${url.search}`;
    return Response.redirect(newUrl, 301);
  }
};
```

**成果物:**

- 稼働中の `math.edu-quest.app`
- 正常に動作するリダイレクト
- 更新されたモニタリングダッシュボード

**検証:**

- [ ] `math.edu-quest.app` で全ページが表示される
- [ ] 認証が機能する
- [ ] クイズ機能が動作する
- [ ] DB の読み書きが成功する
- [ ] `mathquest.app` が正しくリダイレクトする

---

### フェーズ3: ポータル開発（5〜8週）

**目的:** edu-quest.app にポータルを構築

**タスク:**

- [ ] 新アプリ `apps/portal/` 作成
- [ ] Cloudflare Pages 向け Next.js 設定
- [ ] ランディングページ設計と実装
- [ ] 教科選択 UI（算数・漢字・かなカード）
- [ ] 共通認証システム
- [ ] ユーザーアカウント管理
- [ ] `edu-quest.app` へデプロイ

**ディレクトリ構成:**

```text
apps/portal/
├── app/
│   ├── page.tsx              # ランディングページ
│   ├── about/
│   │   └── page.tsx
│   └── account/
│       └── page.tsx
├── components/
│   ├── SubjectCard.tsx       # 教科選択カード
│   ├── Header.tsx
│   └── Footer.tsx
├── public/
│   └── images/
└── package.json
```

**ランディングページ例:**

```tsx
// apps/portal/app/page.tsx
export default function Home() {
  return (
    <main>
      <Hero title="EduQuest" subtitle="学びの冒険をはじめよう" />

      <SubjectGrid>
        <SubjectCard
          title="算数クエスト"
          icon="🔢"
          description="計算力を鍛えよう"
          href="https://math.edu-quest.app"
          available
        />

        <SubjectCard
          title="漢字クエスト"
          icon="📝"
          description="漢字をマスターしよう"
          href="https://kanji.edu-quest.app"
          comingSoon
        />

        <SubjectCard
          title="ひらがなクエスト"
          icon="✏️"
          description="ひらがなを覚えよう"
          href="https://kana.edu-quest.app"
          comingSoon
        />
      </SubjectGrid>
    </main>
  );
}
```

**成果物:**

- `edu-quest.app` の公開ポータル
- 教科選択インターフェース
- モバイル対応レイアウト
- Better Auth による共通認証

**検証:**

- [ ] ポータルが各デバイスで表示できる
- [ ] math.edu-quest.app へのリンクが機能する
- [ ] 認証がサブドメイン間で維持される
- [ ] SEO メタデータが適切

---

### フェーズ4: アーキテクチャ再設計（9〜12週）

**目的:** 複数教科対応の共通化

**タスク:**

- [ ] 共通ロジックを `@eduquest/core` へ切り出し
- [ ] パッケージ名の変更: `@mathquest/*` → `@eduquest/*`
- [ ] データベーススキーマの抽象化
- [ ] 教科非依存の型を定義
- [ ] すべての import を更新

**変更前のパッケージ構成:**

```text
packages/
├── domain/        # @mathquest/domain
└── app/           # @mathquest/app
```

**変更後のパッケージ構成:**

```text
packages/
├── core/          # @eduquest/core（共通ロジック）
├── math/          # @eduquest/math（算数ドメイン）
├── kanji/         # @eduquest/kanji（漢字ドメイン）
├── kana/          # @eduquest/kana（かなドメイン）
├── ui/            # @eduquest/ui（共通コンポーネント）
└── auth/          # @eduquest/auth（認証）
```

**データベーススキーマの進化:**

```sql
-- 現行: 算数特化
CREATE TABLE quiz_results (
  id TEXT PRIMARY KEY,
  grade_id TEXT NOT NULL,
  mode TEXT NOT NULL,        -- 'add', 'sub', 'mul', 'div'
  operand_a INTEGER,
  operand_b INTEGER,
  operator TEXT,
  correct_answer INTEGER,
  user_answer INTEGER,
  is_correct INTEGER,
  created_at INTEGER
);

-- 将来: 複数教科対応
CREATE TABLE learning_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  subject TEXT NOT NULL,     -- 'math', 'kanji', 'kana'
  grade_id TEXT,
  created_at INTEGER
);

CREATE TABLE learning_results (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES learning_sessions(id),
  subject TEXT NOT NULL,

  -- 算数向け（他教科では NULL）
  mode TEXT,
  operand_a INTEGER,
  operand_b INTEGER,
  operator TEXT,

  -- 漢字向け（他教科では NULL）
  kanji TEXT,
  reading TEXT,
  meaning TEXT,

  -- 共通フィールド
  correct_answer TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
```

**型定義例:**

```typescript
// packages/core/src/types/subject.ts
export type SubjectType = 'math' | 'kanji' | 'kana';

export interface BaseQuestion {
  id: string;
  subject: SubjectType;
  gradeId: string;
  difficulty: number;
}

// packages/math/src/types.ts
export interface MathQuestion extends BaseQuestion {
  subject: 'math';
  a: number;
  b: number;
  op: '+' | '-' | '×' | '÷';
  answer: number;
  extras?: ExtraStep[];
}

// packages/kanji/src/types.ts
export interface KanjiQuestion extends BaseQuestion {
  subject: 'kanji';
  kanji: string;
  readings: string[];
  correctReading: string;
}
```

**成果物:**

- 新しいパッケージ構成
- 更新された import とコード
- 抽象化された DB スキーマ
- 教科ごとの型安全な取り扱い

**検証:**

- [ ] すべてのテストが通過
- [ ] import エラーなし
- [ ] 算数アプリが動作し続ける
- [ ] DB マイグレーションが成功

---

### フェーズ5: 新教科アプリ開発（13週以降）

**目的:** 漢字・かなアプリの実装

**タスク:**

- [ ] `apps/kanji/` を作成（`apps/edge/` をベースにコピー）
- [ ] 漢字問題生成ロジック実装
- [ ] 漢字練習 UI 設計
- [ ] `kanji.edu-quest.app` へデプロイ
- [ ] `apps/kana/` を作成
- [ ] かな問題生成ロジック実装
- [ ] `kana.edu-quest.app` へデプロイ

**漢字アプリ構成例:**

```text
apps/kanji/
├── src/
│   ├── routes/
│   │   ├── pages/
│   │   │   ├── start.tsx
│   │   │   └── play.tsx
│   │   └── apis/
│   │       └── quiz.ts
│   ├── application/
│   │   └── usecases/
│   │       └── kanji-quiz.ts
│   └── infrastructure/
│       └── database/
└── wrangler.toml
```

**成果物:**

- 稼働する `kanji.edu-quest.app`
- 稼働する `kana.edu-quest.app`
- ポータルからのリンク更新

**検証:**

- [ ] 漢字問題が正しく生成される
- [ ] かな問題が正しく生成される
- [ ] ポータルから両アプリへ遷移できる
- [ ] 教科ごとに学習進捗が記録される

---

## 技術的実装

### Cloudflare Workers のルーティング

```typescript
// apps/edge/src/index.ts (全サブドメインのルーター)
import { Hono } from 'hono';

const app = new Hono();

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // サブドメインごとにルーティング
    if (hostname === 'math.edu-quest.app') {
      return handleMathApp(request, env);
    }

    if (hostname === 'kanji.edu-quest.app') {
      return handleKanjiApp(request, env);
    }

    if (hostname === 'kana.edu-quest.app') {
      return handleKanaApp(request, env);
    }

    // デフォルト: 404
    return new Response('Not Found', { status: 404 });
  },
};
```

### DNS 設定（Terraform）

```hcl
# infra/terraform/dns.tf

variable "eduquest_zone_id" {
  description = "Cloudflare Zone ID for edu-quest.app"
  type        = string
}

# ルートドメイン → ポータル（Cloudflare Pages）
resource "cloudflare_record" "root" {
  zone_id = var.eduquest_zone_id
  name    = "@"
  type    = "CNAME"
  value   = "eduquest-portal.pages.dev"
  proxied = true
}

# www → ルートへリダイレクト
resource "cloudflare_record" "www" {
  zone_id = var.eduquest_zone_id
  name    = "www"
  type    = "CNAME"
  value   = "edu-quest.app"
  proxied = true
}

# 算数サブドメイン → Workers
resource "cloudflare_record" "math" {
  zone_id = var.eduquest_zone_id
  name    = "math"
  type    = "CNAME"
  value   = "eduquest-math.workers.dev"
  proxied = true
}

# 漢字サブドメイン → Workers
resource "cloudflare_record" "kanji" {
  zone_id = var.eduquest_zone_id
  name    = "kanji"
  type    = "CNAME"
  value   = "eduquest-kanji.workers.dev"
  proxied = true
}

# かなサブドメイン → Workers
resource "cloudflare_record" "kana" {
  zone_id = var.eduquest_zone_id
  name    = "kana"
  type    = "CNAME"
  value   = "eduquest-kana.workers.dev"
  proxied = true
}
```

### 共通認証

```typescript
// packages/auth/src/index.ts
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: env.DB,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieName: 'eduquest_session',
    domain: '.edu-quest.app', // 全サブドメインで共有
  },
});
```

---

## データベーススキーマの進化

### マイグレーション戦略

1. **後方互換の変更:** 既存カラムを残したまま新カラムを追加
2. **二重書き込み期間:** 旧スキーマと新スキーマへ同時に書き込み
3. **データ移行:** 既存データをバックフィル
4. **読み取り切り替え:** 新スキーマから読み取り開始
5. **クリーンアップ:** 検証後に旧カラムを削除

### マイグレーション例

```sql
-- ステップ1: 新カラム追加（後方互換）
ALTER TABLE quiz_results ADD COLUMN subject TEXT DEFAULT 'math';
ALTER TABLE quiz_results ADD COLUMN result_data TEXT;  -- 柔軟な保存のための JSON

-- ステップ2: 新テーブル定義
CREATE TABLE learning_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  subject TEXT NOT NULL CHECK(subject IN ('math', 'kanji', 'kana')),
  grade_id TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE learning_results (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES learning_sessions(id),
  subject TEXT NOT NULL,
  result_data TEXT NOT NULL,  -- 教科別データを JSON で格納
  correct_answer TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL CHECK(is_correct IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX idx_learning_results_session ON learning_results(session_id);
CREATE INDEX idx_learning_results_subject ON learning_results(subject);

-- ステップ3: データバックフィル（デプロイ後に実行）
INSERT INTO learning_results (id, session_id, subject, result_data, correct_answer, user_answer, is_correct, created_at)
SELECT
  id,
  NULL as session_id,
  'math' as subject,
  json_object(
    'mode', mode,
    'operandA', operand_a,
    'operandB', operand_b,
    'operator', operator
  ) as result_data,
  correct_answer,
  user_answer,
  is_correct,
  created_at
FROM quiz_results
WHERE subject = 'math';
```

---

## デプロイ戦略

### デプロイ順序

1. **DNS 設定:** すべての DNS レコードを構成（まだトラフィックなし）
2. **ポータル:** Cloudflare Pages へデプロイ
3. **算数アプリ:** math.edu-quest.app へデプロイ
4. **リダイレクト:** mathquest.app → math.edu-quest.app のリダイレクトを有効化
5. **監視:** 48 時間メトリクスを監視
6. **漢字／かな:** 準備でき次第デプロイ

### デプロイコマンド例

```bash
# フェーズ1: インフラ
cd infra/terraform
terraform apply

# フェーズ2: ポータル
cd apps/portal
pnpm build
npx wrangler pages deploy dist --project-name=eduquest-portal

# フェーズ3: 算数アプリ
cd apps/edge
pnpm build
npx wrangler deploy --name=eduquest-math

# フェーズ4: リダイレクト
cd apps/mathquest-redirect
npx wrangler deploy --name=mathquest-redirect
```

### 環境変数

```bash
# .env.production (math.edu-quest.app)
CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_API_TOKEN=xxx
DATABASE_ID=xxx
KV_SESSION_ID=xxx
KV_TRIAL_ID=xxx
KV_RATE_LIMIT_ID=xxx

# Better Auth の設定
AUTH_URL=https://math.edu-quest.app
AUTH_COOKIE_DOMAIN=.edu-quest.app
```

---

## ロールバック計画

### 緊急時の対応手順

重大な問題が発生した場合:

1. **リダイレクト停止:**

   ```bash
   cd infra/terraform
   terraform apply -var="enable_redirect=false"
   ```

2. **mathquest.app の復旧:**

   - mathquest.app を従来の Workers に戻すよう DNS を再設定
   - 新しいサブドメインルーティングを停止

3. **データベースロールバック:**

   - 適用済みのスキーマ変更を保存済みマイグレーションで巻き戻す
   - 必要に応じて D1 バックアップから復元

4. **コミュニケーション:**
   - SNS やアプリ内で状況を告知
   - 認証に影響があった場合はユーザーへメール通知

### ロールバック検証

- [ ] mathquest.app が元のアプリを提供している
- [ ] ユーザーセッションが維持されている
- [ ] データベースクエリが成功する
- [ ] データ損失がない

---

## 成功指標

### パフォーマンス指標

- **ページ表示速度:** P95 で 1.5 秒未満
- **API 応答時間:** P95 で 200ms 未満
- **エラーレート:** 0.1% 未満
- **稼働率:** 99.9% 以上

### ユーザー指標

- **ユーザー継続率:** 現状維持または改善
- **セッション時間:** 現状維持または改善
- **クイズ完了率:** 現状維持または改善
- **教科間利用:** 複数教科を利用するユーザー数を追跡

### 技術指標

- **ビルド時間:** 2 分未満
- **デプロイ時間:** 1 分未満
- **DB クエリ時間:** P95 で 50ms 未満
- **キャッシュヒット率:** 80% 以上

---

## タイムライン概要

| フェーズ                    | 期間     | 主要成果物                                   |
| --------------------------- | -------- | -------------------------------------------- |
| フェーズ1: 基盤整備         | 2 週間   | ドメイン設定、DNS、SSL                       |
| フェーズ2: MathQuest 移行   | 2 週間   | math.edu-quest.app 稼働、リダイレクト完了    |
| フェーズ3: ポータル開発     | 4 週間   | edu-quest.app ポータル公開                   |
| フェーズ4: リファクタリング | 4 週間   | 複数教科対応アーキテクチャ                   |
| フェーズ5: 新アプリ開発     | 6 週間〜 | kanji.edu-quest.app、kana.edu-quest.app 公開 |

**想定総期間:** 18 週間以上（約 4.5 か月）

---

## 今後の進め方

1. ✅ 移行計画をドキュメント化（本ドキュメント）
2. ⬜ `edu-quest.app` ドメインを取得
3. ⬜ DNS 管理用 Terraform を整備
4. ⬜ プロジェクトのタイムラインと担当者を決定
5. ⬜ フェーズ1の実装を開始

---

## 検討・決定が必要な事項

- [ ] **ドメイン購入:** edu-quest.app を誰が取得するか
- [ ] **予算:** Cloudflare Pages と Workers の概算コスト
- [ ] **データベース:** 教科ごとに D1 を分けるか共有するか
- [ ] **分析基盤:** サブドメインごとに Google Analytics を分けるか統合するか
- [ ] **CDN:** 静的アセット配信に Cloudflare R2 を使うか

---

**ドキュメントバージョン:** 1.0
**最終更新日:** 2025-10-18
**作成者:** AI Assistant (Claude)
**承認者:** プロダクトオーナー
