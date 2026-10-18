'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSessionToken, passwordsMatch, safeNextPath, SESSION_COOKIE, sessionCookieOptions, sessionMaxAge } from '@/lib/session';

export async function login(formData: FormData) {
  const password = String(formData.get('password') ?? '');
  const nextPath = safeNextPath(typeof formData.get('from') === 'string' ? String(formData.get('from')) : null);
  const expected = process.env.SITE_PASSWORD ?? '';
  const accepted = await passwordsMatch(password, expected);
  const token = accepted ? await createSessionToken() : null;

  if (!token) {
    const params = new URLSearchParams({ error: '1' });
    if (nextPath !== '/') params.set('from', nextPath);
    redirect(`/login?${params.toString()}`);
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions(sessionMaxAge()));
  redirect(nextPath);
}

export async function logout() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, '', sessionCookieOptions(0));
  redirect('/login');
}
