# Git Worktreeを使った並列開発

このガイドでは、git worktreeを使って複数の機能を並列開発し、それぞれに独立したClaude Codeインスタンスを起動する方法を説明します。

## 概要

Git worktreeは、同じリポジトリに対して複数の作業ディレクトリ（worktree）を持つことができ、それぞれ異なるブランチで作業できます。これにより:

- **並列機能開発**: 機能Aと機能Bを同時に開発可能
- **独立した環境**: 各worktreeは独自の開発サーバー、依存関係、状態を持つ
- **独立したClaude Codeインスタンス**: 各機能に対して独立したClaude Codeセッションを実行
- **簡単なコンテキスト切り替え**: stashやcommitなしで機能間を切り替え

## アーキテクチャ

```text
edu-quest/                           # メインworktree (mainブランチ)
├── apps/
├── packages/
└── docs/

edu-quest-worktrees/                 # Worktreeディレクトリ
├── feature-a/                       # 機能A用worktree
│   ├── apps/
│   ├── packages/
│   └── .git -> main repo .git
├── feature-b/                       # 機能B用worktree
│   ├── apps/
│   ├── packages/
│   └── .git -> main repo .git
└── bugfix-x/                        # バグ修正X用worktree
    ├── apps/
    ├── packages/
    └── .git -> main repo .git
```

## クイックスタート

### 1. 並列機能用のWorktreeを作成

```bash
# 機能A用worktreeを作成（mainブランチベース）
just worktree-create feature-a main

# 機能B用worktreeを作成（mainブランチベース）
just worktree-create feature-b main

# バグ修正用worktreeを作成（developブランチベース）
just worktree-create bugfix-x develop
```

### 2. 開発サーバーを起動

各worktreeで異なるポートで開発サーバーを起動できます:

```bash
# ターミナル1: feature-aの開発サーバーをポート8788で起動
just worktree-dev feature-a 8788

# ターミナル2: feature-bの開発サーバーをポート8789で起動
just worktree-dev feature-b 8789

# または、システムに自動ポート割り当てさせる
just worktree-dev feature-a
```

### 3. 各Worktree用のClaude Codeを起動

```bash
# ターミナル3: feature-a用のClaude Codeを起動
just worktree-claude feature-a

# ターミナル4: feature-b用のClaude Codeを起動
just worktree-claude feature-b
```

これで以下の環境が整いました:

- 機能A: ポート8788の開発サーバー、Claude Codeインスタンス1
- 機能B: ポート8789の開発サーバー、Claude Codeインスタンス2

## 完全なワークフロー例

2つの機能を並列で開発する場合:

1. 漢字辞書機能の追加
2. MathQuest UIの改善

### ステップ1: Worktreeを作成

```bash
# 漢字辞書用worktree
just worktree-create add-kanji-dict main

# MathQuest UI用worktree
just worktree-create improve-mathquest-ui main
```

### ステップ2: 2つのターミナルウィンドウを開く

**ターミナルウィンドウ1（漢字辞書）:**

```bash
cd ../edu-quest-worktrees/add-kanji-dict
pnpm dev:edge  # ポート8788で起動
```

**ターミナルウィンドウ2（MathQuest UI）:**

```bash
cd ../edu-quest-worktrees/improve-mathquest-ui
pnpm dev:edge  # ポート8789で起動（自動検出）
```

### ステップ3: それぞれにClaude Codeを起動

**ターミナル3:**

```bash
just worktree-claude add-kanji-dict
# add-kanji-dict worktreeでClaude Codeが開く
```

**ターミナル4:**

```bash
just worktree-claude improve-mathquest-ui
# improve-mathquest-ui worktreeでClaude Codeが開く
```

### ステップ4: 並列作業

これで以下が可能になります:

- worktree 1のClaudeに漢字辞書の実装を依頼
- worktree 2のClaudeにMathQuest UIの改善を依頼
- 両機能が独立して開発される
- <http://localhost:8788>（漢字）と<http://localhost:8789>（mathquest）でテスト

