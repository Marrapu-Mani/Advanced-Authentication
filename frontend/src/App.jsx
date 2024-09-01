import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Signup from './pages/Signup';
import EmailVerification from './pages/EmailVerification';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuthStore } from './store/authStore';

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth) 
	return <LoadingSpinner />;

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#370617] via-[#dc2f02] to-[#ffba08] flex justify-center items-center relative overflow-hidden'>
      <Routes>
			<Route
				path='/'
				element={
					<ProtectedRoute>
						<Home />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/signup'
				element={
					<RedirectAuthenticatedUser>
						<Signup />
					</RedirectAuthenticatedUser>
				}
			/>
			<Route
				path='/login'
				element={
					<RedirectAuthenticatedUser>
						<Login />
					</RedirectAuthenticatedUser>
				}
			/>
			<Route 
				path='/verify-email' 
				element={
					<RedirectAuthenticatedUser>
						<EmailVerification />
					</RedirectAuthenticatedUser>
				}	
			/>
			<Route 
				path='/forgot-password' 
				element={
					<RedirectAuthenticatedUser>
						<ForgotPassword />
					</RedirectAuthenticatedUser>
				}	
			/>
			<Route 
				path='/reset-password/:token' 
				element={
					<RedirectAuthenticatedUser>
						<ResetPassword />
					</RedirectAuthenticatedUser>
				}	
			/>
			<Route 
				path='*'
				element={
					<Navigate to='/' replace />
				}
			/>
		</Routes>   
      <Toaster />  
    </div>
  )
}

export default App;