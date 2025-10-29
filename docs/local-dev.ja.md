[English](/docs/local-dev.md)

# ローカル検証環境の作り方

本リポジトリは 2 つのローカル開発モードを用意しています。

- Node ローカル（簡易）: `apps/api` + `apps/web` をローカルで起動
- Edge-SSR（Cloudflare Workers エミュレーション）: `apps/edge` を Wrangler で起動

## 初期セットアップ（必須）

**重要**: `make bootstrap` を実行する前に、以下の手順を実行する必要があります。

### 1. Cloudflare 認証情報の設定

```shell
# まず権限を追加
cf-vault add edu-quest
cf-vault list
```

これにより、ローカル開発環境で Cloudflare リソースへのアクセスが可能になります。

### 2. Terraform Bootstrap の実行

AWS リソース（IAM ロールなど）を初期化します。

```shell
just tf -chdir=dev/bootstrap init -reconfigure
just tf -chdir=dev/bootstrap validate
just tf -chdir=dev/bootstrap plan
just tf -chdir=dev/bootstrap apply -auto-approve
```

これにより、開発環境用の AWS リソースが作成されます。

### 3. Terraform Databases の実行

Cloudflare リソース（D1、KV、Turnstile など）を初期化します。

**重要**: Bootstrap の実行後、5〜10分待ってから実行してください。これは、Cloudflare API のレート制限を回避するためです。

```shell
just tf -chdir=dev/databases init -reconfigure
just tf -chdir=dev/databases validate
just tf -chdir=dev/databases plan
just tf -chdir=dev/databases apply -auto-approve
```

これにより、開発環境用の Cloudflare リソースが作成されます。

### 4. 本番環境用 Terraform の実行（オプション）

開発環境のセットアップ後、本番環境用のリソースも初期化する場合は、以下の手順を実行します。

#### 4.1. Bootstrap（AWS リソース）

```shell
just tf -chdir=prod/bootstrap init -reconfigure
just tf -chdir=prod/bootstrap validate
just tf -chdir=prod/bootstrap plan
just tf -chdir=prod/bootstrap apply -auto-approve
```

#### 4.2. Databases（Cloudflare リソース）

**重要**: Bootstrap の実行後、5〜10分待ってから実行してください。

```shell
just tf -chdir=prod/databases init -reconfigure
just tf -chdir=prod/databases validate
just tf -chdir=prod/databases plan
just tf -chdir=prod/databases apply -auto-approve
```

これにより、本番環境用のリソースが作成されます。

**注意**: 本番環境のリソースを作成する場合は、適切な権限とアカウント設定が必要です。

## 前提条件

- pnpm がインストール済み（`pnpm --version`）
- Cloudflare Wrangler が mise 経由で導入済み（`mise install` 後に `wrangler --version` が通ること）
- 初回は依存導入: ルートで `pnpm install`

## 1) Node ローカルモード（最短）

- 一括起動（Just 推奨）
  - `just dev-node`
  - API: <http://localhost:8787> / Web: <http://localhost:8788>
- 個別起動（手動）
  - 別ターミナル1: `pnpm --filter @edu-quest/api run dev`
  - 別ターミナル2: `pnpm --filter @edu-quest/web run dev`
- 動作確認
  - ヘルスチェック: `curl http://localhost:8787/healthz`
  - ブラウザで Web を開く: <http://localhost:8788>

## 2) Edge-SSR（Workers）モード

Wrangler を使って Cloudflare Workers をローカル実行します。KV/D1 もローカルでエミュレート可能です。

- 起動
  - `pnpm --filter @edu-quest/edge run dev`
  - または `just dev-edge`
  - Wrangler が表示するローカル URL にアクセス
  - ローカルモードでは `--live-reload` を有効化しているため、ソース更新時にブラウザも自動でリロードされます。
  - Wrangler のデバッグログは `apps/edge/.wrangler/logs/` に保存されます（リポジトリ外への書き込みを避けるため）。
  - ログイン検証は Better Auth を経由せず、デフォルトでモックユーザーが使用されます（`USE_MOCK_USER=false` で無効化可能）。
- KV のローカル準備（任意）
  - `wrangler kv namespace create KV_FREE_TRIAL`
  - `wrangler kv namespace create KV_AUTH_SESSION`
  - `wrangler kv namespace create KV_RATE_LIMIT`
  - `wrangler kv namespace create KV_IDEMPOTENCY`
  - `wrangler dev` 実行時はプレビュー用 namespace が自動で割り当てられますが、明示的に作成して `wrangler.toml` の `kv_namespaces` に id を設定することも可能です。
- D1 のローカル準備（任意）
  - DB 作成: `wrangler d1 create eduquest`
  - 生成された `database_id` を `apps/edge/wrangler.toml` の `d1_databases` に反映
  - マイグレーション適用: `wrangler d1 migrations apply DB --local --config apps/edge/wrangler.toml`
    - `DB` は `wrangler.toml` の `binding` 名を指し、`--config` で設定ファイルを指定することで `infra/migrations` 配下の SQL が適用されます。
    - `--local` フラグにより、ローカル SQLite ファイルに対してマイグレーションが実行されるため、Wrangler のプレビュー環境に影響を与えません。
  - スキーマ変更時は `pnpm drizzle:generate` で SQL を生成し、上記コマンドで適用
- データ永続化（開発用）
  - `wrangler dev --persist` を使うと KV/D1 のローカルデータを `.wrangler` ディレクトリに保持できます。

## よくある質問（FAQ）

- ポートを変えたい
  - API: `PORT=8080 pnpm --filter @edu-quest/api run dev`
  - Web 側の API 呼び先は `apps/web/public/main.js` の `http://localhost:8787` を合わせてください。
- CORS でエラーになる
  - API 側（`apps/api`）は CORS を許可済みですが、URL を確認してください。
- pre-commit が失敗する
  - `just lint` で詳細を確認。ファイル整形や辞書（`cspell.json`）の単語追加を行ってください。

## コード整形（Prettier）

- すべての対象ファイルを整形
  - `just format`
- ステージ済みのみ整形（コミット前など）
  - `just format-staged`

pre-commit の Prettier フックを拡張しており、`js/ts/tsx/json/css/html/md/yaml` が対象です。
