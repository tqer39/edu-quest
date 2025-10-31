[🇺🇸 English](/docs/AI_RULES.md)

# AI アシスタント共通ルール（日本語）

本リポジトリで Cursor / GitHub Copilot / Codex CLI / Gemini / Claude Code 等のアシスタントが一貫した挙動になるよう、プロジェクト固有の指示をまとめます。

## 基本方針

- すべての回答は日本語で行う。
- 変更は最小限・フォーカスして行い、無関係な修正は避ける。
- リポジトリのガイドラインに従う（`AGENTS.md` 参照）。
- ツールやワークフローを変更した場合は、関連ドキュメント（`docs/`）を更新する。
- 機密情報（API キー等）はコミットしない。検出系フックが有効。

## 作業ルール

- コード変更時は周辺スタイルに合わせる。余計なリファクタはしない。
- ルートの設定に従う：`.editorconfig`、`.prettierrc`、`.pre-commit-config.yaml`。
- `just lint` が通る状態で変更を提案・適用する。
- ファイル参照はパスをインラインコードで示す（例: `src/app.ts:42`）。
- 大きな説明は簡潔に。必要に応じて箇条書きと短い見出しで要点を整理する。

### EduQuest の UI/UX ルール

**解答入力インターフェース:**

- クイズの解答送信には標準ブラウザ入力コントロール（`<input type="text">`、`<input type="number">`、`<select>` など）を**使用しない**
- すべてのクエストタイプ（MathQuest、ClockQuest、KanjiQuest、GameQuest）で**ボタン式の解答入力**を使用する
- **実装方法:** 各解答選択肢は SSR 互換性のため、hidden input を持つ `<form>` 内の独立した `<button>` とする
- **理由:** 対象ユーザーは小学生であり、ボタン式入力はキーボード/IME の問題を回避し、モバイル/タブレットでの UX を向上させる

## 実行コマンドの指針

- ローカル検証が可能な場合は、必要最小限のコマンドで動作確認する。
- プロジェクトのコマンドは以下を優先的に使う：
  - セットアップ: `brew bundle install` → `just setup`
  - Lint 全実行: `just lint`
  - 自動修正: `just fix`
  - ルール同期（任意導入）: `just rulesync -- --check` / `just rulesync -- apply`

## rulesync による設定ファイル生成

- `just rulesync -- generate` で AI アシスタント向け設定ファイルを生成できる。
- 生成対象（初期値）:
  - `.cursorrules`（Cursor）
  - `.github/copilot-instructions.md`（GitHub Copilot Chat）
  - `CLAUDE.md`（Claude Code/Dev）
  - `docs/AI_RULES.ja.md`（本ファイル: 単一ソース）
- 生成物は本ファイルの内容をベースにし、各ツールに合わせたヘッダーを付す。

## 参考: ガイドラインの要点（抜粋）

- コミットは短く命令形。必要に応じて `#123` で issue を参照。
- 既存 CI は prek を実行。ワークフロー改変時は注意。
- Node は `mise`、Python は `uv` で管理。固定バージョンに合わせる。
