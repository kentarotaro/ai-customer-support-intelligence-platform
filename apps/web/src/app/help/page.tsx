/**
 * ============================================================================
 * HALAMAN BANTUAN & IT SUPPORT
 * ============================================================================
 * pusat bantuan yang bersih ala Gmail dengan FAQ dan kontak IT.
 * ============================================================================
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { Theme } from '@/types';

// icon-iconnya
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-amber-500" strokeWidth="2">
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-indigo-500" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

// data FAQ-nya
const FAQ_DATA = [
  {
    question: "How does the AI classify messages?",
    answer: "Our AI analyzes the content, tone, and context of each message to automatically classify it into categories like Technical, Billing, General, Account, or Feature Request. It also determines the priority level and customer sentiment."
  },
  {
    question: "How accurate is the AI sentiment analysis?",
    answer: "Our sentiment analysis model has an accuracy rate of over 90%. It considers word choice, punctuation, context, and patterns to determine if a customer is feeling positive, neutral, or negative."
  },
  {
    question: "Can I override the AI's classification?",
    answer: "Yes! The AI provides suggestions, but you have full control. You can manually change the category, priority, or any other classification if you believe it should be different."
  },
  {
    question: "How do I use the suggested responses?",
    answer: "Click 'Use This Response' to automatically insert the AI-generated response into the reply composer. You can then edit it as needed before sending. The response is just a starting point."
  },
  {
    question: "Why is my inbox not loading?",
    answer: "If your inbox isn't loading, try refreshing the page. If the issue persists, check your internet connection or contact IT support. The backend server may also need to be started."
  },
  {
    question: "How do I switch between dark and light mode?",
    answer: "Click on the theme toggle button in the sidebar or use the toggle in Settings. You can choose between Light, Dark, or System (which follows your device settings)."
  }
];

// komponen item FAQ-nya
function FAQItem({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void;
}) {
  return (
    <div className="border-b border-[var(--border-light)]">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-[var(--card-hover)] px-4 -mx-4 transition-colors"
      >
        <span className="font-medium text-[var(--foreground)]">{question}</span>
        <span className={`transform transition-transform duration-200 text-[var(--foreground-muted)] ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDownIcon />
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 text-[var(--foreground-secondary)] animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const cycleTheme = () => {
    const order: Theme[] = ['light', 'dark', 'system'];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto flex items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="p-2.5 rounded-lg hover:bg-[var(--card-hover)] text-[var(--foreground-secondary)] transition-colors"
          >
            <ArrowLeftIcon />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg text-white">
              <HelpIcon />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[var(--foreground)]">Help & IT Support</h1>
              <p className="text-sm text-[var(--foreground-muted)]">Get help with AI Support Platform</p>
            </div>
          </div>
          
          {/* toggle tema */}
          <button
            onClick={cycleTheme}
            className="ml-auto p-2 rounded-full hover:bg-[var(--card-hover)] text-[var(--foreground-secondary)] transition-colors"
            title={`Current: ${theme} mode`}
          >
            {resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </header>

      {/* konten utama */}
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* hubungi IT Support */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Contact IT Support</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 bg-[var(--card)] rounded-lg border border-[var(--border)] hover:shadow-[var(--shadow-md)] transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-950/50 rounded-md text-blue-600 dark:text-blue-400">
                  <MailIcon />
                </div>
                <span className="font-medium text-[var(--foreground)]">Email Support</span>
              </div>
              <a 
                href="mailto:it-support@company.com" 
                className="text-[var(--primary)] hover:underline"
              >
                it-support@company.com
              </a>
              <p className="text-sm text-[var(--foreground-muted)] mt-1">Response within 24 hours</p>
            </div>
            
            <div className="p-6 bg-[var(--card)] rounded-lg border border-[var(--border)] hover:shadow-[var(--shadow-md)] transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-green-100 dark:bg-green-950/50 rounded-md text-green-600 dark:text-green-400">
                  <PhoneIcon />
                </div>
                <span className="font-medium text-[var(--foreground)]">Phone Support</span>
              </div>
              <a 
                href="tel:+621234567890" 
                className="text-[var(--primary)] hover:underline"
              >
                +62 123 456 7890
              </a>
              <p className="text-sm text-[var(--foreground-muted)] mt-1">Mon-Fri, 9 AM - 6 PM</p>
            </div>
          </div>
        </section>

        {/* panduan troubleshooting */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Quick Troubleshooting</h2>
          <div className="p-6 bg-[var(--card)] rounded-lg border border-[var(--border)]">
            <ol className="space-y-3">
              {[
                "Refresh the page (F5 or Ctrl+R)",
                "Clear browser cache and cookies",
                "Check your internet connection",
                "Ensure backend server is running on port 4000",
                "Try a different browser",
                "Contact IT support if issue persists"
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-sm font-medium flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-[var(--foreground-secondary)]">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* bagian FAQ */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Frequently Asked Questions</h2>
          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-6">
            {FAQ_DATA.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={expandedFAQ === index}
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
