/**
 * ============================================================================
 * HALAMAN PENGATURAN
 * ============================================================================
 * halaman settings bersih ala Gmail buat theme dan preferensi.
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { Theme } from '@/types';

// icon-iconnya
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const MonitorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themeOptions: { value: Theme; label: string; description: string; icon: React.ReactNode }[] = [
    {
      value: 'light',
      label: 'Light',
      description: 'Light background with dark text',
      icon: <SunIcon />
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Dark background with light text',
      icon: <MoonIcon />
    },
    {
      value: 'system',
      label: 'System',
      description: 'Follows your device settings',
      icon: <MonitorIcon />
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* bagian header */}
      <header className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto flex items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="p-2.5 rounded-lg hover:bg-[var(--card-hover)] text-[var(--foreground-secondary)] transition-colors"
          >
            <ArrowLeftIcon />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white">
              <SettingsIcon />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[var(--foreground)]">Settings</h1>
              <p className="text-sm text-[var(--foreground-muted)]">Customize your experience</p>
            </div>
          </div>
        </div>
      </header>

      {/* konten utama */}
      <main className="max-w-4xl mx-auto p-6">
        {/* bagian tampilan */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Appearance</h2>
          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] overflow-hidden">
            <div className="p-5 border-b border-[var(--border-light)]">
              <h3 className="font-medium text-[var(--foreground)] mb-1">Theme</h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Choose how AI Support looks to you
              </p>
            </div>
            
            <div className="p-5">
              <div className="grid gap-3">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`
                      flex items-center gap-4 p-5 rounded-md border-2 transition-all text-left
                      ${theme === option.value 
                        ? 'border-[var(--primary)] bg-[var(--primary-light)]' 
                        : 'border-[var(--border)] hover:border-[var(--foreground-muted)]'
                      }
                    `}
                  >
                    <div className={`
                      p-2.5 rounded-md 
                      ${theme === option.value 
                        ? 'bg-[var(--primary)] text-white' 
                        : 'bg-[var(--background-secondary)] text-[var(--foreground-secondary)]'
                      }
                    `}>
                      {option.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-[var(--foreground)]">{option.label}</div>
                      <div className="text-sm text-[var(--foreground-muted)]">{option.description}</div>
                    </div>
                    
                    {theme === option.value && (
                      <div className="text-[var(--primary)]">
                        <CheckIcon />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              <p className="mt-4 text-sm text-[var(--foreground-muted)]">
                Currently using: <span className="font-medium text-[var(--foreground)]">{resolvedTheme} mode</span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
