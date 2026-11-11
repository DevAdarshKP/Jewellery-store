'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Sparkles, FolderTree, Settings, ExternalLink } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Sparkles },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Settings & WhatsApp', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-onyx-950 text-onyx-200 flex flex-col border-r border-onyx-800 shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-onyx-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 font-serif font-bold text-lg">
            L
          </div>
          <div>
            <h1 className="font-serif text-lg tracking-wide text-ivory-50 font-semibold">LUMIÈRE</h1>
            <p className="text-[10px] uppercase tracking-widest text-gold-400/80 font-sans">Back-Office CMS</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && (pathname?.startsWith(item.href) ?? false));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                  : 'text-onyx-400 hover:text-ivory-100 hover:bg-onyx-900'
              }`}
            >
              <Icon className="w-4 h-4 mr-3 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* View Public Storefront Link */}
      <div className="p-4 border-t border-onyx-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 text-xs font-medium text-onyx-300 hover:text-ivory-50 bg-onyx-900 hover:bg-onyx-850 rounded-lg border border-onyx-800 transition"
        >
          <span>View Public Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}

