import React, { useState, useEffect, useCallback } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Chrome } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onSwitchMode: () => void;
}

export function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleCallback = useCallback(async (response: any) => {
    setLoading(true);
    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      // Create user object from Google data
      const googleUser = {
        id: `google-${payload.sub}`,
        email: payload.email,
        user_metadata: {
          full_name: payload.name,
          avatar_url: payload.picture,
          provider: 'google'
        },
        created_at: new Date().toISOString()
      };

      // Store in demo accounts
      const existingAccounts = JSON.parse(localStorage.getItem('demo_accounts') || '[]');
      const existingAccount = existingAccounts.find((acc: any) => acc.email === payload.email);
      
      if (!existingAccount) {
        existingAccounts.push(googleUser);
        localStorage.setItem('demo_accounts', JSON.stringify(existingAccounts));
      }

      // Login the user
      localStorage.setItem('demo_user', JSON.stringify(googleUser));
      window.dispatchEvent(new CustomEvent('demo-login', { detail: googleUser }));
      
      onClose();
      
      // Navigate to profile after successful login
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navigate-to-profile'));
        // Force page reload to ensure proper state update
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Google callback error:', error);
      setError('Failed to process Google Sign-In');
    } finally {
      setLoading(false);
    }
  }, [onClose]);

  // Initialize Google Sign-In when component mounts
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (googleClientId && googleClientId !== 'your_google_client_id' && window.google && window.google.accounts) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCallback
        });
      } catch (error) {
        console.error('Google Sign-In initialization error:', error);
      }
    }
  }, [handleGoogleCallback]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    // Check if we have a valid Google Client ID
    if (!googleClientId || googleClientId === 'your_google_client_id') {
      setError('Google Sign-In is not configured properly');
      setLoading(false);
      return;
    }

    try {
      // Try real Google Sign-In first
      if (window.google && window.google.accounts) {
        // Prompt for sign-in (initialization already done in useEffect)
        window.google.accounts.id.prompt();
      } else if (isSupabaseConfigured) {
        // Fallback to Supabase OAuth
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      } else {
        // Demo fallback when neither Google nor Supabase is available
        const demoGoogleUser = {
          id: `google-demo-${Date.now()}`,
          email: 'demo.google.user@gmail.com',
          user_metadata: {
            full_name: 'Google Demo User',
            avatar_url: 'https://via.placeholder.com/150',
            provider: 'google'
          },
          created_at: new Date().toISOString()
        };

        // Store demo Google user
        localStorage.setItem('demo_user', JSON.stringify(demoGoogleUser));
        window.dispatchEvent(new CustomEvent('demo-login', { detail: demoGoogleUser }));
        
        onClose();
        
        // Navigate to profile after successful login
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('navigate-to-profile'));
          // Force page reload to ensure proper state update
          window.location.reload();
        }, 100);
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      // Create demo user on error
      const demoGoogleUser = {
        id: `google-demo-${Date.now()}`,
        email: 'demo.google.user@gmail.com',
        user_metadata: {
          full_name: 'Google Demo User',
          avatar_url: 'https://via.placeholder.com/150',
          provider: 'google'
        },
        created_at: new Date().toISOString()
      };

      localStorage.setItem('demo_user', JSON.stringify(demoGoogleUser));
      window.dispatchEvent(new CustomEvent('demo-login', { detail: demoGoogleUser }));
      
      onClose();
      
      // Navigate to profile after successful login
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navigate-to-profile'));
        // Force page reload to ensure proper state update
        window.location.reload();
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo login credentials
    const demoEmail = 'bicigi6832@etenx.com';
    const demoPassword = 'admin';

    try {
      if (mode === 'signup') {
        // Handle demo signup
        if (!isSupabaseConfigured) {
          // Create a demo user account
          const demoUser = {
            id: `demo-user-${Date.now()}`,
            email: formData.email,
            user_metadata: {
              full_name: formData.fullName
            },
            created_at: new Date().toISOString()
          };
          
          // Store demo user accounts in localStorage
          const existingAccounts = JSON.parse(localStorage.getItem('demo_accounts') || '[]');
          
          // Check if account already exists
          const existingAccount = existingAccounts.find((acc: any) => acc.email === formData.email);
          if (existingAccount) {
            setError('An account with this email already exists. Please sign in instead.');
            setLoading(false);
            return;
          }
          
          // Add new account
          existingAccounts.push(demoUser);
          localStorage.setItem('demo_accounts', JSON.stringify(existingAccounts));
          
          // Auto-login the new user
          localStorage.setItem('demo_user', JSON.stringify(demoUser));
          window.dispatchEvent(new CustomEvent('demo-login', { detail: demoUser }));
          
          onClose();
          
          // Navigate to profile after successful signup
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('navigate-to-profile'));
            // Force page reload to ensure proper state update
            window.location.reload();
          }, 100);
          return;
        } else {
          const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                full_name: formData.fullName
              }
            }
          });
          if (error) throw error;
          alert('Account created successfully! You can now sign in.');
          onSwitchMode();
        }
      } else {
        // Handle login
        
        // Check for demo login
        if (formData.email === demoEmail && formData.password === demoPassword) {
          // Simulate successful demo login
          const mockUser = {
            id: 'demo-user-123',
            email: demoEmail,
            user_metadata: {
              full_name: 'Demo User'
            },
            created_at: new Date().toISOString()
          };
          
          // Store demo user in localStorage for persistence
          localStorage.setItem('demo_user', JSON.stringify(mockUser));
          
          // Trigger a custom event to notify the app of login
          window.dispatchEvent(new CustomEvent('demo-login', { detail: mockUser }));
          
          onClose();
          
          // Navigate to profile after successful demo login
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('navigate-to-profile'));
            // Force page reload to ensure proper state update
            window.location.reload();
          }, 100);
          return;
        }

        // Handle demo login for any registered demo accounts
        if (!isSupabaseConfigured) {
          const existingAccounts = JSON.parse(localStorage.getItem('demo_accounts') || '[]');
          const account = existingAccounts.find((acc: any) => acc.email === formData.email);
          
          if (account) {
            // Login with demo account
            localStorage.setItem('demo_user', JSON.stringify(account));
            window.dispatchEvent(new CustomEvent('demo-login', { detail: account }));
            onClose();
            
            // Navigate to profile after successful login
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('navigate-to-profile'));
              // Force page reload to ensure proper state update
              window.location.reload();
            }, 100);
            return;
          } else {
            setError('Account not found. Please check your email or create a new account.');
            setLoading(false);
            return;
          }
        }
        
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        onClose();
        
        // Navigate to profile after successful login
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('navigate-to-profile'));
          // Force page reload to ensure proper state update
          window.location.reload();
        }, 100);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-purple-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">
              {mode === 'login' ? '🔑 Welcome Back!' : '✨ Join Join Journey'}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors duration-200 p-2 hover:bg-white/20 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-purple-100 mt-2">
            {mode === 'login' ? 'Ready for your next adventure?' : 'Start your amazing journey today!'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center space-x-2">
              <span className="text-xl">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <User className="h-5 w-5 mr-2 text-purple-500" />
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="Enter your awesome name"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-purple-300 bg-gradient-to-r from-white to-purple-50/30 group-hover:shadow-lg"
              />
            </div>
          )}

          <div className="group">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-pink-500" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="your.email@example.com"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 hover:border-pink-300 bg-gradient-to-r from-white to-pink-50/30 group-hover:shadow-lg"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-indigo-500" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Create a strong password"
                className="w-full px-6 py-4 pr-14 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-300 bg-gradient-to-r from-white to-indigo-50/30 group-hover:shadow-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-indigo-600 transition-colors duration-200 p-1 hover:bg-indigo-50 rounded-full"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Demo Login Info */}
          {mode === 'login' && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">🎯 Demo Login:</p>
              <p className="text-sm text-blue-700">
                <strong>Email:</strong> bicigi6832@etenx.com<br />
                <strong>Password:</strong> admin
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 hover:from-purple-700 hover:via-pink-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-purple-500/25'
            }`}
          >
            {loading ? '⏳ Please wait...' : (mode === 'login' ? '🚀 Sign In & Explore' : '✨ Create My Account')}
          </button>

          {/* Google Sign-In Button */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gradient-to-r from-purple-200 to-pink-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-semibold">or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 py-4 px-6 border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="bg-white rounded-full p-2 shadow-sm group-hover:shadow-md transition-shadow duration-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
              {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="px-8 pb-8 text-center">
          <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-4 rounded-2xl">
            <p className="text-gray-600 font-medium">
              {mode === 'login' ? "New to Join Journey? " : "Already have an account? "}
              <button
                onClick={onSwitchMode}
                className="text-purple-600 hover:text-purple-700 font-bold transition-colors duration-200 hover:underline"
              >
                {mode === 'login' ? '🎉 Join the community!' : '🔑 Sign in here!'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}