### ステップ5: ステータス確認

```bash
just worktree-status
```

これにより表示されます:

- 全worktreeのリスト
- 各worktreeの現在のブランチ
- 開発サーバーが起動しているか
- Gitステータス（ステージング済み/未ステージの変更）

### ステップ6: プルリクエストの作成

機能が完成したら:

```bash
# worktreeディレクトリに移動
cd ../edu-quest-worktrees/add-kanji-dict
git add .
git commit -m "feat: add kanji dictionary feature"
git push origin worktree/add-kanji-dict

# PRを作成
gh pr create --title "Add Kanji Dictionary Feature"
```

### ステップ7: クリーンアップ

マージ後:

```bash
# worktreeを削除
just worktree-remove add-kanji-dict
```

## 利用可能なコマンド

### Worktree管理

```bash
# 新しいworktreeを作成
just worktree-create <名前> [ベースブランチ]

# 全worktreeをリスト表示
just worktree-list

# worktreeを削除
just worktree-remove <名前>

# 全worktreeのステータスを表示
just worktree-status
```

### 開発

```bash
# 開発サーバーを起動（ポート自動割り当て）
just worktree-dev <名前>

# 特定のポートで開発サーバーを起動
just worktree-dev <名前> <ポート>

# Claude Codeを起動
just worktree-claude <名前>
```

### スクリプトの直接使用

スクリプトを直接使用することもできます:

```bash
# Worktree管理
./scripts/worktree-dev.sh create feature-x main
./scripts/worktree-dev.sh list
./scripts/worktree-dev.sh status
./scripts/worktree-dev.sh remove feature-x

# Claude Code起動
./scripts/claude-worktree.sh feature-x
```

## 高度な使い方

### tmuxを使った開発サーバー管理（オプション）

**注意:** tmuxはオプションです。インストールされていない場合、開発サーバーは現在のターミナルで実行されます。

tmuxをインストールするには:

```bash
# macOS
brew install tmux

# Linux (Ubuntu/Debian)
sudo apt-get install tmux

# Linux (CentOS/RHEL)
sudo yum install tmux
```

tmuxがインストールされている場合、`worktree-dev`コマンドは自動的にtmuxセッションを作成します:

```bash
# tmuxで開発サーバーを起動（インストール済みの場合）
just worktree-dev feature-a

# tmuxセッションにアタッチ
tmux attach-session -t eduquest-feature-a

# tmuxからデタッチ: Ctrl+B, then D
```

**tmuxなしの場合:**
開発サーバーは現在のターミナルで実行されます。各worktree用に別々のターミナルウィンドウ/タブを使用してください。

### 異なるベースブランチからの複数機能

```bash
# mainから機能開発
just worktree-create new-feature main

# productionから緊急修正
just worktree-create urgent-fix production

# developから実験的機能
just worktree-create experiment develop
```

### リモートとの同期

各worktreeは同じ.gitディレクトリを共有します:

```bash
# 任意のworktreeで
git fetch origin

# ブランチの最新変更をpull
git pull origin worktree/your-branch

# 変更をpush
git push origin worktree/your-branch
```

## ベストプラクティス

### 1. 命名規則

worktreeには説明的な名前を使用:

```bash
# 良い例
just worktree-create add-kanji-dictionary main
just worktree-create fix-clock-quest-bug main

# 避けるべき例
just worktree-create test main
just worktree-create new main
```

### 2. ポート管理

- 開発サーバーのポートはシステムに自動割り当てさせる
- または手動で割り当て: 8788（feature-a）、8789（feature-b）、8790（feature-c）

### 3. 定期的なクリーンアップ

マージ後はworktreeを削除:

```bash
just worktree-list
just worktree-remove merged-feature
```

### 4. 独立した依存関係

各worktreeは独自の`node_modules`を持ちます:

- 一方のworktreeでの依存関係の変更は他に影響しない
- 依存関係のアップグレードを分離してテスト可能

### 5. Claude Codeのコンテキスト

