import React from 'react';
import { Car, User, Menu, X } from 'lucide-react';
import type { CurrentPage } from '../App';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface NavigationProps {
  currentPage: CurrentPage;
  onPageChange: (page: CurrentPage) => void;
  onAuthClick: (mode: 'login' | 'signup') => void;
  onSignOut: () => void;
  user: SupabaseUser | null;
}

export function Navigation({ currentPage, onPageChange, onAuthClick, onSignOut, user }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home' as const, label: 'Home', href: '#' },
    { id: 'create-ride' as const, label: '🚗 Publish Ride', href: '#' },
    { id: 'about' as const, label: 'About', href: '#' },
    { id: 'contact' as const, label: 'Contact', href: '#' },
  ];

  const handleNavClick = (page: CurrentPage) => {
    onPageChange(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl border-b border-purple-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-2 rounded-full shadow-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              🌟 Join Journey
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-gray-700 hover:text-purple-600 font-semibold transition-all duration-200 hover:scale-105 ${
                  currentPage === item.id ? 'text-purple-600 border-b-2 border-purple-600 pb-1' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleNavClick('profile')}
                  className={`flex items-center space-x-2 font-semibold transition-all duration-200 hover:scale-105 ${
                    currentPage === 'profile' ? 'text-purple-600 border-b-2 border-purple-600 pb-1' : 'text-gray-700 hover:text-purple-600'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>👤 Profile</span>
                </button>
                <button
                  onClick={onSignOut}
                  className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onAuthClick('login')}
                  className="text-gray-700 hover:text-purple-600 font-semibold transition-all duration-200 hover:scale-105"
                >
                  🔑 Log in
                </button>
                <button
                  onClick={() => onAuthClick('signup')}
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white px-6 py-2 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  ✨ Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md font-semibold ${
                    currentPage === item.id ? 'text-purple-600 bg-purple-50' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <button
                      onClick={() => handleNavClick('profile')}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md font-semibold"
                    >
                      👤 Profile
                    </button>
                    <button
                      onClick={onSignOut}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md font-semibold"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onAuthClick('login')}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md font-semibold"
                    >
                      🔑 Log in
                    </button>
                    <button
                      onClick={() => onAuthClick('signup')}
                      className="block w-full text-left px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 rounded-md font-bold"
                    >
                      ✨ Sign up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}