import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts';
import { UserAuthentication } from '@shared/api';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const password = UserAuthentication.password();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    const form = new FormData(event.currentTarget);
    console.log(formData)

    setIsSubmitting(true);
    try {console.log(form)
      const update = await password.update(form, formData.password);

      if (!update.ok) {
        setErrors({ general: 'Password update failed' });
        return;
      }

      navigate('/signin');
    } catch (error: any) {
      console.error('Error confirming password:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    border: `1px solid ${hasError ? '#EF4444' : '#E5E7EB'}`,
    borderRadius: '0.375rem',
    backgroundColor: hasError ? '#FEF2F2' : '#F9FAFB',
    outline: 'none',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.25rem',
  };

  const errorStyle = {
    marginTop: '0.25rem',
    fontSize: '0.75rem',
    color: '#DC2626',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
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
            <h2 className='text-2xl font-bold text-gray-900 mb-1'>Reset Your Password</h2>
          </div>

          <form
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
            className='flex flex-col gap-4'
          >
            <div>
              <label htmlFor='password' style={labelStyle}>
                Password
              </label>
              <input
                id='password'
                type='password'
                name='password'
                value={formData.password}
                onChange={(e) => {
                  handleChange('password', e.target.value);
                }}
                placeholder='Enter your password'
                style={inputStyle(!!errors.password)}
              />
              {errors.password && (
                <p style={errorStyle}>
                  <span>✕</span> {errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='confirmPassword' style={labelStyle}>
                Confirm Password
              </label>
              <input
                id='confirmPassword'
                type='password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={(e) => {
                  handleChange('confirmPassword', e.target.value);
                }}
                placeholder='Re-enter your password'
                style={inputStyle(!!errors.confirmPassword)}
              />
              {errors.confirmPassword && (
                <p style={errorStyle}>
                  <span>✕</span> {errors.confirmPassword}
                </p>
              )}              
            </div>

            

            {errors.general && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  borderRadius: '0.375rem',
                  padding: '0.625rem',
                }}
              >
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <span>✕</span> {errors.general}
                </p>
              </div>
            )}

            <div style={{ marginTop: '0.5rem' }}>
              <button
                type='submit'
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.625rem 1rem',
                  backgroundColor: isSubmitting ? '#93C5FD' : '#2563EB',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
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
