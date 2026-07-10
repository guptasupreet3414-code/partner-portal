// Pure, dependency-free HTTP Basic Auth helpers shared by the Vercel Edge
// Middleware (../../middleware.ts) and its unit test. Keeping the logic here —
// with the password passed in as an argument rather than read from the
// environment — means it never touches a secret and stays trivially testable.

/**
 * Returns true when an `Authorization: Basic <base64>` header carries the
 * expected password. The username is ignored (any username is accepted).
 */
export function isAuthorized(authHeader: string | null, password: string): boolean {
  if (!authHeader) return false;

  const [scheme, encoded] = authHeader.split(' ');
  if (scheme !== 'Basic' || !encoded) return false;

  let decoded: string;
  try {
    decoded = atob(encoded);
  } catch {
    return false;
  }

  // Credentials are "username:password"; the password may itself contain ":".
  const separator = decoded.indexOf(':');
  if (separator === -1) return false;

  return decoded.slice(separator + 1) === password;
}

/** The 401 challenge that prompts the browser's Basic Auth dialog. */
export function unauthorizedResponse(): Response {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Protected", charset="UTF-8"',
    },
  });
}
