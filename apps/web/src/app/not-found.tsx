'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-center px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-2xl">
        {/* 404 Number with Animation */}
        <div className="relative">
          <h1 className="text-9xl md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-extrabold text-blue-600/10 dark:text-blue-400/10 blur-2xl">
            404
          </div>
        </div>
        
        {/* Error Message */}
        <div className="mt-8 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Sorry, the page you are looking for does not exist or has been moved to another location.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/"
            className="group relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Home className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
            <span>Back to Inbox</span>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="group inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Additional Help Text */}
        <div className="mt-12 text-sm text-gray-500 dark:text-gray-500">
          <p>Need help? Contact our support team or check the documentation.</p>
        </div>
      </div>
    </div>
  );
}