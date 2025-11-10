import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext.tsx';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Wrapper for routes that require authentication
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F9FAFB',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '3rem',
              height: '3rem',
              border: '4px solid #E5E7EB',
              borderTopColor: '#2563EB',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto',
            }}
          />
          <p style={{ marginTop: '1rem', color: '#6B7280' }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    return <Navigate to='/signin' replace />;
  }

  // Redirect to verify email if not confirmed
  if (!user.email_confirmed_at) {
    return <Navigate to='/verify-email' replace />;
  }

  return <>{children}</>;
}
