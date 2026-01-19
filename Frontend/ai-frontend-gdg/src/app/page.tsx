'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Message } from '@/types';
import { fetchMessages, deleteMessage, archiveMessage } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Theme } from '@/types';
import { 
  HiOutlineLogout,
  HiOutlineChartBar
} from 'react-icons/hi';
import { 
  FiSmile,
  FiMeh,
  FiFrown
} from 'react-icons/fi';

// ============================================================================
// DATA MOCK (cadangan kalo backend lagi mati)
// ============================================================================
const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    customer_name: "Budi Santoso",
    customer_email: "budi.santoso@email.com",
    subject: "Saldo tidak masuk",
    content: "Saya sudah topup 50rb tapi saldo masih 0. Mohon segera ditangani karena saya butuh untuk transaksi penting.",
    preview: "Saya sudah topup 50rb tapi saldo masih 0. Mohon segera ditangani karena saya butuh untuk transaksi penting.",
    created_at: "2024-01-04T09:30:00",
    status: "Open",
    category: "Billing",
    sentiment: "Negative",
    priority: "Urgent",
    isRead: false
  },
  {
    id: 2,
    customer_name: "Siti Aminah",
    customer_email: "siti.aminah@email.com",
    subject: "Fitur baru bagus!",
    content: "Terima kasih update terbarunya sangat membantu. Dashboard baru sangat user friendly!",
    preview: "Terima kasih update terbarunya sangat membantu. Dashboard baru sangat user friendly!",
    created_at: "2024-01-04T10:15:00",
    status: "Closed",
    category: "General",
    sentiment: "Positive",
    priority: "Low",
    isRead: true
  },
  {
    id: 3,
    customer_name: "Joko Anwar",
    customer_email: "joko.anwar@email.com",
    subject: "App Crash saat login",
    content: "Setiap saya buka aplikasi langsung force close. Sudah coba reinstall tapi tetap sama.",
    preview: "Setiap saya buka aplikasi langsung force close. Sudah coba reinstall tapi tetap sama.",
    created_at: "2024-01-04T11:00:00",
    status: "Open",
    category: "Technical",
    sentiment: "Negative",
    priority: "High",
    isRead: false
  },
  {
    id: 4,
    customer_name: "Maya Indira",
    customer_email: "maya.indira@email.com",
    subject: "Minta fitur dark mode",
    content: "Apakah bisa ditambahkan fitur dark mode? Mata saya cepat lelah kalau pakai terus.",
    preview: "Apakah bisa ditambahkan fitur dark mode? Mata saya cepat lelah kalau pakai terus.",
    created_at: "2024-01-04T12:30:00",
    status: "Open",
    category: "Feature Request",
    sentiment: "Neutral",
    priority: "Low",
    isRead: true
  },
  {
    id: 5,
    customer_name: "Ahmad Rizki",
    customer_email: "ahmad.rizki@email.com",
    subject: "Tidak bisa ganti password",
    content: "Saya lupa password lama, tapi email reset tidak masuk ke inbox saya.",
    preview: "Saya lupa password lama, tapi email reset tidak masuk ke inbox saya.",
    created_at: "2024-01-04T13:45:00",
    status: "In Progress",
    category: "Account",
    sentiment: "Negative",
    priority: "Medium",
    isRead: false
  },
  {
    id: 6,
    customer_name: "Lisa Permata",
    customer_email: "lisa.permata@email.com",
    subject: "Refund belum diterima",
    content: "Sudah 7 hari kerja tapi refund saya belum masuk. Tolong dicek status refund saya.",
    preview: "Sudah 7 hari kerja tapi refund saya belum masuk. Tolong dicek status refund saya.",
    created_at: "2024-01-04T14:20:00",
    status: "Open",
    category: "Billing",
    sentiment: "Negative",
    priority: "Urgent",
    isRead: false
  },
  {
    id: 7,
    customer_name: "Rudi Hartono",
    customer_email: "rudi.hartono@email.com",
    subject: "Pertanyaan tentang pricing",
    content: "Saya tertarik dengan paket enterprise, bisa minta detail harga dan fiturnya?",
    preview: "Saya tertarik dengan paket enterprise, bisa minta detail harga dan fiturnya?",
    created_at: "2024-01-04T15:00:00",
    status: "Open",
    category: "General",
    sentiment: "Positive",
    priority: "Medium",
    isRead: true
  }
];

