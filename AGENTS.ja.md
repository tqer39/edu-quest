# AGENTS.md

## 概要

EduQuestは小学生向けの算数学習プラットフォームで、Cloudflare Workers上で動作するHonoベースのSSRアプリケーションです。monorepoアーキテクチャを採用し、Edge Runtime、API/フロントエンドパッケージ、Terraform管理のインフラストラクチャを一つのリポジトリで管理しています。

## Quest モジュール構成

EduQuest は複数の「Quest」モジュールを通じて様々な教育コンテンツを提供します。

- **MathQuest** (`/math`) - 算数練習。学年別プリセットとテーマ練習を提供（利用可能）
- **KanjiQuest** (`/kanji`) - 学年別の漢字クイズ（読み当て・穴あき問題）
- **ClockQuest** (`/clock`) - アナログ時計とデジタル時計を使った時刻の読み方練習（準備中）

## 現在の主要機能

- **ハブページ（`/`）**
  - 利用可能な Quest モジュールをテーマカラー付きカードで表示
  - 各 Quest への遷移ボタンを配置
- **MathQuest トップページ（`/math`）**
  - MathQuest 固有の情報と機能（学年プリセット、カスタマイズオプション、集中モード）を表示
  - 「算数をはじめる」ボタンから `/math/start` へ遷移
- **MathQuest スタート画面（`/math/start`）**
  - 学年（小1〜小6）、計算種類（たし算・ひき算・かけ算・四則演算）、テーマプリセット（例: 「たし算 20 まで」「ひき算 50 まで」）を選択
  - 効果音・途中式表示のトグル、問題数（本番: 10/20/30、開発モード: 1 問のデバッグオプション）を切り替え
  - `eduquest:progress:v1`（解答数/正解数/最後の学年）、`eduquest:sound-enabled`、`eduquest:show-working`、`eduquest:question-count-default` に設定を保存
  - 選択内容は `eduquest:pending-session` として `sessionStorage` に退避し、プレイ画面へシームレスに引き継ぎ
- **MathQuest プレイ画面（`/math/play`）**
  - 3 秒カウントダウン後に問題を表示。テンキー UI、ストリーク表示、途中式のトグル、サウンド再生を実装
  - `/apis/quiz/generate` で新しい問題を取得し、`/apis/quiz/verify` で採点。正解時は進捗をローカルストレージへ反映
  - ラウンド完了時は結果カードで正答数・経過時間を提示し、スタート画面への導線を表示
- **ユースケース / API**
  - `generateQuizQuestion` は学年・テーマに応じて `generateGradeOneQuestion` や複数項目の加減算ロジックを選択。
  - `verifyAnswer` はクライアントから渡された途中式 (`extras`) を含む問題を評価し、正解値と正誤を返却。
- **共有ロジック**
  - `@edu-quest/domain` が全ての問題生成・採点ロジックを提供。学年別テーマや複数ステップ計算を純関数として実装。
  - `@edu-quest/app` が出題回数や正解数のカウントを担当し、UI から副作用を切り離してテストしやすい構造にしている。

## システムアーキテクチャ

### 全体構成図

```mermaid
graph TB
    subgraph "User Interface"
        Browser[ブラウザ]
    end

    subgraph "Cloudflare Edge"
        EdgeApp[Edge App<br/>Hono SSR]
        KV_Session[KV: Auth Session]
        KV_Trial[KV: Free Trial]
        KV_Rate[KV: Rate Limit]
        KV_Idempotency[KV: Idempotency]
        D1[D1 Database]
    end

    subgraph "Application Layer"
        UseCases[Application UseCases<br/>quiz.ts]
        Session[Session Management<br/>current-user.ts]
    end

    subgraph "Domain Layer"
        DomainLogic[Domain Logic<br/>@edu-quest/domain]
        AppLogic[App Logic<br/>@edu-quest/app]
    end

    subgraph "Infrastructure"
        Database[Database Client<br/>Drizzle ORM]
        Schema[Database Schema]
    end

    subgraph "Routes"
        Pages[Pages<br/>home, math-home, start, play]
        APIs[APIs<br/>/apis/quiz]
    end

    Browser --> EdgeApp
    EdgeApp --> Pages
    EdgeApp --> APIs
    EdgeApp --> UseCases
    UseCases --> AppLogic
    UseCases --> Session
    AppLogic --> DomainLogic
    EdgeApp --> KV_Session
    EdgeApp --> KV_Trial
    EdgeApp --> KV_Rate
    EdgeApp --> KV_Idempotency
    EdgeApp --> Database
    Database --> D1
    Database --> Schema
```

