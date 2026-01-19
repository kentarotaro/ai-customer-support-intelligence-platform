/**
 * ============================================================================
 * LOADING SPINNER COMPONENT
 * ============================================================================
 * Animated loading spinner for async operations.
 * ============================================================================
 */

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * LoadingSpinner Component
 */
export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        border-gray-300 dark:border-gray-600
        border-t-blue-600 dark:border-t-blue-400
        rounded-full animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
}

/**
 * Full page loading state
 */
export function LoadingPage({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}
