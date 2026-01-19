/**
 * ============================================================================
 * MESSAGE LIST ITEM COMPONENT
 * ============================================================================
 * Individual message row in the inbox list, similar to Gmail's message row.
 * Shows sender, subject, preview, timestamp, and AI-generated tags.
 * ============================================================================
 */

'use client';

import React from 'react';
import { Message } from '@/types';
import PriorityBadge from '@/components/ui/PriorityBadge';
import SentimentBadge from '@/components/ui/SentimentBadge';
import CategoryTag from '@/components/ui/CategoryTag';
import { ClockIcon, UserIcon } from '@/components/icons/Icons';

interface MessageListItemProps {
  message: Message;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * Format timestamp to relative time or date
 * Supports both created_at (backend) and timestamp (legacy)
 */
function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * Get initials from name
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
 * Get avatar background color based on name (consistent per user)
 */
function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  
  // fungsi hash simple buat warna konsisten
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * MessageListItem Component
 */
export default function MessageListItem({ 
  message, 
  isSelected, 
  onClick 
}: MessageListItemProps) {
  const isUnread = !message.isRead;

  return (
    <article
      onClick={onClick}
      className={`
        relative flex items-start gap-4 p-4 cursor-pointer
        border-b border-gray-100 dark:border-gray-800
        transition-all duration-200
        ${isSelected 
          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 border-l-transparent'
        }
        ${isUnread ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-900/50'}
      `}
      role="button"
      tabIndex={0}
      aria-label={`Message from ${message.customer_name}: ${message.subject}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Avatar */}
      <div 
        className={`
          flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
          text-white font-semibold text-sm
          ${getAvatarColor(message.customer_name)}
        `}
        aria-hidden="true"
      >
        {getInitials(message.customer_name)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top row: Name, Priority, Time */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <h3 
              className={`
                text-sm truncate
                ${isUnread 
                  ? 'font-semibold text-gray-900 dark:text-white' 
                  : 'font-medium text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {message.customer_name}
            </h3>
            {message.priority && <PriorityBadge priority={message.priority} size="sm" />}
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            <ClockIcon size={12} />
            <time dateTime={message.created_at || message.timestamp}>
              {formatTimestamp(message.created_at || message.timestamp || '')}
            </time>
          </div>
        </div>

        {/* Subject line */}
        <h4 
          className={`
            text-sm mb-1 truncate
            ${isUnread 
              ? 'font-medium text-gray-900 dark:text-white' 
              : 'text-gray-700 dark:text-gray-300'
            }
          `}
        >
          {message.subject}
        </h4>

        {/* Preview text */}
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-2">
          {message.preview || message.content?.substring(0, 100) || ''}
        </p>

        {/* Tags row */}
        <div className="flex items-center gap-2 flex-wrap">
          {message.category && <CategoryTag category={message.category} size="sm" />}
          {message.sentiment && <SentimentBadge sentiment={message.sentiment} size="sm" />}
        </div>
      </div>

      {/* Unread indicator */}
      {isUnread && (
        <div 
          className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"
          aria-label="Unread message"
        />
      )}
    </article>
  );
}
