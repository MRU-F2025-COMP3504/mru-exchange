import { useState, type FormEvent } from 'react';
import { useAuth } from '@shared/hooks';
import { useNavigate, Link } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate @mtroyal.ca email
    if (!email.endsWith('@mtroyal.ca')) {
      setError('Please use a valid @mtroyal.ca email address');
      setIsLoading(false);
      return;
    }

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError.message);
      } else {
        // Redirect to home page on successful login
        navigate('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
          <p className='text-gray-600'>Campus Marketplace for Students</p>
        </div>

        {/* Login Card */}
        <div className='bg-white rounded-lg shadow-xl p-8'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Sign In</h2>

          <form onSubmit={handleSubmit} className='space-y-6'>
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
                onChange={(e) => setEmail(e.target.value)}
                placeholder='student@mtroyal.ca'
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors'
                disabled={isLoading}
              />
              <p className='mt-1 text-xs text-gray-500'>
                Must be a valid @mtroyal.ca email
              </p>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Password
              </label>
              <input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors'
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className='mt-4 text-center'>
            <Link
              to='/reset-password'
              className='text-sm text-indigo-600 hover:text-indigo-800 hover:underline'
            >
              Forgot your password?
            </Link>
          </div>

          {/* Divider */}
          <div className='relative my-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to='/signup'
            className='block w-full text-center py-3 border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors'
          >
            Create Account
          </Link>
        </div>

        {/* Footer */}
        <div className='mt-8 text-center text-sm text-gray-600'>
          <p>
            Only MRU students with @mtroyal.ca email can access this platform
          </p>
        </div>
      </div>
    </div>
  );
};
