import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import middleware from '../../../middleware';

const USERNAME = 'admin';
const PASSWORD = 's3cret-pass';

const request = (authHeader?: string) =>
  new Request('https://example.com/', {
    headers: authHeader ? { authorization: authHeader } : {},
  });

const basic = (user: string, pass: string) => `Basic ${btoa(`${user}:${pass}`)}`;

describe('middleware (Edge)', () => {
  let origUsername: string | undefined;
  let origPassword: string | undefined;

  beforeEach(() => {
    origUsername = process.env.SITE_USERNAME;
    origPassword = process.env.SITE_PASSWORD;
  });

  afterEach(() => {
    if (origUsername === undefined) delete process.env.SITE_USERNAME;
    else process.env.SITE_USERNAME = origUsername;
    if (origPassword === undefined) delete process.env.SITE_PASSWORD;
    else process.env.SITE_PASSWORD = origPassword;
  });

  it('returns 401 when credentials are configured but no auth header is sent', () => {
    process.env.SITE_USERNAME = USERNAME;
    process.env.SITE_PASSWORD = PASSWORD;
    const res = middleware(request());
    expect(res.status).toBe(401);
    expect(res.headers.get('WWW-Authenticate')).toContain('Basic');
  });

  it('returns 401 for a correct username but wrong password', () => {
    process.env.SITE_USERNAME = USERNAME;
    process.env.SITE_PASSWORD = PASSWORD;
    expect(middleware(request(basic(USERNAME, 'wrong'))).status).toBe(401);
  });

  it('returns 401 for a wrong username but correct password', () => {
    process.env.SITE_USERNAME = USERNAME;
    process.env.SITE_PASSWORD = PASSWORD;
    expect(middleware(request(basic('notadmin', PASSWORD))).status).toBe(401);
  });

  it('passes through (not 401) with the correct username and password', () => {
    process.env.SITE_USERNAME = USERNAME;
    process.env.SITE_PASSWORD = PASSWORD;
    const res = middleware(request(basic(USERNAME, PASSWORD)));
    expect(res.status).not.toBe(401);
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('returns 500 when SITE_USERNAME is not set', () => {
    delete process.env.SITE_USERNAME;
    process.env.SITE_PASSWORD = PASSWORD;
    const res = middleware(request());
    expect(res.status).toBe(500);
  });

  it('returns 500 when SITE_PASSWORD is not set', () => {
    process.env.SITE_USERNAME = USERNAME;
    delete process.env.SITE_PASSWORD;
    const res = middleware(request());
    expect(res.status).toBe(500);
  });

  it('returns 500 when neither credential is set', () => {
    delete process.env.SITE_USERNAME;
    delete process.env.SITE_PASSWORD;
    const res = middleware(request());
    expect(res.status).toBe(500);
  });
});
