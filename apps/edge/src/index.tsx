import {
  type ClockDifficulty,
  type ClockGrade,
  getKanjiDictionaryByGrade,
  getKanjiByUnicode,
  getKanjiIndexByGrade,
  type KanjiGrade,
  type KanjiQuestType,
} from '@edu-quest/domain';
import { Hono } from 'hono';
import { jsxRenderer } from 'hono/jsx-renderer';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { BetterAuthService } from './application/auth/service';
import { resolveCurrentUser } from './application/session/current-user';
import type { ClockQuizSession } from './application/usecases/clock-quiz';
import {
  startClockQuizSession,
  submitClockAnswer,
} from './application/usecases/clock-quiz';
import type { KanjiQuizSession } from './application/usecases/kanji-quiz';
import {
  getKanjiSessionResult,
  startKanjiQuizSession,
  submitKanjiQuizAnswer,
} from './application/usecases/kanji-quiz';
import type { Env } from './env';
import type { AssetManifest } from './middlewares/asset-manifest';
import { assetManifest } from './middlewares/asset-manifest';
import { i18n } from './middlewares/i18n';
import { securityHeaders } from './middlewares/security-headers';
import { seoControl } from './middlewares/seo-control';
import { quiz } from './routes/apis/quiz';
import { ClockHome } from './routes/pages/clock-home';
import { ClockQuest } from './routes/pages/clock-quest';
import { ClockQuiz } from './routes/pages/clock-quiz';
import { ClockResults } from './routes/pages/clock-results';
import { ClockSelect } from './routes/pages/clock-select';
import { NotFoundPage, ServerErrorPage } from './routes/pages/error';
import { GameHome } from './routes/pages/game-home';
import {
  gameGradeLevels,
  getGameGradeById,
  getSudokuPresetsForGrade,
} from './routes/pages/game-presets';
import { GameQuest } from './routes/pages/game-quest';
import { GameSelect } from './routes/pages/game-select';
import {
  calculationTypes,
  type GradeId,
  gradeCalculationTypes,
  gradeLevels,
} from './routes/pages/grade-presets';
import { Home } from './routes/pages/home';
import { KanjiDetail } from './routes/pages/kanji-detail';
import {
  KanjiDictionary,
  createKanjiSearchIndexEntry,
} from './routes/pages/kanji-dictionary';
import { KanjiHome } from './routes/pages/kanji-home';
import { KanjiQuest } from './routes/pages/kanji-quest';
import { KanjiQuiz } from './routes/pages/kanji-quiz';
import { KanjiResults } from './routes/pages/kanji-results';
import { KanjiSelect } from './routes/pages/kanji-select';
import { Login } from './routes/pages/login';
import { MathHome } from './routes/pages/math-home';
import { MathPresetSelect } from './routes/pages/math-preset-select';
import { getMathPresetsForGradeAndCalc } from './routes/pages/math-presets';
import { MathQuest } from './routes/pages/math-quest';
import { MathSelect } from './routes/pages/math-select';
import { ParentsPage } from './routes/pages/parents';
import { Play } from './routes/pages/play';
import { Sudoku } from './routes/pages/sudoku';
import { SudokuSelect } from './routes/pages/sudoku-select';
import {
  createSchoolGradeParam,
  formatSchoolGradeLabel,
  parseSchoolGradeParam,
} from './routes/utils/school-grade';
import {
  getSelectedGrade,
  setSelectedGrade,
} from './routes/utils/grade-session';
import type { ReleaseInfo } from './types/release';
import { Document } from './views/layouts/document';

const GITHUB_RELEASE_ENDPOINT =
  'https://api.github.com/repos/tqer39/edu-quest/releases/latest';

type GitHubReleaseResponse = {
  tag_name?: string;
  published_at?: string;
};

type GlobalWithProcess = typeof globalThis & {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

const fetchLatestRelease = async (): Promise<ReleaseInfo | null> => {
  try {
    const maybeProcess = (globalThis as GlobalWithProcess).process;
    if (maybeProcess?.env?.VITEST !== undefined) {
      return null;
    }

    const cache = globalThis.caches?.default;
    const createCacheRequest = () => new Request(GITHUB_RELEASE_ENDPOINT);

    if (cache) {
      const cached = await cache.match(createCacheRequest());
      if (cached) {
        try {
          return (await cached.json()) as ReleaseInfo;
        } catch {
          await cache.delete(createCacheRequest());
        }
      }
    }

    const response = await fetch(GITHUB_RELEASE_ENDPOINT, {
      headers: {
        'User-Agent': 'edu-quest-worker',
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as GitHubReleaseResponse;

    if (!data.tag_name || !data.published_at) {
      return null;
    }

    const releaseInfo: ReleaseInfo = {
      version: data.tag_name,
      publishedAt: data.published_at,
    };

    if (cache) {
      const cacheResponse = new Response(JSON.stringify(releaseInfo), {
        headers: {
          'Cache-Control': 'public, max-age=900',
          'Content-Type': 'application/json',
        },
      });
      await cache.put(createCacheRequest(), cacheResponse);
    }

    return releaseInfo;
  } catch {
    return null;
  }
};

const app = new Hono<{
  Bindings: Env;
  Variables: { lang: 'ja' | 'en'; assetManifest: AssetManifest | null };
}>();

const isKanjiQuestType = (
  value: string | null | undefined
): value is KanjiQuestType => value === 'reading' || value === 'stroke-count';

const isGameGradeId = (value: string | null | undefined): value is GradeId =>
  typeof value === 'string' &&
  gameGradeLevels.some((level) => level.id === value);

app.use('*', logger());
app.use('*', securityHeaders());
app.use('*', prettyJSON());
app.use('*', i18n());
app.use('*', seoControl());
app.use('*', assetManifest());

// KanjiQuest favicon
app.get('/favicon-kanji.svg', (c) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#9B87D4" rx="15"/>
  <text x="50" y="70" font-size="60" text-anchor="middle" fill="white" font-family="sans-serif" font-weight="bold">漢</text>
</svg>`;
  return c.body(svg, 200, {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'public, max-age=86400',
  });
});

// GameQuest favicon
app.get('/favicon-game.svg', (c) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#5DB996" rx="15"/>
  <text x="50" y="70" font-size="60" text-anchor="middle" fill="white" font-family="Zen Kaku Gothic New, sans-serif" font-weight="bold">遊</text>
</svg>`;
  return c.body(svg, 200, {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'public, max-age=86400',
  });
});

// ClockQuest favicon
app.get('/favicon-clock.svg', (c) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#F5A85F" rx="15"/>
  <text x="50" y="70" font-size="60" text-anchor="middle" fill="white" font-family="Zen Kaku Gothic New, sans-serif" font-weight="bold">時</text>
</svg>`;
  return c.body(svg, 200, {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'public, max-age=86400',
  });
});

// Default favicon (no content)
app.get('/favicon.ico', (c) => c.body(null, 204));

// Robots.txt - dev環境では全てのクローラーをブロック
app.get('/robots.txt', (c) => {
  const environment = c.env.ENVIRONMENT;
  const isDev = environment === 'dev';

  if (isDev) {
    // dev環境: すべてのクローラーをブロック
    return c.text(
      `User-agent: *
Disallow: /

# Block all search engines and LLM crawlers
User-agent: Googlebot
Disallow: /

User-agent: Bingbot
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /`,
      200,
      { 'Content-Type': 'text/plain' }
    );
  } else {
    // production環境: クローリングを許可
    return c.text(
      `User-agent: *
Allow: /

# Block LLM crawlers in production
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

Sitemap: https://edu-quest.app/sitemap.xml`,
      200,
      { 'Content-Type': 'text/plain' }
    );
  }
});

