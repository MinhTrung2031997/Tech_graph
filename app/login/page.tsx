import type { Metadata } from 'next';
import { login } from '@/lib/auth-actions';
import { safeNextPath } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Log in',
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; from?: string }> }) {
  const params = await searchParams;
  const failed = params.error === '1';
  const from = safeNextPath(params.from);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0d12] px-6 text-[#e6e8ee]">
      <form action={login} className="w-full max-w-[22rem] rounded-xl border border-[#2a3142] bg-[#161b24] p-6">
        {from !== '/' ? <input type="hidden" name="from" value={from} /> : null}
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className="mt-2 w-full rounded-lg border border-[#1d212b] bg-[#11141b] px-3 py-2 text-[#e6e8ee] outline-none ring-[#818cf8] placeholder:text-[#9aa1b2] focus:border-[#818cf8] focus:ring-1"
        />
        <button
          type="submit"
          className="mt-4 w-full rounded-lg border border-[#818cf8] bg-[#33366b] px-3 py-2 text-sm font-medium text-[#eeeefe] hover:bg-[#3c3f7a]"
        >
          Log in
        </button>
        {failed ? (
          <p role="alert" className="mt-3 text-sm text-[#f0b4bc]">
            Wrong password.
          </p>
        ) : null}
      </form>
    </main>
  );
}
