/**
 * ============================================================================
 * PROTECTED ROUTE COMPONENT
 * ============================================================================
 * Wraps pages that require authentication.
 * Redirects to login if user is not authenticated.
 * FIXED: Hydration error prevention
 * ============================================================================
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** opsional: batasi akses ke role tertentu aja */
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, isMounted]);

  // cek permission role-nya
  useEffect(() => {
    if (isMounted && !isLoading && isAuthenticated && user && allowedRoles) {
      if (!allowedRoles.includes(user.role)) {
        // redirect ke halaman utama kalo user ga punya role yang dibutuhin
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, isMounted]);

  // CRITICAL: Don't render until mounted to prevent hydration
  if (!isMounted) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-300 dark:border-zinc-700 border-t-gray-600 dark:border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // tampilin loading pas lagi ngecek autentikasi
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-300 dark:border-zinc-700 border-t-gray-600 dark:border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // jangan render children sampe autentikasi beres
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-300 dark:border-zinc-700 border-t-gray-600 dark:border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // cek akses role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500 dark:text-red-400">Access denied. Insufficient permissions.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;