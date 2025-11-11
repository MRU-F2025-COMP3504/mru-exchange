import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@shared/contexts';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context) {
    return context;
  }

  throw new Error('useAuth must be used within the AuthProvider');
}