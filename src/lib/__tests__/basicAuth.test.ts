import { describe, it, expect } from 'vitest';
import { isAuthorized, unauthorizedResponse } from '../basicAuth';

const USERNAME = 'admin';
const PASSWORD = 'correct horse battery staple';

// Build an "Authorization: Basic ..." header value for the given credentials.
const basic = (user: string, pass: string) =>
  `Basic ${btoa(`${user}:${pass}`)}`;

describe('isAuthorized', () => {
  it('accepts the correct username and password', () => {
    expect(isAuthorized(basic(USERNAME, PASSWORD), USERNAME, PASSWORD)).toBe(true);
  });

  it('accepts a password that contains a colon', () => {
    const pass = 'a:b:c';
    expect(isAuthorized(basic(USERNAME, pass), USERNAME, pass)).toBe(true);
  });

  it('rejects a wrong password', () => {
    expect(isAuthorized(basic(USERNAME, 'nope'), USERNAME, PASSWORD)).toBe(false);
  });

  it('rejects a wrong username', () => {
    expect(isAuthorized(basic('notadmin', PASSWORD), USERNAME, PASSWORD)).toBe(false);
  });

  it('rejects wrong username and wrong password', () => {
    expect(isAuthorized(basic('notadmin', 'nope'), USERNAME, PASSWORD)).toBe(false);
  });

  it('rejects a missing header', () => {
    expect(isAuthorized(null, USERNAME, PASSWORD)).toBe(false);
    expect(isAuthorized('', USERNAME, PASSWORD)).toBe(false);
  });

  it('rejects a non-Basic scheme', () => {
    expect(isAuthorized(`Bearer ${btoa(`${USERNAME}:${PASSWORD}`)}`, USERNAME, PASSWORD)).toBe(false);
  });

  it('rejects malformed / non-base64 credentials', () => {
    expect(isAuthorized('Basic', USERNAME, PASSWORD)).toBe(false);
    expect(isAuthorized('Basic !!!not-base64!!!', USERNAME, PASSWORD)).toBe(false);
    expect(isAuthorized(`Basic ${btoa('no-colon-here')}`, USERNAME, PASSWORD)).toBe(false);
  });
});

describe('unauthorizedResponse', () => {
  it('is a 401 that challenges for Basic Auth', () => {
    const res = unauthorizedResponse();
    expect(res.status).toBe(401);
    expect(res.headers.get('WWW-Authenticate')).toContain('Basic');
  });
});
