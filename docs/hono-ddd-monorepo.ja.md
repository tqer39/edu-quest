[🇺🇸 English](/docs/hono-ddd-monorepo.md)

# Hono × DDD モノレポ構成（最小）

> **ステータス**: このガイドは、Hono と DDD をモノレポで組み合わせた最初期のチュートリアル構成をまとめたものです。現在の本番実装は主に `apps/edge` に置かれています。最新のレイアウトは [edu-quest-architecture.md](./edu-quest-architecture.ja.md) を参照してください。

## このドキュメントの目的

- ドメイン → アプリケーション → インターフェイスという最小 3 レイヤ構成を小さく把握できるようにする。
- 現在の本番リポジトリでも採用している命名規則のルーツを示す。
- 過去の議論やコミットを読む際に登場する `apps/api` / `apps/web` の位置付けを把握できるようにする。

## 最小構成のリファレンス

- `packages/domain`: ドメイン層
  - エンティティ、値オブジェクト、ドメインサービス（四則演算の問題生成と採点）
- `packages/app`: アプリケーション層
  - 用語: ユースケース / アプリケーションサービス（クイズ進行の状態管理）
- `apps/api`: インターフェイス層（Hono）
  - REST API（問題生成と採点）、CORS、簡易静的ページ
- `apps/web`: フロントエンド（Hono 静的配信）
  - API を呼び出す最小の UI（算数クイズ）

## 現在の本番リポジトリとの違い

- `apps/edge` が主なインターフェイス兼アプリケーション層です。Cloudflare Workers 上で SSR を実行し、クエストページを描画しつつ `/apis/quiz/*` エンドポイントを提供します。
- `apps/api` と `apps/web` はローカル検証用に残っていますが、本番デプロイには使用しません。
- この最小チュートリアルには含まれていない補助ディレクトリもリポジトリには存在します。
  - `infra/`: Terraform と D1 マイグレーション
  - `tests/e2e/`: Playwright の E2E スペック
  - `scripts/`: ドキュメントツリー生成などのメンテナンス用スクリプト
- ディレクトリ構成と依存関係の一次情報は [edu-quest-architecture.md](./edu-quest-architecture.ja.md) です。レイアウトが変わった際は `pnpm run docs:update-structure` を実行し、同ドキュメント内の自動生成ツリーを更新してください。

## 主要コマンド（ローカル / pnpm）

- 事前準備（初回）: `just setup`
  - Homebrew 経由のツール導入 → mise によるツール（node/pnpm 等）導入 → pre-commit 設定
- 依存関係のインストール（ルート）: `pnpm install`
- ビルド: `pnpm run build`
- API 起動: `pnpm --filter @edu-quest/api run dev` → <http://localhost:8787>
- Web 起動: `pnpm --filter @edu-quest/web run dev` → <http://localhost:8788>
  - Web は API を `http://localhost:8787` に呼びます。両方起動してください。
- Edge-SSR 起動（Workers）: `pnpm --filter @edu-quest/edge run dev` → Wrangler の URL にアクセス
  - KV / D1 は wrangler.toml のバインディングを環境に合わせて設定してください。

## API 概要

- `POST /v1/questions/next`
  - 入力: `{ mode: 'add'|'sub'|'mul'|'mix', max: number }`
  - 出力: `{ question: { a, b, op, answer } }`（初期版では正解も返却）
- `POST /v1/answers/check`
  - 入力: `{ a, b, op, value }`
  - 出力: `{ ok: boolean, correctAnswer: number }`

将来的にはセッション ID を導入して、問題配布と採点をセッション単位で管理し、正解は隠蔽する設計に発展できます。

## DDD の観点

- ドメイン層はフレームワーク依存を持たず、純粋な TypeScript オブジェクトと関数で構成します。
- アプリケーション層はドメインロジックを編成し、永続化やセッション、トランスポートとの調停を担います。
- インターフェイス層（Hono）はルーティング、リクエストバリデーション、HTTP レスポンスへの変換に集中します。
- 依存の向きは「インターフェイス → アプリケーション → ドメイン」の一方向に保ちます。

## 既存のフロントエンドとの連携

旧スタティック版の Math Quiz プロトタイプ（[`docs/math-quiz.md`](./math-quiz.md) に記載）はクライアントサイド完結の実装です。API を使う版に差し替える場合は、問題生成と採点の呼び出しを `/v1/...` に置き換えていけば移行できます。本番スタック（`apps/edge`）に対して作業する場合は、同じドメインロジックをラップした `/apis/quiz/generate` と `/apis/quiz/verify` ハンドラーを利用してください。

## pnpm の導入について

- mise 経由（推奨）
  - `.tool-versions` に `pnpm` を追加して `mise install` を実行
- npm 経由
  - `npm install -g pnpm`
