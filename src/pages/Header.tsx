import { useAuth } from '@shared/contexts';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/signin');
    };

    const handleProfile = () => {
        navigate('/profile')
    }

    const handleMessaging = () => {
        navigate('/messaging')
    }
    
    return (
        <header
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #E5E7EB',
          padding: '1rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div 
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            
            <img
              src='/MruExchangeLogo.png'
              alt='MRU Exchange Logo'
              onClick={() => navigate("/home")}
              style={{
                width: '50px',
                height: 'auto',
                cursor: 'pointer',
              }}
            />
            <h1
              onClick={() => navigate("/home")}
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                cursor: 'pointer',
              }}
            >
              MRU Exchange
            </h1>
          </div>
          
          <button
            onClick={handleProfile}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0F76D7',
              color: 'white',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Profile
          </button>

          <button
            onClick={handleMessaging}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0F76D7',
              color: 'white',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Messages
          </button>
          <button
            onClick={handleSignOut}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#EF4444',
              color: 'white',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </header>
    );

}