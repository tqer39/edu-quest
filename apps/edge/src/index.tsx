import { Hono } from 'hono';
import { jsxRenderer } from 'hono/jsx-renderer';
import { secureHeaders } from 'hono/secure-headers';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import type { Env } from './env';
import { i18n } from './middlewares/i18n';
import { seoControl } from './middlewares/seo-control';
import { quiz } from './routes/apis/quiz';
import { Home } from './routes/pages/home';
import { ClockHome } from './routes/pages/clock-home';
import { ClockQuiz } from './routes/pages/clock-quiz';
import { ClockResults } from './routes/pages/clock-results';
import { KanjiHome } from './routes/pages/kanji-home';
import { KanjiQuiz } from './routes/pages/kanji-quiz';
import { KanjiResults } from './routes/pages/kanji-results';
import { Start } from './routes/pages/start';
import { Play } from './routes/pages/play';
import { Sudoku } from './routes/pages/sudoku';
import { Login } from './routes/pages/login';
import { BetterAuthService } from './application/auth/service';
import { resolveCurrentUser } from './application/session/current-user';
import {
  startClockQuizSession,
  submitClockAnswer,
} from './application/usecases/clock-quiz';
import type { ClockQuizSession } from './application/usecases/clock-quiz';
import {
  startKanjiQuizSession,
  submitKanjiQuizAnswer,
  getKanjiSessionResult,
} from './application/usecases/kanji-quiz';
import type { KanjiQuizSession } from './application/usecases/kanji-quiz';
import type { ClockDifficulty, KanjiGrade } from '@edu-quest/domain';
import { Document } from './views/layouts/document';

const app = new Hono<{ Bindings: Env; Variables: { lang: 'ja' | 'en' } }>();

