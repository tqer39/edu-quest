[🇺🇸 English](/docs/edu-quest-architecture.md)

# eduquest: アーキテクチャ設計とプロジェクト構造

## 1. 目的

EduQuest は小学生向けの学習プラットフォームで、複数の「Quest」モジュールを通じて様々な教育コンテンツを提供します。現在は算数練習の MathQuest を提供しており、将来的に漢字学習の KanjiQuest、脳トレ系ミニゲームの GameQuest、時計の読み方を学ぶ ClockQuest を追加予定です。Cloudflare Workers 上で Hono を用いて SSR を行い、学年別プリセットやテーマ練習を提供します。問題生成と採点は共有ドメインロジックに集約し、UI から API まで一貫した仕様で再利用できるように構成されています。

### Quest モジュール

- **MathQuest** (`/math`): 学年別プリセットとテーマ練習（「たし算 20 まで」「たし算・ひき算ミックス」など）を提供する算数練習
- **KanjiQuest** (`/kanji`): 学年別に整理された漢字学習（準備中）
- **GameQuest** (`/game`): パターン認識・空間認識・記憶力を鍛える脳トレミニゲーム（準備中）
- **ClockQuest** (`/clock`): アナログ時計とデジタル時計を使った時刻の読み方練習（準備中）

## 2. アーキテクチャ概要

### 実行環境

- **Edge Runtime:** Cloudflare Workers（Wrangler 開発モード／本番環境）
- **フレームワーク:** Hono + JSX（SSR + Islands）
- **データストア:** Cloudflare D1（想定）、KV（クイズセッション・認証セッション・レート制限・フリートライアル・冪等性管理）
- **ビルド:** pnpm ワークスペース + Vite/Vitest（アプリケーション）

### レイヤー構造

- **ドメイン層 (`packages/domain`)**
  - 出題アルゴリズム、複数ステップ計算（たし算→ひき算など）、逆算問題（`? + 5 = 10`）、回答チェック、表示フォーマット。
- **アプリケーション層 (`packages/app`, `apps/edge/src/application`)**
  - クイズの進行状態（問題数・正解数）管理、ユースケース (`generateQuizQuestion`, `verifyAnswer`) やセッションハンドリング。
- **インフラストラクチャ層 (`apps/edge/src/infrastructure`)**
  - Drizzle ORM による D1 接続、KV バインディング、環境変数管理。
- **インターフェース層 (`apps/edge/src/routes`)**
  - ページ: EduQuest ハブ (`/`)、Quest 専用ページ (`/math`, `/kanji`, `/game`, `/clock`)、練習画面 (`/math/start`, `/math/play`)
  - BFF API (`/apis/quiz/generate`, `/apis/quiz/verify`)、クライアントサイドのインタラクションロジック。

レイヤー間の依存はドメイン層を中心とした内向き矢印となるよう整理しており、UI 改修や新しいデリバリーチャネル追加（例: API 専用の UI）でもドメインロジックをそのまま流用できます。

## 3. モジュール構成

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

- `@edu-quest/edge`: 本番用 Cloudflare Workers アプリ。スタート画面でプリセットを JSON 埋め込みし、クライアントスクリプトが動的 UI（テーマ選択、進捗保存、効果音/途中式トグル）を構成します。
- `@edu-quest/api` / `@edu-quest/web`: Workers を利用しないローカル検証用の Node + Hono サーバー。ドメイン/API ロジックの動作確認や Storybook 的な用途に活用できます。
- `@edu-quest/app`: クイズ進行オブジェクト（現在の問題番号、正解数など）の計算を担い、UI 側は副作用レスに状態遷移を扱えます。
- `@edu-quest/domain`: 計算問題の生成規則。学年別テーマ指定時は `generateGradeOneQuestion` などの複合ロジックを呼び出し、逆算問題の場合は `generateInverseQuestion` を使用します。

## 4. ディレクトリ構造

以下のツリーは自動生成されています。ディレクトリを追加・削除した際は `pnpm run docs:update-structure` を実行し、最新状態に更新してください。

<!-- AUTO-GENERATED:STRUCTURE:START -->