### モジュール依存関係

```mermaid
graph LR
    subgraph "Apps"
        Edge[@edu-quest/edge]
        API[@edu-quest/api]
        Web[@edu-quest/web]
    end

    subgraph "Packages"
        Domain[@edu-quest/domain]
        App[@edu-quest/app]
    end

    Edge --> App
    Edge --> Domain
    API --> App
    API --> Domain
    App --> Domain
```

## プロジェクト構成

### ディレクトリ構造

```text
eduquest/
├── apps/                    # アプリケーション群
│   ├── edge/               # Cloudflare Workers エッジアプリ（メイン）
│   │   ├── src/
│   │   │   ├── application/        # アプリケーション層
│   │   │   │   ├── usecases/      # ユースケース（quiz.ts）
│   │   │   │   └── session/       # セッション管理
│   │   │   ├── infrastructure/    # インフラ層
│   │   │   │   └── database/      # DB クライアント & スキーマ
│   │   │   ├── routes/            # ルーティング
│   │   │   │   ├── pages/         # SSR ページ（home, start, play）
│   │   │   │   └── apis/          # BFF API（/apis/quiz）
│   │   │   ├── views/             # ビュー層
│   │   │   │   └── layouts/       # レイアウトコンポーネント
│   │   │   ├── middlewares/       # ミドルウェア（i18n等）
│   │   │   ├── env.ts             # 環境変数型定義
│   │   │   └── index.tsx          # エントリーポイント
│   │   └── wrangler.toml          # Cloudflare Workers設定
│   ├── api/                # Node.js API サーバー（開発用）
│   └── web/                # Hono Webサーバー（開発用）
├── packages/                # 共有パッケージ
│   ├── domain/             # ドメインロジック
│   │   └── src/
│   │       └── index.ts    # 問題生成、計算ロジック
│   └── app/                # アプリケーションロジック
│       └── src/
│           └── index.ts    # クイズ管理、回答チェック
├── infra/                  # インフラ構成
│   ├── terraform/          # Terraform設定
│   └── migrations/         # D1 データベースマイグレーション
└── docs/                   # ドキュメント
```

### ドキュメント配置ポリシー

- 英語版は `.md` 拡張子を使用します。
- 日本語版は同じファイル名で `.ja.md` 拡張子を使用します。
- すべてのドキュメントは英語と日本語の両方を揃えてください。片方を更新した場合は、もう片方にも同じ内容を反映させます。

### ワークスペース構成

pnpm workspacesによるmonorepo構成：

