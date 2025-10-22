import type { MiddlewareHandler } from 'hono';
import type { Env } from '../env';

/**
 * SEO制御ミドルウェア
 * dev環境では検索エンジンとLLMクローラーによるインデックスを防ぐ
 */
export const seoControl = (): MiddlewareHandler<{ Bindings: Env }> => {
  return async (c, next) => {
    await next();

    const environment = c.env.ENVIRONMENT;
    const isDev = environment === 'dev';

    if (isDev) {
      // X-Robots-Tagヘッダーを追加してインデックスを防ぐ
      c.header('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    }
  };
};