```txt
edu-quest/
├── apps/ - アプリケーション群
│   ├── api/ - ローカル開発用 API サーバー
│   ├── edge/ - Cloudflare Workers 向け SSR アプリ
│   │   └── src/
│   │       ├── __tests__/ - Edge 向けの統合テスト
│   │       ├── application/ - ユースケース・セッション管理
│   │       ├── components/ - UI アイランドと共通コンポーネント
│   │       ├── infrastructure/ - Drizzle・環境変数
│   │       ├── middlewares/
│   │       ├── routes/
│   │       │   ├── apis/ - `/apis/quiz` ハンドラー
│   │       │   └── pages/ - `/`・クエストページ・クライアントスクリプト
│   │       ├── styles/ - 共有のデザイントークン
│   │       └── views/ - レイアウトとテンプレート
│   └── web/ - ローカル開発用 Web サーバー
├── cypress/ - Cypress E2E テスト
│   ├── e2e/ - Cypress スペックファイル
│   └── support/ - 共通ヘルパーと初期化コード
├── docs/ - ドキュメント群
├── infra/ - インフラ構成 (Terraform など)
│   ├── migrations/ - D1 スキーマ
│   └── terraform/ - Terraform 構成
├── packages/ - 共有ライブラリ
│   ├── app/ - クイズ進行ユースケース
│   └── domain/ - 問題生成・採点ロジック
└── scripts/ - リポジトリの補助スクリプト
    └── docs/ - ドキュメント用スクリプト
```

<!-- AUTO-GENERATED:STRUCTURE:END -->

## 5. ユースケースとデータフロー

### EduQuest ハブ (`/`)

1. トップページでは、利用可能な Quest モジュールをテーマカラー付きのカードで表示：
   - **MathQuest**（青系テーマ）: 利用可能
   - **KanjiQuest**（紫系テーマ）: 準備中
   - **GameQuest**（緑系テーマ）: 準備中
   - **ClockQuest**（オレンジ系テーマ）: 準備中
2. 「はじめる」ボタンをクリックして、各 Quest に遷移できます。
3. 各 Quest は CSS 変数で独自のカラースキームが適用されています。

### MathQuest トップページ (`/math`)

1. MathQuest 固有の情報と機能（学年プリセット、カスタマイズオプション、集中モード）を表示。
2. 「算数をはじめる」をクリックすると `/math/start` に遷移。
3. テーマカラーは青系（#6B9BD1）。

### MathQuest スタート画面 (`/math/start`)

1. SSR でレンダリング。サーバー側で学年一覧・計算種別・テーマプリセットを JSON として `<script type="application/json">` へ埋め込み。
2. クライアントスクリプト (`start.client.ts`) が初期化し、ローカルストレージから以下の状態を復元：
   - `eduquest:progress:v1`: 総解答数・正解数・最後に選択した学年/テーマ。
   - `eduquest:sound-enabled` / `eduquest:show-working`: UI トグル。
   - `eduquest:question-count-default`: 初期問題数。
3. 学年選択に応じて `gradeCalculationTypes` から計算種別をフィルタリングし、テーマボタンも最小対象学年で絞り込み。
4. 「れんしゅうをはじめる」を押すと選択内容をセッションストレージへ保存し、`/math/play` に遷移。

### MathQuest プレイ画面 (`/math/play`)

1. 画面読み込み時に `eduquest:pending-session` から設定を復元し、表示ラベルを更新。
2. `countdown-overlay` で 3 秒カウントダウン後、`/apis/quiz/generate` に POST して問題を取得。
3. ユーザー回答を `/apis/quiz/verify` に送信し、正誤と正しい答えを表示。正解時はストリークを加算し、ローカルストレージの進捗を更新。
4. 残り問題数が 0 になると結果カードを表示し、`/math/start` への導線を提示。

### API レイヤー

- `POST /apis/quiz/generate`
  - 入力: `mode`, `max`, `gradeId`, `themeId` など（スタート画面の選択内容）
  - 出力: 問題データ（数式・途中式 `extras` を含む）
- `POST /apis/quiz/verify`
  - 入力: 問題オブジェクト + 解答値
  - 出力: 正誤判定と正解値

API は `apps/edge/src/application/usecases/quiz.ts` を経由し、`@edu-quest/domain` のロジックを利用します。これにより UI 側と API 側で同一仕様の問題が生成され、テストもユースケース単位で記述できます。

### 逆算問題（ぎゃくさん）

逆算問題は、一方のオペランドが未知数となる問題形式です（例: `? + 5 = 10` または `3 + ? = 9`）。

**実装の特徴:**

- **問題生成**: `generateInverseQuestion` 関数が `isInverse: true` と `inverseSide: 'left' | 'right'` を持つ問題を生成します。
- **表示形式**: `formatQuestion` 関数が `?` 記号と結果（`= 10`）を含む形式で問題を表示します。
- **回答検証**: `verifyAnswer` 関数が逆算問題の場合、問題オブジェクトの `answer` フィールド（未知数の値）を使用して正誤判定を行います。通常の算数問題とは異なり、計算結果ではなく未知数の値が正解となります。

