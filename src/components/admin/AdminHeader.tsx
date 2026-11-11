'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { useState } from 'react';

interface AdminHeaderProps {
  userName?: string;
  userEmail?: string;
}

export function AdminHeader({ userName = 'Administrator', userEmail }: AdminHeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-ivory-200 px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-3">
        <span className="text-xs uppercase tracking-widest text-gold-600 font-semibold bg-gold-50 px-2.5 py-1 rounded-full border border-gold-200">
          Admin Portal
        </span>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-sm text-onyx-700">
          <div className="w-8 h-8 rounded-full bg-gold-100 border border-gold-300 text-gold-700 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="font-medium text-onyx-900 leading-tight">{userName}</div>
            {userEmail && <div className="text-xs text-onyx-500 leading-tight">{userEmail}</div>}
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center space-x-1.5 text-xs font-medium text-onyx-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 px-3 py-1.5 rounded-lg transition"
          title="Sign out of Admin CMS"
        >
          <LogOut className="w-4 h-4" />
          <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
        </button>
      </div>
    </header>
  );
}

