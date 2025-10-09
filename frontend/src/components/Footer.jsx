import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Github } from 'lucide-react';

// Professional Footer Component
const ProfessionalFooter = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">TaskMaster</h3>
                <p className="text-xs text-slate-400">Professional Task Management</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              TaskMaster is a powerful task management platform designed to help individuals and teams stay organized, boost productivity, and achieve their goals efficiently.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Email</div>
                  <a href="mailto:support@taskmaster.com" className="text-slate-300 hover:text-white transition-colors">
                   azikeshinye@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Phone</div>
                  <a href="tel:+1234567890" className="text-slate-300 hover:text-white transition-colors">
                    +1 (212) 751-780853
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Address</div>
                  <span className="text-slate-300">Bab Cheffa Sale, Rabat, Morocco</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/home" 
                  onClick={(e) => handleNavClick(e, 'home')}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="about" 
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About
                </a>
              </li>
              <li>
                <a 
                  href="services" 
                  onClick={(e) => handleNavClick(e, 'services')}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Services
                </a>
              </li>
              <li>
                <a 
                  href="contact" 
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="login" 
                  onClick={(e) => handleNavClick(e, 'login')}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Login
                </a>
              </li>
              <li>
                <a 
                  href="signup" 
                  onClick={(e) => handleNavClick(e, 'signup')}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Sign Up
                </a>
              </li>
              <li>
                <a 
                  href="dashboard" 
                  onClick={(e) => handleNavClick(e, 'dashboard')}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="profile" 
                  onClick={(e) => handleNavClick(e, 'profile')}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Connect</h4>
            {/* Social Links */}
            <div className="flex items-center gap-3 mb-6">
              <a href="https://web.facebook.com/simon.azike/" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all hover:scale-110" target='_blank'>
              <Facebook className="w-4 h-4" />
              </a>
              <a href="https://github.com/samzik234?tab=repositories" className="w-10 h-10 bg-slate-800 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-all hover:scale-110" target='_blank'>
                <Github className="w-4 h-4" />
               
              </a>
              <a href="https://www.linkedin.com/in/simonzik/" className="w-10 h-10 bg-slate-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all hover:scale-110" target='_blank'>
                <Linkedin className="w-4 h-4" />
         
              </a>
              <a href="https://x.com/SimonAzike75984" className="w-10 h-10 bg-slate-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all hover:scale-110" target='_blank'>
                <Instagram className="w-4 h-4" />
             
              </a>
              <a href="https://www.youtube.com/@SamzikTech" className="w-10 h-10 bg-slate-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all hover:scale-110" target='_blank'>
                <Youtube className="w-4 h-4" />
               
              </a>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-xs text-slate-400">Active Users</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-white">1M+</div>
                <div className="text-xs text-slate-400">Tasks Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500 text-center md:text-left">
              © {currentYear} TaskMaster Inc. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
              <span className="text-slate-700">•</span>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms of Service</a>
              <span className="text-slate-700">•</span>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 opacity-50">
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              SSL Secured
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-5a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
              GDPR Compliant
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              ISO 27001 Certified
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ProfessionalFooter;