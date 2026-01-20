/**
 * ============================================================================
 * PROTECTED ROUTE COMPONENT
 * ============================================================================
 * Wraps pages that require authentication.
 * Redirects to login if user is not authenticated.
 * ============================================================================
 */

'use client';

import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // cek permission role-nya
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && allowedRoles) {
      if (!allowedRoles.includes(user.role)) {
        // redirect ke halaman utama kalo user ga punya role yang dibutuhin
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  // tampilin loading pas lagi ngecek autentikasi
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // jangan render children sampe autentikasi beres
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // cek akses role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500 dark:text-red-400">Access denied. Insufficient permissions.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