// Simple health endpoint for手動確認
app.get('/hello', (c) => c.text('Hello World'));

// SSR renderer
app.use(
  '*',
  jsxRenderer(
    async (
      props: {
        title?: string;
        description?: string;
        favicon?: string;
        children?: any;
      },
      c
    ) => {
      const lang = c.get('lang') ?? 'ja';
      const environment = c.env.ENVIRONMENT;
      const manifest = c.get('assetManifest') ?? null;
      const releaseInfo =
        environment === 'dev' ? await fetchLatestRelease() : null;

      return (
        <Document
          lang={lang}
          title={props.title}
          description={props.description}
          favicon={props.favicon}
          environment={environment}
          assetManifest={manifest}
          releaseInfo={releaseInfo}
        >
          {props.children}
        </Document>
      );
    }
  )
);

// Public top
app.get('/', async (c) =>
  c.render(<Home currentUser={await resolveCurrentUser(c.env, c.req.raw)} />, {
    title: 'EduQuest | じぶんのペースで楽しく学習',
    description:
      '学年別の単元から選んで学習。匿名で始めて、記録を残したくなったら会員登録できる学習アプリです。',
  })
);

// Parents landing page
app.get('/parents', async (c) =>
  c.render(
    <ParentsPage currentUser={await resolveCurrentUser(c.env, c.req.raw)} />,
    {
      title: '保護者の方へ | EduQuestの安心・安全な学び',
      description:
        '安全性・教育的効果・導入のしやすさを紹介。小学生のお子さまが安心して学べるEduQuestの取り組みをお伝えします。',
    }
  )
);

// MathQuest routes
app.get('/math', async (c) => {
  // Cookie から前回選択した学年を取得
  const savedGradeId = getSelectedGrade(c);

  // 学年が保存されていれば、クエスト選択画面にリダイレクト
  if (savedGradeId) {
    const parsedGrade = parseSchoolGradeParam(savedGradeId);
    if (parsedGrade && parsedGrade.stage === '小学') {
      const gradeParam = createSchoolGradeParam(parsedGrade);
      return c.redirect(
        `/math/select?grade=${encodeURIComponent(gradeParam)}`,
        302
      );
    }
  }

  // 学年が保存されていない場合は、学年選択画面を表示
  return c.render(
    <MathHome currentUser={await resolveCurrentUser(c.env, c.req.raw)} />,
    {
      title: 'MathQuest | 学年を選んで練習をはじめよう',
      description:
        '最初に学年を選択して、ぴったりの算数ミッションを見つけましょう。',
    }
  );
});

app.get('/math/select', async (c) => {
  const gradeParam = c.req.query('grade');
  const parsedGrade = parseSchoolGradeParam(gradeParam);

  if (parsedGrade == null || parsedGrade.stage !== '小学') {
    return c.redirect('/math', 302);
  }

  const gradeIndex = parsedGrade.grade - 1;
  const selectedGrade = gradeLevels[gradeIndex];

  // 学年選択を Cookie に保存
  if (selectedGrade && !selectedGrade.disabled) {
    setSelectedGrade(c, selectedGrade.id);
  }

  if (!selectedGrade || selectedGrade.disabled) {
    return c.redirect('/math', 302);
  }

  const gradeLabel = formatSchoolGradeLabel(parsedGrade);

  return c.render(
    <MathSelect
      currentUser={await resolveCurrentUser(c.env, c.req.raw)}
      gradeId={selectedGrade.id}
      gradeStage={parsedGrade.stage}
    />,
    {
      title: `MathQuest - ${gradeLabel}`,
      description: `${gradeLabel}向けの学習方法を選んでください。`,
    }
  );
});

app.get('/math/quest', async (c) => {
  const gradeParam = c.req.query('grade');
  const parsedGrade = parseSchoolGradeParam(gradeParam);

  if (parsedGrade == null || parsedGrade.stage !== '小学') {
    return c.redirect('/math', 302);
  }

  const gradeIndex = parsedGrade.grade - 1;
  const selectedGrade = gradeLevels[gradeIndex];

  // 学年選択を Cookie に保存
  if (selectedGrade && !selectedGrade.disabled) {
    setSelectedGrade(c, selectedGrade.id);
  }

  if (!selectedGrade || selectedGrade.disabled) {
    return c.redirect('/math', 302);
  }

  const gradeLabel = formatSchoolGradeLabel(parsedGrade);

  return c.render(
    <MathQuest
      currentUser={await resolveCurrentUser(c.env, c.req.raw)}
      gradeId={selectedGrade.id}
      gradeStage={parsedGrade.stage}
    />,
    {
      title: `MathQuest - ${gradeLabel}`,
      description: `${gradeLabel}向けの算数クエストを選んでください。`,
    }
  );
});

