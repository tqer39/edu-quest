# Git Worktree クイックリファレンス

git worktreeを使った並列開発のための1ページチートシート。

## クイックセットアップ（3ステップ）

```bash
# 1. worktreeを作成
just worktree-create feature-name main

# 2. 開発サーバーを起動
just worktree-dev feature-name

# 3. Claude Codeを起動
just worktree-claude feature-name
```

## 基本コマンド

| コマンド                                 | 説明                         |
| ---------------------------------------- | ---------------------------- |
| `just worktree-create <名前> <ブランチ>` | 新しいworktreeを作成         |
| `just worktree-list`                     | 全worktreeをリスト表示       |
| `just worktree-status`                   | 全worktreeのステータスを表示 |
| `just worktree-dev <名前> [ポート]`      | 開発サーバーを起動           |
| `just worktree-claude <名前>`            | Claude Codeを起動            |
| `just worktree-remove <名前>`            | worktreeを削除               |

## 並列開発パターン

```text
┌─────────────────────────────────────────────────────────────────┐
│ ターミナル1: 機能A 開発サーバー                                    │
├─────────────────────────────────────────────────────────────────┤
│ $ just worktree-dev feature-a 8788                             │
│ ✓ Dev server running on http://localhost:8788                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ターミナル2: 機能B 開発サーバー                                    │
├─────────────────────────────────────────────────────────────────┤
│ $ just worktree-dev feature-b 8789                             │
│ ✓ Dev server running on http://localhost:8789                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ターミナル3: 機能A用 Claude Code                                  │
├─────────────────────────────────────────────────────────────────┤
│ $ just worktree-claude feature-a                                │
│ > Working on feature A implementation...                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ターミナル4: 機能B用 Claude Code                                  │
├─────────────────────────────────────────────────────────────────┤
│ $ just worktree-claude feature-b                                │
│ > Working on feature B implementation...                        │
└─────────────────────────────────────────────────────────────────┘
```

## ファイル構造

```text
workspace/
├── edu-quest/                    # メインリポジトリ (mainブランチ)
│   ├── apps/
│   ├── packages/
│   ├── docs/
│   └── scripts/
│       ├── worktree-dev.sh      # Worktree管理
│       └── claude-worktree.sh   # Claude起動
│
└── edu-quest-worktrees/          # Worktreeディレクトリ
    ├── feature-a/                # 機能A用worktree
    │   ├── apps/
    │   ├── packages/
    │   └── node_modules/         # 独立した依存関係
    │
    └── feature-b/                # 機能B用worktree
        ├── apps/
        ├── packages/
        └── node_modules/         # 独立した依存関係
```

## 一般的なワークフロー

### 新機能を開始

```bash
# mainベースでworktreeを作成
just worktree-create new-feature main

# 開発を開始
just worktree-dev new-feature

# Claude Codeを起動（別のターミナルで）
just worktree-claude new-feature
```

### 複数機能を同時に作業

```bash
# ターミナル1: 機能A
just worktree-dev feature-a 8788

# ターミナル2: 機能B
just worktree-dev feature-b 8789

# ターミナル3: A用Claude
just worktree-claude feature-a

# ターミナル4: B用Claude
just worktree-claude feature-b
```

### ステータス確認

```bash
# 全worktreeとその状態を表示
just worktree-status

# 出力例:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ℹ Worktree: feature-a
#   Path: ../edu-quest-worktrees/feature-a
#   Dev Server: Running on port 8788
#   ## worktree/feature-a
#   M  apps/edge/src/routes/pages/kanji.tsx
```

### 完了とクリーンアップ

```bash
# worktreeに移動
cd ../edu-quest-worktrees/feature-a

# 変更をコミット
git add .
git commit -m "feat: add new feature"
git push origin worktree/feature-a

# PRを作成
gh pr create --title "Add New Feature"

# マージ後、worktreeを削除
just worktree-remove feature-a
```

## ポート管理

| ポート | 用途                         |
| ------ | ---------------------------- |
| 8788   | デフォルト開発サーバーポート |
| 8789   | 2番目の機能                  |
| 8790   | 3番目の機能                  |
| ...    | 指定しない場合は自動割り当て |

**ポート自動割り当て:**

```bash
just worktree-dev feature-name
# システムが次の利用可能なポートを自動的に見つける
```

**手動ポート割り当て:**

```bash
just worktree-dev feature-a 8788
just worktree-dev feature-b 8789
```

## Tmuxセッション（オプション）

**注意:** tmuxはオプションです。`brew install tmux`（macOS）または`apt-get install tmux`（Linux）でインストールできます。

tmuxがインストールされている場合、Worktree開発サーバーは自動的にtmuxセッションを作成します:

```bash
# 開発サーバーを起動（tmuxがインストールされている場合、tmuxセッション作成）
just worktree-dev feature-a

# tmuxセッションにアタッチ
tmux attach-session -t eduquest-feature-a

# tmuxからデタッチ
# 押下: Ctrl+B, then D
```

**tmuxなしの場合:** 開発サーバーは現在のターミナルで実行されます。別々のターミナルウィンドウ/タブを使用してください。

## トラブルシューティング

### ポートが既に使用中

```bash
# ポートを使用しているものを確認
lsof -i :8788

# プロセスをkill
kill <PID>

# または別のポートを使用
just worktree-dev feature-a 8790
```

### Worktreeが既に存在

```bash
# 既存のworktreeをリスト表示
just worktree-list

# 古いworktreeを削除
just worktree-remove old-feature

# 新しいworktreeを作成
just worktree-create new-feature main
```

### 依存関係が同期していない

```bash
# worktreeに移動
cd ../edu-quest-worktrees/feature-name

# 依存関係を再インストール
pnpm install
```

### ブランチの競合

```bash
# エラー: branch 'worktree/feature-a' already exists
# 解決策: 先にブランチを削除
git branch -D worktree/feature-a

# その後、worktreeを再作成
just worktree-create feature-a main
```

## ベストプラクティス

### ✅ すべきこと

- 説明的なworktree名を使用（`add-kanji-dict`、`test`ではなく）
- 最新のベースブランチからworktreeを作成
- PRマージ後にworktreeを削除
- 可能な限りシステムにポートを自動割り当てさせる
- worktreeを単一機能に集中させる

### ❌ すべきでないこと

- worktreeが存在する間にメインリポジトリを削除しない
- worktreeからベースブランチに直接コミットしない
- 異なるマシン間でworktreeを共有しない
- あまり多くのworktreeを作成しない（2〜4個が最適）
- worktree作成前の`git fetch`を忘れない

## 主な利点

- ✅ stash不要
- ✅ ブランチ切り替えのオーバーヘッドなし
- ✅ 並列開発とテスト
- ✅ 独立したClaude Codeコンテキスト
- ✅ 機能の並列比較
- ✅ 分離された依存関係管理

## 完全ドキュメント

完全ガイドはこちら: [docs/parallel-development.ja.md](./parallel-development.ja.md)

## サポート

何か問題が発生した場合:

1. `just worktree-status`で現在の状態を確認
2. worktreeの削除と再作成を試す
3. `.git/worktrees/`ディレクトリを確認
4. 完全なドキュメントを確認

---

**クイックスタートテンプレート:**

```bash
# この機能用にテンプレートをコピーしてカスタマイズ
export FEATURE_NAME="your-feature-name"
export BASE_BRANCH="main"
export DEV_PORT="8788"

just worktree-create $FEATURE_NAME $BASE_BRANCH
just worktree-dev $FEATURE_NAME $DEV_PORT
just worktree-claude $FEATURE_NAME
```
