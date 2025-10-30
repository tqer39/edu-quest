#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

const ROOT_NAME = 'edu-quest';

const treeConfig = new Map([
  [
    '.',
    {
      order: ['apps', 'cypress', 'docs', 'infra', 'packages', 'scripts'],
      labels: {
        apps: 'Application projects',
        cypress: 'End-to-end tests',
        docs: 'Documentation',
        infra: 'Infrastructure as code',
        packages: 'Shared libraries',
        scripts: 'Automation scripts',
      },
      includeUnlisted: false,
    },
  ],
  [
    'apps',
    {
      order: ['api', 'edge', 'web'],
      labels: {
        api: 'Local development API server',
        edge: 'Cloudflare Workers SSR app',
        web: 'Local development web server',
      },
    },
  ],
  [
    'cypress',
    {
      order: ['e2e', 'support'],
      labels: {
        e2e: 'Cypress spec files',
        support: 'Shared Cypress helpers',
      },
      includeUnlisted: true,
    },
  ],
  [
    'apps/edge',
    {
      order: ['src'],
      includeUnlisted: false,
      labels: {
        src: '',
      },
    },
  ],
  [
    'apps/edge/src',
    {
      order: ['__tests__', 'application', 'components', 'infrastructure', 'middlewares', 'routes', 'styles', 'views'],
      labels: {
        __tests__: 'Edge integration tests',
        application: 'Use cases, session management',
        components: 'UI islands and shared components',
        infrastructure: 'Drizzle, environment variables',
        middlewares: '',
        routes: '',
        styles: 'Shared Tailwind-like tokens',
        views: 'Layouts and templates',
      },
      includeUnlisted: false,
    },
  ],
  [
    'apps/edge/src/routes',
    {
      order: ['apis', 'pages'],
      labels: {
        apis: '`/apis/quiz` handlers',
        pages: '`/`, quest pages, client scripts',
      },
    },
  ],
  [
    'infra',
    {
      order: ['migrations', 'terraform'],
      labels: {
        migrations: 'D1 schema',
        terraform: 'Terraform configuration',
      },
    },
  ],
  [
    'packages',
    {
      order: ['app', 'domain'],
      labels: {
        app: 'Quiz progression use cases',
        domain: 'Question generation & grading logic',
      },
    },
  ],
  [
    'scripts',
    {
      order: ['docs'],
      labels: {
        docs: 'Documentation tooling',
      },
    },
  ],
]);

const japaneseLabels = new Map([
  ['apps', 'アプリケーション群'],
  ['apps/api', 'ローカル開発用 API サーバー'],
  ['apps/edge', 'Cloudflare Workers 向け SSR アプリ'],
  ['apps/edge/src/__tests__', 'Edge 向けの統合テスト'],
  ['apps/edge/src/application', 'ユースケース・セッション管理'],
  ['apps/edge/src/components', 'UI アイランドと共通コンポーネント'],
  ['apps/edge/src/infrastructure', 'Drizzle・環境変数'],
  ['apps/edge/src/routes/apis', '`/apis/quiz` ハンドラー'],
  ['apps/edge/src/routes/pages', '`/`・クエストページ・クライアントスクリプト'],
  ['apps/edge/src/styles', '共有のデザイントークン'],
  ['apps/edge/src/views', 'レイアウトとテンプレート'],
  ['apps/web', 'ローカル開発用 Web サーバー'],
  ['cypress', 'Cypress E2E テスト'],
  ['cypress/e2e', 'Cypress スペックファイル'],
  ['cypress/support', '共通ヘルパーと初期化コード'],
  ['docs', 'ドキュメント群'],
  ['infra', 'インフラ構成 (Terraform など)'],
  ['infra/migrations', 'D1 スキーマ'],
  ['infra/terraform', 'Terraform 構成'],
  ['packages', '共有ライブラリ'],
  ['packages/app', 'クイズ進行ユースケース'],
  ['packages/domain', '問題生成・採点ロジック'],
  ['scripts', 'リポジトリの補助スクリプト'],
  ['scripts/docs', 'ドキュメント用スクリプト'],
]);

