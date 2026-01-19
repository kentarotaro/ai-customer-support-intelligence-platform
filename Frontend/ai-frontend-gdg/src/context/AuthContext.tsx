/**
 * ============================================================================
 * CONTEXT AUTHENTICATION
 * ============================================================================
 * ngelola state authentication di seluruh aplikasi.
 * handle login, logout, register, sama management token.
 * ============================================================================
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, AuthSession } from '@/types';

// key storage
const TOKEN_KEY = 'ai_support_token';
const USER_KEY = 'ai_support_user';

// URL backend-nya nih
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// interface value context
interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string, role: 'agent' | 'lead') => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// bikin context-nya
const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  refreshProfile: async () => {},
});

/**
 * hook custom buat pake auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Komponen AuthProvider
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // load auth yang disimpen pas mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // data yang disimpen invalid, apus aja
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // simpen auth ke storage
  const saveAuth = (newToken: string, newUser: User) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // apus auth dari storage
  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  // fungsi login
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: data.message || data.error || 'Login failed' 
        };
      }

      if (data.success && data.session && data.user) {
        saveAuth(data.session.access_token, data.user);
        return { success: true };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, []);

  // fungsi register
  const register = useCallback(async (
    email: string, 
    password: string, 
    fullName: string, 
    role: 'agent' | 'lead'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          full_name: fullName, 
          role 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: data.message || data.error || 'Registration failed' 
        };
      }

      // kalo ada session langsung, simpen auth-nya
      if (data.success && data.session && data.user) {
        saveAuth(data.session.access_token, data.user);
        return { success: true };
      }

      // kalo session null (email perlu verifikasi), tetep sukses tapi kasih info
      if (data.success && !data.session) {
        return { 
          success: true, 
          error: data.message || 'Silakan cek email untuk verifikasi!' 
        };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, []);

  // fungsi logout
  const logout = useCallback(async () => {
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    clearAuth();
  }, [token]);

  // refresh profile
  const refreshProfile = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } else if (response.status === 401) {
        // token udah expired, hapus auth-nya
        clearAuth();
      }
    } catch (error) {
      console.error('Profile refresh error:', error);
    }
  }, [token]);

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * dapetin token yang disimpen (buat API call di luar React)
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
