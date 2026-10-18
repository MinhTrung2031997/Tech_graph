export const SESSION_COOKIE = 'site_session';

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;
const MAX_SECRET_LENGTH = 1024;

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  };
}

export function sessionMaxAge() {
  return SESSION_TTL_SECONDS;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  const length = Math.max(a.length, b.length);
  let mismatch = a.length ^ b.length;
  for (let i = 0; i < length; i++) {
    mismatch |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return mismatch === 0;
}

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '');
}

function fromBase64Url(value: string) {
  if (!/^[A-Za-z0-9_-]+$/u.test(value)) return null;
  try {
    const padded = value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (value.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return new Uint8Array(digest);
}

async function hmacSha256(secret: string, data: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return new Uint8Array(signature);
}

export async function passwordsMatch(input: string, expected: string) {
  const tooLong = input.length > MAX_SECRET_LENGTH || expected.length > MAX_SECRET_LENGTH;
  const [left, right] = await Promise.all([sha256(input.slice(0, MAX_SECRET_LENGTH)), sha256(expected.slice(0, MAX_SECRET_LENGTH))]);
  return !tooLong && expected.length > 0 && timingSafeEqual(left, right);
}

export async function createSessionToken() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  const payload = `1.${Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS}`;
  const signature = toBase64Url(await hmacSha256(secret, payload));
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined) {
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret || token.length > 512) return false;
  const separator = token.lastIndexOf('.');
  if (separator <= 0) return false;
  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const [version, expText] = payload.split('.');
  if (version !== '1' || !expText || !/^\d+$/u.test(expText)) return false;
  const expected = fromBase64Url(toBase64Url(await hmacSha256(secret, payload)));
  const actual = fromBase64Url(signature) ?? new Uint8Array(expected?.length ?? 0);
  if (!expected || !timingSafeEqual(actual, expected)) return false;
  return Number(expText) > Math.floor(Date.now() / 1000);
}

export function safeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/';
  try {
    const url = new URL(value, 'http://localhost');
    if (url.origin !== 'http://localhost') return '/';
    if (url.pathname === '/login' || url.pathname.startsWith('/login/')) return '/';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/';
  }
}
