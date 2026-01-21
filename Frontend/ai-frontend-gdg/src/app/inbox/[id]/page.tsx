'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Message, AISummary, AIResponseSuggestion } from '@/types';
import { fetchMessageById, fetchAISummary, fetchAIResponseSuggestion, sendReply, markAsRead, deleteMessage, editReply } from '@/lib/api';

// ============================================================================
// KONFIGURASI TAG PRIORITAS - design lebih kreatif dan humanlike
// ============================================================================
const PRIORITY_CONFIG = {
  Urgent: {
    label: '🔴 Urgent',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    textColor: 'text-rose-800 dark:text-rose-300',
    borderColor: 'border-rose-300 dark:border-rose-700',
    description: 'Requires immediate attention'
  },
  High: {
    label: '🟠 High',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-800 dark:text-amber-300',
    borderColor: 'border-amber-300 dark:border-amber-700',
    description: 'High priority - address soon'
  },
  Medium: {
    label: '🟡 Medium',
    bgColor: 'bg-sky-100 dark:bg-sky-900/30',
    textColor: 'text-sky-800 dark:text-sky-300',
    borderColor: 'border-sky-300 dark:border-sky-700',
    description: 'Normal priority'
  },
  Low: {
    label: '🟢 Low',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    textColor: 'text-emerald-800 dark:text-emerald-300',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
    description: 'Low priority - handle when available'
  }
} as const;

// ============================================================================
// KONFIGURASI TAG STATUS - lebih simple dan natural
// ============================================================================
const STATUS_CONFIG = {
  Open: {
    label: '📬 Open',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    textColor: 'text-indigo-800 dark:text-indigo-300',
    borderColor: 'border-indigo-300 dark:border-indigo-700'
  },
  'In Progress': {
    label: '⏳ In Progress',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    textColor: 'text-violet-800 dark:text-violet-300',
    borderColor: 'border-violet-300 dark:border-violet-700'
  },
  Closed: {
    label: '✅ Closed',
    bgColor: 'bg-slate-100 dark:bg-slate-800/50',
    textColor: 'text-slate-700 dark:text-slate-300',
    borderColor: 'border-slate-300 dark:border-slate-600'
  }
} as const;

// ============================================================================
// INDIKATOR SENTIMEN - icon profesional
// ============================================================================
const SENTIMENT_CONFIG = {
  Positive: { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/50' },
  Neutral: { color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800' },
  Negative: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/50' }
} as const;

// komponen icon sentimen
const SentimentIcon = ({ sentiment, size = 16 }: { sentiment: string; size?: number }) => {
  if (sentiment === 'Positive') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    );
  }
  if (sentiment === 'Negative') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="8" y1="15" x2="16" y2="15"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  );
};

