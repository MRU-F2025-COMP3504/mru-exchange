import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@shared/contexts';
import { ProtectedRoute } from '@shared/components';
import {
  WelcomePage,
  SignInPage,
  CreateAccountPage,
  VerifyEmailPage,
  HomePage,
  ResetPasswordPage,
  SignUpPage,
  ContactUsPage,
  ProfilePage,
  ProductSearchPage,
  ProductPage,
  MessagingPage,
  PostProductPage
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
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='/sign-up' element={<SignUpPage />} />
          <Route path='/contact-us' element={<ContactUsPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/product-search' element={<ProductSearchPage />} />
          <Route path='/product' element={<ProductPage />} />
          <Route path='/messaging' element={<MessagingPage />} />
          <Route path='/post-product' element={<PostProductPage />} />
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
