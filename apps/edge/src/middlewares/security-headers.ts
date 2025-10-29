import type { MiddlewareHandler } from 'hono';

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' https://cdn.tailwindcss.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data:",
  "font-src 'self' https://fonts.gstatic.com data:",
  "connect-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
];

export const securityHeaders = (): MiddlewareHandler => {
  const csp = cspDirectives.join('; ');
  return async (c, next) => {
    c.header('Content-Security-Policy', csp);
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('X-Frame-Options', 'DENY');
    c.header(
      'Strict-Transport-Security',
      'max-age=15552000; includeSubDomains; preload'
    );
    // COEP is disabled because it can block external resources (Google Fonts, Tailwind CDN)
    // even with crossorigin attributes if the CDN doesn't return proper CORP headers.
    // Re-enable only if SharedArrayBuffer or similar features are needed.
    // c.header('Cross-Origin-Embedder-Policy', 'credentialless');
    c.header('Cross-Origin-Resource-Policy', 'same-origin');
    c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    await next();
  };
};
