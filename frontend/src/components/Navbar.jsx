import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ isDark, setIsDark }) {
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const accountRef = useRef(null);

  async function handleLogout() {
    try {
      await fetch('http://localhost:5000/user/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    try { logout(); } catch (e) {}
    navigate('/', { replace: true });
  }

  // Protect navigation for logged-in users only
  function protectedNavigate(path) {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(path);
  }

  useEffect(() => {
    function onDocClick(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const navBase = isDark
    ? 'bg-gray-900 text-gray-100 shadow-sm border-b border-gray-800'
    : 'bg-white text-gray-900 shadow-sm border-b border-gray-200';

  return (
    <nav className={`${navBase} relative z-40`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <span className={`text-xl font-semibold ${isDark ? 'text-coral-400' : 'text-gray-900'}`}>NoteSnap</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}
            >
              Home
            </Link>

            {/* Revision (Dashboard-like section) */}
            <button
              type="button"
              onClick={() => protectedNavigate('/dashboard')}
              className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium bg-transparent outline-none`}
              style={{ border: 0 }}
            >
              Revision
            </button>

            {/* Protected routes - Quiz and Notes */}
            <button
              type="button"
              onClick={() => protectedNavigate('/upload')}
              className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}
            >
              AI Quiz Generator
            </button>

            <button
              type="button"
              onClick={() => protectedNavigate('/upload')}
              className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}
            >
              AI Notes Generator
            </button>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsDark(d => !d)}
              className={`p-2 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-pressed={isDark}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>

            {user ? (
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen(v => !v)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {(user.fullname || user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className={`${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium`}>
                    {user.fullname || user.name || user.email}
                  </span>
                  <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                  Login
                </Link>
                <Link to="/signup" className="text-gray-700 hover:text-gray-900 font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
