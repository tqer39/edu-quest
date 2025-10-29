import { describe, expect, it, beforeAll, beforeEach } from 'vitest';
import app from '../index';
import type { Env } from '../env';
import type { KVNamespace, D1Database } from '@cloudflare/workers-types';
import { clearAssetManifestCache } from '../middlewares/asset-manifest';

const createTestEnv = (overrides: Partial<Env> = {}): Env => ({
  KV_FREE_TRIAL: {} as unknown as KVNamespace,
  KV_AUTH_SESSION: {} as unknown as KVNamespace,
  KV_RATE_LIMIT: {} as unknown as KVNamespace,
  KV_IDEMPOTENCY: {} as unknown as KVNamespace,
  KV_QUIZ_SESSION: {} as unknown as KVNamespace,
  DB: {} as unknown as D1Database,
  DEFAULT_LANG: 'ja',
  ENVIRONMENT: 'dev',
  ...overrides,
});

beforeAll(() => {
  app.get('/__test-error', () => {
    throw new Error('boom');
  });
});

beforeEach(() => {
  clearAssetManifestCache();
});

describe('app global handlers', () => {
  it('renders SSR not found page with 404 status', async () => {
    const response = await app.request('/__missing', undefined, createTestEnv());
    expect(response.status).toBe(404);
    const html = await response.text();
    expect(html).toContain('ページが見つかりません');
    expect(response.headers.get('content-type')).toContain('text/html');
    expect(response.headers.get('cache-control')).toBe('private, no-store, max-age=0');
  });

  it('renders SSR error page on unhandled exceptions', async () => {
    const response = await app.request('/__test-error', undefined, createTestEnv());
    expect(response.status).toBe(500);
    const html = await response.text();
    expect(html).toContain('エラーが発生しました');
    expect(html).toContain('ID:');
    expect(response.headers.get('cache-control')).toBe('private, no-store, max-age=0');
  });
});

describe('SSR manifest integration', () => {
  it('injects modulepreload, stylesheet, and script tags from manifest', async () => {
    const manifest = JSON.stringify({
      'src/entry-client.tsx': {
        file: 'assets/entry-client.js',
        css: ['assets/main.css'],
        imports: ['chunks/vendor.js'],
      },
      'chunks/vendor.js': {
        file: 'chunks/vendor.js',
      },
    });

    const response = await app.request('/', undefined, createTestEnv({ ASSETS_MANIFEST: manifest }));
    const body = await response.text();

    expect(body).toMatch(
      /<link rel="modulepreload" href=\/?assets\/entry-client\.js"? crossorigin="anonymous"\s*\/?/i
    );
    expect(body).toMatch(/<link rel="modulepreload" href=\/?chunks\/vendor\.js"? crossorigin="anonymous"\s*\/?/i);
    expect(body).toMatch(/<link rel="stylesheet" href=\/?assets\/main\.css"?\s*\/?/i);
    expect(body).toMatch(/type="module"/i);
    expect(body).toMatch(/src=\/?assets\/entry-client\.js"?/i);
    expect(body).toMatch(/defer[^<]*<\/script>/i);
  });
});

