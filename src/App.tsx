import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { RideSearch } from './components/RideSearch';
import { RideListings } from './components/RideListings';
import { CreateRide } from './components/CreateRide';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { AuthModal } from './components/AuthModal';
import UserProfile from './components/UserProfile';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

export type CurrentPage = 'home' | 'create-ride' | 'about' | 'contact' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState<{
    fromCity: string;
    toCity: string;
    date: string;
    passengers: number;
    pickupLocation?: string;
  } | null>(null);

  useEffect(() => {
    // Check for demo user in localStorage
    const demoUser = localStorage.getItem('demo_user');
    if (demoUser) {
      setUser(JSON.parse(demoUser));
      setLoading(false);
      return;
    }

    // Listen for demo login events
    const handleDemoLogin = (event: any) => {
      setUser(event.detail);
    };
    
    // Listen for profile navigation events
    const handleNavigateToProfile = () => {
      setCurrentPage('profile');
    };
    
    // Listen for auth modal open events
    const handleOpenAuthModal = (event: any) => {
      const mode = event.detail || 'login';
      setAuthMode(mode);
      setShowAuthModal(true);
    };
    
    // Listen for page change events
    const handlePageChange = (event: any) => {
      setCurrentPage(event.detail);
    };
    
    window.addEventListener('demo-login', handleDemoLogin);
    window.addEventListener('navigate-to-profile', handleNavigateToProfile);
    window.addEventListener('open-auth-modal', handleOpenAuthModal);
    window.addEventListener('change-page', handlePageChange);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setShowAuthModal(false);
        // Force page reload after successful login
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('demo-login', handleDemoLogin);
      window.removeEventListener('navigate-to-profile', handleNavigateToProfile);
      window.removeEventListener('open-auth-modal', handleOpenAuthModal);
      window.removeEventListener('change-page', handlePageChange);
    };
  }, []);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    // Clear demo user from localStorage
    localStorage.removeItem('demo_user');
    localStorage.removeItem('user_bookings');
    localStorage.removeItem('demo_accounts');
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('home');
    // Show success message without blocking UI
    setTimeout(() => {
      console.log('👋 You have been signed out successfully!');
    }, 100);
  };

  const handleSearch = (searchData: {
    fromCity: string;
    toCity: string;
    date: string;
    passengers: number;
    pickupLocation?: string;
  }) => {
    setSearchFilters(searchData);
    // Scroll to ride listings
    setTimeout(() => {
      const rideListings = document.getElementById('ride-listings');
      if (rideListings) {
        rideListings.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleExploreRides = () => {
    // Scroll to ride listings
    setTimeout(() => {
      const rideListings = document.getElementById('ride-listings');
      if (rideListings) {
        rideListings.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-purple-300 border-t-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">🚗 Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onAuthClick={handleAuthClick}
        onSignOut={handleSignOut}
        user={user}
      />
      
      <main className="pt-16">
        {currentPage === 'home' && (
          <>
            <Hero onAuthClick={handleAuthClick} onExploreRides={handleExploreRides} />
            <RideSearch onSearch={handleSearch} />
            <div id="ride-listings">
              <RideListings user={user} searchFilters={searchFilters} />
            </div>
          </>
        )}
        
        {currentPage === 'create-ride' && <CreateRide user={user} />}
        {currentPage === 'about' && <About />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'profile' && user && <UserProfile user={user} />}
      </main>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
        />
      )}
    </div>
  );
}

export default App;