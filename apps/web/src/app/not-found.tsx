'use client';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '96px', fontWeight: 'bold', color: '#2563eb' }}>
          404
        </h1>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginTop: '16px' }}>
          Page Not Found
        </h2>
        <p style={{ color: '#6b7280', marginTop: '8px' }}>
          Sorry, the page you are looking for does not exist.
        </p>
        <a 
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '32px',
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          Back to Inbox
        </a>
      </div>
    </div>
  );
}