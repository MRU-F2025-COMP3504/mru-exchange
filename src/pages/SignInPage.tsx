import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts';

export default function SignInPage() {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.endsWith('@mtroyal.ca')) {
      newErrors.email = 'Please use a valid @mtroyal.ca address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const signer = signin();

      signer.email(formData.email);
      signer.password(formData.password);

      const result = await signer.submit();

      if (!result.ok) {
        setErrors({ general: 'Invalid email or password' });
        return;
      }

      navigate('/home');
    } catch (error: any) {
      console.error('Error signing in:', error);
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
      <div style={{ width: '100%', maxWidth: '24rem' }}>
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '2rem',
          }}
        >
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <img
              src='/MruExchangeLogo.png'
              alt='MRU Exchange Logo'
              style={{
                width: '100px',
                height: 'auto',
                marginBottom: '1rem',
                margin: '0 auto 1rem',
              }}
            />
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.25rem',
              }}
            >
              Sign In
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
              Sign in to your MRU Exchange account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem',
            }}
          >
            <div>
              <label htmlFor='email' style={labelStyle}>
                Email
              </label>
              <input
                id='email'
                type='email'
                value={formData.email}
                onChange={(e) => {
                  handleChange('email', e.target.value);
                }}
                placeholder='yourname@mtroyal.ca'
                style={inputStyle(!!errors.email)}
              />
              {errors.email && (
                <p style={errorStyle}>
                  <span>✕</span> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='password' style={labelStyle}>
                Password
              </label>
              <input
                id='password'
                type='password'
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
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            <p
              style={{
                textAlign: 'center',
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '0.25rem',
              }}
            >
              Don't have an account?{' '}
              <button
                type='button'
                onClick={() => {
                  navigate('/create-account');
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
                Create account.
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