// ============================================================================
// KONFIGURASI TAG PRIORITAS - pake icon profesional aja, gausah pake emoji
// ============================================================================
const PRIORITY_CONFIG = {
  Urgent: {
    label: 'Urgent',
    bgColor: 'bg-red-50 dark:bg-red-950/40',
    textColor: 'text-red-700 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800',
    dotColor: 'bg-red-500',
    description: 'Requires immediate attention'
  },
  High: {
    label: 'High',
    bgColor: 'bg-orange-50 dark:bg-orange-950/40',
    textColor: 'text-orange-700 dark:text-orange-400',
    borderColor: 'border-orange-200 dark:border-orange-800',
    dotColor: 'bg-orange-500',
    description: 'High priority - address soon'
  },
  Medium: {
    label: 'Medium',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/40',
    textColor: 'text-yellow-700 dark:text-yellow-500',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    dotColor: 'bg-yellow-500',
    description: 'Normal priority'
  },
  Low: {
    label: 'Low',
    bgColor: 'bg-green-50 dark:bg-green-950/40',
    textColor: 'text-green-700 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800',
    dotColor: 'bg-green-500',
    description: 'Low priority - handle when available'
  }
} as const;

// ============================================================================
// KONFIGURASI TAG STATUS
// ============================================================================
const STATUS_CONFIG = {
  Open: {
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    textColor: 'text-blue-700 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  'In Progress': {
    bgColor: 'bg-purple-50 dark:bg-purple-950/50',
    textColor: 'text-purple-700 dark:text-purple-400',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  Closed: {
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    textColor: 'text-gray-600 dark:text-gray-400',
    borderColor: 'border-gray-200 dark:border-gray-700'
  }
} as const;

// ============================================================================
// INDIKATOR SENTIMEN - pake icon profesional
// ============================================================================
const SENTIMENT_CONFIG = {
  Positive: { color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-950/40' },
  Neutral: { color: 'text-gray-500 dark:text-gray-400', bgColor: 'bg-gray-50 dark:bg-gray-800' },
  Negative: { color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-950/40' }
} as const;

// komponen icon sentimen nih
const SentimentIcon = ({ sentiment }: { sentiment: 'Positive' | 'Neutral' | 'Negative' }) => {
  const config = SENTIMENT_CONFIG[sentiment];
  if (sentiment === 'Positive') return <FiSmile className={`w-4 h-4 ${config.color}`} />;
  if (sentiment === 'Negative') return <FiFrown className={`w-4 h-4 ${config.color}`} />;
  return <FiMeh className={`w-4 h-4 ${config.color}`} />;
};

// ============================================================================
// ICON - icon gede yang bersih banget
// ============================================================================
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
  </svg>
);

const InboxIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-6l-2 3h-4l-2-3H2"/>
    <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
  </svg>
);

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? '#f59e0b' : 'none'} stroke={filled ? '#f59e0b' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const CheckboxIcon = ({ checked = false }: { checked?: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {checked ? (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" fill="var(--primary-600, #2563eb)" stroke="var(--primary-600, #2563eb)"/>
        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5"/>
      </>
    ) : (
      <rect x="3" y="3" width="18" height="18" rx="3"/>
    )}
  </svg>
);

const SettingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

const SunIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

const ArchiveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8"/>
    <rect x="1" y="3" width="22" height="5"/>
    <line x1="10" y1="12" x2="14" y2="12"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
  </svg>
);

// ============================================================================
// FUNGSI-FUNGSI UTILITY
// ============================================================================
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  if (isYesterday) {
    return 'Yesterday';
  }
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============================================================================
// KOMPONEN TAG PRIORITAS
// ============================================================================
function PriorityTag({ priority }: { priority: keyof typeof PRIORITY_CONFIG }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;
  
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
      title={config.description}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
}

// ============================================================================
// KOMPONEN TAG STATUS
// ============================================================================
function StatusTag({ status }: { status: keyof typeof STATUS_CONFIG }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Open;
  const dotColor = status === 'Closed' ? 'bg-green-500' : status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500';
  
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
}

// ============================================================================
// KOMPONEN KARTU PESAN - design kartunya kece abis
// ============================================================================
function MessageCard({ message, isSelected, onSelect, onDelete, onArchive }: { 
  message: Message; 
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onArchive: (id: number) => void;
}) {
  const router = useRouter();
  const [isStarred, setIsStarred] = useState(false);
  const priorityKey = message.priority as keyof typeof PRIORITY_CONFIG;
  const statusKey = message.status as keyof typeof STATUS_CONFIG;
  const sentimentKey = message.sentiment as keyof typeof SENTIMENT_CONFIG;
  const sentimentConfig = SENTIMENT_CONFIG[sentimentKey];
  
  return (
    <article
      className={`
        group relative px-5 py-5 sm:px-7 sm:py-6 border-b border-gray-200 dark:border-gray-700/60
        transition-all duration-150 ease-out cursor-pointer
        ${!message.isRead 
          ? 'bg-white dark:bg-gray-900' 
          : 'bg-gray-50/50 dark:bg-gray-900/30'
        }
        ${isSelected 
          ? 'bg-blue-50 dark:bg-blue-950/30 border-l-[3px] border-l-blue-500' 
          : 'border-l-[3px] border-l-transparent'
        }
        hover:bg-gray-100/80 dark:hover:bg-gray-800/40
      `}
      onClick={() => router.push(`/inbox/${message.id}`)}
    >
      {/* Top Row - Gmail-style: Checkbox, Star, then content */}
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Left Actions - Checkbox & Star */}
        <div className="flex items-center gap-1 pt-1 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(message.id); }}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus-ring"
            aria-label={isSelected ? 'Deselect message' : 'Select message'}
          >
            <CheckboxIcon checked={isSelected} />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); setIsStarred(!isStarred); }}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-amber-500 transition-colors focus-ring"
            aria-label={isStarred ? 'Remove star' : 'Add star'}
          >
            <StarIcon filled={isStarred} />
          </button>
        </div>
        
        {/* avatar */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-base font-semibold shrink-0">
          {message.customer_name.charAt(0).toUpperCase()}
        </div>
        
        {/* konten utama */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* baris 1: nama sama tanggal */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`text-[15px] truncate ${!message.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                {message.customer_name}
              </span>
              <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400 truncate">
                {message.customer_email}
              </span>
            </div>
            <time 
              className={`text-sm shrink-0 ${!message.isRead ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              dateTime={message.created_at}
            >
              {formatDate(message.created_at)}
            </time>
          </div>
          
          {/* Row 2: Subject */}
          <h4 className={`text-[15px] leading-snug truncate ${!message.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {message.subject}
          </h4>
          
          {/* Row 3: Preview */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 sm:line-clamp-2 leading-relaxed">
            {message.preview}
          </p>
          
          {/* baris 4: tags - otomatis wrap di mobile */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2.5">
            <PriorityTag priority={priorityKey} />
            <StatusTag status={statusKey} />
            <span className="hidden sm:inline-flex items-center px-3.5 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              {message.category}
            </span>
            {sentimentKey && (
              <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg ${sentimentConfig?.bgColor || 'bg-gray-50'} ${sentimentConfig?.color || 'text-gray-600'} border border-current/20`} title={`${sentimentKey} sentiment`}>
                <SentimentIcon sentiment={sentimentKey} />
                <span className="hidden lg:inline">{sentimentKey}</span>
              </span>
            )}
          </div>
        </div>
        
        {/* aksi kanan - arsip sama hapus (muncul pas hover) */}
        <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onArchive(message.id); }}
            className="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus-ring"
            title="Archive"
          >
            <ArchiveIcon />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(message.id); }}
            className="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-red-600 transition-colors focus-ring"
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      
      {/* indikator belum dibaca - di sisi kiri */}
      {!message.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
      )}
    </article>
  );
}