app.get('/math/start', async (c) => {
  const gradeParam = c.req.query('grade');
  const calcParam = c.req.query('calc');
  let selectedGradeIndex = gradeLevels.findIndex(
    (grade) => grade.id === gradeParam
  );
  let selectedGrade =
    selectedGradeIndex >= 0 ? gradeLevels[selectedGradeIndex] : undefined;

  if (!selectedGrade && gradeParam) {
    const parsedSchoolGrade = parseSchoolGradeParam(gradeParam);
    if (parsedSchoolGrade && parsedSchoolGrade.stage === '小学') {
      selectedGradeIndex = parsedSchoolGrade.grade - 1;
      selectedGrade = gradeLevels[selectedGradeIndex];
    }
  }

  if (!selectedGrade && gradeParam) {
    const parsedGrade = Number(gradeParam);
    if (
      !Number.isNaN(parsedGrade) &&
      parsedGrade >= 1 &&
      parsedGrade <= gradeLevels.length
    ) {
      selectedGradeIndex = parsedGrade - 1;
      selectedGrade = gradeLevels[selectedGradeIndex];
    }
  }

  if (
    !selectedGrade ||
    selectedGrade.disabled ||
    selectedGradeIndex < 0 ||
    selectedGradeIndex >= gradeLevels.length
  ) {
    return c.redirect('/math', 302);
  }

  const gradeNumber = selectedGradeIndex + 1;
  const gradeQuery = createSchoolGradeParam({
    stage: '小学',
    grade: gradeNumber,
  });

  // 計算タイプを検証
  if (!calcParam) {
    return c.redirect(
      `/math/quest?grade=${encodeURIComponent(gradeQuery)}`,
      302
    );
  }

  const availableCalcIds =
    gradeCalculationTypes[
      selectedGrade.id as keyof typeof gradeCalculationTypes
    ] ?? [];

  if (!(availableCalcIds as readonly string[]).includes(calcParam)) {
    return c.redirect(
      `/math/quest?grade=${encodeURIComponent(gradeQuery)}`,
      302
    );
  }

  // 計算タイプの情報を取得
  const calcType = calculationTypes.find((c) => c.id === calcParam);
  if (!calcType) {
    return c.redirect(
      `/math/quest?grade=${encodeURIComponent(gradeQuery)}`,
      302
    );
  }

  // アイコンマッピング
  const calcIconMap: Record<string, string> = {
    'calc-add': '➕',
    'calc-sub': '➖',
    'calc-mul': '✖️',
    'calc-div': '➗',
    'calc-add-sub-mix': '➕➖',
    'calc-add-inverse': '🔄',
    'calc-sub-inverse': '🔄',
    'calc-mix': '🔢',
  };

  const calcTypeInfo = {
    id: calcType.id,
    label: calcType.label,
    emoji: calcIconMap[calcType.id] || '🔢',
  };

  // プリセットを取得
  const presets = getMathPresetsForGradeAndCalc(selectedGrade.id, calcParam);

  return c.render(
    <MathPresetSelect
      currentUser={await resolveCurrentUser(c.env, c.req.raw)}
      gradeId={selectedGrade.id}
      calcType={calcTypeInfo}
      presets={presets}
    />,
    {
      title: `MathQuest | ${calcType.label}のテーマを選択`,
      description: `${selectedGrade.label}向けの${calcType.label}テーマを選んで練習をはじめましょう。`,
    }
  );
});

app.get('/math/play', async (c) =>
  c.render(<Play currentUser={await resolveCurrentUser(c.env, c.req.raw)} />, {
    title: 'MathQuest | 練習セッション',
    description:
      '選択した学年の問題に挑戦します。カウントダウン後にテンキーで解答し、途中式を確認できます。',
  })
);

// GameQuest routes
app.get('/game', async (c) => {
  // Check if grade is saved in cookie
  const savedGradeId = getSelectedGrade(c);
  if (savedGradeId) {
    const parsedGrade = parseSchoolGradeParam(savedGradeId);
    if (parsedGrade && parsedGrade.stage === '小学') {
      const gradeParam = createSchoolGradeParam(parsedGrade);
      return c.redirect(
        `/game/select?grade=${encodeURIComponent(gradeParam)}`,
        302
      );
    }
  }

  return c.render(
    <GameHome currentUser={await resolveCurrentUser(c.env, c.req.raw)} />,
    {
      title: 'GameQuest | 学年からゲームを選ぼう',
      description:
        '学年に合わせた脳トレゲームに挑戦できます。まずは学年を選んで、ぴったりの数独プリセットを選択しよう。',
      favicon: '/favicon-game.svg',
    }
  );
});

app.get('/game/select', async (c) => {
  const gradeParam = c.req.query('grade');
  const parsedGrade = parseSchoolGradeParam(gradeParam);

  if (parsedGrade == null || parsedGrade.stage !== '小学') {
    return c.redirect('/game', 302);
  }

  const gradeId = createSchoolGradeParam(parsedGrade);
  if (!isGameGradeId(gradeId)) {
    return c.redirect('/game', 302);
  }

  const grade = getGameGradeById(gradeId);

  // Save grade selection to cookie
  setSelectedGrade(c, gradeId);

  return c.render(
    <GameSelect
      currentUser={await resolveCurrentUser(c.env, c.req.raw)}
      gradeId={gradeId}
    />,
    {
      title: `GameQuest | ${grade.label} - 学習方法選択`,
      description: `${grade.label}向けの学習方法を選択しましょう。`,
      favicon: '/favicon-game.svg',
    }
  );
});

