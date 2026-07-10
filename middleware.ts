import { next } from '@vercel/edge';
import { isAuthorized, unauthorizedResponse } from './src/lib/basicAuth';

// Vercel Edge Middleware — the framework-agnostic equivalent of a Next.js
// proxy layer. This is a static Vite SPA, so a `src/proxy.ts` would be bundled
// into the *client* and could never see a server-only secret. A root-level
// `middleware.ts` instead runs at the edge, before any static asset is served.
//
// `process.env` is provided by the Edge runtime; declared locally so this file
// type-checks without pulling in @types/node.
declare const process: { env: { SITE_AUTH_PASSWORD?: string } };

export const config = {
  // Gate every path, including assets, behind the password.
  matcher: '/(.*)',
};

export default function middleware(request: Request): Response {
  const password = process.env.SITE_AUTH_PASSWORD;

  // No password configured → gate disabled, so local dev and any environment
  // without the secret stay fully open.
  if (!password) {
    return next();
  }

  if (isAuthorized(request.headers.get('authorization'), password)) {
    return next();
  }

  return unauthorizedResponse();
}