app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', prettyJSON());
app.use('*', i18n());
app.use('*', seoControl());

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
  jsxRenderer<{ title?: string; description?: string; favicon?: string }>(
    (props, c) => {
      const lang = c.get('lang') ?? 'ja';
      const environment = c.env.ENVIRONMENT;
      return (
        <Document
          lang={lang}
          title={props.title}
          description={props.description}
          favicon={props.favicon}
          environment={environment}
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

// MathQuest routes
app.get('/math', (c) => c.redirect('/math/start', 302));

app.get('/math/start', async (c) =>
  c.render(<Start currentUser={await resolveCurrentUser(c.env, c.req.raw)} />, {
    title: 'MathQuest | 設定ウィザード',
    description:
      '学年・単元とプレイ設定をまとめて選択し、集中モードで算数ミッションを始めましょう。',
  })
);

app.get('/math/play', async (c) =>
  c.render(<Play currentUser={await resolveCurrentUser(c.env, c.req.raw)} />, {
    title: 'MathQuest | 練習セッション',
    description:
      '選択した学年の問題に挑戦します。カウントダウン後にテンキーで解答し、途中式を確認できます。',
  })
);

// KanjiQuest routes
app.get('/kanji', async (c) =>
  c.render(
    <KanjiHome currentUser={await resolveCurrentUser(c.env, c.req.raw)} />,
    {
      title: 'KanjiQuest | 漢字の読み方をマスターしよう',
      description: '小学校で習う漢字の読み方を練習。楽しく漢字を覚えられます。',
      favicon: '/favicon-kanji.svg',
    }
  )
);

// KanjiQuest: クエストタイプ選択画面
app.get('/kanji/select', async (c) => {
  const gradeParam = c.req.query('grade');
  const grade = Number(gradeParam) as KanjiGrade;

  // 学年のバリデーション
  if (!grade || grade < 1 || grade > 6) {
    return c.redirect('/kanji', 302);
  }

  const { KanjiSelect } = await import('./routes/pages/kanji-select');

  return c.html(
    <Document
      title="KanjiQuest - クエスト選択"
      description="学習したいクエストタイプを選んでください。"
    >
      <KanjiSelect
        currentUser={await resolveCurrentUser(c.env, c.req.raw)}
        grade={grade}
      />
    </Document>
  );
});

// KanjiQuest: 学年選択してクイズ開始
app.get('/kanji/start', async (c) => {
  const gradeParam = c.req.query('grade');
  const questTypeParam = c.req.query('questType');
  const grade = Number(gradeParam) as KanjiGrade;
  const questType = (questTypeParam as KanjiQuestType) || 'reading';

  // 学年のバリデーション
  if (!grade || grade < 1 || grade > 6) {
    return c.redirect('/kanji', 302);
  }

  // クエストタイプのバリデーション
  if (questType !== 'reading' && questType !== 'stroke-count') {
    return c.redirect(`/kanji/select?grade=${grade}`, 302);
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
    `kanji_session_id=${sessionId}; Path=/; Max-Age=1800; HttpOnly; SameSite=Lax`
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
        `kanji_result_id=${resultId}; Path=/; Max-Age=300; HttpOnly; SameSite=Lax`
      );
      response.headers.append(
        'Set-Cookie',
        'kanji_session_id=; Path=/; Max-Age=0'
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
app.get('/clock', async (c) =>
  c.render(
    <ClockHome currentUser={await resolveCurrentUser(c.env, c.req.raw)} />,
    {
      title: 'ClockQuest | 時計の読み方をマスターしよう',
      description:
        'アナログ時計とデジタル時計の読み方を練習。楽しく時間の概念を学べます。',
    }
  )
);

// ClockQuest: 難易度選択してクイズ開始
app.get('/clock/start', async (c) => {
  const difficultyParam = c.req.query('difficulty');
  const difficulty = Number(difficultyParam) as ClockDifficulty;

  // 難易度のバリデーション
  if (!difficulty || difficulty < 1 || difficulty > 5) {
    return c.redirect('/clock', 302);
  }

  // クイズセッションを開始（10問固定）
  const session = startClockQuizSession(difficulty, 10);

  // セッション情報をクッキーに保存
  const maxAge = 60 * 30; // 30分
  const response = c.redirect('/clock/quiz', 302);
  response.headers.append(
    'Set-Cookie',
    `clock_quiz_session=${encodeURIComponent(
      JSON.stringify(session)
    )}; Path=/; Max-Age=${maxAge}; SameSite=Lax; HttpOnly`
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
      />,
      {
        title: `ClockQuest | レベル${session.quiz.config.difficulty}`,
        description: '時計の読み方クイズに挑戦中',
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
          })
        )}; Path=/; Max-Age=${maxAge}; SameSite=Lax; HttpOnly`
      );
      // セッションクッキーをクリア
      response.headers.append(
        'Set-Cookie',
        'clock_quiz_session=; Path=/; Max-Age=0'
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
      )}; Path=/; Max-Age=${maxAge}; SameSite=Lax; HttpOnly`
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
    } = JSON.parse(decodeURIComponent(resultMatch[1]));

    return c.render(
      <ClockResults
        currentUser={await resolveCurrentUser(c.env, c.req.raw)}
        score={result.score}
        total={result.total}
        difficulty={result.difficulty}
      />,
      {
        title: `ClockQuest | 結果発表`,
        description: `${result.score}/${result.total}問正解しました！`,
      }
    );
  } catch (error) {
    console.error('Failed to parse clock quiz result:', error);
    return c.redirect('/clock', 302);
  }
});

// Backward compatibility: redirect old routes to /math/*
app.get('/start', (c) => c.redirect('/math/start', 301));
app.get('/play', (c) => c.redirect('/math/play', 301));

app.get('/sudoku', (c) =>
  c.render(<Sudoku currentUser={resolveCurrentUser(c.env, c.req.raw)} />, {
    title: 'MathQuest | 数独',
    description:
      '数独パズルで論理的思考力を鍛えよう。数字を使った楽しいパズルゲームです。',
  })
);

app.get('/auth/guest-login', (c) => {
  const profileParam = c.req.query('profile');
  const profileIndex = Number(profileParam);
  const index =
    Number.isInteger(profileIndex) && profileIndex >= 0 ? profileIndex : 0;
  const maxAge = 60 * 60 * 24 * 30;
  const response = c.redirect('/', 302);
  response.headers.append(
    'Set-Cookie',
    `mq_guest=1; Path=/; Max-Age=${maxAge}; SameSite=Lax`
  );
  response.headers.append(
    'Set-Cookie',
    `mq_guest_profile=${index}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
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

export default app;
