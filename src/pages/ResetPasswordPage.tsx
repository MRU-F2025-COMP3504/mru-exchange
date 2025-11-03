import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthAPI } from '@features/auth';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Validate @mtroyal.ca email
    if (!email.endsWith('@mtroyal.ca')) {
      setError('Please use a valid @mtroyal.ca email address');
      setIsLoading(false);
      return;
    }

    const result = await AuthAPI.resetPassword(email);

    if (result.ok) {
      setSuccessMessage(
        'Password reset link has been sent to your email. Please check your inbox.',
      );
      setEmail('');
    } else {
      setError(result.error.message);
    }

    setIsLoading(false);
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

          <form onSubmit={void handleSubmit} className='space-y-6'>
            {/* Email Input */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Email Address
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => { setEmail(e.target.value); }}
                placeholder='student@mtroyal.ca'
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors'
                disabled={isLoading}
              />
              <p className='mt-1 text-xs text-gray-500'>
                Must be a valid @mtroyal.ca email
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm'>
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
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
            to='/login'
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
