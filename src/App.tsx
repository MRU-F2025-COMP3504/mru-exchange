import {
  ContactUsPage,
  ForgotPasswordPage,
  HomePage,
  MessagingPage,
  PostProductPage,
  PreviewPostPage,
  ProductPage,
  ProductSearchPage,
  ProfilePage,
  SellerPage,
  ResetPasswordPage,
  SignInPage,
  SignUpPage,
  VerifyEmailPage,
  WelcomePage,
} from '@pages/index';
import { ProtectedRoute } from '@shared/components';
import { AuthProvider } from '@shared/contexts';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<WelcomePage />} />
          <Route path='/sign-in' element={<SignInPage />} />
          <Route path='/sign-up' element={<SignUpPage />} />
          <Route path='/verify-email' element={<VerifyEmailPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/sign-up' element={<SignUpPage />} />
          <Route path='/contact-us' element={<ContactUsPage />} />
          <Route path='/messaging' element={<MessagingPage />} />

          {/* Protected routes */}
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
            path='/product/:productId'
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
            path='/seller/:sellerId'
            element={
              <ProtectedRoute>
                <SellerPage />
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
          <Route
            path='/reset-password'
            element={
              <ProtectedRoute>
                <ResetPasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute>
                <ForgotPasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/post-product'
            element={
              <ProtectedRoute>
                <PostProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/preview-post'
            element={
              <ProtectedRoute>
                <PreviewPostPage />
              </ProtectedRoute>
            }
          />
          {/* Catch all */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