// ============================================================================
// DATA MOCK (cadangan kalo backend lagi mati)
// ============================================================================
const MOCK_MESSAGES: Record<number, Message> = {
  1: {
    id: 1,
    customer_name: "Budi Santoso",
    customer_email: "budi.santoso@email.com",
    subject: "Saldo tidak masuk",
    content: "Saya sudah topup 50rb tapi saldo masih 0. Mohon segera ditangani karena saya butuh untuk transaksi penting. Ini bukti transfernya sudah saya lampirkan. Tolong dicek segera ya!",
    preview: "Saya sudah topup 50rb tapi saldo masih 0.",
    created_at: "2024-01-04T09:30:00",
    status: "Open",
    category: "Billing",
    sentiment: "Negative",
    priority: "Urgent",
    isRead: false,
    conversation: [
      { id: 1, sender: 'customer', content: 'Saya sudah topup 50rb tapi saldo masih 0. Mohon segera ditangani karena saya butuh untuk transaksi penting. Ini bukti transfernya sudah saya lampirkan. Tolong dicek segera ya!', timestamp: '2024-01-04T09:30:00' }
    ]
  },
  2: {
    id: 2,
    customer_name: "Siti Aminah",
    customer_email: "siti.aminah@email.com",
    subject: "Fitur baru bagus!",
    content: "Terima kasih update terbarunya sangat membantu. Dashboard baru sangat user friendly! Tim kalian memang hebat.",
    preview: "Terima kasih update terbarunya sangat membantu.",
    created_at: "2024-01-04T10:15:00",
    status: "Closed",
    category: "General",
    sentiment: "Positive",
    priority: "Low",
    isRead: true,
    conversation: [
      { id: 1, sender: 'customer', content: 'Terima kasih update terbarunya sangat membantu. Dashboard baru sangat user friendly! Tim kalian memang hebat.', timestamp: '2024-01-04T10:15:00' },
      { id: 2, sender: 'support', content: 'Terima kasih atas feedback positifnya! Kami senang mendengar bahwa Anda menyukai fitur baru kami. Jangan ragu untuk menghubungi kami jika ada yang bisa kami bantu.', timestamp: '2024-01-04T10:45:00' }
    ]
  },
  3: {
    id: 3,
    customer_name: "Joko Anwar",
    customer_email: "joko.anwar@email.com",
    subject: "App Crash saat login",
    content: "Setiap saya buka aplikasi langsung force close. Sudah coba reinstall tapi tetap sama. HP saya Samsung Galaxy S21, Android 13. Tolong dibantu, saya tidak bisa akses akun saya sama sekali!",
    preview: "Setiap saya buka aplikasi langsung force close.",
    created_at: "2024-01-04T11:00:00",
    status: "Open",
    category: "Technical",
    sentiment: "Negative",
    priority: "High",
    isRead: false,
    conversation: [
      { id: 1, sender: 'customer', content: 'Setiap saya buka aplikasi langsung force close. Sudah coba reinstall tapi tetap sama. HP saya Samsung Galaxy S21, Android 13. Tolong dibantu, saya tidak bisa akses akun saya sama sekali!', timestamp: '2024-01-04T11:00:00' }
    ]
  },
  4: {
    id: 4,
    customer_name: "Maya Indira",
    customer_email: "maya.indira@email.com",
    subject: "Minta fitur dark mode",
    content: "Apakah bisa ditambahkan fitur dark mode? Mata saya cepat lelah kalau pakai aplikasi terus, terutama malam hari.",
    preview: "Apakah bisa ditambahkan fitur dark mode?",
    created_at: "2024-01-04T12:30:00",
    status: "Open",
    category: "Feature Request",
    sentiment: "Neutral",
    priority: "Low",
    isRead: true,
    conversation: [
      { id: 1, sender: 'customer', content: 'Apakah bisa ditambahkan fitur dark mode? Mata saya cepat lelah kalau pakai aplikasi terus, terutama malam hari.', timestamp: '2024-01-04T12:30:00' }
    ]
  },
  5: {
    id: 5,
    customer_name: "Ahmad Rizki",
    customer_email: "ahmad.rizki@email.com",
    subject: "Tidak bisa ganti password",
    content: "Saya lupa password lama, tapi email reset tidak masuk ke inbox saya. Sudah cek spam folder juga tidak ada.",
    preview: "Saya lupa password lama, tapi email reset tidak masuk.",
    created_at: "2024-01-04T13:45:00",
    status: "In Progress",
    category: "Account",
    sentiment: "Negative",
    priority: "Medium",
    isRead: false,
    conversation: [
      { id: 1, sender: 'customer', content: 'Saya lupa password lama, tapi email reset tidak masuk ke inbox saya. Sudah cek spam folder juga tidak ada.', timestamp: '2024-01-04T13:45:00' }
    ]
  },
  6: {
    id: 6,
    customer_name: "Lisa Permata",
    customer_email: "lisa.permata@email.com",
    subject: "Refund belum diterima",
    content: "Sudah 7 hari kerja tapi refund saya belum masuk ke rekening. Nomor order #12345. Tolong dicek status refund saya.",
    preview: "Sudah 7 hari kerja tapi refund saya belum masuk.",
    created_at: "2024-01-04T14:20:00",
    status: "Open",
    category: "Billing",
    sentiment: "Negative",
    priority: "Urgent",
    isRead: false,
    conversation: [
      { id: 1, sender: 'customer', content: 'Sudah 7 hari kerja tapi refund saya belum masuk ke rekening. Nomor order #12345. Tolong dicek status refund saya.', timestamp: '2024-01-04T14:20:00' }
    ]
  },
  7: {
    id: 7,
    customer_name: "Rudi Hartono",
    customer_email: "rudi.hartono@email.com",
    subject: "Pertanyaan tentang pricing",
    content: "Saya tertarik dengan paket enterprise untuk perusahaan saya. Bisa minta detail harga dan fiturnya?",
    preview: "Saya tertarik dengan paket enterprise.",
    created_at: "2024-01-04T15:00:00",
    status: "Open",
    category: "General",
    sentiment: "Positive",
    priority: "Medium",
    isRead: true,
    conversation: [
      { id: 1, sender: 'customer', content: 'Saya tertarik dengan paket enterprise untuk perusahaan saya. Bisa minta detail harga dan fiturnya?', timestamp: '2024-01-04T15:00:00' }
    ]
  }
};

