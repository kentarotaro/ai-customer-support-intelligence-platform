/**
 * ============================================================================
 * KOMPONEN AI SUMMARY PANEL
 * ============================================================================
 * nampilin ringkasan yang di-generate AI dari percakapan.
 * nunjukin poin-poin penting, niat customer, saran aksi, sama urgensinya.
 * ============================================================================
 */

'use client';

import React from 'react';
import { AISummary } from '@/types';
import { SparklesIcon, CheckIcon, AlertIcon } from '@/components/icons/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AISummaryPanelProps {
  summary: AISummary | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * komponen AISummaryPanel
 */
export default function AISummaryPanel({ 
  summary, 
  isLoading, 
  error 
}: AISummaryPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-5 border border-purple-100 dark:border-purple-800/50">
        <div className="flex items-center gap-2 mb-3">
          <SparklesIcon size={18} className="text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-purple-900 dark:text-purple-200">
            AI Summary
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" />
          <span className="ml-3 text-purple-600 dark:text-purple-400">
            Analyzing conversation...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-5 border border-red-100 dark:border-red-800/50">
        <div className="flex items-center gap-2 mb-2">
          <AlertIcon size={18} className="text-red-600 dark:text-red-400" />
          <h3 className="font-semibold text-red-900 dark:text-red-200">
            Summary Unavailable
          </h3>
        </div>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-5 border border-purple-100 dark:border-purple-800/50">
      {/* bagian header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
          <SparklesIcon size={16} className="text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="font-semibold text-purple-900 dark:text-purple-200">
          AI Summary
        </h3>
        <span className="ml-auto px-2.5 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-800/50 text-purple-700 dark:text-purple-300 rounded-lg">
          {Math.round((summary.confidence || 0.85) * 100)}% confidence
        </span>
      </div>

      {/* ringkasan utama */}
      {summary.summary && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-2">
            Summary
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
            {summary.summary}
          </p>
        </div>
      )}

      {/* poin-poin penting */}
      {summary.keyPoints && summary.keyPoints.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-2">
            Key Points
          </h4>
          <ul className="space-y-2">
            {summary.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckIcon 
                  size={14} 
                  className="text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0" 
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* kategori yang disaranin */}
      {summary.suggestedCategory && (
        <div className="flex items-center justify-between pt-3 border-t border-purple-100 dark:border-purple-800/50">
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
            Suggested Category
          </span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
            {summary.suggestedCategory}
          </span>
        </div>
      )}
    </div>
  );
}