app.get('/game/quest', async (c) => {
  const gradeParam = c.req.query('grade');
  const parsedGrade = parseSchoolGradeParam(gradeParam);

  if (parsedGrade == null || parsedGrade.stage !== '小学') {
    return c.redirect('/game', 302);
  }

  const gradeId = createSchoolGradeParam(parsedGrade);
  if (!isGameGradeId(gradeId)) {
    return c.redirect('/game', 302);
  }

  const grade = getGameGradeById(gradeId);

  // Save grade selection to cookie
  setSelectedGrade(c, gradeId);

  return c.render(
    <GameQuest
      currentUser={await resolveCurrentUser(c.env, c.req.raw)}
      gradeId={gradeId}
    />,
    {
      title: `GameQuest | ${grade.label} - ゲーム選択`,
      description: `${grade.label}向けの数独パズルに挑戦しよう。${grade.highlight}がおすすめです。`,
      favicon: '/favicon-game.svg',
    }
  );
});

// Sudoku preset selection page
app.get('/game/sudoku', async (c) => {
  const gradeParam = c.req.query('grade');
  const gradeId: GradeId = isGameGradeId(gradeParam) ? gradeParam : 'grade-1';
  const grade = getGameGradeById(gradeId);

  return c.render(
    <SudokuSelect
      currentUser={await resolveCurrentUser(c.env, c.req.raw)}
      grade={grade}
      presets={getSudokuPresetsForGrade(gradeId)}
    />,
    {
      title: `GameQuest | 数独（${grade.label}向け）`,
      description: `${grade.label}に合わせた難易度プリセットで数独に挑戦しよう。`,
      favicon: '/favicon-game.svg',
    }
  );
});

// Sudoku gameplay page
app.get('/game/sudoku/play', async (c) => {
  const gradeParam = c.req.query('grade');
  const sizeParam = c.req.query('size');
  const difficultyParam = c.req.query('difficulty');

  const gradeId: GradeId = isGameGradeId(gradeParam) ? gradeParam : 'grade-1';
  const grade = getGameGradeById(gradeId);
  const size = sizeParam ? Number(sizeParam) : 4;
  const difficulty = difficultyParam || 'easy';

  return c.render(
    <Sudoku
      currentUser={await resolveCurrentUser(c.env, c.req.raw)}
      grade={grade}
      size={size}
      difficulty={difficulty}
    />,
    {
      title: `GameQuest | 数独 - ${grade.label}`,
      description: `数独パズルで集中力を鍛えよう。`,
      favicon: '/favicon-game.svg',
    }
  );
});

// KanjiQuest routes
app.get('/kanji', async (c) => {
  // Check if grade is saved in cookie
  const savedGradeId = getSelectedGrade(c);
  if (savedGradeId) {
    const parsedGrade = parseSchoolGradeParam(savedGradeId);
    if (parsedGrade && parsedGrade.stage === '小学') {
      const gradeParam = createSchoolGradeParam(parsedGrade);
      return c.redirect(
        `/kanji/select?grade=${encodeURIComponent(gradeParam)}`,
        302
      );
    }
  }

  return c.render(
    <KanjiHome currentUser={await resolveCurrentUser(c.env, c.req.raw)} />,
    {
      title: 'KanjiQuest | 漢字の読み方をマスターしよう',
      description: '小学校で習う漢字の読み方を練習。楽しく漢字を覚えられます。',
      favicon: '/favicon-kanji.svg',
    }
  );
});

app.get('/kanji/dictionary', async (c) => {
  const gradeParam = c.req.query('grade');
  const parsedGrade = parseSchoolGradeParam(gradeParam);
  const candidateGrade =
    parsedGrade && parsedGrade.stage === '小学'
      ? (parsedGrade.grade as KanjiGrade)
      : 1;

  const availableGrades: KanjiGrade[] = [1, 2];
  const preferredGrade = availableGrades.includes(candidateGrade)
    ? candidateGrade
    : null;
  const grade = preferredGrade ?? 1;
  const gradeLabel = formatSchoolGradeLabel({ stage: '小学', grade });

  // Load lightweight index and search data
  const indexEntries = availableGrades.flatMap((g) =>
    getKanjiIndexByGrade(g)
  );
  const searchIndex = availableGrades.flatMap((g) =>
    getKanjiDictionaryByGrade(g).map((kanji) =>
      createKanjiSearchIndexEntry(kanji)
    )
  );

  return c.render(
    <KanjiDictionary
      currentUser={await resolveCurrentUser(c.env, c.req.raw)}
      grade={grade}
      entries={indexEntries}
      searchIndex={searchIndex}
    />,
    {
      title: `KanjiQuest | ${gradeLabel}の漢字辞書`,
      description: `${gradeLabel}で学ぶ漢字の読み方・意味・例をまとめた辞書ページです。`,
      favicon: '/favicon-kanji.svg',
    }
  );
});

app.get('/kanji/dictionary/:id', async (c) => {
  const kanjiId = c.req.param('id');
  const gradeParam = c.req.query('grade');
  const parsedGrade = parseSchoolGradeParam(gradeParam);
  const candidateGrade =
    parsedGrade && parsedGrade.stage === '小学'
      ? (parsedGrade.grade as KanjiGrade)
      : 1;

  const availableGrades: KanjiGrade[] = [1, 2];
  const preferredGrade = availableGrades.includes(candidateGrade)
    ? candidateGrade
    : null;

  const kanji = getKanjiByUnicode(kanjiId);

  if (!kanji) {
    return c.notFound();
  }

  const fallbackGrade = availableGrades.includes(kanji.grade as KanjiGrade)
    ? (kanji.grade as KanjiGrade)
    : 1;
  const grade = preferredGrade ?? fallbackGrade;

  const gradeLabel = formatSchoolGradeLabel({ stage: '小学', grade });

  return c.render(
    <KanjiDetail
      currentUser={await resolveCurrentUser(c.env, c.req.raw)}
      grade={grade}
      kanji={kanji}
    />,
    {
      title: `${kanji.character} - ${gradeLabel}の漢字 | KanjiQuest`,
      description: `${kanji.character}（${kanji.meanings.join(
        '、'
      )}）の読み方・意味・例を確認できます。`,
      favicon: '/favicon-kanji.svg',
    }
  );
});

