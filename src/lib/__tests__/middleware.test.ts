import { describe, it, expect, beforeEach, afterEach } from 'vitest';
// Import the real root Edge Middleware and drive it end-to-end.
import middleware from '../../../middleware';

const PASSWORD = 's3cret-pass';

const request = (authHeader?: string) =>
  new Request('https://example.com/', {
    headers: authHeader ? { authorization: authHeader } : {},
  });

const basic = (user: string, pass: string) => `Basic ${btoa(`${user}:${pass}`)}`;

describe('middleware (Edge)', () => {
  let original: string | undefined;

  beforeEach(() => {
    original = process.env.SITE_AUTH_PASSWORD;
  });
  afterEach(() => {
    if (original === undefined) delete process.env.SITE_AUTH_PASSWORD;
    else process.env.SITE_AUTH_PASSWORD = original;
  });

  it('returns 401 when the password is set but no credentials are sent', () => {
    process.env.SITE_AUTH_PASSWORD = PASSWORD;
    const res = middleware(request());
    expect(res.status).toBe(401);
    expect(res.headers.get('WWW-Authenticate')).toContain('Basic');
  });

  it('returns 401 for a wrong password', () => {
    process.env.SITE_AUTH_PASSWORD = PASSWORD;
    expect(middleware(request(basic('user', 'wrong'))).status).toBe(401);
  });

  it('passes through (not 401) with the correct password and any username', () => {
    process.env.SITE_AUTH_PASSWORD = PASSWORD;
    const res = middleware(request(basic('anyone', PASSWORD)));
    expect(res.status).not.toBe(401);
    // next() marks the response so the request continues to the origin.
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('is open (not 401) when the password is unset', () => {
    delete process.env.SITE_AUTH_PASSWORD;
    const res = middleware(request());
    expect(res.status).not.toBe(401);
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });
});
