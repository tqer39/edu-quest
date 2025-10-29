# EduQuest ドキュメント概要

[![codecov](https://codecov.io/gh/tqer39/edu-quest/graph/badge.svg)](https://codecov.io/gh/tqer39/edu-quest)

EduQuest は、小学生向けに専門の「Quest」モジュールを通じてさまざまな学習コンテンツを提供するプラットフォームです。SSR には Cloudflare Workers 上の Hono を採用し、pnpm ワークスペースで管理されたモノレポ内で共通のドメインロジックを共有しています。

## Quest モジュール

- **MathQuest** (`/math`): 学年別のプリセットとテーマ別の演習を備えた計算練習。計算種別の選択、設定（効果音や途中式の表示）の切り替え、テンキー UI での練習ができます。
- **KanjiQuest** (`/kanji`): 学年ごとに整理された漢字学習（近日公開）。
- **ClockQuest** (`/clock`): アナログ時計とデジタル時計で時間の読み方を学ぶ練習（近日公開）。

プラットフォームには各 Quest モジュールへ移動できるハブページ（`/`）があり、問題生成と採点は `@edu-quest/domain` で行い、API レイヤー（`/apis/quiz`）でも再利用しています。

## クイックスタート

### 前提条件

リポジトリでは次のツールを利用します。

- **Homebrew**: macOS/Linux でのシステムレベル開発ツールを管理します。
- **mise**: Node.js や pnpm、Wrangler などの実行環境のバージョンを管理します。
- **just**: セットアップや lint コマンドをまとめたタスクランナーです。
- **pnpm**: JavaScript/TypeScript ワークスペースを管理します。

### セットアップ

**重要**: `make bootstrap` を実行する前に、以下の手順を完了してください。

#### 1. Cloudflare の認証情報を設定する

```bash
# make bootstrap の前に Cloudflare 認証情報を追加
cf-vault add edu-quest
cf-vault list
```

#### 2. Terraform ブートストラップを初期化する

開発環境向けの Cloudflare リソース（D1、KV、Turnstile など）をセットアップします。

```bash
just tf -chdir=dev/bootstrap init -reconfigure
just tf -chdir=dev/bootstrap validate
just tf -chdir=dev/bootstrap plan
just tf -chdir=dev/bootstrap apply -auto-approve
```

#### 3. 標準セットアップを進める

```bash
# 1. Homebrew をインストール（macOS/Linux）
make bootstrap

# 2. 依存ツールと npm パッケージをまとめてセットアップ
# Cypress バイナリも自動でインストールされます
just setup
```

すでに Homebrew をインストール済みの場合は、`just setup` の前に `brew bundle install` を実行してください。

**補足:** `just setup` コマンドは以下を自動で実行します。

- mise ツール（Node.js、pnpm など）のインストール
- pnpm（未導入の場合）のインストール
- すべての npm 依存関係のインストール
- E2E テスト用の Cypress バイナリのインストール

### よく使うコマンド

```bash
# 利用可能な just タスクを一覧表示
just help

# コード品質チェック（biome, cspell, vitest など）
just lint

# 自動整形を適用
just fix

# pre-commit のキャッシュを削除
just clean

# ランタイムや CLI を更新
just update-brew
just update
just update-hooks

# mise の状態を確認
just status

# Cypress を使った E2E テスト（ヘッドレス）を実行
just e2e

# Cypress テストランナー（対話モード）を開く
just e2e-open
```

## テスト

### ユニットテスト

ユニットテストには Vitest を使用します。

```bash
# すべてのユニットテストを実行
pnpm test

# ウォッチモードでユニットテストを実行
pnpm test:watch

# カバレッジレポートを生成
pnpm test:coverage
```

### E2E テスト

画面遷移やユーザーフローを検証するために Cypress を用いた E2E テストを実行します。

#### E2E テストの実行方法

##### オプション 1: 手動（開発時に推奨）

```bash
# 1. 別ターミナルで Cloudflare Workers の開発サーバーを起動
pnpm dev:edge
# http://localhost:8788 でサーバーが起動します

# 2. ヘッドレスモードで E2E テストを実行
just e2e

# もしくは Cypress テストランナー（対話モード）を開く
just e2e-open
```

##### オプション 2: 自動（CI や手早く確認したい場合）

```bash
# 開発サーバーの起動と E2E テスト実行を自動化
just e2e-ci
```

このコマンドでは以下が行われます。

1. Cloudflare Workers の開発サーバーをバックグラウンドで起動
2. サーバーの起動完了を待機（最大 30 秒）
3. すべての E2E テストを実行
4. 終了後にサーバーを自動停止

**重要な注意点:**

- **E2E テストは必ず `@edu-quest/edge`（Cloudflare Workers）を対象に実行し、`@edu-quest/web` では行わないでください。**
- `@edu-quest/web` はアプリケーションルートを持たないプレースホルダーの Node.js サーバーです。
- 実際のアプリケーションルート（`/`, `/math`, `/math/start`, `/math/play` など）はすべて `@edu-quest/edge` に実装されています。
- `just e2e` と `just e2e-open` コマンドは `http://localhost:8788` でサーバーが稼働しているか確認します。
- **E2E テスト用のサーバー起動には常に `pnpm dev:edge` を使用してください。**

**E2E テストで確認する内容:**

- 画面遷移フロー（ホーム → MathQuest → スタート → プレイ → リザルト）
- ClockQuest の画面遷移
- 戻るボタンによる戻り遷移
- 旧 URL のリダイレクト（`/start` → `/math/start`, `/play` → `/math/play`）

#### CI/CD との統合

E2E テストは GitHub Actions 上で以下のタイミングで自動実行されます。

- `main` ブランチへのプッシュ
- プルリクエストの作成・更新

CI ワークフロー（`.github/workflows/e2e.yml`）では次の処理が行われます。

1. `just` コマンドランナーのインストール
2. mise（Node.js、pnpm など）のセットアップ
3. pnpm 依存関係のインストール
4. Cypress バイナリのインストール
5. 必要なパッケージ（`@edu-quest/domain`, `@edu-quest/app`）のビルド
6. `just e2e-ci` の実行（サーバーの自動管理を含む）
7. 失敗時のスクリーンショットや動画のアップロード

#### テスト失敗時のスクリーンショット確認

CI で E2E テストが失敗した場合は次の手順で確認します。

1. GitHub Actions の失敗したワークフロー実行を開く
2. ページ下部までスクロール
3. `cypress-screenshots` アーティファクト（利用可能な場合）をダウンロード
4. 動画記録を有効にしている場合は `cypress-videos` アーティファクトをダウンロード
5. スクリーンショットや動画を確認して原因を特定

スクリーンショットファイルはテストファイル名とテスト名ごとに整理されています。

```text
cypress/screenshots/
├── math-quest-flow.cy.ts/
│   └── MathQuest Flow -- Start Configuration Page -- should load (failed).png
└── navigation.cy.ts/
    └── EduQuest Navigation -- Home Page -- should load (failed).png
```

## リポジトリ構成

- `apps/edge`: Cloudflare Workers 上で動作する Hono SSR アプリ。`routes/pages` にスタート/プレイ画面があり、`routes/apis/quiz.ts` で問題生成と採点 API を提供します。
- `apps/api` / `apps/web`: ローカル開発向けの Node サーバーと Web フロントエンド。Workers を使わずに動作確認するために利用します。
- `packages/domain`: 問題生成と採点のロジック。学年別の複数ステップ問題（例: 加算→減算）も定義しています。
- `packages/app`: ドメインロジックを利用し、問題の進行（出題順序や正答数など）を管理します。
- `docs/`: 設計や運用に関するドキュメント。
- `infra/`: Terraform と D1 マイグレーション。
- `games/math-quiz`: 旧ブラウザ版ゲーム（静的 HTML/JS）。
- `games/clock-quest`: アナログ・デジタル時計を扱う ClockQuest のプロトタイプ（静的 HTML/JS）。

## 関連ドキュメント

- `AGENTS.md`: 全体設計とモジュール依存関係のまとめ。
- `docs/local-dev.md`: ローカル検証環境のセットアップ手順。
- `docs/edu-quest-architecture.md`: 詳細なアーキテクチャ設計。
- `docs/math-quiz.md`: 旧スタンドアロン型ミニゲームの仕様。

