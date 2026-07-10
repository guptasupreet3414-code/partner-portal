import { describe, it, expect } from 'vitest';
import { isAuthorized, unauthorizedResponse } from '../basicAuth';

const PASSWORD = 'correct horse battery staple';

// Build an "Authorization: Basic ..." header value for the given credentials.
const basic = (user: string, pass: string) =>
  `Basic ${btoa(`${user}:${pass}`)}`;

describe('isAuthorized', () => {
  it('accepts the correct password with any username', () => {
    expect(isAuthorized(basic('anyone', PASSWORD), PASSWORD)).toBe(true);
    expect(isAuthorized(basic('', PASSWORD), PASSWORD)).toBe(true);
    expect(isAuthorized(basic('admin', PASSWORD), PASSWORD)).toBe(true);
  });

  it('accepts a password that contains a colon', () => {
    const pass = 'a:b:c';
    expect(isAuthorized(basic('user', pass), pass)).toBe(true);
  });

  it('rejects a wrong password', () => {
    expect(isAuthorized(basic('user', 'nope'), PASSWORD)).toBe(false);
  });

  it('rejects a missing header', () => {
    expect(isAuthorized(null, PASSWORD)).toBe(false);
    expect(isAuthorized('', PASSWORD)).toBe(false);
  });

  it('rejects a non-Basic scheme', () => {
    expect(isAuthorized(`Bearer ${btoa(`user:${PASSWORD}`)}`, PASSWORD)).toBe(false);
  });

  it('rejects malformed / non-base64 credentials', () => {
    expect(isAuthorized('Basic', PASSWORD)).toBe(false);
    expect(isAuthorized('Basic !!!not-base64!!!', PASSWORD)).toBe(false);
    expect(isAuthorized(`Basic ${btoa('no-colon-here')}`, PASSWORD)).toBe(false);
  });
});

describe('unauthorizedResponse', () => {
  it('is a 401 that challenges for Basic Auth', () => {
    const res = unauthorizedResponse();
    expect(res.status).toBe(401);
    expect(res.headers.get('WWW-Authenticate')).toContain('Basic');
  });
});
