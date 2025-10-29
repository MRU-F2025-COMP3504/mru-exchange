import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@shared/contexts';
import { ProtectedRoute } from '@shared/components';
import {
  WelcomePage,
  SignInPage,
  CreateAccountPage,
  VerifyEmailPage,
  HomePage,
} from '@pages/index';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<WelcomePage />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/create-account' element={<CreateAccountPage />} />
          <Route path='/verify-email' element={<VerifyEmailPage />} />
          <Route
            path='/home'
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
