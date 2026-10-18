'use client';

import { usePathname } from 'next/navigation';
import { logout } from '@/lib/auth-actions';

export function LogoutControl() {
  const pathname = usePathname();
  if (pathname === '/login') return null;

  return (
    <form action={logout} className="fixed right-4 bottom-4 z-30">
      <button
        type="submit"
        className="rounded-lg border border-[#2a3142] bg-[#33366b] px-3 py-1.5 text-xs font-medium text-[#eeeefe] hover:bg-[#3c3f7a]"
      >
        Log out
      </button>
    </form>
  );
}
