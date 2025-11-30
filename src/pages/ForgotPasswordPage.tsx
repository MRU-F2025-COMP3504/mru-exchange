import { useAuth } from '@shared/contexts';
import type { NullableResult } from '@shared/types';
import { empty } from '@shared/utils';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submit, setSubmit] = useState<NullableResult<null>>(() => empty());
  const { password } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const result = await password().reset(form);

    setSubmit(result);
    setIsSubmitting(false);

    if (result.ok) {
      setMessage(
        'Password reset link has been sent to your email. Please check your inbox.',
      );
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Logo/Brand Section */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-indigo-600 mb-2'>
            MRU Exchange
          </h1>
          <p className='text-gray-600'>Reset Your Password</p>
        </div>

        {/* Reset Password Card */}
        <div className='bg-white rounded-lg shadow-xl p-8'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
            Forgot Password?
          </h2>

          <p className='text-gray-600 mb-6'>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <form
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
            className='space-y-6'
          >
            {/* Email Input */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address
                <input
                  name='email'
                  type='email'
                  placeholder='student@mtroyal.ca'
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors'
                  disabled={isSubmitting}
                />
              </label>
            </div>

            {/* Error Message */}
            {submit.error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
                {submit.error.message}
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm'>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Divider */}
          <div className='relative my-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>
                Remember your password?
              </span>
            </div>
          </div>

          {/* Back to Login Link */}
          <Link
            to='/signin'
            className='block w-full text-center py-3 border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors'
          >
            Back to Sign In
          </Link>
        </div>

        {/* Footer */}
        <div className='mt-8 text-center text-sm text-gray-600'>
          <p>
            Check your spam folder if you don't see the email within a few
            minutes
          </p>
        </div>
      </div>
    </div>
  );
}
