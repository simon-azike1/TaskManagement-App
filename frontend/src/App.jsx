import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ServicesPage from './components/ServicesPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProfilePage from './components/ProfilePage';
import Dashboard from './components/Dashboard';
import { authAPI } from './services/servicesApi';
// import Footer from './components/Footer'


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthError('');
        console.log('🔄 Checking authentication status...');
        
        // Check if user is authenticated using authAPI
        const isAuth = authAPI.isAuthenticated();
        const userData = authAPI.getCurrentUser();
        
        console.log('Auth status:', { isAuth, userData });
        
        if (isAuth && userData) {
          console.log('✅ User authenticated:', userData.email);
          setIsAuthenticated(true);
          setUser(userData);
          
          // If user was on a protected page, keep them there
          const protectedPages = ['dashboard', 'profile', 'billing'];
          if (!protectedPages.includes(currentPage)) {
            // Don't auto-redirect to dashboard, let them stay on home
            console.log('User authenticated but staying on current page:', currentPage);
          }
        } else {
          console.log('❌ No valid authentication found');
          // Clear any stale localStorage data
          localStorage.removeItem('chetro_auth');
          localStorage.removeItem('chetro_user');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Auth check failed:', error);
        setAuthError('Authentication check failed');
        setIsAuthenticated(false);
        setUser(null);
        
        // Clear potentially corrupted auth data
        localStorage.removeItem('taskmaster_auth');
        localStorage.removeItem('taskmaster_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle navigation between pages
  const handleNavigation = (page) => {
    console.log('🧭 Navigating to:', page);
    setAuthError(''); // Clear any auth errors
    
    // Handle authentication-required pages
    if (['dashboard', 'profile', 'billing'].includes(page) && !isAuthenticated) {
      console.log('🔒 Protected page requires authentication, redirecting to login');
      setCurrentPage('login');
      return;
    }
    
    setCurrentPage(page);
  };

  // Handle successful login
const handleLogin = async (userData) => {
  try {
    setIsAuthenticated(true);
    setUser(userData);
    setAuthError('');
    localStorage.setItem('taskmaster_auth', 'true');
    localStorage.setItem('taskmaster_user', JSON.stringify(userData));
    setCurrentPage('dashboard');

    toast.success(`Welcome back, ${userData.firstName}! 🎉`); // <-- toast added
  } catch (error) {
    console.error('❌ Login handler error:', error);
    setAuthError('Login processing failed');
    toast.error('Login failed ❌'); // <-- toast added
  }
};

// Handle successful signup
const handleSignup = async (userData) => {
  try {
    setIsAuthenticated(true);
    setUser(userData);
    setAuthError('');
    localStorage.setItem('taskmaster_auth', 'true');
    localStorage.setItem('taskmaster_user', JSON.stringify(userData));
    setCurrentPage('dashboard');

    toast.success(`Account created successfully, ${userData.firstName}! 🎉`);
  } catch (error) {
    console.error('❌ Signup handler error:', error);
    setAuthError('Signup processing failed');
    toast.error('Signup failed ❌');
  }
};

// Handle logout
const handleLogout = async () => {
  try {
    await authAPI.logout?.();
    setIsAuthenticated(false);
    setUser(null);
    setAuthError('');
    localStorage.removeItem('taskmaster_auth');
    localStorage.removeItem('taskmaster_user');
    setCurrentPage('home');

    toast.info('Logged out successfully 👋');
  } catch (error) {
    console.error('❌ Logout API error:', error);
    toast.error('Logout failed ❌');
  }
};


  // Handle user profile updates
  const handleUpdateUser = (updatedUser) => {
    console.log('🔄 Updating user profile:', updatedUser.email);
    setUser(updatedUser);
    localStorage.setItem('taskmaster_user', JSON.stringify(updatedUser));
    console.log('✅ User profile updated successfully');
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading TaskMaster...</p>
          <p className="mt-2 text-sm text-slate-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Render current page
  const renderPage = () => {
    console.log('🎨 Rendering page:', currentPage, '| Auth:', isAuthenticated);
    
    switch (currentPage) {
      case 'home':
        return (
          <LandingPage 
            onNavigate={handleNavigation} 
            isAuthenticated={isAuthenticated} 
            user={user} 
          />
        );
      
      case 'about':
        return <AboutPage onNavigate={handleNavigation} />;
      
      case 'contact':
        return <ContactPage onNavigate={handleNavigation} />;
      
      case 'services':
        return <ServicesPage onNavigate={handleNavigation} />;
      
      case 'login':
        // Redirect authenticated users away from login
        if (isAuthenticated) {
          console.log('🔄 Authenticated user accessing login, redirecting to dashboard');
          setTimeout(() => setCurrentPage('dashboard'), 100);
          return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Redirecting to dashboard...</p>
              </div>
            </div>
          );
        }
        
        return (
          <LoginPage 
            onNavigate={handleNavigation} 
            onLogin={handleLogin}
            error={authError}
          />
        );
      
      case 'signup':
        // Redirect authenticated users away from signup
        if (isAuthenticated) {
          console.log('🔄 Authenticated user accessing signup, redirecting to dashboard');
          setTimeout(() => setCurrentPage('dashboard'), 100);
          return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Redirecting to dashboard...</p>
              </div>
            </div>
          );
        }
        
        return (
          <SignupPage 
            onNavigate={handleNavigation} 
            onSignup={handleSignup}
            error={authError}
          />
        );
      
      case 'dashboard':
        if (isAuthenticated && user) {
          return (
            <Dashboard 
              user={user} 
              onNavigate={handleNavigation}
              onLogout={handleLogout}
            />
          );
        }
        
        console.log('🔒 Unauthenticated access to dashboard, redirecting to login');
        return (
          <LoginPage 
            onNavigate={handleNavigation} 
            onLogin={handleLogin}
            error="Please log in to access your dashboard"
          />
        );
      
      case 'profile':
        if (isAuthenticated && user) {
          return (
            <ProfilePage 
              user={user} 
              onNavigate={handleNavigation}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
            />
          );
        }
        
        console.log('🔒 Unauthenticated access to profile, redirecting to login');
        return (
          <LoginPage 
            onNavigate={handleNavigation} 
            onLogin={handleLogin}
            error="Please log in to access your profile"
          />
        );
      
      case 'billing':
        if (isAuthenticated && user) {
          return (
            <div className="min-h-screen bg-gray-50">
              {/* Billing Header */}
              <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Billing & Subscription
                        </h1>
                        <p className="text-gray-600 mt-1">
                          Manage your subscription and billing information
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Account: {user.email}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleNavigation('profile')}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => handleNavigation('dashboard')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Back to Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Content */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Current Plan */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h2>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">Free Plan</h3>
                            <p className="text-gray-600">Perfect for getting started</p>
                            <div className="mt-4">
                              <p className="text-sm text-gray-600">✓ Unlimited tasks</p>
                              <p className="text-sm text-gray-600">✓ Basic features</p>
                              <p className="text-sm text-gray-600">✓ Email support</p>
                              <p className="text-sm text-gray-600">✓ Individual workspace</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-gray-900">$0</p>
                            <p className="text-gray-600">per month</p>
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upgrade Options */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Upgrade Your Plan</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro Plan</h3>
                          <p className="text-3xl font-bold text-gray-900 mb-1">$9.99</p>
                          <p className="text-gray-600 mb-4">per month</p>
                          <ul className="space-y-2 mb-6">
                            <li className="text-sm text-gray-600">✓ Everything in Free</li>
                            <li className="text-sm text-gray-600">✓ Advanced analytics</li>
                            <li className="text-sm text-gray-600">✓ Priority support</li>
                            <li className="text-sm text-gray-600">✓ Custom categories</li>
                            <li className="text-sm text-gray-600">✓ Export features</li>
                          </ul>
                          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Upgrade to Pro
                          </button>
                        </div>

                        <div className="border border-purple-200 rounded-lg p-6 relative hover:border-purple-300 transition-colors">
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                              Most Popular
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Plan</h3>
                          <p className="text-3xl font-bold text-gray-900 mb-1">$19.99</p>
                          <p className="text-gray-600 mb-4">per month</p>
                          <ul className="space-y-2 mb-6">
                            <li className="text-sm text-gray-600">✓ Everything in Pro</li>
                            <li className="text-sm text-gray-600">✓ Team collaboration</li>
                            <li className="text-sm text-gray-600">✓ Advanced integrations</li>
                            <li className="text-sm text-gray-600">✓ Custom workflows</li>
                            <li className="text-sm text-gray-600">✓ 24/7 phone support</li>
                          </ul>
                          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                            Upgrade to Business
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Billing Summary */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Holder</span>
                          <span className="font-medium">{user.firstName} {user.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email</span>
                          <span className="font-medium text-sm">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Plan</span>
                          <span className="font-medium">Free</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Member Since</span>
                          <span className="font-medium">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Billing Date</span>
                          <span className="font-medium">N/A</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method</span>
                          <span className="font-medium">None</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Tasks Created</span>
                            <span className="font-medium">Unlimited</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Free plan includes unlimited tasks</p>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Storage Used</span>
                            <span className="font-medium">Unlimited</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: '100%'}}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">No storage limits on any plan</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
                      <div className="text-center py-4">
                        <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-600 font-medium">No billing history</p>
                        <p className="text-sm text-gray-500">You're on the free plan</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
        console.log('🔒 Unauthenticated access to billing, redirecting to login');
        return (
          <LoginPage 
            onNavigate={handleNavigation} 
            onLogin={handleLogin}
            error="Please log in to access billing information"
          />
        );
      
      default:
        console.log('🏠 Default case - rendering LandingPage');
        return (
          <LandingPage 
            onNavigate={handleNavigation} 
            isAuthenticated={isAuthenticated} 
            user={user} 
          />
        );
    }
  };

  return (
    <div className="App">
      {/* Only show Navbar on non-dashboard pages */}
      {currentPage !== 'dashboard' && (
        <Navbar 
          currentPage={currentPage} 
          onNavigate={handleNavigation}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />
      )}
      
      {/* Show auth error if present */}
      {authError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{authError}</p>
            </div>
          </div>
        </div>
      )}
      
      {renderPage()}
  <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>
{/* <Footer  onNavigate={handleNavigation} /> */}
    </div>
  );
}

export default App;