// ============================================================================
// ICON - icon stroke-based yang gede dan kece
// ============================================================================
const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
  </svg>
);

const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const ReplyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 17 4 12 9 7"/>
    <path d="M20 18v-2a4 4 0 00-4-4H4"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
  </svg>
);

const SparklesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18M3 12h18M5.64 5.64l12.72 12.72M5.64 18.36l12.72-12.72"/>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

const TagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const InboxIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-6l-2 3h-4l-2-3H2"/>
    <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
  </svg>
);

const PrintIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
);

// ============================================================================
// FUNGSI-FUNGSI UTILITY
// ============================================================================
function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// ============================================================================
// KOMPONEN TAG PRIORITAS - simple dan humanlike
// ============================================================================
function PriorityTag({ priority }: { priority: string }) {
  const config = PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.Medium;
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
      title={config.description}
    >
      {config.label}
    </span>
  );
}

// ============================================================================
// KOMPONEN TAG STATUS - simple dan readable
// ============================================================================
function StatusTag({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.Open;
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
    >
      {config.label}
    </span>
  );
}

// ============================================================================
// REPLY COMPOSER - design yang kece
// ============================================================================
function ReplyComposer({ 
  recipientName, 
  recipientEmail, 
  subject,
  suggestion,
  onSend,
  isSending,
  onCancel
}: { 
  recipientName: string;
  recipientEmail: string;
  subject: string;
  suggestion: AIResponseSuggestion | null;
  onSend: (text: string) => void;
  isSending: boolean;
  onCancel: () => void;
}) {
  const [replyText, setReplyText] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(true);
  
  const applySuggestion = () => {
    if (suggestion) {
      setReplyText(suggestion.suggestion);
      setShowSuggestion(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm overflow-hidden">
      {/* bagian header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
            <ReplyIcon />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Reply to Message</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Re: {subject}</p>
          </div>
        </div>
        <button 
          onClick={onCancel} 
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <CloseIcon />
        </button>
      </div>
      
      {/* penerima */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-base text-gray-500 dark:text-gray-400">To:</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {recipientName.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-base font-medium text-gray-900 dark:text-white">{recipientName}</span>
              <span className="text-base text-gray-500 dark:text-gray-400 ml-2">&lt;{recipientEmail}&gt;</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* saran AI */}
      {suggestion && showSuggestion && (
        <div className="px-6 py-5 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/50">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
              <SparklesIcon />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300">AI Suggested Response</h4>
                <span className="text-sm text-blue-600 dark:text-blue-400">{Math.round((suggestion.confidence || 0.9) * 100)}% match</span>
              </div>
              <p className="text-base text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
                {suggestion.suggestion}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={applySuggestion}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus-ring"
                >
                  Use this response
                </button>
                <button
                  onClick={() => setShowSuggestion(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* area teks */}
      <div className="p-6">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write your reply..."
          rows={10}
          className="w-full text-base text-gray-800 dark:text-gray-200 bg-transparent resize-none focus:outline-none leading-relaxed"
        />
      </div>
      
      {/* tombol-tombol aksi */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSend(replyText)}
            disabled={!replyText.trim() || isSending}
            className="
              flex items-center gap-2 px-6 py-3 
              text-base font-semibold
              bg-blue-600 
              hover:bg-blue-700
              rounded-md
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
              focus-ring
            "
            style={{ color: 'white' }}
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <SendIcon />
            )}
            <span className="text-white">Send Reply</span>
          </button>
        </div>
        
        <button
          onClick={onCancel}
          className="px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MESSAGE BUBBLE - thread percakapan yang rapih
// ============================================================================
function MessageBubble({ 
  message, 
  customerName, 
  customerEmail,
  isExpanded,
  onToggle,
  onEdit,
  replyId
}: { 
  message: { id: number; sender: string; content: string; timestamp: string };
  customerName: string;
  customerEmail: string;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit?: (replyId: number, currentContent: string) => void;
  replyId?: number;
}) {
  const isSupport = message.sender === 'support';
  const [showMenu, setShowMenu] = useState(false);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMenu]);
  
  return (
    <article className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 relative z-10 hover:z-20">
      {/* Header - Always visible - using div with onClick instead of button to avoid nesting */}
      <div 
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
        className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left focus-ring"
      >
        {/* Avatar */}
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 ${isSupport ? 'bg-emerald-600' : 'bg-blue-600'}`}>
          {isSupport ? 'CS' : customerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        
        {/* Name & Preview */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {isSupport ? 'Support Team' : customerName}
            </span>
            {isSupport && (
              <span className="hidden sm:inline px-2 py-1 text-[10px] font-medium rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                Agent
              </span>
            )}
          </div>
          {!isExpanded ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {message.content.slice(0, 80)}...
            </p>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              to {isSupport ? customerEmail : 'Support Team'}
            </p>
          )}
        </div>
        
        {/* Date & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <time className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400">
            {formatFullDate(message.timestamp)}
          </time>
          {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
      </div>
      
      {/* Content - Only when expanded */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pl-14 sm:pl-20 animate-fade-in">
          <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus-ring">
              <ReplyIcon />
              <span>Reply</span>
            </button>
            
            {/* Three dots menu with dropdown */}
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus-ring"
              >
                <MoreIcon />
              </button>
              
              {/* Dropdown menu - opens upward to avoid overlapping with messages below */}
              {showMenu && (
                <div 
                  className="absolute right-0 bottom-full mb-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-[9999]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isSupport && onEdit && replyId && (
                    <button
                      onClick={() => {
                        onEdit(replyId, message.content);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <EditIcon />
                      <span>Edit Reply</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

// ============================================================================
// HALAMAN UTAMA - detail pesan yang lengkap
// ============================================================================
export default function MessageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const messageId = Number(params.id);
  
  const [message, setMessage] = useState<Message | null>(null);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [suggestion, setSuggestion] = useState<AIResponseSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set());
  const [showReply, setShowReply] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Edit reply state
  const [editingReply, setEditingReply] = useState<{ id: number; content: string } | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Handle edit reply
  const handleStartEdit = (replyId: number, currentContent: string) => {
    setEditingReply({ id: replyId, content: currentContent });
    setEditContent(currentContent);
  };
  
  const handleSaveEdit = async () => {
    if (!editingReply || !editContent.trim()) return;
    
    if (editContent.trim().length < 10) {
      showNotification('error', 'Reply must be at least 10 characters');
      return;
    }
    
    setIsEditing(true);
    try {
      await editReply(editingReply.id, editContent.trim());
      
      // Update local state immediately so UI reflects the change
      setMessage(prev => {
        if (!prev) return null;
        return {
          ...prev,
          conversation: prev.conversation?.map(msg => 
            msg.id === editingReply.id 
              ? { ...msg, content: editContent.trim() }
              : msg
          ),
          replies: prev.replies?.map(reply =>
            reply.id === editingReply.id
              ? { ...reply, reply_content: editContent.trim(), updated_at: new Date().toISOString() }
              : reply
          )
        };
      });
      
      showNotification('success', 'Reply updated successfully');
      setEditingReply(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to edit reply:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to update reply');
    } finally {
      setIsEditing(false);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingReply(null);
    setEditContent('');
  };
  
  const handleDeleteMessage = async () => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    setIsDeleting(true);
    try {
      await deleteMessage(messageId);
      showNotification('success', 'Message deleted successfully');
      setTimeout(() => router.push('/'), 1000);
    } catch (error) {
      console.error('Failed to delete message:', error);
      showNotification('error', 'Failed to delete message');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const loadMessage = useCallback(async () => {
    setIsLoading(true);
    try {
      const [msgData, summaryData, suggestionData] = await Promise.all([
        fetchMessageById(messageId),
        fetchAISummary(messageId),
        fetchAIResponseSuggestion(messageId)
      ]);
      
      const mockMsg = MOCK_MESSAGES[messageId];
      
      // Build conversation from backend data
      const conversation: Array<{id: number; sender: 'customer' | 'support'; content: string; timestamp: string}> = [];
      
      // Add the original customer message from backend
      if (msgData.content) {
        conversation.push({
          id: msgData.id,
          sender: 'customer' as const,
          content: msgData.content,
          timestamp: msgData.created_at || msgData.timestamp || new Date().toISOString()
        });
      }
      
      // Add all replies from backend as support messages
      if (msgData.replies && msgData.replies.length > 0) {
        msgData.replies.forEach(reply => {
          conversation.push({
            id: reply.id,
            sender: 'support' as const,
            content: reply.reply_content,
            timestamp: reply.created_at
          });
        });
      }
      
      // Sort conversation by timestamp
      conversation.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      const fullMessage = {
        ...msgData,
        customer_email: mockMsg?.customer_email || msgData.customer_email,
        conversation,
      } as Message;
      
      setMessage(fullMessage);
      setSummary(summaryData);
      setSuggestion(suggestionData);
      
      // tampilin pesan terakhir secara default
      if (fullMessage.conversation?.length) {
        setExpandedMessages(new Set([fullMessage.conversation[fullMessage.conversation.length - 1].id]));
      }
      
      await markAsRead(messageId);
    } catch {
      const mockMsg = MOCK_MESSAGES[messageId];
      if (mockMsg) {
        setMessage(mockMsg);
        setSummary({
          messageId,
          summary: `Customer ${mockMsg.customer_name} is reaching out about: ${mockMsg.subject}. This is a ${mockMsg.priority || 'Medium'} priority ${mockMsg.category || 'General'} issue with ${(mockMsg.sentiment || 'Neutral').toLowerCase()} sentiment.`,
          keyPoints: ['Issue reported by customer', 'Requires follow-up', 'Check related systems'],
          suggestedCategory: mockMsg.category,
          confidence: 0.85
        });
        setSuggestion({
          messageId,
          suggestion: `Dear ${mockMsg.customer_name},\n\nThank you for reaching out to us. I understand your concern regarding "${mockMsg.subject}". I'm looking into this matter right now and will get back to you shortly with an update.\n\nPlease let me know if you have any additional information that might help us resolve this faster.\n\nBest regards,\nSupport Team`,
          tone: 'empathetic',
          confidence: 0.9
        });
        if (mockMsg.conversation?.length) {
          setExpandedMessages(new Set([mockMsg.conversation[mockMsg.conversation.length - 1].id]));
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [messageId]);
  
  useEffect(() => {
    if (messageId) loadMessage();
  }, [messageId, loadMessage]);
  
  const handleSendReply = async (text: string) => {
    if (!text.trim() || !message) return;
    
    setIsSending(true);
    try {
      const response = await sendReply(messageId, text);
      
      // Use the reply ID from backend if available
      const replyId = response.data?.id || Date.now();
      
      const newReply = {
        id: replyId,
        sender: 'support' as const,
        content: text,
        timestamp: response.data?.created_at || new Date().toISOString()
      };
      
      // Add to conversation only if this ID doesn't already exist
      setMessage(prev => {
        if (!prev) return null;
        
        // Check if this reply already exists
        const existingReply = prev.conversation?.find(msg => msg.id === replyId);
        if (existingReply) return prev; // Don't add duplicate
        
        return {
          ...prev,
          conversation: [...(prev.conversation || []), newReply],
          replies: [...(prev.replies || []), { id: replyId, reply_content: text, created_at: newReply.timestamp }]
        };
      });
      
      setExpandedMessages(new Set([newReply.id]));
      setShowReply(false);
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  const toggleMessage = (id: number) => {
    setExpandedMessages(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  
  // pas lagi loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-blue-500 rounded-full animate-spin" />
        <p className="text-base text-gray-600 dark:text-gray-400">Loading message...</p>
      </div>
    );
  }
  
  // kalo pesannya ga ketemu
  if (!message) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
          <InboxIcon />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">Message not found</h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400">The message you are looking for does not exist or has been deleted.</p>
        </div>
        <Link 
          href="/" 
          className="px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors focus-ring"
        >
          Return to Inbox
        </Link>
      </div>
    );
  }
  
  const sentimentKey = message.sentiment as keyof typeof SENTIMENT_CONFIG;
  const sentimentConfig = SENTIMENT_CONFIG[sentimentKey];
  
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Notification Toast */}
      {notification && (
        <div className={`
          fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-sm border
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
      
      {/* Header - full width with centered content */}
      <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center h-14 sm:h-16 px-3 sm:px-6 gap-3 sm:gap-4 w-full max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors focus-ring"
            title="Back to inbox"
          >
            <ArrowLeftIcon />
          </button>
          
          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700" />
          
          {/* Actions - proper spacing to prevent overlap */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={handleDeleteMessage}
              disabled={isDeleting}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors focus-ring disabled:opacity-50"
              title="Delete"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <TrashIcon />
              )}
            </button>
            <button 
              className="hidden sm:flex p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors focus-ring"
              title="Mark as unread"
            >
              <MailIcon />
            </button>
            <button 
              className="hidden sm:flex p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors focus-ring"
              title="Print"
            >
              <PrintIcon />
            </button>
          </div>
          
          <div className="flex-1" />
          
          {/* Message Navigation */}
          <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">
            Message {messageId} of 7
          </span>
        </div>
      </header>
      
      {/* Content - Gmail-style: message centered, AI sidebar fixed on right */}
      <div className="flex justify-center w-full p-3 sm:p-4 lg:p-6">
        {/* Centered content wrapper */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full max-w-5xl">
          {/* Main message area - takes most space, truly centered */}
          <div className="flex-1 min-w-0 space-y-4 sm:space-y-5">
          {/* Subject Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              {/* Subject */}
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {message.subject}
              </h1>
              
              {/* Tags Row */}
              <div className="flex flex-wrap items-center gap-2.5">
                {message.priority && <PriorityTag priority={message.priority} />}
                <StatusTag status={message.status} />
                
                {message.category && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    <TagIcon />
                    {message.category}
                  </span>
                )}
                
                {sentimentKey && (
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md ${sentimentConfig?.bg || 'bg-gray-50'} ${sentimentConfig?.color || 'text-gray-600'} border border-current/20`}>
                    <SentimentIcon sentiment={sentimentKey} size={14} />
                    {message.sentiment}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Conversation Thread */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-visible">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                Conversation ({message.conversation?.length || 0} messages)
              </h2>
            </div>
            
            {message.conversation?.map((msg) => {
              // Find the matching reply ID for support messages
              // Count support messages before this one to get the correct reply index
              let replyId: number | undefined = undefined;
              if (msg.sender === 'support' && message.replies && message.replies.length > 0) {
                const supportMessagesBeforeThis = message.conversation
                  ?.slice(0, message.conversation.indexOf(msg))
                  .filter(m => m.sender === 'support').length || 0;
                // Only set replyId if we have a matching reply from backend
                replyId = message.replies[supportMessagesBeforeThis]?.id;
              }
              
              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  customerName={message.customer_name}
                  customerEmail={message.customer_email!}
                  isExpanded={expandedMessages.has(msg.id)}
                  onToggle={() => toggleMessage(msg.id)}
                  onEdit={handleStartEdit}
                  replyId={replyId}
                />
              );
            })}
          </div>
          
          {/* Edit Reply Modal */}
          {editingReply && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Reply</h3>
                </div>
                <div className="p-6">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Edit your reply..."
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Minimum 10 characters required
                  </p>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isEditing || editContent.trim().length < 10}
                    className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isEditing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Reply Area */}
          {!showReply ? (
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowReply(true)}
                  className="
                    flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3
                    text-sm font-bold text-white
                    bg-blue-600
                    hover:bg-blue-700
                    rounded-lg
                    transition-colors
                    focus-ring
                  "
                >
                  <ReplyIcon />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          ) : (
            <ReplyComposer
              recipientName={message.customer_name}
              recipientEmail={message.customer_email!}
              subject={message.subject}
              suggestion={suggestion}
              onSend={handleSendReply}
              isSending={isSending}
              onCancel={() => setShowReply(false)}
            />
          )}
        </div>
        
        {/* AI Summary Sidebar - fixed width, right side */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-20 space-y-4">
            {/* AI Summary Card */}
            {summary && (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-visible">
                {/* Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b border-blue-100 dark:border-blue-900/50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
                      <SparklesIcon />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white">AI Analysis</h3>
                      <span className="text-xs text-blue-600 dark:text-blue-400">{Math.round((summary.confidence || 0.85) * 100)}% confidence</span>
                    </div>
                  </div>
                </div>
                
                {/* Summary */}
                <div className="px-4 py-3">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Summary</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {summary.summary}
                  </p>
                </div>
                
                {/* Key Points */}
                {summary.keyPoints && summary.keyPoints.length > 0 && (
                  <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Key Points</h4>
                    <ul className="space-y-2">
                      {summary.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-semibold shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Quick Stats */}
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">Sentiment</span>
                    <span className={`flex items-center gap-1.5 text-sm font-medium ${sentimentConfig?.color || 'text-gray-600'}`}>
                      <span className="shrink-0"><SentimentIcon sentiment={sentimentKey || 'Neutral'} size={16} /></span>
                      <span className="truncate">{message.sentiment || 'Neutral'}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">Status</span>
                    <StatusTag status={message.status} />
                  </div>
                  {message.priority && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">Priority</span>
                      <PriorityTag priority={message.priority} />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Customer Info Card */}
            <div className="mt-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-white mb-3">Customer</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-base font-semibold">
                  {message.customer_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{message.customer_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{message.customer_email}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
        </div>
      </div>
    </div>
  );
}
