/**
 * ============================================================================
 * KOMPONEN MESSAGE DETAIL VIEW
 * ============================================================================
 * tampilan lengkap pesan yang dipilih dengan riwayat percakapan, ringkasan AI,
 * dan composer buat bales. mirip kayak tampilan detail email Gmail.
 * ============================================================================
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Message, AISummary, AIResponseSuggestion, ConversationMessage } from '@/types';
import { 
  fetchAISummary, 
  fetchAIResponseSuggestion, 
  sendReply 
} from '@/lib/api';
import PriorityBadge from '@/components/ui/PriorityBadge';
import SentimentBadge from '@/components/ui/SentimentBadge';
import CategoryTag from '@/components/ui/CategoryTag';
import StatusBadge from '@/components/ui/StatusBadge';
import AISummaryPanel from './AISummaryPanel';
import AIResponseSuggestionPanel from './AIResponseSuggestion';
import { 
  ArrowLeftIcon, 
  SendIcon, 
  ClockIcon, 
  UserIcon,
  MailIcon,
  SparklesIcon
} from '@/components/icons/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface MessageDetailProps {
  message: Message | null;
  onBack: () => void;
  isLoading: boolean;
}

/**
 * format timestamp buat ditampilin
 * support created_at (backend) dan timestamp (legacy)
 */
function formatFullTimestamp(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * ambil inisial dari nama
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * komponen MessageDetail
 */
export default function MessageDetail({ 
  message, 
  onBack, 
  isLoading 
}: MessageDetailProps) {
  // state fitur AI
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  
  const [responseSuggestion, setResponseSuggestion] = useState<AIResponseSuggestion | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  
  // state composer buat balas
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showComposer, setShowComposer] = useState(false);

  // load ringkasan AI sama saran balasan pas pesan berubah
  useEffect(() => {
    if (message) {
      loadAISummary(message.id);
      loadAIResponseSuggestion(message.id);
    }
  }, [message?.id]);

  // ambil ringkasan AI
  const loadAISummary = async (messageId: number) => {
    setSummaryLoading(true);
    setSummaryError(null);
    
    try {
      const data = await fetchAISummary(messageId);
      setSummary(data);
    } catch (err) {
      setSummaryError('Failed to generate summary. Please try again.');
      // pake data mock sebagai fallback
      setSummary({
        messageId,
        summary: 'Customer is experiencing an issue with the product/service. They have tried basic troubleshooting steps and are expecting a quick resolution.',
        keyPoints: [
          'Customer is experiencing an issue with the product/service',
          'They have tried basic troubleshooting steps',
          'Expecting a quick resolution',
        ],
        suggestedCategory: message?.category,
        confidence: 0.85,
      });
      setSummaryError(null);
    } finally {
      setSummaryLoading(false);
    }
  };

  // ambil saran balasan AI
  const loadAIResponseSuggestion = async (messageId: number) => {
    setSuggestionLoading(true);
    
    try {
      const data = await fetchAIResponseSuggestion(messageId);
      setResponseSuggestion(data);
    } catch (err) {
      // pake data mock sebagai fallback
      setResponseSuggestion({
        suggestion: `Dear ${message?.customer_name || 'Customer'},

Thank you for reaching out to us. I completely understand how frustrating this situation must be, and I sincerely apologize for any inconvenience caused.

I've reviewed your case and I'm here to help you resolve this as quickly as possible. Let me look into this right away and provide you with a solution.

Please rest assured that we take your concerns seriously and are committed to making this right.

Is there anything else I can help you with?

Best regards,
Customer Support Team`,
        tone: 'empathetic',
        confidence: 0.92,
      });
    } finally {
      setSuggestionLoading(false);
    }
  };

  // handle pemakaian saran AI
  const handleUseSuggestion = (text: string) => {
    setReplyText(text);
    setShowComposer(true);
  };

  // handle kirim balasan
  const handleSendReply = async () => {
    if (!message || !replyText.trim()) return;
    
    // Validasi minimum 10 karakter (sesuai backend)
    if (replyText.trim().length < 10) {
      alert('Reply must be at least 10 characters');
      return;
    }
    
    setIsSending(true);
    
    try {
      console.log('Sending reply to message:', message.id);
      console.log('Reply content:', replyText);
      
      const success = await sendReply(message.id, replyText);
      
      if (success) {
        setReplyText('');
        setShowComposer(false);
        alert('Reply sent successfully!');
      } else {
        alert('Failed to send reply. Please try again.');
      }
    } catch (err) {
      console.error('Reply error:', err);
      alert(`Failed to send reply: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  // state kosong
  if (!message && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        <MailIcon size={64} className="mb-4 opacity-30" />
        <h3 className="text-xl font-medium mb-2">Select a message</h3>
        <p className="text-sm">Choose a message from the inbox to view details</p>
      </div>
    );
  }

  // state loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!message) return null;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start gap-4">
          {/* tombol back (mobile) */}
          <button
            onClick={onBack}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Back to inbox"
          >
            <ArrowLeftIcon size={20} className="text-gray-600 dark:text-gray-400" />
          </button>

          {/* avatar */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {getInitials(message.customer_name)}
          </div>

          {/* info header */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {message.subject}
              </h2>
              <StatusBadge status={message.status} />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-medium">{message.customer_name}</span>
              {message.customer_email && (
                <>
                  <span>•</span>
                  <span>{message.customer_email}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {message.priority && <PriorityBadge priority={message.priority} size="sm" />}
              {message.sentiment && <SentimentBadge sentiment={message.sentiment} size="sm" />}
              {message.category && <CategoryTag category={message.category} size="sm" />}
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <ClockIcon size={12} />
                <time>{formatFullTimestamp(message.created_at || message.timestamp || '')}</time>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* area konten */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* thread percakapan */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Conversation
              </h3>
              
              {/* pesan */}
              <div className="space-y-4">
                {message.conversation && message.conversation.length > 0 ? (
                  message.conversation.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-lg ${
                        msg.sender === 'customer'
                          ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                          : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 ml-8'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {msg.sender === 'customer' ? message.customer_name : 'Support Agent'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFullTimestamp(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  ))
                ) : (
                  // fallback: tampilin preview sebagai pesan awal
                  <div className="p-5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {message.customer_name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFullTimestamp(message.created_at || message.timestamp || '')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {message.preview || message.content || ''}
                    </p>
                  </div>
                )}
              </div>

              {/* composer buat balas */}
              <div className="mt-6">
                {!showComposer ? (
                  <button
                    onClick={() => setShowComposer(true)}
                    className="w-full p-5 text-left border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors"
                  >
                    Click to write a reply...
                  </button>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reply to {message.customer_name}
                      </span>
                    </div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      className="w-full p-4 min-h-[200px] text-sm text-gray-900 dark:text-white bg-transparent resize-none focus:outline-none"
                    />
                    <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      <button
                        onClick={() => {
                          setShowComposer(false);
                          setReplyText('');
                        }}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || isSending}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        {isSending ? (
                          <>
                            <LoadingSpinner size="sm" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <SendIcon size={16} />
                            Send Reply
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* panel AI */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon size={18} className="text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  AI Insights
                </h3>
              </div>
              
              {/* ringkasan AI */}
              <AISummaryPanel
                summary={summary}
                isLoading={summaryLoading}
                error={summaryError}
              />

              {/* saran balasan AI */}
              <AIResponseSuggestionPanel
                suggestion={responseSuggestion}
                isLoading={suggestionLoading}
                onUseSuggestion={handleUseSuggestion}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
