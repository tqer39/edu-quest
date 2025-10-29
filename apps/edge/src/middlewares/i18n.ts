import type { MiddlewareHandler } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import type { Env } from '../env';

type SupportedLanguage = 'ja' | 'en';

const isSupportedLang = (value: string | null | undefined): value is SupportedLanguage =>
  value === 'ja' || value === 'en';

export function i18n(): MiddlewareHandler<{
  Bindings: Env;
  Variables: { lang: SupportedLanguage };
}> {
  return async (c, next) => {
    const queryLang = c.req.query('lang');
    const cookieLang = getCookie(c, 'lang');
    const acceptLanguage = c.req.header('accept-language') ?? '';
    const acceptLang = acceptLanguage.toLowerCase().startsWith('ja') ? 'ja' : 'en';
    const defaultLang = isSupportedLang(c.env.DEFAULT_LANG) ? c.env.DEFAULT_LANG : 'ja';

    const resolvedLang: SupportedLanguage =
      (isSupportedLang(queryLang)
        ? queryLang
        : isSupportedLang(cookieLang)
          ? cookieLang
          : acceptLang) ?? defaultLang;

    c.set('lang', resolvedLang);
    c.header('Vary', 'Accept-Language', { append: true });

    if (isSupportedLang(queryLang) && queryLang !== cookieLang) {
      setCookie(c, 'lang', queryLang, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'Lax',
        secure: true,
        httpOnly: true,
      });
    }

    await next();
  };
}
