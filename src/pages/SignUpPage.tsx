import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@shared/contexts';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

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
    } else if (password !== confirmPassword) {
      // Validate password match
      setError('Passwords do not match');
      setIsLoading(false);

      return;
    } else if (password.length < 6) {
      // Validate password length
      setError('Password must be at least 6 characters long');
      setIsLoading(false);

      return;
    }

    const result = await auth.signUp(email, password, firstName, lastName);

    if (result.ok) {
      setSuccessMessage(
        'Account created successfully! Please check your email to verify your account.',
      );

      // Optionally redirect after a delay
      setTimeout(() => { navigate('/login'); }, 3000);
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
          <p className='text-gray-600'>Join the Campus Marketplace</p>
        </div>

        {/* Sign Up Card */}
        <div className='bg-white rounded-lg shadow-xl p-8'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
            Create Account
          </h2>

          <form onSubmit={void handleSubmit} className='space-y-4'>
            {/* First Name */}
            <div>
              <label
                htmlFor='firstName'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                First Name
              </label>
              <input
                id='firstName'
                type='text'
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); }}
                placeholder='John'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors'
                disabled={isLoading}
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor='lastName'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Last Name
              </label>
              <input
                id='lastName'
                type='text'
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); }}
                placeholder='Doe'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors'
                disabled={isLoading}
              />
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor='userName'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Username
              </label>
              <input
                id='userName'
                type='text'
                value={userName}
                onChange={(e) => { setUserName(e.target.value); }}
                placeholder='johndoe'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors'
                disabled={isLoading}
              />
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Email Address *
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

            {/* Password Input */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Password *
              </label>
              <input
                id='password'
                type='password'
                value={password}
                onChange={(e) => { setPassword(e.target.value); }}
                placeholder='Enter your password'
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors'
                disabled={isLoading}
              />
              <p className='mt-1 text-xs text-gray-500'>Minimum 6 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Confirm Password *
              </label>
              <input
                id='confirmPassword'
                type='password'
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); }}
                placeholder='Confirm your password'
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
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className='relative my-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link
            to='/login'
            className='block w-full text-center py-3 border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors'
          >
            Sign In
          </Link>
        </div>

        {/* Footer */}
        <div className='mt-8 text-center text-sm text-gray-600'>
          <p>
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