// KanjiQuest: クエストタイプ選択画面
app.get('/kanji/select', async (c) => {
  const gradeParam = c.req.query('grade');
  const parsedGrade = parseSchoolGradeParam(gradeParam);

  if (parsedGrade == null || parsedGrade.stage !== '小学') {
    return c.redirect('/kanji', 302);
  }

  const grade = parsedGrade.grade as KanjiGrade;
  const gradeLabel = formatSchoolGradeLabel(parsedGrade);

  // Save grade selection to cookie
  const gradeId = createSchoolGradeParam(parsedGrade);
  setSelectedGrade(c, gradeId);

  return c.render(
    <KanjiSelect
      currentUser={await resolveCurrentUser(c.env, c.req.raw)}
      grade={grade}
      gradeStage={parsedGrade.stage}
    />,
    {
      title: `KanjiQuest - ${gradeLabel}`,
      description: `${gradeLabel}向けの学習方法を選んでください。`,
      favicon: '/favicon-kanji.svg',
    }
  );
});

app.get('/kanji/quest', async (c) => {
  const gradeParam = c.req.query('grade');
  const parsedGrade = parseSchoolGradeParam(gradeParam);

  if (parsedGrade == null || parsedGrade.stage !== '小学') {
    return c.redirect('/kanji', 302);
  }

  const grade = parsedGrade.grade as KanjiGrade;
  const gradeLabel = formatSchoolGradeLabel(parsedGrade);

  // Save grade selection to cookie
  const gradeId = createSchoolGradeParam(parsedGrade);
  setSelectedGrade(c, gradeId);

  return c.render(
    <KanjiQuest
      currentUser={await resolveCurrentUser(c.env, c.req.raw)}
      grade={grade}
      gradeStage={parsedGrade.stage}
    />,
    {
      title: `KanjiQuest - ${gradeLabel}`,
      description: `${gradeLabel}向けのクエストタイプを選んでください。`,
      favicon: '/favicon-kanji.svg',
    }
  );
});

// KanjiQuest: 学年選択してクイズ開始
app.get('/kanji/start', async (c) => {
  const gradeParam = c.req.query('grade');
  const questTypeParam = c.req.query('questType');
  const grade = Number(gradeParam) as KanjiGrade;

  if (questTypeParam && !isKanjiQuestType(questTypeParam)) {
    const gradeQuery = createSchoolGradeParam({ stage: '小学', grade });
    return c.redirect(`/kanji/quest?grade=${gradeQuery}`, 302);
  }

  const questType: KanjiQuestType = isKanjiQuestType(questTypeParam)
    ? questTypeParam
    : 'reading';

  // 学年のバリデーション
  if (!grade || grade < 1 || grade > 6) {
    return c.redirect('/kanji', 302);
  }

  // クイズセッションを開始（10問固定）
  const session = startKanjiQuizSession(grade, 10, questType);

  // セッションIDを生成
  const sessionId = crypto.randomUUID();

  // KVにセッション情報を保存（30分TTL）
  await c.env.KV_QUIZ_SESSION.put(
    `kanji:${sessionId}`,
    JSON.stringify(session),
    { expirationTtl: 1800 }
  );

  // セッションIDのみをHttpOnly Cookieに保存
  const response = c.redirect('/kanji/quiz', 302);
  response.headers.append(
    'Set-Cookie',
    `kanji_session_id=${sessionId}; Path=/; Max-Age=1800; HttpOnly; SameSite=Lax; Secure`
  );

  return response;
});

// KanjiQuest: クイズ画面（現在の問題を表示）
app.get('/kanji/quiz', async (c) => {
  const cookies = c.req.header('Cookie') ?? '';
  const sessionMatch = cookies.match(/kanji_session_id=([^;]+)/);

  if (!sessionMatch) {
    return c.redirect('/kanji', 302);
  }

  const sessionId = sessionMatch[1];

  try {
    // KVからセッション情報を取得
    const sessionData = await c.env.KV_QUIZ_SESSION.get(`kanji:${sessionId}`);

    if (!sessionData) {
      return c.redirect('/kanji', 302);
    }

    const session: KanjiQuizSession = JSON.parse(sessionData);

    if (!session.currentQuestion) {
      return c.redirect('/kanji', 302);
    }

    return c.render(
      <KanjiQuiz
        currentUser={await resolveCurrentUser(c.env, c.req.raw)}
        question={session.currentQuestion}
        questionNumber={session.quiz.index + 1}
        totalQuestions={session.quiz.questions.length}
        score={session.quiz.correct}
        grade={session.quiz.config.grade}
      />,
      {
        title: `KanjiQuest | ${session.quiz.config.grade}年生`,
        description: '漢字の読み方クイズに挑戦中',
      }
    );
  } catch (error) {
    console.error('Failed to load kanji quiz session:', error);
    return c.redirect('/kanji', 302);
  }
});

app.post('/kanji/quit', async (c) => {
  const cookies = c.req.header('Cookie') ?? '';
  const sessionMatch = cookies.match(/kanji_session_id=([^;]+)/);

  if (sessionMatch) {
    const sessionId = sessionMatch[1];

    try {
      await c.env.KV_QUIZ_SESSION.delete(`kanji:${sessionId}`);
    } catch (error) {
      console.error('Failed to delete kanji quiz session:', error);
    }
  }

  const body = await c.req.parseBody();
  const rawGrade = body.grade;
  const grade = typeof rawGrade === 'string' ? Number(rawGrade) : NaN;
  const isValidGrade = Number.isInteger(grade) && grade >= 1 && grade <= 6;
  const redirectUrl = isValidGrade ? `/kanji/select?grade=${grade}` : '/kanji';

  const response = c.redirect(redirectUrl, 302);
  response.headers.append(
    'Set-Cookie',
    'kanji_session_id=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure'
  );
  response.headers.append(
    'Set-Cookie',
    'kanji_result_id=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure'
  );

  return response;
});

