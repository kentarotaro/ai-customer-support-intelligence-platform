/**
 * ============================================================================
 * SIDEBAR COMPONENT
 * ============================================================================
 * Main navigation sidebar similar to Gmail's sidebar.
 * Contains navigation links to Inbox, Settings, and Help.
 * Also includes theme toggle and branding.
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import {
  InboxIcon,
  SettingsIcon,
  HelpIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  SparklesIcon,
  MenuIcon,
  XIcon,
} from '@/components/icons/Icons';
import { Theme } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount: number;
}

/**
 * Navigation item component for sidebar links
 */
interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  isActive: boolean;
}

function NavItem({ href, icon, label, badge, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-medium' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

/**
 * Theme toggle button component
 */
function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // ganti-ganti tema: light -> dark -> system -> light lagi
  const cycleTheme = () => {
    const themeOrder: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  // ambil icon sama label berdasarkan setting tema sekarang
  const getThemeDisplay = () => {
    switch (theme) {
      case 'light':
        return { icon: <SunIcon size={20} />, label: 'Light' };
      case 'dark':
        return { icon: <MoonIcon size={20} />, label: 'Dark' };
      case 'system':
        return { icon: <MonitorIcon size={20} />, label: 'System' };
    }
  };

  const { icon, label } = getThemeDisplay();

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-3 w-full px-4 py-3.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
      aria-label={`Current theme: ${label}. Click to change.`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1 text-left">Theme: {label}</span>
    </button>
  );
}

/**
 * Main Sidebar Component
 */
export default function Sidebar({ isOpen, onToggle, unreadCount }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* bagian header/logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <SparklesIcon size={24} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">
                  AI Support
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Intelligence Platform
                </p>
              </div>
            </div>
            
            {/* tombol close buat mobile */}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close sidebar"
            >
              <XIcon size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* link-link navigasi */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavItem
              href="/"
              icon={<InboxIcon size={20} />}
              label="Inbox"
              badge={unreadCount}
              isActive={pathname === '/'}
            />
            
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="px-4 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Preferences
              </p>
              
              <NavItem
                href="/settings"
                icon={<SettingsIcon size={20} />}
                label="Settings"
                isActive={pathname === '/settings'}
              />
              
              <NavItem
                href="/help"
                icon={<HelpIcon size={20} />}
                label="Help & Support"
                isActive={pathname === '/help'}
              />
            </div>

            {/* Theme Toggle */}
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="px-4 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Appearance
              </p>
              <ThemeToggle />
            </div>
          </nav>

          {/* bagian footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              AI Support Platform v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

/**
 * Mobile menu toggle button
 * Used in the main layout header on mobile devices
 */
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Open menu"
    >
      <MenuIcon size={24} className="text-gray-600 dark:text-gray-400" />
    </button>
  );
}
