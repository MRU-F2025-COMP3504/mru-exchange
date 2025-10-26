import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts';

export default function CreateAccountPage() {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.endsWith('@mtroyal.ca')) {
      newErrors.email = 'Please use a valid @mtroyal.ca address';
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
      );

      if (error) {
        if (error.message.includes('already registered')) {
          setErrors({ email: 'An account with this email already exists.' });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      navigate('/verify-email', { state: { email: formData.email } });
    } catch (error: any) {
      console.error('Error creating account:', error);
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
              Create Account
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
              Sign up using your @mtroyal.ca email
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
              <label htmlFor='firstName' style={labelStyle}>
                First Name
              </label>
              <input
                id='firstName'
                type='text'
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder='Enter your first name'
                style={inputStyle(!!errors.firstName)}
              />
              {errors.firstName && (
                <p style={errorStyle}>
                  <span>✕</span> {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='lastName' style={labelStyle}>
                Last Name
              </label>
              <input
                id='lastName'
                type='text'
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder='Enter your last name'
                style={inputStyle(!!errors.lastName)}
              />
              {errors.lastName && (
                <p style={errorStyle}>
                  <span>✕</span> {errors.lastName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='email' style={labelStyle}>
                Email
              </label>
              <input
                id='email'
                type='email'
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
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
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder='Create a password'
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
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange('confirmPassword', e.target.value)
                }
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
                <p style={{ fontSize: '0.75rem', color: '#DC2626' }}>
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
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
              Already have an account?{' '}
              <button
                type='button'
                onClick={() => navigate('/signin')}
                style={{
                  color: '#2563EB',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
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
