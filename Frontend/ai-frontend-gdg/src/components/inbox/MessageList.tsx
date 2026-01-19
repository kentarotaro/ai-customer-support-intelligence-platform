/**
 * ============================================================================
 * MESSAGE LIST COMPONENT
 * ============================================================================
 * Container for the inbox message list.
 * Includes search, filter, and refresh functionality.
 * ============================================================================
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Message, Priority, Sentiment, Category } from '@/types';
import MessageListItem from './MessageListItem';
import { RefreshIcon, InboxIcon } from '@/components/icons/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface MessageListProps {
  messages: Message[];
  selectedMessageId: number | null;
  onSelectMessage: (id: number) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

type FilterType = 'all' | Priority | Sentiment | Category | 'unread';

/**
 * MessageList Component
 */
export default function MessageList({
  messages,
  selectedMessageId,
  onSelectMessage,
  onRefresh,
  isLoading,
}: MessageListProps) {
  // state search sama filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // filter dan search pesan
  const filteredMessages = useMemo(() => {
    let result = [...messages];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (msg) =>
          msg.customer_name.toLowerCase().includes(query) ||
          msg.subject.toLowerCase().includes(query) ||
          (msg.preview || msg.content || '').toLowerCase().includes(query)
      );
    }

    // terapin filter kategori/prioritas/sentimen
    if (activeFilter !== 'all') {
      if (activeFilter === 'unread') {
        result = result.filter((msg) => !msg.isRead);
      } else if (['High', 'Medium', 'Low'].includes(activeFilter)) {
        result = result.filter((msg) => msg.priority === activeFilter);
      } else if (['Positive', 'Neutral', 'Negative'].includes(activeFilter)) {
        result = result.filter((msg) => msg.sentiment === activeFilter);
      } else {
        result = result.filter((msg) => msg.category === activeFilter);
      }
    }

    return result;
  }, [messages, searchQuery, activeFilter]);

  // opsi-opsi filter
  const filterOptions: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Unread', value: 'unread' },
    { label: 'High Priority', value: 'High' },
    { label: 'Negative', value: 'Negative' },
    { label: 'Technical', value: 'Technical' },
    { label: 'Billing', value: 'Billing' },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <InboxIcon size={24} className="text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Inbox
            </h2>
            <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg">
              {messages.length}
            </span>
          </div>
          
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
            aria-label="Refresh inbox"
          >
            <RefreshIcon 
              size={20} 
              className={`text-gray-600 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>

        {/* Search input */}
        <div className="relative mb-4">
          <input
            type="search"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '3rem' }}
            className="w-full px-4 py-3.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`
                px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors
                ${activeFilter === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <InboxIcon size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No messages found</p>
            <p className="text-sm">
              {searchQuery || activeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Your inbox is empty'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredMessages.map((message) => (
              <MessageListItem
                key={message.id}
                message={message}
                isSelected={selectedMessageId === message.id}
                onClick={() => onSelectMessage(message.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