- **apps/**: 実行可能なアプリケーション

  - `@edu-quest/edge`: Cloudflare Workers上のメインアプリ（SSR + BFF API）
  - `@edu-quest/api`: Node.js開発用APIサーバー
  - `@edu-quest/web`: Hono開発用Webサーバー

- **packages/**: 共有ライブラリ
  - `@edu-quest/domain`: ドメインロジック（問題生成、計算ルール）
  - `@edu-quest/app`: アプリケーションロジック（クイズ管理、回答検証）

## 主要機能モジュール

### 1. ドメイン層（@edu-quest/domain）

**責務**: 算数問題の生成と計算ロジック

**主要な型・関数**:

- `Mode`: 問題モード (`'add' | 'sub' | 'mul' | 'mix'`)
- `QuizConfig`: クイズ設定（モード、最大値）
- `Question`: 問題データ構造（a, b, op, extras, answer）
- `ExtraStep`: 途中式ステップ（op: '+' | '-', value: number）

**主要関数**:

- `generateQuestion(config)`: 基本問題生成
- `generateGradeOneQuestion(max)`: 1年生向け問題生成
- `evaluateQuestion(question)`: 問題の答えを計算
- `formatQuestion(question)`: 問題を文字列化
- `checkAnswer(question, input)`: 回答の正誤判定
- `pickOp(mode)`: モードから演算子を選択

**ファイル**: `packages/domain/src/index.ts:1-223`

### 2. アプリケーション層（@edu-quest/app）

**責務**: クイズセッションの管理と状態管理

**主要な型・関数**:

- `Quiz`: クイズセッション状態（config, index, correct）
- `StartQuizInput`: クイズ開始時の入力

**主要関数**:

- `createQuiz(input)`: 新規クイズセッション作成
- `nextQuestion(quiz)`: 次の問題を生成
- `checkAnswer(quiz, question, value)`: 回答チェック & 状態更新

**ファイル**: `packages/app/src/index.ts:1-32`

### 3. エッジアプリケーション（@edu-quest/edge）

#### 3.1 エントリーポイント（`src/index.tsx`）

**責務**: Honoアプリケーションの初期化とルーティング

**主要設定**:

- ミドルウェア: logger, secureHeaders, prettyJSON, i18n
- SSR レンダラー: jsxRenderer + Document layout

**ルート構成**:

- **Pages**:

  - `/`: EduQuest ハブ（Quest 選択ポータル）
  - `/math`: MathQuest トップページ
  - `/math/start`: MathQuest 設定ウィザード
  - `/math/play`: MathQuest 練習セッション
  - `/kanji`: KanjiQuest トップページ
  - `/clock`: ClockQuest トップページ（準備中）

- **Backward Compatibility**:

  - `/start` → `/math/start`（301 リダイレクト）
  - `/play` → `/math/play`（301 リダイレクト）

- **Auth**:

  - `/auth/guest-login`: ゲストログイン
  - `/auth/login`: ログインページ
  - `/auth/login/email`: メールログイン処理
  - `/auth/callback`: ログインコールバック
  - `/auth/logout`: ログアウト

- **API**:
  - `/apis/quiz`: クイズ関連API

**ファイル**: `apps/edge/src/index.tsx:1-104`

#### 3.2 アプリケーションユースケース（`src/application/usecases/quiz.ts`）

**責務**: 問題生成と回答検証のビジネスロジック

**主要関数**:

- `generateQuizQuestion(input)`: 学年・モード・最大値に応じた問題生成

  - `gradeId`に応じて異なる問題パターン生成
    - `'grade-1'`: 1年生向け
    - `'practice-add-three'`: 3項加算
    - `'practice-add-four'`: 4項加算
    - `'practice-add-mixed-digits'`: 1桁+2桁
    - `'practice-sub-double-digit'`: 2桁減算
    - `'practice-mix-three'`: 3項加減混合
    - `'practice-mix-four'`: 4項加減混合

- `verifyAnswer(input)`: 回答の正誤検証

**補助関数**:

- `clauseAddQuestion(values, op)`: 連続加算問題生成
- `generateAdditionMulti(terms, max)`: 多項加算生成
- `generateOneDigitPlusTwoDigit()`: 1桁+2桁問題生成
- `generateDoubleDigitSubtraction()`: 2桁減算生成
- `generateAddSubMix(terms, max)`: 加減混合問題生成

**ファイル**: `apps/edge/src/application/usecases/quiz.ts:1-152`

#### 3.3 セッション管理（`src/application/session/current-user.ts`）

**責務**: ユーザー認証・セッション管理

**ファイル**: `apps/edge/src/application/session/current-user.ts`

#### 3.4 インフラストラクチャ層（`src/infrastructure/database/`）

**責務**: データベースアクセスとスキーマ定義

**主要ファイル**:

- `client.ts`: Drizzle ORMクライアント
- `schema.ts`: D1データベーススキーマ定義

#### 3.5 ルート定義

**Pages**（`src/routes/pages/`）:

- `home.tsx`: ホームページSSR
- `start.tsx`: 設定ウィザードSSR
- `start.client.ts`: 設定ウィザードクライアントロジック（~20KB）
- `play.tsx`: 練習セッションSSR
- `play.client.ts`: 練習セッションクライアントロジック（~39KB）
- `grade-presets.ts`: 学年別プリセット定義

**APIs**（`src/routes/apis/`）:

- `quiz.ts`: クイズAPI（問題生成、回答検証）

#### 3.6 ミドルウェア（`src/middlewares/`）

- `i18n.ts`: 国際化ミドルウェア（言語設定）

#### 3.7 環境設定（`src/env.ts`）

**Cloudflare Bindings**:

- `KV_FREE_TRIAL`: 無料トライアル管理
- `KV_AUTH_SESSION`: 認証セッション
- `KV_RATE_LIMIT`: レート制限
- `KV_IDEMPOTENCY`: 冪等性保証
- `DB`: D1データベース
- `DEFAULT_LANG`: デフォルト言語（'ja'）
- `USE_MOCK_USER`: モックユーザー設定（開発用）

**ファイル**: `apps/edge/src/env.ts:1-12`

### 4. インフラストラクチャ

**構成**:

- `infra/terraform/`: Cloudflare Workers、KV、D1の設定
- `infra/migrations/`: D1データベースマイグレーションSQL

## 技術スタック

### ランタイム・フレームワーク

- **Cloudflare Workers**: エッジコンピューティングプラットフォーム
- **Hono**: 軽量Webフレームワーク（SSR対応）
- **Node.js 22**: 開発用サーバー
- **TypeScript 5.5**: 型安全な開発

### データストア

- **Cloudflare KV**: キー・バリューストア（セッション、キャッシュ）
- **Cloudflare D1**: SQLite互換データベース
- **Drizzle ORM**: TypeScript ORMライブラリ

### 開発ツール

- **pnpm 10**: パッケージマネージャー
- **mise**: ツールバージョン管理
- **just**: タスクランナー
- **pre-commit**: Git フック管理
- **Wrangler**: Cloudflare Workers CLI

### テスト

- **Vitest**: テストフレームワーク

## ビルド・デプロイフロー

### ビルド順序

```bash
pnpm build
```

1. `@edu-quest/domain` のビルド（ドメインロジック）
2. `@edu-quest/app` のビルド（アプリケーションロジック）
3. `@edu-quest/api` のビルド
4. `@edu-quest/web` のビルド

※ `@edu-quest/edge`はWranglerが直接TypeScriptをバンドル

### 開発サーバー

```bash
# Edgeアプリ（推奨）
pnpm dev:edge

# APIサーバー
pnpm dev:api

# Webサーバー
pnpm dev:web
```

### デプロイ

```bash
cd apps/edge
pnpm deploy
```

## データフロー

### スタート設定フロー

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant EdgeApp
    participant LocalStorage

    User->>Browser: GET /start
    Browser->>EdgeApp: HTTP Request
    EdgeApp-->>Browser: SSR Start page + preset JSON
    Browser->>LocalStorage: load progress/settings
    User->>Browser: 学年・テーマ・設定を選択
    Browser->>LocalStorage: save progress & defaults
    Browser->>Browser: sessionStorage.setItem('eduquest:pending-session')
    User->>Browser: れんしゅうをはじめる
    Browser->>EdgeApp: Navigate to /play
```

### 問題生成フロー

```mermaid
sequenceDiagram
    participant Browser
    participant SessionStorage
    participant QuizAPI
    participant UseCase
    participant Domain

    Browser->>SessionStorage: read eduquest:pending-session
    SessionStorage-->>Browser: 設定（mode/max/grade/theme）
    Browser->>QuizAPI: POST /apis/quiz/generate
    QuizAPI->>UseCase: generateQuizQuestion(mode, max, gradeId, themeId)
    UseCase->>Domain: generateQuestion/configure extras
    Domain-->>UseCase: Question
    UseCase-->>QuizAPI: Question
    QuizAPI-->>Browser: JSON response
    Browser-->>Browser: UI を更新（途中式/サウンド設定反映）
    Browser-->>User: 問題表示
```

### 回答検証フロー

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant QuizAPI
    participant UseCase
    participant Domain
    participant LocalStorage

    User->>Browser: 回答入力
    Browser->>QuizAPI: POST /apis/quiz/verify
    QuizAPI->>UseCase: verifyAnswer(question, value)
    UseCase->>Domain: evaluateQuestion(question)
    Domain-->>UseCase: correctAnswer
    UseCase->>Domain: checkAnswer(question, value)
    Domain-->>UseCase: ok: boolean
    UseCase-->>QuizAPI: {ok, correctAnswer}
    QuizAPI-->>Browser: JSON response
    Browser->>LocalStorage: update progress if ok
    Browser-->>User: 正誤フィードバック
```

## セキュリティ

- **Secure Headers**: Honoミドルウェアによる自動設定
- **Rate Limiting**: KV_RATE_LIMITによる制限
- **Idempotency**: KV_IDEMPOTENCYによる重複リクエスト防止
- **Session Management**: KV_AUTH_SESSIONによる認証管理

## パフォーマンス最適化

- **エッジコンピューティング**: Cloudflare Workersによる低レイテンシ
- **KVキャッシング**: セッションデータの高速アクセス
- **クライアントサイドロジック**: play.client.ts（39KB）、start.client.ts（20KB）で即応性確保
- **SSR**: 初回レンダリングの高速化

## 国際化（i18n）

- デフォルト言語: 日本語（`ja`）
- ミドルウェア: `apps/edge/src/middlewares/i18n.ts`
- 環境変数: `DEFAULT_LANG` in `wrangler.toml:32`

## テスト

- ユニットテスト: `apps/edge/src/application/usecases/__tests__/quiz.test.ts`
- テストフレームワーク: Vitest

## 今後の拡張ポイント

1. **ユーザー認証**: 現在はゲストログインのみ。本格的な認証機能追加可能
2. **学習履歴**: D1データベースを活用した学習データ永続化
3. **AIチューター**: 問題の難易度調整や個別最適化
4. **マルチプレイ**: リアルタイム対戦機能
5. **学年別コンテンツ拡充**: 2年生以上の単元追加

## マルチ Quest アーキテクチャ

**EduQuest** は複数の教科に対応する学習プラットフォームで、専門化された「Quest」モジュールを通じて様々な教育コンテンツを提供します。シンプルさと統一されたユーザー体験のため、**サブディレクトリベースのルーティング構造**を採用しています。

### Quest モジュール

現在サポートおよび今後サポート予定の Quest モジュール：

- **MathQuest** (`/math`) - 学年別プリセットとテーマ練習を提供する算数練習（利用可能）
- **KanjiQuest** (`/kanji`) - 学年別の漢字クイズ（読み当て・穴あき問題）
- **ClockQuest** (`/clock`) - アナログ時計とデジタル時計を使った時刻の読み方練習（準備中）

### URL 構造

**サブディレクトリベースのルーティング：**

```text
ドメイン構造:
  dev.edu-quest.app (開発環境)
  edu-quest.app (本番環境)

ルート構造:
  /                    → EduQuest ハブ（Quest 選択ポータル）
  /math                → MathQuest トップページ
  /math/start          → MathQuest 設定ウィザード
  /math/play           → MathQuest 練習セッション
  /kanji               → KanjiQuest トップページ
  /clock               → ClockQuest トップページ（準備中）
```

**後方互換性：**

- `/start` → `/math/start`（301 リダイレクト）
- `/play` → `/math/play`（301 リダイレクト）

### 設計原則

- **サブディレクトリルーティング**: サブドメイン方式と比較してシンプルなインフラ、統一されたセッション、優れた SEO
- **テーマカスタマイズ**: 各 Quest モジュールは CSS 変数による独自の配色スキーム
  - MathQuest: 青系テーマ (#6B9BD1)
  - KanjiQuest: 紫系テーマ (#9B7EC8)
  - ClockQuest: オレンジ系テーマ (#F5A85F)
- **共有ドメインロジック**: すべての Quest モジュールは `@edu-quest/domain` と `@edu-quest/app` パッケージを再利用
- **一貫した UX**: すべての Quest モジュール間で統一されたナビゲーションと認証

### 命名規則

```text
ブランド:     EduQuest
ドメイン:     dev.edu-quest.app (開発), edu-quest.app (本番)
パッケージ:   @edu-quest/*
ルート:
  - ポータル:  /
  - 算数:      /math, /math/start, /math/play
  - 漢字:      /kanji
  - 時計:      /clock（準備中）
```

**AI アシスタントへの注意**: 新しい Quest モジュールや機能を実装する際は、教科固有のロジックを適切に分離しつつ、共通機能（問題生成パターン、回答検証など）については共有ドメインロジックを活用してください。

## 参考リンク

- [README.md](README.md): プロジェクトセットアップ
- [CLAUDE.md](CLAUDE.md): Claude Code向けプロジェクト規約
- [docs/AI_RULES.ja.md](docs/AI_RULES.ja.md): 詳細なコーディング規約
- [Hono Documentation](https://hono.dev/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
