import type { D1Database, KVNamespace } from '@cloudflare/workers-types';

export type Env = {
  KV_FREE_TRIAL: KVNamespace;
  KV_AUTH_SESSION: KVNamespace;
  KV_RATE_LIMIT: KVNamespace;
  KV_IDEMPOTENCY: KVNamespace;
  KV_QUIZ_SESSION: KVNamespace;
  DB: D1Database;
  ENVIRONMENT?: 'local' | 'dev' | 'staging' | 'production';
  DEFAULT_LANG: string;
  USE_MOCK_USER?: 'true' | 'false';
  AUTH_BASE_URL?: string;
  AUTH_EMAIL_FROM?: string;
  RESEND_API_KEY?: string;
  ASSETS_MANIFEST?: string;
  __STATIC_CONTENT_MANIFEST?: string;
};
