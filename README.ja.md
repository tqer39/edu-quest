# MathQuest

MathQuest は Cloudflare Workers 上で動作する Hono ベースの SSR アプリケーションを使った、小学生向けの算数学習プラットフォームです。エッジランタイムと API/フロントエンドの各パッケージ、Terraform で管理するインフラを 1 つのモノレポでまとめているため、プロダクト・プラットフォーム・運用の改善を一元的に進められます。

## クイックスタート

### 前提ツール

このプロジェクトでは、以下のツールチェーンを利用します。

- **Homebrew** (macOS/Linux): mise・just・git・pre-commit・uv などの開発ツールを導入
- **mise**: `.tool-versions` に記載されたランタイム（Node.js 22、pnpm 10、Terraform、Wrangler など）をインストール
- **just**: セットアップ・Lint・開発コマンドをまとめたタスクランナー
- **pnpm**: ワークスペース全体で使用する JavaScript パッケージマネージャー（`just setup` 中に mise が導入）

### セットアップ手順

```bash
# 1. (macOS/Linux) Homebrew と Brewfile 記載パッケージをインストール
make bootstrap

# 2. mise + pnpm でランタイムと JS 依存関係を導入
just setup
```

すでに Homebrew が入っている場合は `make bootstrap` を省略し、代わりに以下を実行します。

```bash
brew bundle install
just setup
```

### 利用可能なコマンド

```bash
# 利用可能なタスク一覧を表示
just help

# コード品質チェックを実行
just lint

# 一般的な整形を自動修正
just fix

# pre-commit のキャッシュを削除
just clean

# 開発ツールを更新
just update-brew  # Homebrew パッケージの更新
just update       # mise 管理ツールの更新
just update-hooks # pre-commit フックの更新

# mise の状態を表示
just status
```

## ツールの役割分担

各ツールの責務は次のとおりです。

- **brew**: git、pre-commit、mise、just、uv、rulesync、cf-vault、aws-vault などのシステムレベル開発ツール
- **mise**: `.tool-versions` で定義されたランタイム（Node.js、pnpm、Terraform、Wrangler）をインストール
- **pnpm**: `apps/` と `packages/` 配下の JavaScript/TypeScript ワークスペースを管理
- **uv**: スクリプト用に Python パッケージとプロジェクトを管理
- **pre-commit**: 各種 Lint/フォーマッターフックを自動実行（個別にフックを導入する必要なし）

## オプション: rulesync

外部のルールリポジトリから共通設定ファイルを同期したい場合は、`docs/RULESYNC.ja.md` を参照してセットアップと使い方を確認してください。
