/**
 * ============================================================================
 * HALAMAN ANALYTICS - dashboard team lead
 * ============================================================================
 * dashboard analytics lengkap yang nampilin statistik pesan, trend,
 * dan metrik performa AI. cuma bisa diakses role 'lead' doang.
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

  // komponen kartu statistik
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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  // komponen progress bar dengan indikator titik
  const ProgressBar = ({ label, value, max, color, dotColor }: { label: string; value: number; max: number; color: string; dotColor?: string }) => {
    const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2.5">
            {dotColor && <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />}
            {label}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{value} ({percentage}%)</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              >
                <HiOutlineArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Welcome back, {user?.full_name}
                </p>
              </div>
            </div>
            <button
              onClick={loadAnalytics}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              <HiOutlineRefresh className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* kalo ada error */}
        {error && (
          <div className="mb-6 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-4">
            <HiOutlineExclamationCircle className="w-6 h-6 text-red-500" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !analytics && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-400 dark:border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
            </div>
          </div>
        )}

        {/* Analytics Content */}
        {analytics && (
          <>
            {/* Last Updated */}
            {lastUpdated && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={HiOutlineInbox}
                label="Total Messages"
                value={analytics.total}
                color="bg-blue-500"
                description="All time messages"
              />
              <StatCard
                icon={HiOutlineClock}
                label="Open Tickets"
                value={analytics.by_status?.Open || 0}
                color="bg-amber-500"
                description="Awaiting response"
              />
              <StatCard
                icon={HiOutlineCheckCircle}
                label="Closed Tickets"
                value={analytics.by_status?.Closed || 0}
                color="bg-green-500"
                description="Resolved successfully"
              />
              <StatCard
                icon={HiOutlineSparkles}
                label="AI Processed"
                value={analytics.total}
                color="bg-purple-500"
                description="With AI analysis"
              />
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sentiment Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiOutlineTrendingUp className="w-5 h-5 text-blue-500" />
                  Sentiment Distribution
                </h3>
                <div className="space-y-4">
                  <ProgressBar
                    label="Positive"
                    value={analytics.by_sentiment?.Positive || 0}
                    max={analytics.total}
                    color="bg-green-500"
                    dotColor="bg-green-500"
                  />
                  <ProgressBar
                    label="Neutral"
                    value={analytics.by_sentiment?.Neutral || 0}
                    max={analytics.total}
                    color="bg-gray-400"
                    dotColor="bg-gray-400"
                  />
                  <ProgressBar
                    label="Negative"
                    value={analytics.by_sentiment?.Negative || 0}
                    max={analytics.total}
                    color="bg-red-500"
                    dotColor="bg-red-500"
                  />
                </div>
              </div>

              {/* Priority Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiOutlineExclamationCircle className="w-5 h-5 text-amber-500" />
                  Priority Distribution
                </h3>
                <div className="space-y-4">
                  <ProgressBar
                    label="High"
                    value={analytics.by_priority?.High || 0}
                    max={analytics.total}
                    color="bg-red-500"
                    dotColor="bg-red-500"
                  />
                  <ProgressBar
                    label="Medium"
                    value={analytics.by_priority?.Medium || 0}
                    max={analytics.total}
                    color="bg-yellow-500"
                    dotColor="bg-yellow-500"
                  />
                  <ProgressBar
                    label="Low"
                    value={analytics.by_priority?.Low || 0}
                    max={analytics.total}
                    color="bg-green-500"
                    dotColor="bg-green-500"
                  />
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiOutlineInbox className="w-5 h-5 text-indigo-500" />
                  Category Breakdown
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {analytics.by_category && Object.entries(analytics.by_category).map(([category, count]) => (
                    <div 
                      key={category}
                      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center"
                    >
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{count as number}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-1">{category}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Performance */}
            <div className="mt-6 bg-linear-to-br from-purple-500 to-indigo-600 rounded-lg p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <HiOutlineSparkles className="w-8 h-8" />
                  <h3 className="text-xl font-bold">AI Analysis Performance</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-purple-200 text-sm">Total Messages</p>
                  <p className="text-3xl font-bold">{analytics.total}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm">AI Analyzed</p>
                  <p className="text-3xl font-bold">{analytics.total}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Analysis Rate</p>
                  <p className="text-3xl font-bold">100%</p>
                </div>
              </div>
            </div>
          </>
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
