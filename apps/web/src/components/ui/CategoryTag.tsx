/**
 * ============================================================================
 * CATEGORY TAG COMPONENT
 * ============================================================================
 * Displays a tag indicating the AI-classified issue category.
 * ============================================================================
 */

import React from 'react';
import { Category } from '@/types';
import { TagIcon } from '@/components/icons/Icons';

interface CategoryTagProps {
  category: Category;
  size?: 'sm' | 'md';
}

/**
 * Get styling based on category
 */
function getCategoryStyles(category: Category): { bg: string; text: string } {
  switch (category) {
    case 'Billing':
      return {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-700 dark:text-purple-400',
      };
    case 'Technical':
      return {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
      };
    case 'General':
      return {
        bg: 'bg-gray-100 dark:bg-gray-700/50',
        text: 'text-gray-700 dark:text-gray-300',
      };
    case 'Account':
      return {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-700 dark:text-orange-400',
      };
    case 'Feature Request':
      return {
        bg: 'bg-cyan-100 dark:bg-cyan-900/30',
        text: 'text-cyan-700 dark:text-cyan-400',
      };
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-700/50',
        text: 'text-gray-700 dark:text-gray-300',
      };
  }
}

/**
 * CategoryTag Component
 */
export default function CategoryTag({ category, size = 'md' }: CategoryTagProps) {
  const styles = getCategoryStyles(category);
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-1 text-xs gap-1.5' 
    : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`
        inline-flex items-center rounded-lg font-medium
        ${styles.bg} ${styles.text} ${sizeClasses}
      `}
    >
      <TagIcon size={size === 'sm' ? 10 : 12} />
      <span>{category}</span>
    </span>
  );
}
