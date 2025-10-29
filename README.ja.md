# EduQuest ドキュメント概要

[![D1 Migrations (Dev)](https://github.com/tqer39/edu-quest/actions/workflows/d1-migrations-dev.yml/badge.svg)](https://github.com/tqer39/edu-quest/actions/workflows/d1-migrations-dev.yml)
[![D1 Migrations (Prod)](https://github.com/tqer39/edu-quest/actions/workflows/d1-migrations-prod.yml/badge.svg)](https://github.com/tqer39/edu-quest/actions/workflows/d1-migrations-prod.yml)
[![Terraform (Dev)](https://github.com/tqer39/edu-quest/actions/workflows/terraform-dev.yml/badge.svg)](https://github.com/tqer39/edu-quest/actions/workflows/terraform-dev.yml)
[![Terraform (Prod)](https://github.com/tqer39/edu-quest/actions/workflows/terraform-prod.yml/badge.svg)](https://github.com/tqer39/edu-quest/actions/workflows/terraform-prod.yml)

EduQuest は小学生向けに各種学習コンテンツを提供するプラットフォームで、専門の「Quest」モジュールを通じて学習体験を提供します。Cloudflare Workers 上で Hono を用いた SSR で構築されており、pnpm ワークスペースで管理されるモノレポ内で共通のドメインロジックを共有します。

## Quest モジュール

- **MathQuest** (`/math`): 学年別プリセットとテーマ付き演習による計算練習。計算種類の選択、設定の切り替え（効果音、中間ステップ）やキーパッド UI での練習が可能です。
- **KanjiQuest** (`/kanji`): 学年別に整理された漢字学習（近日公開）
- **ClockQuest** (`/clock`): アナログ・デジタル時計を使った時間の読み取り練習（近日公開）

プラットフォームには EduQuest ハブページ（`/`）があり、ユーザーは各 Quest モジュールに移動できます。問題の生成と採点は `@edu-quest/domain` によって処理され、API レイヤー（`/apis/quiz`）でも再利用されます。

## クイックスタート

### 必要条件

このリポジトリでは以下のツールを使用します。

- **Homebrew**: macOS/Linux のシステムレベル開発ツールを管理します。
- **mise**: Node.js、pnpm、Wrangler など実行環境のバージョンを管理します。
- **just**: セットアップやリント処理をまとめたタスクランナーです。
- **pnpm**: JavaScript/TypeScript ワークスペースを管理します。

### セットアップ

**重要**: `make bootstrap` を実行する前に、以下の手順を完了してください。

#### 1. Cloudflare 認証情報を設定

```bash
# make bootstrap 実行前に Cloudflare 認証情報を追加
cf-vault add edu-quest
cf-vault list
```

#### 2. Terraform ブートストラップを初期化

開発環境向けに Cloudflare リソース（D1、KV、Turnstile など）を設定します。

```bash
just tf -chdir=dev/bootstrap init -reconfigure
just tf -chdir=dev/bootstrap validate
just tf -chdir=dev/bootstrap plan
just tf -chdir=dev/bootstrap apply -auto-approve
```

#### 3. 通常のセットアップを進める

```bash
# 1. Homebrew をインストール（macOS/Linux）
make bootstrap

# 2. 依存ツールと npm パッケージをまとめてセットアップ
# Cypress バイナリも自動的にインストールされます
just setup
```

すでに Homebrew がある場合は、`just setup` の前に `brew bundle install` を実行してください。

**補足:** `just setup` コマンドは次を自動的にインストールします。

- mise の各ツール（Node.js、pnpm など）
- pnpm（未インストールの場合）
- すべての npm 依存関係
- E2E テスト用 Cypress バイナリ

### よく使うコマンド

```bash
# 利用可能な just タスクを表示
just help

# コード品質チェック（biome, cspell, vitest など）
just lint

# 自動フォーマットを適用
just fix

# pre-commit キャッシュをクリア
just clean

# ランタイムや CLI を更新
just update-brew
just update
just update-hooks

# mise の状態を確認
just status

# Cypress による E2E テスト（ヘッドレス）
just e2e

# Cypress テストランナーを開く（インタラクティブ）
just e2e-open
```

## テスト

### 単体テスト

本プロジェクトは単体テストに Vitest を使用します。

```bash
# すべての単体テストを実行
pnpm test

# ウォッチモードで単体テストを実行
pnpm test:watch

# カバレッジレポートを生成
pnpm test:coverage
```

### E2E テスト

画面遷移やユーザーフローを確認するため、E2E テストには Cypress を使用します。

#### E2E テストの実行

##### オプション 1: 手動（開発時に推奨）

```bash
# 1. 別ターミナルで Cloudflare Workers の開発サーバーを起動
pnpm dev:edge
# http://localhost:8788 でサーバーが起動します

# 2. ヘッドレスモードで E2E テストを実行
just e2e

# または Cypress テストランナーを開く（インタラクティブモード）
just e2e-open
```

##### オプション 2: 自動（CI や簡易テスト向け）

```bash
# 開発サーバーを自動起動して E2E テストを実行
just e2e-ci
```

このコマンドは次を実行します。

1. バックグラウンドで Cloudflare Workers の開発サーバーを起動
2. サーバーの起動完了を待機（最大 30 秒）
3. すべての E2E テストを実行
4. 完了後にサーバーを自動停止

**重要な注意点:**

- **E2E テストは必ず `@edu-quest/edge`（Cloudflare Workers）を対象に実行してください。`@edu-quest/web` ではありません。**
- `@edu-quest/web` は実際のアプリケーションルートを持たないプレースホルダーの Node.js サーバーです。
- すべてのアプリケーションルート（/, /math, /math/start, /math/play など）は `@edu-quest/edge` のみで提供されます。
- `just e2e` と `just e2e-open` コマンドは `http://localhost:8788` でサーバーが動作しているかを確認します。
- **E2E テスト用のサーバー起動には常に `pnpm dev:edge` を使用してください。**

**E2E テスト範囲:**

- ページ間のナビゲーションフロー（Home → MathQuest → Start → Play → Results）
- ClockQuest のナビゲーション
- 戻るボタン（ブラウザバック）の挙動