// KanjiQuest: 回答を送信
app.post('/kanji/quiz', async (c) => {
  const cookies = c.req.header('Cookie') ?? '';
  const sessionMatch = cookies.match(/kanji_session_id=([^;]+)/);

  if (!sessionMatch) {
    return c.redirect('/kanji', 302);
  }

  const sessionId = sessionMatch[1];

  try {
    // KVからセッション情報を取得
    const sessionData = await c.env.KV_QUIZ_SESSION.get(`kanji:${sessionId}`);

    if (!sessionData) {
      return c.redirect('/kanji', 302);
    }

    const session: KanjiQuizSession = JSON.parse(sessionData);
    const body = await c.req.parseBody();
    const answer = String(body.answer);

    // 回答をチェック
    const result = submitKanjiQuizAnswer(session, answer);

    // クイズが終了した場合
    if (!result.nextSession) {
      const quizResult = getKanjiSessionResult(session);

      // 結果用のセッションIDを生成してKVに保存
      const resultId = crypto.randomUUID();
      await c.env.KV_QUIZ_SESSION.put(
        `kanji_result:${resultId}`,
        JSON.stringify(quizResult),
        { expirationTtl: 300 } // 5分
      );

      // クイズセッションを削除
      await c.env.KV_QUIZ_SESSION.delete(`kanji:${sessionId}`);

      // 結果ページにリダイレクト
      const response = c.redirect('/kanji/results', 302);
      response.headers.append(
        'Set-Cookie',
        `kanji_result_id=${resultId}; Path=/; Max-Age=300; HttpOnly; SameSite=Lax; Secure`
      );
      response.headers.append(
        'Set-Cookie',
        'kanji_session_id=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure'
      );
      return response;
    }

    // 次の問題へ - KVのセッションを更新
    await c.env.KV_QUIZ_SESSION.put(
      `kanji:${sessionId}`,
      JSON.stringify(result.nextSession),
      { expirationTtl: 1800 }
    );

    return c.redirect('/kanji/quiz', 302);
  } catch (error) {
    console.error('Failed to process kanji quiz answer:', error);
    return c.redirect('/kanji', 302);
  }
});

// KanjiQuest: 結果画面
app.get('/kanji/results', async (c) => {
  const cookies = c.req.header('Cookie') ?? '';
  const resultMatch = cookies.match(/kanji_result_id=([^;]+)/);

  if (!resultMatch) {
    return c.redirect('/kanji', 302);
  }

  const resultId = resultMatch[1];

  try {
    // KVから結果情報を取得
    const resultData = await c.env.KV_QUIZ_SESSION.get(
      `kanji_result:${resultId}`
    );

    if (!resultData) {
      return c.redirect('/kanji', 302);
    }

    const result: ReturnType<typeof getKanjiSessionResult> =
      JSON.parse(resultData);

    // TODO: 結果に学年情報も含めるように改善
    const grade = 1;

    return c.render(
      <KanjiResults
        currentUser={await resolveCurrentUser(c.env, c.req.raw)}
        score={result.correctAnswers}
        total={result.totalQuestions}
        grade={grade}
        message={result.message}
      />,
      {
        title: 'KanjiQuest | 結果',
        description: `漢字クイズの結果: ${result.score}点`,
      }
    );
  } catch (error) {
    console.error('Failed to parse kanji quiz result:', error);
    return c.redirect('/kanji', 302);
  }
});

// ClockQuest routes
app.get('/clock', async (c) => {
  // Check if grade is saved in cookie
  const savedGradeId = getSelectedGrade(c);
  if (savedGradeId) {
    const parsedGrade = parseSchoolGradeParam(savedGradeId);
    if (parsedGrade && parsedGrade.stage === '小学') {
      const gradeParam = createSchoolGradeParam(parsedGrade);
      return c.redirect(
        `/clock/select?grade=${encodeURIComponent(gradeParam)}`,
        302
      );
    }
  }

  return c.render(
    <ClockHome currentUser={await resolveCurrentUser(c.env, c.req.raw)} />,
    {
      title: 'ClockQuest | 時計の読み方をマスターしよう',
      description:
        'アナログ時計とデジタル時計の読み方を練習。楽しく時間の概念を学べます。',
      favicon: '/favicon-clock.svg',
    }
  );
});

app.get('/clock/select', async (c) => {
  const gradeParam = c.req.query('grade');
  const parsedGrade = parseSchoolGradeParam(gradeParam);

  if (parsedGrade == null || parsedGrade.stage !== '小学') {
    return c.redirect('/clock', 302);
  }

  const grade = parsedGrade.grade as ClockGrade;

  // Save grade selection to cookie
  const gradeId = createSchoolGradeParam(parsedGrade);
  setSelectedGrade(c, gradeId);

  return c.render(
    <ClockSelect
      currentUser={await resolveCurrentUser(c.env, c.req.raw)}
      grade={grade}
    />,
    {
      title: `ClockQuest | 小学${grade}年生の学習方法選択`,
      description: `小学${grade}年生向けの学習方法を選択しましょう。`,
      favicon: '/favicon-clock.svg',
    }
  );
});

app.get('/clock/quest', async (c) => {
  const gradeParam = c.req.query('grade');
  const parsedGrade = parseSchoolGradeParam(gradeParam);

  if (parsedGrade == null || parsedGrade.stage !== '小学') {
    return c.redirect('/clock', 302);
  }

  const grade = parsedGrade.grade as ClockGrade;

  // Save grade selection to cookie
  const gradeId = createSchoolGradeParam(parsedGrade);
  setSelectedGrade(c, gradeId);

  return c.render(
    <ClockQuest
      currentUser={await resolveCurrentUser(c.env, c.req.raw)}
      grade={grade}
    />,
    {
      title: `ClockQuest | 小学${grade}年生のクエスト選択`,
      description: `小学${grade}年生向けの時計クエストを選択しましょう。`,
      favicon: '/favicon-clock.svg',
    }
  );
});

