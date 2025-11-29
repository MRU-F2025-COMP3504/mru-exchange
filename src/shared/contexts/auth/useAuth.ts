import { useContext } from 'react';
import { AuthContext } from '@shared/contexts';

/**
 * Hooks user authentication functionality.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @see {@link UserAuthentication} for more information
 */
export function useAuth(): AuthContext {
  const context = useContext(AuthContext);

  if (context) {
    return context;
  }

  throw new Error('useAuth must be used within the AuthProvider');
}
