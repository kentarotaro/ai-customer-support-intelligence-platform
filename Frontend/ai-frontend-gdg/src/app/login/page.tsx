// halaman login - design minimalis kaya apple/google

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { FiEye, FiEyeOff, FiShoppingBag } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="w-8 h-8 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* sebelah kiri - branding clean dan flat */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-zinc-900 dark:bg-zinc-900 p-12 xl:p-16 flex-col justify-between relative border-r border-zinc-800 dark:border-zinc-700">
        
        {/* logo - dengan bg biru supaya keliatan di dark mode */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <FiShoppingBag className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Tumbas</span>
        </div>
        
        {/* konten utama */}
        <div className="space-y-6">
          <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white leading-tight tracking-tight">
            Tumbas<br />Customer Support
          </h1>
          <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
            Sign in dengan akun anda atau buat akun.
          </p>
          
          {/* fitur-fitur dengan design flat dan accent blue */}
          <div className="flex flex-col gap-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-zinc-300 text-sm">Dapat tag serta analisis sentimen</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-zinc-300 text-sm">Lihat reply suggestions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-zinc-300 text-sm">Dapatkan summary AI</span>
            </div>
          </div>
        </div>
        
        {/* footer */}
        <p className="text-zinc-600 text-sm">© 2026 Tumbas. All rights reserved.</p>
      </div>
      
      {/* sebelah kanan - form login dengan design clean */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12 bg-white dark:bg-zinc-950 border-l-0 lg:border-l lg:border-zinc-200 dark:lg:border-zinc-700">
        <div className="w-full max-w-sm">
          {/* logo buat tampilan mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-zinc-900 dark:text-white">Tumbas</span>
          </div>
          
          {/* header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Welcome back</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Sign in to access your dashboard</p>
          </div>
          
          {/* pesan error kalo ada masalah */}
          {error && (
            <div className="mb-6 px-5 py-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* input email */}
            <div className="mb-2">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email address
              </label>
              <div className="relative group">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none transition-colors group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-300" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ paddingLeft: '3.5rem' }}
                  className="w-full pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                  required
                />
              </div>
            </div>
            
            {/* input password */}
            <div className="mt-2">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none transition-colors group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-300" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }}
                  className="w-full py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* tombol login - solid blue accent color */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mb-2 mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
            
            
            {/* pembatas */}
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400">New to Tumbas?</span>
              </div>
            </div>
          </form>
          
          {/* link buat ke halaman register */}
          <p className="text-center text-zinc-500 dark:text-zinc-400 text-sm mt-2">
            <Link href="/register" className="text-zinc-900 dark:text-white font-semibold hover:underline transition-colors">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
