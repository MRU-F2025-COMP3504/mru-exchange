import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resendVerificationEmail } = useAuth();
  const email = location.state?.email || '';
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResendLink = async () => {
    if (!email) {
      setResendMessage('Email address not found. Please try signing up again.');
      return;
    }

    setIsResending(true);
    setResendMessage('');

    const { error } = await resendVerificationEmail(email);

    if (error) {
      setResendMessage('Failed to resend link. Please try again.');
    } else {
      setResendMessage('Verification link sent successfully!');
    }

    setIsResending(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #EFF6FF, #E0E7FF)',
        padding: '3rem 1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '2.5rem',
            textAlign: 'center',
          }}
        >
          {/* Success Icon */}
          <div
            style={{
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '5rem',
                height: '5rem',
                backgroundColor: '#10B981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                style={{ width: '3rem', height: '3rem', color: 'white' }}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                strokeWidth={3}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
          </div>

          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.75rem',
            }}
          >
            Check your email
          </h2>

          <p
            style={{
              color: '#6B7280',
              marginBottom: '1.5rem',
              lineHeight: '1.5',
            }}
          >
            We've sent a link to verify your @mtroyal.ca email address.
          </p>

          {email && (
            <p
              style={{
                fontSize: '0.875rem',
                color: '#4B5563',
                marginBottom: '1.5rem',
              }}
            >
              Sent to: <strong>{email}</strong>
            </p>
          )}

          {/* Resend Link */}
          <div
            style={{
              paddingTop: '1rem',
              borderTop: '1px solid #E5E7EB',
            }}
          >
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              Didn't receive it?{' '}
              <button
                onClick={handleResendLink}
                disabled={isResending}
                style={{
                  color: isResending ? '#93C5FD' : '#2563EB',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: isResending ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {isResending ? 'Sending...' : 'Resend link.'}
              </button>
            </p>

            {resendMessage && (
              <p
                style={{
                  fontSize: '0.875rem',
                  marginTop: '0.75rem',
                  color: resendMessage.includes('successfully')
                    ? '#10B981'
                    : '#DC2626',
                }}
              >
                {resendMessage}
              </p>
            )}
          </div>

          {/* Back to Sign In */}
          <button
            onClick={() => navigate('/signin')}
            style={{
              marginTop: '1.5rem',
              fontSize: '0.875rem',
              color: '#6B7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
