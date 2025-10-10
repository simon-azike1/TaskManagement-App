import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Menu, 
  X, 
  Home,
  Info,
  Phone,
  Briefcase,
  LogIn,
  UserPlus,
  User,
  ChevronDown,
  LayoutDashboard,
  Settings,
  CreditCard,
  LogOut,
  Sparkles
} from 'lucide-react';

const Navbar = ({ currentPage, onNavigate, isAuthenticated = false, user = null, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Phone },
    ...(isAuthenticated ? [{ id: 'profile', label: 'Profile', icon: User }] : [])
  ];

  const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard }
  ];

  const handleNavigation = (page) => {
    onNavigate(page);
    setIsOpen(false);
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    setShowUserMenu(false);
    setIsOpen(false);
  };

  const getUserInitials = (user) => {
    if (!user) return 'U';
    if (user.name) {
      const names = user.name.split(' ');
      return names.length >= 2
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    return user.email ? user.email[0].toUpperCase() : 'U';
  };

  const getUserDisplayName = (user) => {
    if (!user) return 'User';
    return user.name || user.email?.split('@')[0] || 'User';
  };

  return (
    <>
      <nav className={`bg-black/70 backdrop-blur-xl border-b border-blue-800/40 sticky top-0 z-50 shadow-2xl shadow-blue-900/30 transition-all duration-500 ${
        scrolled ? 'bg-black/85 shadow-blue-900/40 border-blue-700/50' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => handleNavigation('home')}
                className="flex items-center space-x-2 group"
              >
                <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 p-2 rounded-lg shadow-lg shadow-blue-500/50 group-hover:shadow-blue-400/60 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <CheckSquare className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-blue-100 transition-all duration-300">
                  Chetro
                </span>
                <Sparkles className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? 'bg-blue-600/40 text-blue-100 shadow-lg shadow-blue-600/30 border border-blue-400/40'
                        : 'text-blue-200 hover:text-white hover:bg-blue-800/40 border border-blue-700/20 hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-700/20'
                    }`}
                  >
                    <Icon className={`h-4 w-4 transition-all duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'
                    }`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* User Menu / Auth Buttons */}
            <div className="hidden md:block">
              {isAuthenticated && user ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-blue-800/40 hover:bg-blue-700/50 px-4 py-2 rounded-lg transition-all duration-300 border border-blue-600/40 hover:border-blue-500/60 hover:scale-105 group shadow-md hover:shadow-lg hover:shadow-blue-700/30"
                  >
                    <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                      <span className="text-white text-sm font-semibold">
                        {getUserInitials(user)}
                      </span>
                    </div>
                    <span className="text-blue-100 font-medium max-w-32 truncate">
                      {getUserDisplayName(user)}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-blue-300 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-64 bg-black/90 backdrop-blur-xl rounded-xl shadow-2xl border border-blue-800/30 py-2 z-50 animate-slideDown">
                      <div className="px-4 py-3 border-b border-blue-800/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white font-semibold">
                              {getUserInitials(user)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blue-100 truncate">
                              {getUserDisplayName(user)}
                            </p>
                            <p className="text-xs text-blue-300/60 truncate">
                              {user.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = currentPage === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleNavigation(item.id)}
                              className={`flex items-center space-x-3 w-full px-4 py-2.5 text-sm transition-all duration-300 group ${
                                isActive
                                  ? 'bg-blue-600/30 text-blue-200 border-l-2 border-blue-400'
                                  : 'text-blue-200/70 hover:bg-blue-900/30 hover:text-blue-100 border-l-2 border-transparent'
                              }`}
                            >
                              <Icon className={`h-4 w-4 transition-transform duration-300 ${
                                isActive ? '' : 'group-hover:scale-110 group-hover:rotate-12'
                              }`} />
                              <span>{item.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="border-t border-blue-800/30 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-all duration-300 group"
                        >
                          <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleNavigation('login')}
                    className="flex items-center space-x-2 text-blue-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-blue-800/40 border border-blue-700/20 hover:border-blue-500/40 group hover:shadow-md hover:shadow-blue-700/20"
                  >
                    <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    <span>Sign in</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('signup')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95 group"
                  >
                    <UserPlus className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>Sign up</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-800/40 hover:bg-blue-700/50 inline-flex items-center justify-center p-2 rounded-lg text-blue-100 hover:text-white transition-all duration-300 border border-blue-600/40 hover:border-blue-500/60 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg hover:shadow-blue-700/30"
              >
                {isOpen ? 
                  <X className="block h-6 w-6 transition-transform duration-300 rotate-90" /> : 
                  <Menu className="block h-6 w-6 transition-transform duration-300" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden animate-slideDown">
            <div className="px-3 pt-2 pb-4 space-y-2 bg-black/80 backdrop-blur-xl border-t border-blue-800/40 shadow-2xl shadow-blue-900/30">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 group ${
                      isActive
                        ? 'bg-blue-600/40 text-blue-100 shadow-lg shadow-blue-600/30 border border-blue-400/40'
                        : 'text-blue-200 hover:text-white hover:bg-blue-800/40 border border-blue-700/20 hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-700/20'
                    }`}
                  >
                    <Icon className={`h-5 w-5 transition-all duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'
                    }`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-blue-800/30">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center px-4 py-3 bg-blue-800/40 rounded-lg border border-blue-600/40 shadow-md">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <span className="text-white font-semibold">{getUserInitials(user)}</span>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="text-base font-medium text-blue-100 truncate">{getUserDisplayName(user)}</div>
                        <div className="text-sm text-blue-300/60 truncate">{user.email || 'No email'}</div>
                      </div>
                    </div>

                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.id)}
                          className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 group ${
                            isActive
                              ? 'bg-blue-600/40 text-blue-100 border border-blue-400/40 shadow-md shadow-blue-600/20'
                              : 'text-blue-200 hover:text-white hover:bg-blue-800/40 border border-blue-700/20 hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-700/20'
                          }`}
                        >
                          <Icon className={`h-5 w-5 transition-all duration-300 ${
                            isActive ? '' : 'group-hover:scale-110 group-hover:rotate-12'
                          }`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-medium text-red-300 hover:text-red-200 hover:bg-red-900/20 transition-all duration-300 border border-transparent hover:border-red-700/30 group"
                    >
                      <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                      <span>Sign out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavigation('login')}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-medium text-blue-200/70 hover:text-blue-100 hover:bg-blue-900/30 transition-all duration-300 border border-transparent hover:border-blue-700/30 group"
                    >
                      <LogIn className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      <span>Sign in</span>
                    </button>
                    <button
                      onClick={() => handleNavigation('signup')}
                      className="flex items-center justify-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
                    >
                      <UserPlus className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                      <span>Sign up</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;