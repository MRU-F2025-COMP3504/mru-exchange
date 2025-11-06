import { useAuth } from '@shared/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export default function HomePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      
      <Header/>

      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem',
            }}
          >
            Welcome to MRU Exchange! 🎉
          </h2>

          <div
            style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #DBEAFE',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <p style={{ color: '#1E40AF', fontSize: '0.875rem' }}>
              <strong>Email:</strong> {user?.email}
            </p>
            <p
              style={{
                color: '#1E40AF',
                fontSize: '0.875rem',
                marginTop: '0.5rem',
              }}
            >
              <strong>User ID:</strong> {user?.id}
            </p>
            <p
              style={{
                color: '#10B981',
                fontSize: '0.875rem',
                marginTop: '0.5rem',
              }}
            >
              ✓ Email Verified
            </p>
          </div>

          <div style={{ color: '#6B7280', lineHeight: '1.6' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.75rem',
              }}
            >
              Getting Started
            </h3>
            <p style={{ marginBottom: '0.5rem' }}>
              Welcome to your campus marketplace! Here's what you can do:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                Browse products listed by other MRU students
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                List your own items for sale (textbooks, parking passes, etc.)
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Message sellers directly to arrange purchases
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Leave reviews and ratings for products you've bought
              </li>
            </ul>

            <div
              style={{
                marginTop: '2rem',
                padding: '1.5rem',
                backgroundColor: '#F9FAFB',
                borderRadius: '0.5rem',
                textAlign: 'center',
              }}
            >
              <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
                🚧 More features coming soon! This is your authenticated home
                page.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
