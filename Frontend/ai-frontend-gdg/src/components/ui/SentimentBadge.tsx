/**
 * ============================================================================
 * SENTIMENT BADGE COMPONENT
 * ============================================================================
 * Displays a badge indicating AI-detected customer sentiment.
 * Uses appropriate colors and emojis for each sentiment type.
 * ============================================================================
 */

import React from 'react';
import { Sentiment } from '@/types';

interface SentimentBadgeProps {
  sentiment: Sentiment;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Get styling and emoji based on sentiment
 */
function getSentimentConfig(sentiment: Sentiment): { 
  bg: string; 
  text: string; 
  emoji: string;
  label: string;
} {
  switch (sentiment) {
    case 'Positive':
      return {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-700 dark:text-emerald-400',
        emoji: '😊',
        label: 'Positive',
      };
    case 'Neutral':
      return {
        bg: 'bg-gray-100 dark:bg-gray-700/50',
        text: 'text-gray-700 dark:text-gray-300',
        emoji: '😐',
        label: 'Neutral',
      };
    case 'Negative':
    default:
      return {
        bg: 'bg-rose-100 dark:bg-rose-900/30',
        text: 'text-rose-700 dark:text-rose-400',
        emoji: '😞',
        label: 'Negative',
      };
  }
}

/**
 * Get size classes
 */
function getSizeClasses(size: 'sm' | 'md' | 'lg'): { container: string; text: string } {
  switch (size) {
    case 'sm':
      return { container: 'px-2 py-1 gap-1.5', text: 'text-xs' };
    case 'md':
      return { container: 'px-2 py-1 gap-1.5', text: 'text-xs' };
    case 'lg':
      return { container: 'px-3 py-1.5 gap-2', text: 'text-sm' };
  }
}

/**
 * SentimentBadge Component
 * Renders a badge with sentiment indicator
 */
export default function SentimentBadge({ 
  sentiment, 
  showLabel = true, 
  size = 'md' 
}: SentimentBadgeProps) {
  const config = getSentimentConfig(sentiment);
  const sizeClasses = getSizeClasses(size);

  return (
    <span
      className={`
        inline-flex items-center rounded-lg font-medium
        ${config.bg} ${config.text} ${sizeClasses.container}
      `}
      title={`Sentiment: ${sentiment}`}
    >
      <span>{config.emoji}</span>
      {showLabel && <span className={sizeClasses.text}>{config.label}</span>}
    </span>
  );
}
