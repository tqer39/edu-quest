import type { MiddlewareHandler } from 'hono';
import type { Env } from '../env';

export type AssetManifestEntry = {
  file: string;
  imports?: string[];
  css?: string[];
  assets?: string[];
};

export type AssetManifest = Record<string, AssetManifestEntry>;

let cachedManifest: AssetManifest | null | undefined;

const parseManifest = (source: string | undefined): AssetManifest | null => {
  if (!source) return null;
  try {
    const parsed = JSON.parse(source) as AssetManifest;
    cachedManifest = parsed;
    return parsed;
  } catch (error) {
    console.error('Failed to parse assets manifest', error);
    cachedManifest = null;
    return null;
  }
};

const resolveManifest = (env: Env): AssetManifest | null => {
  if (cachedManifest !== undefined) {
    return cachedManifest;
  }

  const manifest =
    env.ASSETS_MANIFEST ?? env.__STATIC_CONTENT_MANIFEST ?? undefined;

  return parseManifest(manifest);
};

export const assetManifest = (): MiddlewareHandler<{
  Bindings: Env;
  Variables: { assetManifest: AssetManifest | null };
}> => {
  return async (c, next) => {
    const manifest = resolveManifest(c.env);
    c.set('assetManifest', manifest ?? null);
    await next();
  };
};

export const clearAssetManifestCache = (): void => {
  cachedManifest = undefined;
};