const clockQuestTypeConfig: Record<
  'reading' | 'conversion' | 'arithmetic' | 'variety',
  { difficulty: ClockDifficulty }
> = {
  reading: { difficulty: 1 as ClockDifficulty },
  conversion: { difficulty: 2 as ClockDifficulty },
  arithmetic: { difficulty: 4 as ClockDifficulty },
  variety: { difficulty: 5 as ClockDifficulty },
};

type ClockQuestType = keyof typeof clockQuestTypeConfig;

// ClockQuest: 学年とクエスト種別を選択してクイズ開始
app.get('/clock/start', async (c) => {
  const gradeParam = c.req.query('grade');
  const difficultyParam = c.req.query('difficulty');
  const typeParam = c.req.query('type');

  // elem-1 形式から数字を抽出
  const gradeMatch = gradeParam?.match(/^elem-(\d)$/);
  const grade = gradeMatch ? (Number(gradeMatch[1]) as ClockGrade) : null;
  let difficulty: ClockDifficulty | null = null;

  if (!grade || grade < 1 || grade > 6) {
    return c.redirect('/clock', 302);
  }

  if (typeParam) {
    const questType = typeParam as ClockQuestType;
    const questConfig = clockQuestTypeConfig[questType];
    if (questConfig) {
      difficulty = questConfig.difficulty;
    }
  }

  if (!difficulty && difficultyParam) {
    const parsed = Number(difficultyParam) as ClockDifficulty;
    if (parsed >= 1 && parsed <= 5) {
      difficulty = parsed;
    }
  }

  if (!difficulty) {
    return c.redirect(`/clock/select?grade=${grade}`, 302);
  }

  // クイズセッションを開始（10問固定）
  const session = startClockQuizSession(grade, difficulty, 10);

  // セッション情報をクッキーに保存
  const maxAge = 60 * 30; // 30分
  const response = c.redirect('/clock/quiz', 302);
  response.headers.append(
    'Set-Cookie',
    `clock_quiz_session=${encodeURIComponent(
      JSON.stringify(session)
    )}; Path=/; Max-Age=${maxAge}; SameSite=Lax; HttpOnly; Secure`
  );

  return response;
});

// ClockQuest: クイズ画面（現在の問題を表示）
app.get('/clock/quiz', async (c) => {
  const cookies = c.req.header('Cookie') ?? '';
  const sessionMatch = cookies.match(/clock_quiz_session=([^;]+)/);

  if (!sessionMatch) {
    return c.redirect('/clock', 302);
  }

  try {
    const session: ClockQuizSession = JSON.parse(
      decodeURIComponent(sessionMatch[1])
    );

    return c.render(
      <ClockQuiz
        currentUser={await resolveCurrentUser(c.env, c.req.raw)}
        hours={session.currentQuestion.hours}
        minutes={session.currentQuestion.minutes}
        questionNumber={session.quiz.index + 1}
        totalQuestions={session.quiz.config.total}
        score={session.quiz.correct}
        difficulty={session.quiz.config.difficulty}
        grade={session.quiz.config.grade}
      />,
      {
        title: `ClockQuest | ${session.quiz.config.grade}年生 レベル${session.quiz.config.difficulty}`,
        description: '時計の読み方クイズに挑戦中',
        favicon: '/favicon-clock.svg',
      }
    );
  } catch (error) {
    console.error('Failed to parse clock quiz session:', error);
    return c.redirect('/clock', 302);
  }
});

// ClockQuest: 回答を送信
app.post('/clock/quiz', async (c) => {
  const cookies = c.req.header('Cookie') ?? '';
  const sessionMatch = cookies.match(/clock_quiz_session=([^;]+)/);

  if (!sessionMatch) {
    return c.redirect('/clock', 302);
  }

  try {
    const session: ClockQuizSession = JSON.parse(
      decodeURIComponent(sessionMatch[1])
    );
    const body = await c.req.parseBody();

    const hours = Number(body.hours);
    const minutes = Number(body.minutes);

    // 回答をチェック
    const result = submitClockAnswer(session, { hours, minutes });

    // クイズ終了時は結果画面へ
    if (!result.nextSession) {
      const maxAge = 60 * 30; // 30分
      const response = c.redirect('/clock/results', 302);
      // 結果情報をクッキーに保存
      response.headers.append(
        'Set-Cookie',
        `clock_quiz_result=${encodeURIComponent(
          JSON.stringify({
            score: session.quiz.correct,
            total: session.quiz.config.total,
            difficulty: session.quiz.config.difficulty,
            grade: session.quiz.config.grade,
          })
        )}; Path=/; Max-Age=${maxAge}; SameSite=Lax; HttpOnly; Secure`
      );
      // セッションクッキーをクリア
      response.headers.append(
        'Set-Cookie',
        'clock_quiz_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure'
      );
      return response;
    }

    // 次の問題へ
    const maxAge = 60 * 30; // 30分
    const response = c.redirect('/clock/quiz', 302);
    response.headers.append(
      'Set-Cookie',
      `clock_quiz_session=${encodeURIComponent(
        JSON.stringify(result.nextSession)
      )}; Path=/; Max-Age=${maxAge}; SameSite=Lax; HttpOnly; Secure`
    );
    return response;
  } catch (error) {
    console.error('Failed to process clock quiz answer:', error);
    return c.redirect('/clock', 302);
  }
});

