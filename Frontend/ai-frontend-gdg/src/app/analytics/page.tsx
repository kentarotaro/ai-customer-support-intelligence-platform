/**
 * ============================================================================
 * halaman analytics buat lead aja nih
 * ============================================================================
 * dashboard lengkap yang nampilin semua statistik pesan, sentimen, prioritas,
 * sama metrik AI. cuma lead yang bisa masuk kesini.
 * ============================================================================
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { fetchAnalyticsOverview } from '@/lib/api';
import type { AnalyticsOverview } from '@/types';
import { 
  HiOutlineArrowLeft,
  HiOutlineInbox,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineTrendingUp,
  HiOutlineRefresh,
  HiOutlineExclamationCircle
} from 'react-icons/hi';

function AnalyticsPageContent() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchAnalyticsOverview();
      setAnalytics(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // kartu statistik yang simpel dan enak dilihat
  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    color,
    description 
  }: { 
    icon: React.ElementType; 
    label: string; 
    value: string | number; 
    color: string;
    description?: string;
  }) => (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-6 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{description}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );

  // progress bar nya biar gampang dibaca
  const ProgressBar = ({ label, value, max, color, emoji }: { label: string; value: number; max: number; color: string; emoji?: string }) => {
    const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            {emoji && <span className="text-base">{emoji}</span>}
            {label}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold tabular-nums">{value}</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500">{percentage}% of total</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* bagian header atas */}
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400 transition-colors"
                aria-label="Back to inbox"
              >
                <HiOutlineArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Welcome, {user?.full_name}
                </p>
              </div>
            </div>
            <button
              onClick={loadAnalytics}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm"
              aria-label="Refresh analytics data"
            >
              <HiOutlineRefresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* konten utama nya */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* kalo ada error pas load data */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-lg flex items-start gap-3">
            <HiOutlineExclamationCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">Error loading data</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* pas lagi loading data */}
        {isLoading && !analytics && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-200 dark:border-zinc-800 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">Loading analytics...</p>
            </div>
          </div>
        )}

        {/* data analytics udah siap ditampilin */}
        {analytics && (
          <div className="space-y-8">
            {/* kapan terakhir di update */}
            {lastUpdated && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated at {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}

            {/* statistik utama yang penting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={HiOutlineInbox}
                label="Total Messages"
                value={analytics.total}
                color="bg-blue-600"
                description="All time"
              />
              <StatCard
                icon={HiOutlineClock}
                label="Open"
                value={analytics.by_status?.Open || 0}
                color="bg-amber-600"
                description="Need attention"
              />
              <StatCard
                icon={HiOutlineCheckCircle}
                label="Closed"
                value={analytics.by_status?.Closed || 0}
                color="bg-green-600"
                description="Resolved"
              />
              <StatCard
                icon={HiOutlineSparkles}
                label="AI Analyzed"
                value={analytics.total}
                color="bg-violet-600"
                description="100% coverage"
              />
            </div>

            {/* breakdown detail analytics nya */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* sentimen positif negatif gitu */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <HiOutlineTrendingUp className="w-5 h-5 text-blue-600" />
                  Sentiment Analysis
                </h3>
                <div className="space-y-5">
                  <ProgressBar
                    emoji="😊"
                    label="Positive"
                    value={analytics.by_sentiment?.Positive || 0}
                    max={analytics.total}
                    color="bg-green-500"
                  />
                  <ProgressBar
                    emoji="😐"
                    label="Neutral"
                    value={analytics.by_sentiment?.Neutral || 0}
                    max={analytics.total}
                    color="bg-gray-400"
                  />
                  <ProgressBar
                    emoji="😞"
                    label="Negative"
                    value={analytics.by_sentiment?.Negative || 0}
                    max={analytics.total}
                    color="bg-red-500"
                  />
                </div>
              </div>

              {/* prioritas tinggi rendah */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <HiOutlineExclamationCircle className="w-5 h-5 text-amber-600" />
                  Priority Levels
                </h3>
                <div className="space-y-5">
                  <ProgressBar
                    emoji="🔴"
                    label="High Priority"
                    value={analytics.by_priority?.High || 0}
                    max={analytics.total}
                    color="bg-red-500"
                  />
                  <ProgressBar
                    emoji="🟡"
                    label="Medium Priority"
                    value={analytics.by_priority?.Medium || 0}
                    max={analytics.total}
                    color="bg-amber-500"
                  />
                  <ProgressBar
                    emoji="🟢"
                    label="Low Priority"
                    value={analytics.by_priority?.Low || 0}
                    max={analytics.total}
                    color="bg-green-500"
                  />
                </div>
              </div>
            </div>

            {/* kategori pesan berdasarkan tipe */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <HiOutlineInbox className="w-5 h-5 text-indigo-600" />
                By Category
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {analytics.by_category && Object.entries(analytics.by_category).map(([category, count]) => (
                  <div 
                    key={category}
                    className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-5 text-center border border-gray-200 dark:border-zinc-700"
                  >
                    <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">{count as number}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize mt-2">{category}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* performa AI*/}
            <div className="bg-white dark:bg-zinc-900 rounded-lg border-2 border-blue-200 dark:border-blue-900/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <HiOutlineSparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Powered by Gemini AI</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Messages Received</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white tabular-nums">{analytics.total}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI Analyzed</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white tabular-nums">{analytics.total}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Coverage Rate</p>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">100%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['lead']}>
      <AnalyticsPageContent />
    </ProtectedRoute>
  );
}
