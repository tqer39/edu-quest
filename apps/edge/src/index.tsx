import { Hono } from 'hono';
import { jsxRenderer } from 'hono/jsx-renderer';
import { secureHeaders } from 'hono/secure-headers';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import type { Env } from './env';
import { i18n } from './middlewares/i18n';
import { seoControl } from './middlewares/seo-control';
import { quiz } from './routes/apis/quiz';
import { kanjiQuiz } from './routes/apis/kanji';
import { Home } from './routes/pages/home';
import { MathHome } from './routes/pages/math-home';
import { KanjiHome } from './routes/pages/kanji-home';
import { KanjiStart } from './routes/pages/kanji-start';
import { KanjiPlay } from './routes/pages/kanji-play';
import { ClockHome } from './routes/pages/clock-home';
import { Start } from './routes/pages/start';
import { Play } from './routes/pages/play';
import { Sudoku } from './routes/pages/sudoku';
import { Login } from './routes/pages/login';
import { BetterAuthService } from './application/auth/service';
import { resolveCurrentUser } from './application/session/current-user';
import { Document } from './views/layouts/document';

const app = new Hono<{ Bindings: Env; Variables: { lang: 'ja' | 'en' } }>();

app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', prettyJSON());
app.use('*', i18n());
app.use('*', seoControl());

// Avoid noisy errors for favicon requests during local dev
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
  jsxRenderer<{ title?: string; description?: string }>((props, c) => {
    const lang = c.get('lang') ?? 'ja';
    const environment = c.env.ENVIRONMENT;
    return (
      <Document
        lang={lang}
        title={props.title}
        description={props.description}
        environment={environment}
      >
        {props.children}
      </Document>
    );
  })
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
app.get('/math', async (c) =>
  c.render(
    <MathHome currentUser={await resolveCurrentUser(c.env, c.req.raw)} />,
    {
      title: 'MathQuest | 算数を楽しく学ぼう',
      description:
        '学年別の算数問題で計算力をアップ。たし算・ひき算・かけ算・わり算を楽しく練習しよう。',
    }
  )
);

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
      title: 'KanjiQuest | 漢字を楽しく学ぼう',
      description:
        '学年を選んで漢字クイズに挑戦。読み当てや穴あき問題で楽しく漢字力をアップしよう。',
    }
  )
);

app.get('/kanji/start', async (c) =>
  c.render(
    <KanjiStart currentUser={await resolveCurrentUser(c.env, c.req.raw)} />,
    {
      title: 'KanjiQuest | クイズ設定',
      description:
        '学年と出題形式、問題数を選んで自分だけの漢字クイズを準備しよう。読み当てや穴あき問題をまとめて設定できます。',
    }
  )
);

app.get('/kanji/play', async (c) =>
  c.render(
    <KanjiPlay currentUser={await resolveCurrentUser(c.env, c.req.raw)} />,
    {
      title: 'KanjiQuest | 漢字クイズ',
      description:
        '選んだ設定で漢字クイズをプレイ。読みの選択や文章の穴あき問題に挑戦して漢字力をのばそう。',
    }
  )
);

// ClockQuest routes (Coming soon)
app.get('/clock', async (c) =>
  c.render(
    <ClockHome currentUser={await resolveCurrentUser(c.env, c.req.raw)} />,
    {
      title: 'ClockQuest | 時計の読み方をマスターしよう（準備中）',
      description:
        'アナログ時計とデジタル時計の読み方を練習。楽しく時間の概念を学べます。',
    }
  )
);

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
app.route('/apis/kanji', kanjiQuiz);

export default app;