// ClockQuest: 結果画面
app.get('/clock/results', async (c) => {
  const cookies = c.req.header('Cookie') ?? '';
  const resultMatch = cookies.match(/clock_quiz_result=([^;]+)/);

  if (!resultMatch) {
    return c.redirect('/clock', 302);
  }

  try {
    const result: {
      score: number;
      total: number;
      difficulty: ClockDifficulty;
      grade: ClockGrade;
    } = JSON.parse(decodeURIComponent(resultMatch[1]));

    return c.render(
      <ClockResults
        currentUser={await resolveCurrentUser(c.env, c.req.raw)}
        score={result.score}
        total={result.total}
        difficulty={result.difficulty}
        grade={result.grade}
      />,
      {
        title: `ClockQuest | ${result.grade}年生の結果`,
        description: `${result.score}/${result.total}問正解しました！`,
        favicon: '/favicon-clock.svg',
      }
    );
  } catch (error) {
    console.error('Failed to parse clock quiz result:', error);
    return c.redirect('/clock', 302);
  }
});

// Backward compatibility: redirect old routes to /math/*
app.get('/start', (c) => c.redirect('/math', 301));
app.get('/play', (c) => c.redirect('/math/play', 301));

app.get('/sudoku', (c) => {
  const gradeParam = c.req.query('grade');
  const suffix = gradeParam ? `?grade=${encodeURIComponent(gradeParam)}` : '';
  return c.redirect(`/game/sudoku${suffix}`, 301);
});

app.get('/auth/guest-login', (c) => {
  const profileParam = c.req.query('profile');
  const profileIndex = Number(profileParam);
  const index =
    Number.isInteger(profileIndex) && profileIndex >= 0 ? profileIndex : 0;
  const maxAge = 60 * 60 * 24 * 30;
  const response = c.redirect('/', 302);
  response.headers.append(
    'Set-Cookie',
    `mq_guest=1; Path=/; Max-Age=${maxAge}; SameSite=Lax; HttpOnly; Secure`
  );
  response.headers.append(
    'Set-Cookie',
    `mq_guest_profile=${index}; Path=/; Max-Age=${maxAge}; SameSite=Lax; HttpOnly; Secure`
  );
  return response;
});

app.get('/auth/login', (c) => {
  const sent = c.req.query('sent');
  const error = c.req.query('error');
  const email = c.req.query('email') ?? undefined;
  const redirect = c.req.query('redirect') ?? undefined;

  const status: 'idle' | 'sent' | 'error' = error
    ? 'error'
    : sent === '1'
      ? 'sent'
      : 'idle';
  const message = error
    ? error
    : sent === '1'
      ? 'ログインリンクをメールで送信しました。届いたメールのリンクからログインを完了してください。'
      : undefined;

  return c.render(
    <Login
      status={status}
      message={message}
      email={email}
      redirect={redirect}
    />,
    {
      title: 'EduQuest | ログイン',
      description:
        'メールアドレス宛にログインリンクを送信して、学習記録をクラウドに同期できます。',
    }
  );
});

app.post('/auth/login/email', async (c) => {
  const authService = new BetterAuthService(c.env);
  const body = await c.req.parseBody();
  const emailValue = body.email;
  const email = typeof emailValue === 'string' ? emailValue : '';
  const redirect = c.req.query('redirect');

  try {
    await authService.requestMagicLink({
      email,
      redirectTo: redirect ?? null,
    });
    const redirectUrl = new URL('/auth/login', c.req.url);
    redirectUrl.searchParams.set('sent', '1');
    redirectUrl.searchParams.set('email', email);
    if (redirect) redirectUrl.searchParams.set('redirect', redirect);
    return c.redirect(redirectUrl.toString(), 303);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'ログインリンクの送信に失敗しました';
    const redirectUrl = new URL('/auth/login', c.req.url);
    redirectUrl.searchParams.set('error', message);
    redirectUrl.searchParams.set('email', email);
    if (redirect) redirectUrl.searchParams.set('redirect', redirect);
    return c.redirect(redirectUrl.toString(), 303);
  }
});

app.get('/auth/callback', async (c) => {
  const token = c.req.query('token');
  const email = c.req.query('email');
  const redirect = c.req.query('redirect');

  if (!token || !email) {
    return c.redirect(
      `/auth/login?error=${encodeURIComponent('ログインリンクが無効です')}`,
      302
    );
  }

  const authService = new BetterAuthService(c.env);
  try {
    const result = await authService.verifyMagicLink(token, email);
    if (!result) {
      return c.redirect(
        `/auth/login?error=${encodeURIComponent(
          'ログインリンクの有効期限が切れているか、すでに使用されています'
        )}`,
        302
      );
    }

    const target = redirect ?? result.redirectTo ?? '/';
    const response = c.redirect(target, 302);
    response.headers.append(
      'Set-Cookie',
      authService.createSessionCookie(result.sessionToken)
    );
    for (const cookie of authService.clearGuestCookies()) {
      response.headers.append('Set-Cookie', cookie);
    }
    return response;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'ログイン処理中にエラーが発生しました';
    return c.redirect(`/auth/login?error=${encodeURIComponent(message)}`, 302);
  }
});

app.get('/auth/logout', async (c) => {
  const authService = new BetterAuthService(c.env);
  const sessionToken = authService.extractSessionFromRequest(c.req.raw);
  if (sessionToken) {
    await authService.invalidateSession(sessionToken);
  }
  const response = c.redirect('/', 302);
  response.headers.append('Set-Cookie', authService.clearSessionCookie());
  for (const cookie of authService.clearGuestCookies()) {
    response.headers.append('Set-Cookie', cookie);
  }
  return response;
});

// BFF API
app.route('/apis/quiz', quiz);

app.notFound((c) => {
  c.status(404);
  return c.render(<NotFoundPage />, {
    title: 'ページが見つかりません',
    description:
      'お探しのページが見つかりませんでした。URL をご確認のうえ再度お試しください。',
  });
});

app.onError((error, c) => {
  const requestId = crypto.randomUUID();
  console.error(`Unhandled error [${requestId}]`, error);
  c.status(500);
  return c.render(<ServerErrorPage requestId={requestId} />, {
    title: 'エラーが発生しました',
    description:
      '申し訳ありません。ページの表示中に問題が発生しました。時間をおいて再度お試しください。',
  });
});

export default app;
