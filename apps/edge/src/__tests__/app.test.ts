import { describe, expect, it, beforeAll } from 'vitest';
import app from '../index';
import type { Env } from '../env';
import type { KVNamespace, D1Database } from '@cloudflare/workers-types';

const createTestEnv = (): Env => ({
  KV_FREE_TRIAL: {} as unknown as KVNamespace,
  KV_AUTH_SESSION: {} as unknown as KVNamespace,
  KV_RATE_LIMIT: {} as unknown as KVNamespace,
  KV_IDEMPOTENCY: {} as unknown as KVNamespace,
  KV_QUIZ_SESSION: {} as unknown as KVNamespace,
  DB: {} as unknown as D1Database,
  DEFAULT_LANG: 'ja',
  ENVIRONMENT: 'dev',
});

beforeAll(() => {
  app.get('/__test-error', () => {
    throw new Error('boom');
  });
});

describe('app global handlers', () => {
  it('renders SSR not found page with 404 status', async () => {
    const response = await app.request('/__missing', undefined, createTestEnv());
    expect(response.status).toBe(404);
    const html = await response.text();
    expect(html).toContain('ページが見つかりません');
    expect(response.headers.get('content-type')).toContain('text/html');
  });

  it('renders SSR error page on unhandled exceptions', async () => {
    const response = await app.request('/__test-error', undefined, createTestEnv());
    expect(response.status).toBe(500);
    const html = await response.text();
    expect(html).toContain('エラーが発生しました');
    expect(html).toContain('ID:');
  });
});

