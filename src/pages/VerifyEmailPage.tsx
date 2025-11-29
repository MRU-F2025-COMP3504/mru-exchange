import { useAuth } from '@shared/contexts';
import type { Result } from '@shared/types';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SignupState {
  email: Result<string>;
}

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { resend } = useAuth();

  const email = (location.state as SignupState).email;

  const handleResend = async () => {
    if (!email.ok) {
      setMessage('Email address not found. Please try signing up again.');

      return;
    }

    setIsResending(true);

    const result = await resend().email('signup', email);

    if (!result.ok) {
      setMessage('Failed to resend link. Please try again.');
    } else {
      setMessage('Verification link sent successfully!');
    }

    setIsResending(false);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-xl shadow-lg p-10 text-center'>
          {/* Success Icon */}
          <div className='mb-6 flex justify-center'>
            <div className='w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center'>
              <svg
                className='w-12 h-12 text-white'
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

          <h2 className='text-2xl font-bold text-gray-900 mb-3'>
            Check your email
          </h2>

          <p className='text-gray-500 mb-6 leading-6'>
            We've sent a link to verify your @mtroyal.ca email address.
          </p>

          {email.ok && (
            <p className='text-sm text-gray-600 mb-6'>
              Sent to: <strong>{email.data}</strong>
            </p>
          )}

          {/* Resend Link */}
          <div className='pt-4 border-t border-gray-200'>
            <p className='text-sm text-gray-500'>
              Didn't receive it?{' '}
              <button
                onClick={() => {
                  void handleResend();
                }}
                disabled={isResending}
                className={`font-medium bg-transparent border-none underline ${isResending
                    ? 'text-blue-300 cursor-not-allowed'
                    : 'text-blue-600 cursor-pointer'
                  }`}
              >
                {isResending ? 'Sending...' : 'Resend link.'}
              </button>
            </p>

            {message && (
              <p
                className={`text-sm mt-3 ${message.includes('successfully')
                    ? 'text-emerald-500'
                    : 'text-red-600'
                  }`}
              >
                {message}
              </p>
            )}
          </div>

          {/* Back to Sign In */}
          <button
            onClick={() => {
              navigate('/signin');
            }}
            className='mt-6 text-sm text-gray-500 bg-transparent border-none cursor-pointer underline'
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
