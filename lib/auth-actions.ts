'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSessionToken, passwordsMatch, safeNextPath, SESSION_COOKIE, sessionCookieOptions, sessionMaxAge } from '@/lib/session';

const FAILURE_DELAY_MS = 1000;
const MAX_FAILURES = 10;
const LOCKOUT_MS = 15 * 60 * 1000;

// Best effort only: this map lives in one serverless instance, so a cold start
// or a request served by another instance starts from a clean count.
const failures = new Map<string, { count: number; since: number }>();

async function clientIp() {
  const forwarded = (await headers()).get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

function isLockedOut(ip: string, now: number) {
  const entry = failures.get(ip);
  if (!entry) return false;
  if (now - entry.since > LOCKOUT_MS) {
    failures.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

function recordFailure(ip: string, now: number) {
  const entry = failures.get(ip);
  if (!entry || now - entry.since > LOCKOUT_MS) failures.set(ip, { count: 1, since: now });
  else entry.count++;
}

export async function login(formData: FormData) {
  const password = String(formData.get('password') ?? '');
  const nextPath = safeNextPath(typeof formData.get('from') === 'string' ? String(formData.get('from')) : null);
  const expected = process.env.SITE_PASSWORD ?? '';
  const ip = await clientIp();
  const now = Date.now();
  const locked = isLockedOut(ip, now);
  const accepted = !locked && (await passwordsMatch(password, expected));
  const token = accepted ? await createSessionToken() : null;

  if (!token) {
    if (!locked) recordFailure(ip, now);
    await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
    const params = new URLSearchParams({ error: '1' });
    if (nextPath !== '/') params.set('from', nextPath);
    redirect(`/login?${params.toString()}`);
  }

  failures.delete(ip);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions(sessionMaxAge()));
  redirect(nextPath);
}

export async function logout() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, '', sessionCookieOptions(0));
  redirect('/login');
}