**データ構造:**

```typescript
type Question = {
  a: number;
  b: number;
  op: '+' | '-' | '×';
  answer: number; // 逆算問題では未知数の値
  isInverse?: boolean; // 逆算問題フラグ
  inverseSide?: 'left' | 'right'; // 未知数の位置
};
```

## 6. 技術スタック

- **UI:** Hono JSX, Tailwind 風ユーティリティクラス（カスタム CSS 変数）
- **クライアントサイド:** TypeScript, Islands 方式のスクリプト埋め込み
- **ロジック:** Vitest によるユースケーステスト、ドメインロジックの純関数化
- **インフラ:** Cloudflare Workers, KV, D1, Terraform
- **ツール:** pnpm, mise, just, biome, cspell

## 7. 設計上の考慮点

- **再利用性:** ドメインロジックとユースケースは Node でも Workers でも動作する純 TypeScript。API と SSR の双方で共有。
- **アクセシビリティ:** テンキーはキーボード操作にも対応し、ARIA 属性で状態を伝達。テーマ選択は `aria-pressed` を利用。
- **ローカルストレージ戦略:** 進捗・設定を保存し、次回訪問時の UX を向上。バージョンキーを付けて将来のマイグレーションに備えています。
- **今後の拡張:** Better Auth 連携によるユーザー管理、D1 への本格的な学習履歴永続化、AI コーチング機能などを想定しています。

## 8. セッション管理

**EduQuest はセキュアなサーバーサイドセッション管理のために Cloudflare KV ストレージを使用します。**

### 基本方針

全ての Quest モジュール（MathQuest、KanjiQuest、GameQuest、ClockQuest）は、クイズセッション管理に **KV + セッション ID パターン** を採用します：

- **セッションデータはサーバーサイドに保存** - Cloudflare KV に自動 TTL（Time To Live）で保存
- **クライアントサイドにはセッション ID のみを保存** - HttpOnly Cookie に格納
- **機密データをクライアントに公開しない** - 問題の正解、正解数などは一切クライアントに送信しない

### 利用可能な KV ネームスペース

| ネームスペース  | 用途                          | バインディング名  |
| --------------- | ----------------------------- | ----------------- |
| KV_QUIZ_SESSION | クイズ/Quest セッションデータ | `KV_QUIZ_SESSION` |
| KV_AUTH_SESSION | ユーザー認証セッション        | `KV_AUTH_SESSION` |
| KV_FREE_TRIAL   | フリートライアル追跡          | `KV_FREE_TRIAL`   |
| KV_RATE_LIMIT   | API レート制限                | `KV_RATE_LIMIT`   |
| KV_IDEMPOTENCY  | 冪等性キー管理                | `KV_IDEMPOTENCY`  |

### セッションライフサイクル例（KanjiQuest）

```typescript
// 1. セッション開始 - ID を生成して KV に保存
const sessionId = crypto.randomUUID();
await c.env.KV_QUIZ_SESSION.put(
  `kanji:${sessionId}`,
  JSON.stringify(session),
  { expirationTtl: 1800 } // 30分
);

// セッション ID のみを HttpOnly Cookie に設定
response.headers.append(
  'Set-Cookie',
  `kanji_session_id=${sessionId}; Path=/; Max-Age=1800; HttpOnly; SameSite=Lax`
);

// 2. セッション取得 - Cookie から ID を読み取り KV から取得
const sessionData = await c.env.KV_QUIZ_SESSION.get(`kanji:${sessionId}`);
const session = JSON.parse(sessionData);

// 3. セッション更新 - KV エントリを新しい状態で上書き
await c.env.KV_QUIZ_SESSION.put(
  `kanji:${sessionId}`,
  JSON.stringify(updatedSession),
  { expirationTtl: 1800 }
);

// 4. セッション終了 - クイズ完了時に KV から削除
await c.env.KV_QUIZ_SESSION.delete(`kanji:${sessionId}`);
```

### セキュリティ上のメリット

- **XSS 対策:** HttpOnly Cookie により JavaScript からセッション ID にアクセス不可
- **CSRF 対策:** SameSite=Lax によりクロスサイトリクエストフォージェリを防止
- **データ隔離:** セッションデータはサーバーから外に出ない
- **自動期限切れ:** TTL によりセッションが無期限に残らない

詳細な実装ガイドラインは [AGENTS.md セクション 7: セッション管理ポリシー](./AGENTS.md#7-session-management-policy) を参照してください。
