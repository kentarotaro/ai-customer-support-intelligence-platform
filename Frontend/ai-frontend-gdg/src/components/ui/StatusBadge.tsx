/**
 * ============================================================================
 * STATUS BADGE COMPONENT
 * ============================================================================
 * Displays the current status of a support ticket/message.
 * ============================================================================
 */

import React from 'react';
import { MessageStatus } from '@/types';

interface StatusBadgeProps {
  status: MessageStatus;
  size?: 'sm' | 'md';
}

/**
 * Get styling based on status
 */
function getStatusStyles(status: MessageStatus): { bg: string; text: string; border: string } {
  // normalize status ke lowercase buat comparison
  const normalizedStatus = status.toLowerCase();
  
  if (normalizedStatus === 'open') {
    return {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    };
  }
  
  if (normalizedStatus === 'in progress' || normalizedStatus === 'in_progress') {
    return {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
    };
  }
  
  if (normalizedStatus === 'closed' || normalizedStatus === 'resolved') {
    return {
      bg: 'bg-gray-50 dark:bg-gray-800/50',
      text: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-700',
    };
  }
  
  // default fallback
  return {
    bg: 'bg-gray-50 dark:bg-gray-800/50',
    text: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
  };
}

/**
 * Get display label for status
 */
function getStatusLabel(status: MessageStatus): string {
  const normalizedStatus = status.toLowerCase();
  
  if (normalizedStatus === 'open') return 'Open';
  if (normalizedStatus === 'in progress' || normalizedStatus === 'in_progress') return 'In Progress';
  if (normalizedStatus === 'closed' || normalizedStatus === 'resolved') return 'Closed';
  
  return status;
}

/**
 * StatusBadge Component
 */
export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const styles = getStatusStyles(status);
  const label = getStatusLabel(status);
  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-1 text-xs' 
    : 'px-3 py-1.5 text-xs';

  return (
    <span
      className={`
        inline-flex items-center rounded-lg font-medium border
        ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses}
      `}
    >
      {label}
    </span>
  );
}
