/**
 * ============================================================================
 * CONTEXT THEME
 * ============================================================================
 * ngelola theme (dark/light mode) di seluruh aplikasi.
 * pake localStorage buat simpen preferensi user.
 * ============================================================================
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '@/types';

// interface value context
interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark'; // tema yang beneran kepake
}

// bikin context dengan nilai awal
const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'light',
});

// key local storage buat preferensi tema
const THEME_STORAGE_KEY = 'ai-support-theme';

/**
 * Komponen ThemeProvider
 * ngebungkus aplikasi dan nyediain context theme ke semua children
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // state preferensi tema dari user
  const [theme, setThemeState] = useState<Theme>('system');
  
  // state tema yang beneran ditampilin
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  
  // lacak kalo komponen udah di-mount (buat SSR hydration)
  const [mounted, setMounted] = useState(false);

  // inisialisasi tema dari localStorage pas mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  // update resolved tema berdasarkan preferensi dan setting sistem
  useEffect(() => {
    if (!mounted) return;

    const updateResolvedTheme = () => {
      if (theme === 'system') {
        // cek preferensi sistemnya
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setResolvedTheme(systemPrefersDark ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();

    // dengerin perubahan tema dari sistem
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateResolvedTheme);

    return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
  }, [theme, mounted]);

  // terapin class tema ke document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme, mounted]);

  // tema setter yang juga simpen ke localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  // cegah flash tema yang salah pas SSR
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * hook custom buat akses theme context
 * @returns ThemeContextValue - state theme sekarang sama setter-nya
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