const ignoreDirectories = new Set(['.git', '.wrangler', 'node_modules', '.cache', '.output', '.next', 'dist', 'build']);

const startMarker = '<!-- AUTO-GENERATED:STRUCTURE:START -->';
const endMarker = '<!-- AUTO-GENERATED:STRUCTURE:END -->';

function getNodeConfig(relPath) {
  const base = treeConfig.get(relPath) ?? {};
  return {
    order: base.order ?? [],
    labels: base.labels ?? {},
    includeUnlisted: base.includeUnlisted !== false,
  };
}

async function listDirectories(relPath) {
  const absPath = path.join(repoRoot, relPath);
  const entries = await fs.readdir(absPath, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory() && !ignoreDirectories.has(entry.name));
}

async function ensureOrderedExists(relPath, order, available) {
  for (const name of order) {
    if (!available.has(name)) {
      throw new Error(`Expected directory "${path.join(relPath, name)}" to exist, but it was not found.`);
    }
  }
}

async function buildChildren(relPath) {
  const { order, labels, includeUnlisted } = getNodeConfig(relPath);
  const dirents = await listDirectories(relPath);
  const entriesMap = new Map(dirents.map((entry) => [entry.name, entry]));

  await ensureOrderedExists(relPath, order, entriesMap);

  const orderedNames = order.filter((name) => entriesMap.has(name));

  if (includeUnlisted) {
    const extras = Array.from(entriesMap.keys())
      .filter((name) => !orderedNames.includes(name))
      .sort((a, b) => a.localeCompare(b));
    orderedNames.push(...extras);
  }

  const children = [];
  for (const name of orderedNames) {
    const childRelPath = relPath === '.' ? name : `${relPath}/${name}`;
    const childLabel = labels[name] ?? '';
    const child = {
      name,
      path: childRelPath,
      label: childLabel,
      children: [],
    };
    if (treeConfig.has(childRelPath)) {
      child.children = await buildChildren(childRelPath);
    }
    children.push(child);
  }

  return children;
}

async function buildTree() {
  const rootChildren = await buildChildren('.');
  return {
    name: ROOT_NAME,
    path: '.',
    label: '',
    children: rootChildren,
  };
}

function formatTreeLines(node, labelOverrides = new Map()) {
  const lines = [`${node.name}/`];
  lines.push(...formatChildren(node.children, '', labelOverrides));
  return lines;
}

function formatChildren(children, prefix, labelOverrides) {
  const lines = [];
  children.forEach((child, index) => {
    const isLast = index === children.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const label = labelOverrides.get(child.path) ?? child.label;
    const labelText = label ? ` - ${label}` : '';
    lines.push(`${prefix}${connector}${child.name}/${labelText}`);
    if (child.children.length > 0) {
      const nextPrefix = `${prefix}${isLast ? '    ' : '│   '}`;
      lines.push(...formatChildren(child.children, nextPrefix, labelOverrides));
    }
  });
  return lines;
}

async function updateFile(filePath, lines) {
  const absPath = path.join(repoRoot, filePath);
  const content = await fs.readFile(absPath, 'utf8');
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Markers not found in ${filePath}`);
  }
  const replacement = `${startMarker}\n\n` +
    '```txt\n' +
    `${lines.join('\n')}\n` +
    '```\n' +
    endMarker;
  const updated = content.slice(0, startIndex) + replacement + content.slice(endIndex + endMarker.length);
  await fs.writeFile(absPath, `${updated.trimEnd()}\n`);
}

async function main() {
  const tree = await buildTree();
  const englishLines = formatTreeLines(tree);
  await updateFile('docs/edu-quest-architecture.md', englishLines);

  const japaneseOverrides = new Map(japaneseLabels);
  const japaneseLines = formatTreeLines(tree, japaneseOverrides);
  await updateFile('docs/edu-quest-architecture.ja.md', japaneseLines);

  console.log('Updated directory structures in architecture documents.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
