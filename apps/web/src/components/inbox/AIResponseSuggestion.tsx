/**
 * ============================================================================
 * AI RESPONSE SUGGESTION COMPONENT
 * ============================================================================
 * Shows AI-suggested empathetic response for the customer support agent.
 * Agent has 100% authority to edit, use, or ignore the suggestion.
 * ============================================================================
 */

'use client';

import React, { useState } from 'react';
import { AIResponseSuggestion } from '@/types';
import { SparklesIcon, CopyIcon, CheckIcon } from '@/components/icons/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AIResponseSuggestionPanelProps {
  suggestion: AIResponseSuggestion | null;
  isLoading: boolean;
  onUseSuggestion: (text: string) => void;
}

/**
 * AIResponseSuggestionPanel Component
 */
export default function AIResponseSuggestionPanel({
  suggestion,
  isLoading,
  onUseSuggestion,
}: AIResponseSuggestionPanelProps) {
  const [copied, setCopied] = useState(false);

  // copy saran ke clipboard
  const handleCopy = async () => {
    if (!suggestion) return;
    
    try {
      await navigator.clipboard.writeText(suggestion.suggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // pake saran di reply
  const handleUseSuggestion = () => {
    if (suggestion) {
      onUseSuggestion(suggestion.suggestion);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-5 border border-emerald-100 dark:border-emerald-800/50">
        <div className="flex items-center gap-2 mb-3">
          <SparklesIcon size={18} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-semibold text-emerald-900 dark:text-emerald-200">
            AI Response Suggestion
          </h3>
        </div>
        <div className="flex items-center justify-center py-6">
          <LoadingSpinner size="sm" />
          <span className="ml-3 text-sm text-emerald-600 dark:text-emerald-400">
            Generating empathetic response...
          </span>
        </div>
      </div>
    );
  }

  if (!suggestion) {
    return null;
  }

  // ambil warna badge tone
  const toneColors = {
    empathetic: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-400',
    professional: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
    friendly: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-5 border border-emerald-100 dark:border-emerald-800/50">
      {/* bagian header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg">
            <SparklesIcon size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-semibold text-emerald-900 dark:text-emerald-200">
            Suggested Response
          </h3>
        </div>
        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${toneColors[suggestion.tone]}`}>
          {suggestion.tone}
        </span>
      </div>

      {/* teks saran */}
      <div className="bg-white/60 dark:bg-gray-800/60 rounded-md p-4 mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {suggestion.suggestion}
        </p>
      </div>

      {/* indikator confidence */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-emerald-700 dark:text-emerald-400">
          Confidence:
        </span>
        <div className="flex-1 h-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${suggestion.confidence * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
          {Math.round(suggestion.confidence * 100)}%
        </span>
      </div>

      {/* tombol-tombol aksi */}
      <div className="flex gap-2">
        <button
          onClick={handleUseSuggestion}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Use This Response
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-1 px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <CheckIcon size={16} className="text-green-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon size={16} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* disclaimer */}
      <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 text-center">
        💡 You have full control – edit, use, or ignore this suggestion
      </p>
    </div>
  );
}
