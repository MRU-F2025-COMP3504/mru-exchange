import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}
    >
      <div style={{ maxWidth: '28rem', width: '100%', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img
            src='/MruExchangeLogo.png'
            alt='MRU Exchange Logo'
            style={{
              width: '150px',
              height: 'auto',
              marginBottom: '1.5rem',
              margin: '0 auto',
            }}
          />
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem',
            }}
          >
            MRU Exchange
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#4B5563' }}>Welcome</p>
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <button
            onClick={() => {
              navigate('/signin');
            }}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '2px solid #2563EB',
              borderRadius: '0.375rem',
              color: '#2563EB',
              backgroundColor: 'white',
              fontWeight: '500',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#EFF6FF')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = 'white')
            }
          >
            Sign In
          </button>

          <button
            onClick={() => { navigate('/create-account'); }}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: '#2563EB',
              color: 'white',
              borderRadius: '0.375rem',
              fontWeight: '500',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#1D4ED8')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = '#2563EB')
            }
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
