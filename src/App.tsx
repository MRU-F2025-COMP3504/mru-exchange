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
          {/* Public routes - accessible without authentication */}
          <Route path='/' element={<WelcomePage />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/create-account' element={<CreateAccountPage />} />
          <Route path='/verify-email' element={<VerifyEmailPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='/sign-up' element={<SignUpPage />} />
          <Route path='/contact-us' element={<ContactUsPage />} />
<<<<<<< HEAD
          
          {/* Protected routes - require authentication (@mtroyal.ca email) */}
=======
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/product-search' element={<ProductSearchPage />} />
          <Route path='/product' element={<ProductPage />} />
          <Route path='/messaging' element={<MessagingPage />} />
          <Route path='/post-product' element={<PostProductPage />} />
>>>>>>> 477fc338b1351c9f377d42864f54d626a0699023
          <Route
            path='/home'
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/product-search'
            element={
              <ProtectedRoute>
                <ProductSearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/product'
            element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/messaging'
            element={
              <ProtectedRoute>
                <MessagingPage />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all - redirect to welcome page */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
