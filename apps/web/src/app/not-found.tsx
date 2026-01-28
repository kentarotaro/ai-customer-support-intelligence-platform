'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found</title>
      </head>
      <body style={{
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1e293b',
        color: '#f1f5f9',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          {/* Icon */}
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto 24px',
            backgroundColor: '#475569',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg 
              style={{ width: '40px', height: '40px', color: '#94a3b8' }}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>

          <h1 style={{ 
            fontSize: '96px', 
            fontWeight: 'bold', 
            color: '#60a5fa',
            margin: '0',
            lineHeight: '1'
          }}>
            404
          </h1>
          
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            marginTop: '16px',
            marginBottom: '8px'
          }}>
            Page Not Found
          </h2>
          
          <p style={{ 
            color: '#94a3b8', 
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '32px'
          }}>
            Sorry, the page you are looking for does not exist or has been moved to another location.
          </p>

          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '15px'
              }}
            >
              <svg 
                style={{ width: '20px', height: '20px' }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              Back to Inbox
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#334155',
                color: '#e2e8f0',
                borderRadius: '8px',
                fontWeight: '500',
                fontSize: '15px',
                border: '1px solid #475569',
                cursor: 'pointer'
              }}
            >
              <svg 
                style={{ width: '20px', height: '20px' }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              Go Back
            </button>
          </div>

          <p style={{ 
            marginTop: '48px',
            fontSize: '14px',
            color: '#64748b'
          }}>
            Need help? Contact our support team or check the documentation.
          </p>
        </div>
      </body>
    </html>
  );
}