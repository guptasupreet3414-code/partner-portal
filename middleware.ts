import { next } from '@vercel/edge';

declare const process: {
  env: {
    SITE_USERNAME?: string;
    SITE_PASSWORD?: string;
  };
};

export const config = {
  matcher: '/(.*)',
};

export default function middleware(request: Request): Response {
  const expectedUsername = process.env.SITE_USERNAME;
  const expectedPassword = process.env.SITE_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return new Response('Authentication is not configured.', {
      status: 500,
    });
  }

  const authorization = request.headers.get('authorization');

  if (authorization?.startsWith('Basic ')) {
    try {
      const decoded = atob(authorization.slice(6));
      const separator = decoded.indexOf(':');

      if (separator !== -1) {
        const username = decoded.slice(0, separator);
        const password = decoded.slice(separator + 1);

        if (
          username === expectedUsername &&
          password === expectedPassword
        ) {
          return next();
        }
      }
    } catch {
      // Fall through to 401
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate':
        'Basic realm="Protected", charset="UTF-8"',
      'Cache-Control': 'private, no-store',
    },
  });
}