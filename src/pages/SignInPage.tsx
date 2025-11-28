import { useAuth } from '@shared/contexts';
import type { NullableResult } from '@shared/types';
import { empty, err } from '@shared/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SigninForm {
  email: NullableResult<string>;
  password: NullableResult<string>;
}

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submit, setSubmit] = useState<NullableResult<null>>(() => empty());
  const [form, setForm] = useState<SigninForm>(() => ({
    email: empty(),
    password: empty(),
  }));
  const navigate = useNavigate();
  const { signin } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const signer = signin();

    const result = {
      email: signer.email(form),
      password: signer.password(form),
    };

    setForm(result);

    if (!signer.isValid()) {
      setSubmit(err('Invalid email or password', result));
    } else {
      setIsSubmitting(true);

      const submit = await signer.submit();

      setSubmit(submit);
      setIsSubmitting(false);

      if (submit.ok) {
        navigate('/home');
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-200 px-4 py-12'>
      <div className='w-full max-w-sm'>
        <div className='bg-white rounded-xl shadow-lg p-8'>
          <div className='mb-6 text-center'>
            <img
              src='/MruExchangeLogo.png'
              alt='MRU Exchange Logo'
              className='w-24 h-auto mx-auto mb-4'
            />
            <h2 className='text-2xl font-bold text-gray-900 mb-1'>Sign In</h2>
            <p className='text-gray-500 text-sm'>
              Sign in to your MRU Exchange account
            </p>
          </div>

          <form
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
            className='flex flex-col gap-4'
          >
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
                <input
                  type='text'
                  name='email'
                  placeholder='yourname@mtroyal.ca'
                  className={`w-full px-3 py-2 text-sm border rounded-md outline-none ${form.email.error
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-gray-50'
                    }`}
                />
              </label>
              {form.email.error && (
                <p className='mt-1 text-xs text-red-600 flex items-center gap-1'>
                  <span>✕</span> {form.email.error.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Password
                <input
                  type='password'
                  name='password'
                  placeholder='Enter your password'
                  className={`w-full px-3 py-2 text-sm border rounded-md outline-none ${form.password.error
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-gray-50'
                    }`}
                />
              </label>
              {form.password.error && (
                <p className='mt-1 text-xs text-red-600 flex items-center gap-1'>
                  <span>✕</span> {form.password.error.message}
                </p>
              )}
              <p
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '0.3rem',
              }}
            >
              {' '}
              <button
                type='button'
                onClick={() => {
                  navigate('/forgot-password');
                }}
                style={{
                  color: '#2563EB',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Forgot Password?
              </button>
            </p>
            </div>           

            {submit.error && (
              <div className='bg-red-50 border border-red-200 rounded-md p-2'>
                <p className='text-xs text-red-600 flex items-center gap-1'>
                  <span>✕</span> {submit.error.message}
                </p>
              </div>
            )}

            <div className='mt-2'>
              <button
                type='submit'
                disabled={isSubmitting}
                className={`w-full px-4 py-2 text-white text-sm font-medium rounded-md border-none ${isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 cursor-pointer hover:bg-blue-700'
                  }`}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            <p className='text-center text-xs text-gray-500 mt-1'>
              Don't have an account?{' '}
              <button
                type='button'
                onClick={() => {
                  navigate('/create-account');
                }}
                className='text-blue-600 font-medium bg-transparent border-none cursor-pointer underline hover:text-blue-700'
              >
                Create account.
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
