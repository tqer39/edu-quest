[English](/docs/README.md)

# EduQuest ドキュメント概要

EduQuest は小学生向けの学習プラットフォームで、複数の「Quest」モジュールを通じて様々な教育コンテンツを提供します。Cloudflare Workers 上で動作する Hono ベースの SSR アプリと、共有ドメインロジックを pnpm ワークスペースで管理するモノレポ構成になっています。

## Quest モジュール

- **MathQuest** (`/math`): 学年別プリセットとテーマ練習を提供する算数練習。計算種別の選択、設定切り替え（効果音、途中式）、テンキー UI での練習が可能。
- **KanjiQuest** (`/kanji`): 学年別に整理された漢字学習（準備中）
- **ClockQuest** (`/clock`): アナログ時計とデジタル時計を使った時刻の読み方練習（準備中）

プラットフォームには EduQuest ハブページ (`/`) があり、ユーザーは各 Quest モジュールに移動できます。問題生成と採点は `@edu-quest/domain` が担当し、API 層（`/apis/quiz`）からも再利用されます。

## クイックスタート

### 前提条件

リポジトリでは以下のツールを利用します。

- **Homebrew**: macOS/Linux 向けのシステムレベル開発ツール管理
- **mise**: Node.js・pnpm・Wrangler など実行環境のバージョン管理
- **just**: セットアップや lint をまとめたタスクランナー
- **pnpm**: JavaScript/TypeScript ワークスペース管理

### セットアップ

**重要**: `make bootstrap` を実行する前に、以下の手順を完了する必要があります：

#### 1. Cloudflare 認証情報の設定

```bash
# Cloudflare 認証情報を追加（make bootstrap の前に必須）
cf-vault add edu-quest
cf-vault list
```

#### 2. Terraform Bootstrap の実行

開発環境用の Cloudflare リソース（D1、KV、Turnstile など）を初期化します：

```bash
just tf -chdir=dev/bootstrap init -reconfigure
just tf -chdir=dev/bootstrap validate
just tf -chdir=dev/bootstrap plan
just tf -chdir=dev/bootstrap apply -auto-approve
```

#### 3. 通常のセットアップを進める

```bash
# 1. Homebrew の導入（macOS/Linux）
make bootstrap

# 2. 依存ツールと npm パッケージをまとめてセットアップ
just setup
```

Homebrew が既に入っている場合は `brew bundle install` を挟んでから `just setup` を実行します。

### よく使うコマンド

```bash
# 利用可能な just タスクを一覧表示
just help

# コード品質チェック（biome, cspell, vitest 等）
just lint

# 自動整形を適用
just fix

# pre-commit キャッシュを削除
just clean

# ランタイム・CLI のアップデート
just update-brew
just update
just update-hooks

# mise の状態確認
just status
```

## リポジトリ構成

- `apps/edge`: Cloudflare Workers で動作する Hono SSR アプリ。`routes/pages` にスタート・プレイ画面、`routes/apis/quiz.ts` に問題生成・採点 API を持ちます。
- `apps/api` / `apps/web`: ローカル開発向けの Node サーバーと Web フロント。Workers を使わない検証で利用します。
- `packages/domain`: 問題生成・採点ロジック。学年別の複合ステップ問題（たし算→ひき算など）もここで定義します。
- `packages/app`: ドメインロジックを利用したクイズ進行管理（出題順・正解数カウントなど）。
- `docs/`: 設計・運用ドキュメント。
- `infra/`: Terraform と D1 マイグレーション。
- `games/math-quiz`: 旧ブラウザ版ゲーム（静的 HTML/JS）。
- `games/clock-quest`: アナログとデジタルの時計でれんしゅうできる ClockQuest 試作版（静的 HTML/JS）。

## 関連ドキュメント

- `AGENTS.md`: 全体設計とモジュール依存関係
- `docs/local-dev.md`: ローカル検証環境の構築手順
- `docs/eduquest アーキテクチャ設計とプロジェクト構造.md`: 詳細なアーキテクチャ設計
- `docs/math-quiz.md`: 旧スタンドアロン版ミニゲームの仕様