各Claude Codeインスタンスは独自の以下を持ちます:

- 会話履歴
- コンテキストウィンドウ
- ファイル状態
- Todoリスト

これにより、複数機能作業時のコンテキストの混乱を防ぎます。

## トラブルシューティング

### Worktree作成の失敗

```bash
# ブランチが既に存在する場合
git branch -D worktree/feature-name

# worktreeディレクトリが存在する場合
rm -rf ../edu-quest-worktrees/feature-name
```

### ポートが既に使用中

```bash
# ポートを使用しているものを確認
lsof -i :8788

# プロセスをkill
kill <PID>

# または別のポートを使用
just worktree-dev feature-a 8790
```

### 依存関係が同期していない

```bash
# worktreeディレクトリで
cd ../edu-quest-worktrees/feature-name
pnpm install
```

### Claude Codeが起動しない

```bash
# Claude CLIがインストールされているか確認
which claude

# インストールされていない場合は、まずClaude Codeをインストール
# その後再試行
just worktree-claude feature-name
```

## アーキテクチャの利点

### 1. コンテキスト切り替えのオーバーヘッドなし

- 変更をstashする必要がない
- ブランチをcheckoutする必要がない
- コンテキスト切り替えの精神的負荷がない

### 2. 並列テスト

- 機能Bを開発しながら機能Aのテストを実行
- ブランチ間の動作を並べて比較

### 3. 進行中のコードレビュー

- チームメンバーに進行中の作業を見せる
- 機能Bが開発中でも機能Aをデモ

### 4. リスクの分離

- 一方のworktreeでの破壊的変更が他に影響しない
- 実験的機能を安全にテスト

### 5. 効率的なCI/CD

- 各worktreeが独自のプレビューデプロイを持てる
- 異なる機能の並列CI実行

## 従来のワークフローとの比較

### 従来（単一作業ディレクトリ）

```bash
# 機能Aで作業
git checkout -b feature-a
# ... 変更を加える ...
git stash  # 切り替える必要がある

# 機能Bで作業
git checkout -b feature-b
# ... 変更を加える ...
git stash  # 戻る必要がある

# 機能Aに戻る
git checkout feature-a
git stash pop
# ... 作業を続ける ...
```

### Worktreeを使用

```bash
# 両方を同時に作業
cd ../edu-quest-worktrees/feature-a
# ... 変更を加える ...

cd ../edu-quest-worktrees/feature-b
# ... 変更を加える ...

# stashなし、切り替えなし、両方が並列で実行
```

## 関連ドキュメント

- [Git Worktree ドキュメント](https://git-scm.com/docs/git-worktree)
- [Claude Code ドキュメント](https://docs.claude.com/claude-code)
- [ローカル開発ガイド](./local-dev.md)
- [プロジェクト概要](./README.md)

## FAQ

### Q: いくつのworktreeを持てますか？

A: ディスクスペースが許す限りいくつでも。実用的には2〜4個のアクティブなworktreeが一般的です。

### Q: worktreeはコミットを共有しますか？

A: はい！同じ.gitディレクトリを共有します。一方のworktreeでのコミットは他でも見えます。

### Q: 同じブランチを複数のworktreeで使えますか？

A: いいえ。Gitは競合を避けるため、同じブランチを複数のworktreeでcheckoutすることを防ぎます。

### Q: メインリポジトリを削除するとworktreeはどうなりますか？

A: worktreeが存在する間はメインリポジトリを削除しないでください。必ず先に`just worktree-remove`でworktreeを削除してください。

### Q: GitHub Codespacesでも使えますか？

A: はい、ただしパスの調整が必要で、個別の開発サーバーは不要かもしれません。

## サポート

問題が発生した場合:

1. `just worktree-status`で現在の状態を確認
2. 各worktreeの`.wrangler/logs`でログを確認
3. worktreeを削除して再作成を試す
4. メインリポジトリの`.git/worktrees/`ディレクトリを確認

質問がある場合は、チームチャットで聞くか、issueを作成してください。
