import { useAuth } from '@shared/contexts';
import type { NullableResult } from '@shared/types';
import { empty, err } from '@shared/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignupForm {
  email: NullableResult<string>;
  password: {
    original: NullableResult<string>;
    confirm: NullableResult<string>;
  };
  name: {
    first: NullableResult<string>;
    last: NullableResult<string>;
    alias: NullableResult<string>;
  };
}

export default function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submit, setSubmit] = useState<NullableResult<null>>(() => empty());
  const [form, setForm] = useState<SignupForm>(() => ({
    email: empty(),
    password: {
      original: empty(),
      confirm: empty(),
    },
    name: {
      first: empty(),
      last: empty(),
      alias: empty(),
    },
  }));
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const signer = signup();

    const name = signer.name(form);
    const result: SignupForm = {
      email: signer.email(form),
      password: {
        original: signer.password(form),
        confirm: signer.password(form, 'confirm-password'),
      },
      name: {
        first: name[0],
        last: name[1],
        alias: name[2],
      },
    };

    setForm(result);

    if (!signer.isSatisfied()) {
      setSubmit(err('Invalid user credentials', result));
    } else if (result.password.original.data !== result.password.confirm.data) {
      setSubmit(err('Passwords do not match', { password: result.password }));
    } else {
      setIsSubmitting(true);

      const submit = await signer.submit();

      setSubmit(submit);
      setIsSubmitting(false);

      if (submit.ok) {
        navigate('/verify-email', { state: { email: result.email } });
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12'>
      <div className='w-full max-w-sm'>
        <div className='bg-white rounded-xl shadow-xl p-8'>
          <div className='mb-6 text-center'>
            <img
              src='/MruExchangeLogo.png'
              alt='MRU Exchange Logo'
              className='w-25 h-auto mx-auto mb-4'
            />
            <h2 className='text-2xl font-bold text-gray-900 mb-1'>
              Create Account
            </h2>
            <p className='text-gray-500 text-sm'>
              Sign up using your @mtroyal.ca email
            </p>
          </div>

          <form
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
            className='flex flex-col space-y-3.5'
          >
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                First Name
                <input
                  type='text'
                  name='firstname'
                  placeholder='Enter your first name'
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none ${form.name.first.error
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-gray-50'
                    }`}
                />
              </label>
              {form.name.first.error && (
                <p className='mt-1 text-xs text-red-600 flex items-center gap-1'>
                  <span>✕</span> {form.name.first.error.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Last Name
                <input
                  type='text'
                  name='lastname'
                  placeholder='Enter your last name'
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none ${form.name.last.error
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-gray-50'
                    }`}
                />
              </label>
              {form.name.last.error && (
                <p className='mt-1 text-xs text-red-600 flex items-center gap-1'>
                  <span>✕</span> {form.name.last.error.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Alias (Nickname)
                <input
                  type='text'
                  name='alias'
                  placeholder='Enter your alias or nickname'
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none ${form.name.last.error
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-gray-50'
                    }`}
                />
              </label>
              {form.name.alias.error && (
                <p className='mt-1 text-xs text-red-600 flex items-center gap-1'>
                  <span>✕</span> {form.name.alias.error.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
                <input
                  type='text'
                  name='email'
                  placeholder='yourname@mtroyal.ca'
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none ${form.email.error
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
              </label>
              <input
                id='password'
                type='password'
                name='password'
                placeholder='Create a password'
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none ${form.password.original.error
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-gray-50'
                  }`}
              />
              {form.password.original.error && (
                <p className='mt-1 text-xs text-red-600 flex items-center gap-1'>
                  <span>✕</span> {form.password.original.error.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Confirm Password
                <input
                  type='password'
                  name='confirm-password'
                  placeholder='Re-enter your password'
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none ${form.password.confirm.error
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-gray-50'
                    }`}
                />
              </label>
              {form.password.confirm.error && (
                <p className='mt-1 text-xs text-red-600 flex items-center gap-1'>
                  <span>✕</span> {form.password.confirm.error.message}
                </p>
              )}
            </div>

            {submit.error && (
              <div className='bg-red-50 border border-red-200 rounded-md p-2.5'>
                <p className='text-xs text-red-600'>
                  <span>✕</span> {submit.error.message}
                </p>
              </div>
            )}

            <div className='mt-2'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full px-4 py-2.5 bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-md border-0 cursor-pointer disabled:cursor-not-allowed'
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            <p className='text-center text-xs text-gray-500 mt-1'>
              Already have an account?{' '}
              <button
                type='button'
                onClick={() => {
                  navigate('/signin');
                }}
                className='text-blue-600 font-medium bg-transparent border-0 cursor-pointer underline'
              >
                Sign in.
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