// ============================================================================
// KOMPONEN SIDEBAR - sidebar yang rapih
// ============================================================================
function Sidebar({ 
  isOpen, 
  onClose, 
  unreadCount, 
  archivedCount,
  viewMode, 
  onViewModeChange,
  user,
  onLogout
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  unreadCount: number;
  archivedCount: number;
  viewMode: 'inbox' | 'archived';
  onViewModeChange: (mode: 'inbox' | 'archived') => void;
  user: { full_name: string; email: string; role: 'agent' | 'lead' } | null;
  onLogout: () => void;
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const cycleTheme = () => {
    const order: Theme[] = ['light', 'dark', 'system'];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };
  
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
      
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 pt-16
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300 ease-out
        lg:translate-x-0 lg:static lg:z-auto lg:pt-4
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Bagian Profil User */}
        {user && (
          <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{user.full_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`
                inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium
                ${user.role === 'lead' 
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' 
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                }
              `}>
                {user.role === 'lead' ? 'Team Lead' : 'Support Agent'}
              </span>
            </div>
          </div>
        )}
        
        {/* menu navigasi - lebih gampang dibaca dengan spacing bagus */}
        <nav className="px-3 pt-4 space-y-2">
          <button
            onClick={() => onViewModeChange('inbox')}
            className={`
              w-full flex items-center gap-3.5 px-4 py-3.5 rounded-lg
              font-medium text-base transition-all
              ${viewMode === 'inbox' 
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <InboxIcon />
            <span className="flex-1 text-left">Inbox</span>
            {unreadCount > 0 && (
              <span className="min-w-6 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold text-center">
                {unreadCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => onViewModeChange('archived')}
            className={`
              w-full flex items-center gap-3.5 px-4 py-3.5 rounded-lg
              font-medium text-base transition-all
              ${viewMode === 'archived' 
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <ArchiveIcon />
            <span className="flex-1 text-left">Archived</span>
            {archivedCount > 0 && (
              <span className="min-w-6 px-2.5 py-1 rounded-lg bg-gray-500 text-white text-xs font-semibold text-center">
                {archivedCount}
              </span>
            )}
          </button>
          
          {/* analytics - khusus buat lead aja */}
          {user?.role === 'lead' && (
            <Link
              href="/analytics"
              className="
                flex items-center gap-3.5 px-4 py-3.5 rounded-lg
                text-gray-700 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-all text-base font-medium
                focus-ring
              "
            >
              <HiOutlineChartBar className="w-5 h-5" />
              <span>Analytics</span>
            </Link>
          )}
          
          {/* pembatas */}
          <div className="my-6 border-t border-gray-200 dark:border-gray-700/60" />
          
          <Link
            href="/settings"
            className="
              flex items-center gap-3 px-4 py-3.5 rounded-lg
              text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition-colors text-base font-medium
              focus-ring
            "
          >
            <SettingsIcon />
            <span>Settings</span>
          </Link>
          
          <button
            onClick={cycleTheme}
            className="
              w-full flex items-center gap-3 px-4 py-3.5 rounded-lg
              text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition-colors text-base font-medium
              focus-ring
            "
          >
            {resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
            <span>{theme === 'system' ? 'System Theme' : theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
          
          {/* tombol logout */}
          <button
            onClick={onLogout}
            className="
              w-full flex items-center gap-3 px-4 py-3.5 rounded-lg
              text-red-600 dark:text-red-400
              hover:bg-red-50 dark:hover:bg-red-900/20
              transition-colors text-base font-medium
              focus-ring
            "
          >
            <HiOutlineLogout className="w-5 h-5" />
            <span>Sign out</span>
          </button>
        </nav>
        
        {/* branding bawah */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Tumbas</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">AI Customer Support</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ============================================================================
// HALAMAN UTAMA - inbox kita
// ============================================================================
function InboxPageContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [archivedMessages, setArchivedMessages] = useState<Message[]>([]);
  const [viewMode, setViewMode] = useState<'inbox' | 'archived'>('inbox');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showNotification('success', 'Message deleted successfully');
    } catch (error) {
      console.error('Failed to delete message:', error);
      showNotification('error', 'Failed to delete message');
    }
  };
  
  const handleArchiveMessage = async (id: number) => {
    try {
      await archiveMessage(id);
      // pindahin pesan ke arsip dulu
      const messageToArchive = messages.find(m => m.id === id);
      if (messageToArchive) {
        setArchivedMessages(prev => [...prev, messageToArchive]);
      }
      setMessages(prev => prev.filter(m => m.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showNotification('success', 'Message archived successfully');
    } catch (error) {
      console.error('Failed to archive message:', error);
      showNotification('error', 'Failed to archive message');
    }
  };
  
  const handleUnarchiveMessage = async (id: number) => {
    try {
      // balikin pesan dari arsip ke inbox lagi
      const messageToUnarchive = archivedMessages.find(m => m.id === id);
      if (messageToUnarchive) {
        setMessages(prev => [...prev, messageToUnarchive]);
      }
      setArchivedMessages(prev => prev.filter(m => m.id !== id));
      showNotification('success', 'Message moved to inbox');
    } catch (error) {
      console.error('Failed to unarchive message:', error);
      showNotification('error', 'Failed to unarchive message');
    }
  };
  
  const unreadCount = messages.filter(m => !m.isRead).length;
  
  // tampil inbox atau arsip tergantung mode yang dipilih
  const currentMessages = viewMode === 'archived' ? archivedMessages : messages;
  
  const filteredMessages = currentMessages.filter(m => {
    const previewText = m.preview || m.content || '';
    const matchesSearch = 
      m.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      previewText.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = !filterPriority || m.priority === filterPriority;
    
    return matchesSearch && matchesPriority;
  });
  
  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  
  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Fetching messages from backend...');
      const data = await fetchMessages();
      console.log('✅ Got messages from backend:', data.length);
      // ubah data backend biar cocok sama yang frontend mau
      const enhanced = data.map((msg: Message) => ({
        ...msg,
        // pake content sebagai preview kalo preview gak ada
        preview: msg.preview || msg.content?.substring(0, 150) || '',
        // default isRead jadi false buat pesan baru
        isRead: msg.isRead ?? false,
        // nilai default buat field opsional
        priority: msg.priority || 'Medium',
        category: msg.category || 'General',
        sentiment: msg.sentiment || 'Neutral'
      }));
      setMessages(enhanced as Message[]);
    } catch (error) {
      // kalo backend mati, pake data mock aja
      console.error('❌ Backend error:', error);
      console.warn('Using mock data as fallback');
      setMessages(MOCK_MESSAGES);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => { loadMessages(); }, [loadMessages]);
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* notifikasi toast */}
      {notification && (
        <div className={`
          fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg border
          animate-fade-in-up
          ${notification.type === 'success' 
            ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' 
            : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
          }
        `}>
          <div className="flex items-center gap-3">
            <span className="text-lg">{notification.type === 'success' ? '✓' : '✕'}</span>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        unreadCount={unreadCount}
        archivedCount={archivedMessages.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        user={user}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - Clean, Gmail-like */}
        <header className="flex items-center gap-3 sm:gap-4 px-3 sm:px-6 h-14 sm:h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shrink-0">
          {/* Menu Button (Mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden text-gray-600 dark:text-gray-300 transition-colors focus-ring"
            aria-label="Open sidebar"
          >
            <MenuIcon />
          </button>
          
          {/* Logo (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 mr-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-base font-bold">T</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Tumbas</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{viewMode === 'archived' ? 'Archive' : 'Inbox'}</span>
            </div>
          </div>
          
          {/* pencarian */}
          <div className="flex-1 max-w-xl">
            <div className="
              relative flex items-center h-10 sm:h-11
              bg-gray-100 dark:bg-gray-800
              rounded-lg
              hover:bg-gray-50 dark:hover:bg-gray-700
              focus-within:bg-white dark:focus-within:bg-gray-800
              focus-within:ring-2 focus-within:ring-blue-500
              transition-all duration-150
              border border-transparent focus-within:border-blue-500
            ">
              <div className="pl-3 text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder={viewMode === 'archived' ? 'Search archived...' : 'Search messages...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  flex-1 h-full px-3 bg-transparent
                  text-gray-900 dark:text-white
                  placeholder:text-gray-500
                  text-sm sm:text-base
                  focus:outline-none
                "
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-2 mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          {/* tombol-tombol header */}
          <div className="flex items-center gap-1">
            <button
              onClick={loadMessages}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors focus-ring"
              title="Refresh"
            >
              <RefreshIcon />
            </button>
            
            <Link
              href="/settings"
              className="hidden sm:flex p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors focus-ring"
              title="Settings"
            >
              <SettingsIcon />
            </Link>
          </div>
        </header>
        
        {/* Toolbar - Compact, responsive with proper spacing */}
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 overflow-x-auto shrink-0">
          {/* pilih semua */}
          <button
            onClick={() => setSelectedIds(prev => prev.size === filteredMessages.length ? new Set() : new Set(filteredMessages.map(m => m.id)))}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 transition-colors focus-ring shrink-0"
            title="Select all"
          >
            <CheckboxIcon checked={selectedIds.size === filteredMessages.length && filteredMessages.length > 0} />
          </button>
          
          {/* tombol refresh */}
          <button 
            onClick={loadMessages} 
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 transition-colors focus-ring shrink-0"
            title="Refresh"
          >
            <RefreshIcon />
          </button>
          
          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 shrink-0" />
          
          {/* Priority Filters - Compact pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide">
            {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setFilterPriority(filterPriority === key ? null : key)}
                className={`
                  inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap
                  transition-all duration-150 shrink-0
                  ${filterPriority === key 
                    ? `${config.bgColor} ${config.textColor} ring-1 ring-inset ring-current` 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                {config.label}
              </button>
            ))}
          </div>
          
          {/* spasi */}
          <div className="flex-1 min-w-4" />
          
          {/* Message Count - Better positioned */}
          <span className="text-sm text-gray-500 dark:text-gray-400 pr-2 whitespace-nowrap">
            {filteredMessages.length > 0 
              ? `${selectedIds.size > 0 ? `${selectedIds.size} selected · ` : ''}${filteredMessages.length} ${viewMode === 'archived' ? 'archived' : 'message'}${filteredMessages.length !== 1 ? 's' : ''}`
              : viewMode === 'archived' ? 'No archived messages' : 'No messages'
            }
          </span>
        </div>
        
        {/* daftar pesan */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {viewMode === 'archived' ? <ArchiveIcon /> : <InboxIcon />}
              </div>
              <div className="text-center px-4">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {viewMode === 'archived' ? 'No archived messages' : 'No messages found'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {searchQuery 
                    ? 'Try adjusting your search terms' 
                    : viewMode === 'archived' 
                      ? 'Archived messages will appear here' 
                      : 'Your inbox is empty'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMessages.map(msg => (
                <MessageCard
                  key={msg.id}
                  message={msg}
                  isSelected={selectedIds.has(msg.id)}
                  onSelect={toggleSelect}
                  onDelete={handleDeleteMessage}
                  onArchive={viewMode === 'archived' ? handleUnarchiveMessage : handleArchiveMessage}
                />
              ))}
            </div>
          )}
        </main>
        
        {/* Footer Status Bar - Compact */}
        <footer className="flex items-center justify-between px-4 sm:px-6 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 shrink-0">
          <span className="font-medium">{viewMode === 'archived' ? `${archivedMessages.length} archived` : `${unreadCount} unread`}</span>
          <span className="hidden sm:inline">Powered by Tumbas AI</span>
          <span>Last refreshed: just now</span>
        </footer>
      </div>
    </div>
  );
}

// ============================================================================
// HALAMAN YANG DI-EXPORT + AUTENTIKASI
// ============================================================================
export default function InboxPage() {
  return (
    <ProtectedRoute>
      <InboxPageContent />
    </ProtectedRoute>
  );
}