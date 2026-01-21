// halaman register - minimalis juga

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import { FiEye, FiEyeOff, FiShoppingBag, FiUsers } from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('agent');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    console.log('Attempting registration for:', email, 'with role:', role);
    const result = await register(email, password, fullName, role);
    console.log('Registration result:', result);
    
    if (result.success) {
      // kalo ada pesan (misal perlu verifikasi email), tampilin dulu
      if (result.error) {
        setError(result.error);
        // tetep redirect ke login setelah 3 detik
        setTimeout(() => router.push('/login'), 3000);
      } else {
        router.push('/');
      }
    } else {
      setError(result.error || 'Registration failed. Please try again.');
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
      {/* sebelah kiri - brandingnya */}
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
            Buat akun dengan <br />mudah<br /> hari ini
          </h1>
          <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
            Buat pekerjaan menjadi lebih mudah.
          </p>
          
          {/* angka-angka statistiknya - dengan subtle blue accent */}
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="bg-blue-600/10 rounded-lg p-4 border border-blue-500/20">
              <p className="text-3xl font-bold text-white">12k+</p>
              <p className="text-sm text-blue-300">Support agents</p>
            </div>
            <div className="bg-blue-600/10 rounded-lg p-4 border border-blue-500/20">
              <p className="text-3xl font-bold text-white">999+</p>
              <p className="text-sm text-blue-300">Happy Customers</p>
            </div>
          </div>
        </div>
        
        {/* footer */}
        <p className="text-zinc-600 text-sm">© 2026 Tumbas. All rights reserved.</p>
      </div>
      
      {/* sebelah kanan - form pendaftaran */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12 bg-white dark:bg-zinc-950 overflow-y-auto border-l-0 lg:border-l lg:border-zinc-200 dark:lg:border-zinc-700">
        <div className="w-full max-w-sm">
          {/* logo versi tampilan mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-zinc-900 dark:text-white">Tumbas</span>
          </div>
          
          {/* judulnya */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Create account</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Join the support team</p>
          </div>
          
          {/* pesan error */}
          {error && (
            <div className="mb-6 px-5 py-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* input nama lengkap */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full name
              </label>
              <div className="relative group">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-colors group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  style={{ paddingLeft: '3.5rem' }}
                  className="w-full pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all hover:border-gray-300 dark:hover:border-gray-700"
                  required
                />
              </div>
            </div>
            
            {/* input email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative group">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-colors group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ paddingLeft: '3.5rem' }}
                  className="w-full pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all hover:border-gray-300 dark:hover:border-gray-700"
                  required
                />
              </div>
            </div>
            
            {/* pilihan role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('agent')}
                  className={`group px-4 py-4 rounded-lg border transition-all text-left flex flex-col gap-1.5 ${
                    role === 'agent'
                      ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900 shadow-sm'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <HiOutlineUser className={`w-5 h-5 ${role === 'agent' ? 'text-gray-900 dark:text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                    <span className={`text-sm font-semibold ${role === 'agent' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Agent</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-7">Handle customer inquiries</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('lead')}
                  className={`group px-4 py-4 rounded-lg border transition-all text-left flex flex-col gap-1.5 ${
                    role === 'lead'
                      ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900 shadow-sm'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FiUsers className={`w-5 h-5 ${role === 'lead' ? 'text-gray-900 dark:text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                    <span className={`text-sm font-semibold ${role === 'lead' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Lead</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-7">Manage team & analytics</span>
                </button>
              </div>
            </div>
            
            {/* input password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-colors group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }}
                  className="w-full py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all hover:border-gray-300 dark:hover:border-gray-700"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {password && password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-1 flex-1 rounded-full transition-all ${
                      password.length < 6 ? 'bg-red-200 dark:bg-red-900' :
                      password.length < 8 ? 'bg-yellow-200 dark:bg-yellow-900' :
                      'bg-green-200 dark:bg-green-900'
                    }`}>
                      <div className={`h-full rounded-full transition-all ${
                        password.length < 6 ? 'bg-red-500 w-1/3' :
                        password.length < 8 ? 'bg-yellow-500 w-2/3' :
                        'bg-green-500 w-full'
                      }`} />
                    </div>
                  </div>
                  <p className={`text-xs ${
                    password.length < 6 ? 'text-red-600 dark:text-red-400' :
                    password.length < 8 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>
                    {password.length < 6 ? 'Weak - minimum 6 characters' :
                     password.length < 8 ? 'Good - consider 8+ characters' :
                     'Strong password'}
                  </p>
                </div>
              )}
            </div>
            
            {/* input konfirmasi password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm password
              </label>
              <div className="relative group">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-colors group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }}
                  className="w-full py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all hover:border-gray-300 dark:hover:border-gray-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && (
                <p className={`mt-2 text-xs flex items-center gap-1.5 ${
                  password === confirmPassword ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {password === confirmPassword ? (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Passwords match
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Passwords do not match
                    </>
                  )}
                </p>
              )}
            </div>
            
            {/* tombol daftar - solid blue accent color */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-7 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
            
            {/* info tentang fitur */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">What you&apos;ll get:</p>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>AI-powered customer insights and analytics</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Smart response suggestions to save time</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Real-time collaboration with your team</span>
                </li>
              </ul>
            </div>
          </form>
          
          {/* link buat ke halaman login */}
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-gray-900 dark:text-white font-semibold hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
