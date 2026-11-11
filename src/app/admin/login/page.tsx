'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-onyx-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background luxury glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-gold-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-onyx-900 border border-gold-500/30 text-gold-400 font-serif text-2xl font-bold mb-4 shadow-luxury-dark">
            L
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold tracking-wider text-ivory-50 uppercase">
            Lumière Atelier
          </h1>
          <p className="text-xs uppercase tracking-widest text-gold-400/80 font-sans mt-1">
            Back-Office Administrative Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-onyx-900/90 border border-onyx-800 backdrop-blur-md rounded-2xl p-8 shadow-luxury-dark">
          <div className="flex items-center space-x-2 text-xs text-onyx-400 mb-6 bg-onyx-950/60 p-3 rounded-lg border border-onyx-800">
            <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
            <span>Authorized store management personnel only.</span>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-red-950/50 border border-red-800/60 rounded-lg flex items-start space-x-3 text-red-300 text-xs leading-relaxed animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-onyx-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-onyx-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jewellerystore.local"
                  className="w-full pl-10 pr-4 py-2.5 bg-onyx-950 border border-onyx-700 rounded-lg text-sm text-ivory-50 placeholder-onyx-600 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-onyx-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-onyx-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-onyx-950 border border-onyx-700 rounded-lg text-sm text-ivory-50 placeholder-onyx-600 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-onyx-950 font-semibold text-sm rounded-lg shadow-luxury transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Back-Office'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-xs text-onyx-500">
          Lumière Atelier Fine Jewellery &copy; 2026. All rights reserved.
        </div>
      </div>
    </div>
  );
}

