/**
 * ============================================================================
 * halaman agents list buat lead aja nih
 * ============================================================================
 * nampilin semua agent yang ada di sistem buat monitoring sama management.
 * cuma lead yang bisa masuk kesini.
 * ============================================================================
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { fetchAgentsList } from '@/lib/api';
import { 
  HiOutlineArrowLeft,
  HiOutlineUsers,
  HiOutlineRefresh,
  HiOutlineExclamationCircle,
  HiOutlineUserCircle,
  HiOutlineSearch
} from 'react-icons/hi';

interface Agent {
  id: string;
  full_name: string;
  role: string;
}

function AgentsPageContent() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadAgents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchAgentsList();
      setAgents(data);
      setFilteredAgents(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch agents:', err);
      setError('Failed to load agents data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  // filter agents berdasarkan search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAgents(agents);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = agents.filter(agent => 
        agent.full_name.toLowerCase().includes(query) ||
        agent.id.toLowerCase().includes(query)
      );
      setFilteredAgents(filtered);
    }
  }, [searchQuery, agents]);

  // kartu agent yang simpel dan enak dilihat
  const AgentCard = ({ agent }: { agent: Agent }) => (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-6 hover:border-gray-300 dark:hover:border-zinc-700 transition-all hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
          <HiOutlineUserCircle className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {agent.full_name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 capitalize">
              {agent.role}
            </span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 font-mono truncate">
            ID: {agent.id}
          </p>
        </div>
      </div>
    </div>
  );

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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agents List</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Welcome, {user?.full_name}
                </p>
              </div>
            </div>
            <button
              onClick={loadAgents}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm"
              aria-label="Refresh agents list"
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
        {isLoading && agents.length === 0 && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-200 dark:border-zinc-800 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">Loading agents...</p>
            </div>
          </div>
        )}

        {/* data agents udah siap ditampilin */}
        {!isLoading && agents.length > 0 && (
          <div className="space-y-8">
            {/* statistik dan search bar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* total agents */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Agents</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3 tabular-nums">{agents.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Registered in system</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-blue-600">
                    <HiOutlineUsers className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* search bar */}
              <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-6">
                <label htmlFor="search-agents" className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-3">
                  Search Agents
                </label>
                <div className="relative">
                  <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="search-agents"
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                {searchQuery && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Found {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {/* kapan terakhir di update */}
            {lastUpdated && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated at {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}

            {/* daftar agents dalam grid */}
            {filteredAgents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAgents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-12 text-center">
                <HiOutlineSearch className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">No agents found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Try adjusting your search query
                </p>
              </div>
            )}
          </div>
        )}

        {/* kalo ga ada agents sama sekali */}
        {!isLoading && agents.length === 0 && !error && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <HiOutlineUsers className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">No agents registered yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Agents will appear here once they register in the system
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AgentsPage() {
  return (
    <ProtectedRoute allowedRoles={['lead']}>
      <AgentsPageContent />
    </ProtectedRoute>
  );
}