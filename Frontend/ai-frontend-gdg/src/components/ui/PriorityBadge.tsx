/**
 * ============================================================================
 * PRIORITY BADGE COMPONENT
 * ============================================================================
 * Displays a colored badge indicating message priority level.
 * Colors: Red for High, Yellow for Medium, Green for Low
 * ============================================================================
 */

import React from 'react';
import { Priority } from '@/types';

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Get styling based on priority level
 */
function getPriorityStyles(priority: Priority): { bg: string; text: string; dot: string } {
  switch (priority) {
    case 'High':
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        dot: 'bg-red-500',
      };
    case 'Medium':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        dot: 'bg-yellow-500',
      };
    case 'Low':
    default:
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        dot: 'bg-green-500',
      };
  }
}

/**
 * Get size classes based on size prop
 */
function getSizeClasses(size: 'sm' | 'md' | 'lg'): { container: string; dot: string; text: string } {
  switch (size) {
    case 'sm':
      return {
        container: 'px-2 py-1 gap-1.5',
        dot: 'w-1.5 h-1.5',
        text: 'text-xs',
      };
    case 'md':
      return {
        container: 'px-2 py-1 gap-1.5',
        dot: 'w-2 h-2',
        text: 'text-xs',
      };
    case 'lg':
      return {
        container: 'px-3 py-1.5 gap-2',
        dot: 'w-2.5 h-2.5',
        text: 'text-sm',
      };
  }
}

/**
 * PriorityBadge Component
 * Renders a badge with priority indicator
 */
export default function PriorityBadge({ 
  priority, 
  showLabel = true, 
  size = 'md' 
}: PriorityBadgeProps) {
  const priorityStyles = getPriorityStyles(priority);
  const sizeClasses = getSizeClasses(size);

  return (
    <span
      className={`
        inline-flex items-center rounded-lg font-medium
        ${priorityStyles.bg} ${priorityStyles.text} ${sizeClasses.container}
      `}
      title={`Priority: ${priority}`}
    >
      {/* titik pulse yang beranimasi buat prioritas tinggi */}
      <span 
        className={`
          rounded-full ${priorityStyles.dot} ${sizeClasses.dot}
          ${priority === 'High' ? 'animate-pulse' : ''}
        `} 
      />
      {showLabel && <span className={sizeClasses.text}>{priority}</span>}
    </span>
  );
}
