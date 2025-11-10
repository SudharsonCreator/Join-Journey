import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import {
  User as UserIcon,
  Calendar,
  MapPin,
  Star,
  Clock,
  Car,
  CreditCard,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Phone,
  MessageCircle,
  Navigation,
  Camera,
  X
} from 'lucide-react';
import { LiveMapTracking } from './LiveMapTracking';

interface UserProfileProps {
  user: User;
}

interface Booking {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  driver: string;
  seats: number;
  pickupLocation?: string;
}

interface DashboardStats {
  totalBookings: number;
  completedRides: number;
  totalSpent: number;
  upcomingRides: number;
}

interface CreatedRide {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  price: number;
  description: string;
  createdAt: string;
}

export default function UserProfile({ user }: UserProfileProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'my-rides' | 'profile' | 'analytics'>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    completedRides: 0,
    totalSpent: 0,
    upcomingRides: 0
  });
  const [createdRides, setCreatedRides] = useState<CreatedRide[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingTab, setTrackingTab] = useState<'tracking' | 'details' | 'chat'>('tracking');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'driver', message: string, time: string }>>([]);
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);

  const handleSignOut = async () => {
    // Clear demo user from localStorage
    localStorage.removeItem('demo_user');
    localStorage.removeItem('user_bookings');
    localStorage.removeItem('demo_accounts');
    localStorage.removeItem('userBookings');
    localStorage.removeItem('createdRides');
    
    // Reload the page to reset state
    window.location.reload();
  };

  const handleCreateRide = () => {
    // Navigate to create ride page
    window.dispatchEvent(new CustomEvent('navigate-to-create-ride'));
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' as const }
          : booking
      );
      setBookings(updatedBookings);
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
      
      // Recalculate stats
      const completed = updatedBookings.filter((b: Booking) => b.status === 'confirmed').length;
      const upcoming = updatedBookings.filter((b: Booking) => new Date(b.date) > new Date() && b.status === 'confirmed').length;
      const totalSpent = updatedBookings.filter((b: Booking) => b.status === 'confirmed').reduce((sum: number, b: Booking) => sum + b.price, 0);
      
      setStats({
        totalBookings: updatedBookings.length,
        completedRides: completed,
        totalSpent,
        upcomingRides: upcoming
      });
      
      alert('Booking cancelled successfully!');
    }
  };

  useEffect(() => {
    loadUserData();
    
    // Listen for navigation events
    const handleNavigateToCreateRide = () => {
      // Dispatch event to change page to create-ride
      const event = new CustomEvent('change-page', { detail: 'create-ride' });
      window.dispatchEvent(event);
    };
    
    window.addEventListener('navigate-to-create-ride', handleNavigateToCreateRide);
    
    return () => {
      window.removeEventListener('navigate-to-create-ride', handleNavigateToCreateRide);
    };
  }, []);

  const loadUserData = () => {
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('userBookings');
    if (savedBookings) {
      const parsedBookings = JSON.parse(savedBookings);
      setBookings(parsedBookings);
      
      // Calculate stats
      const completed = parsedBookings.filter((b: Booking) => b.status === 'confirmed').length;
      const upcoming = parsedBookings.filter((b: Booking) => new Date(b.date) > new Date()).length;
      const totalSpent = parsedBookings.reduce((sum: number, b: Booking) => sum + b.price, 0);
      
      setStats({
        totalBookings: parsedBookings.length,
        completedRides: completed,
        totalSpent,
        upcomingRides: upcoming
      });
    }

    // Load created rides from localStorage
    const savedRides = localStorage.getItem('createdRides');
    if (savedRides) {
      setCreatedRides(JSON.parse(savedRides));
    }
  };

  const handleViewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleTrackRide = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowTrackingModal(true);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Rides</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedRides}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Car className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalSpent}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Rides</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingRides}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {bookings.slice(0, 3).map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Car className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{booking.from} → {booking.to}</p>
                  <p className="text-sm text-gray-600">{booking.date} at {booking.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">₹{booking.price}</p>
                <p className={`text-sm ${
                  booking.status === 'confirmed' ? 'text-green-600' :
                  booking.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">My Bookings</h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => {
          const statusDotBgClass = (() => {
            return booking.status === 'confirmed' ? 'bg-green-500' :
                   booking.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500';
          })();

          const priceTextColorClass = (() => {
            return booking.status === 'confirmed' ? 'text-green-600' :
                   booking.status === 'pending' ? 'text-yellow-600' : 'text-red-600';
          })();

          const statusTextColorClass = (() => {
            return booking.status === 'confirmed' ? 'text-green-600' :
                   booking.status === 'pending' ? 'text-yellow-600' : 'text-red-600';
          })();

          const iconColorClass = (() => {
            return booking.status === 'confirmed' ? 'text-green-600' :
                   booking.status === 'pending' ? 'text-yellow-600' : 'text-red-600';
          })();

          return (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${statusDotBgClass}`}></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{booking.from} → {booking.to}</h4>
                    <p className="text-sm text-gray-600">{booking.driver}</p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowMoreMenu(showMoreMenu === booking.id ? null : booking.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {showMoreMenu === booking.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                      <button
                        onClick={() => {
                          handleViewBookingDetails(booking);
                          setShowMoreMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Car className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => {
                            handleTrackRide(booking);
                            setShowMoreMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>Track Ride</span>
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => {
                            handleCancelBooking(booking.id);
                            setShowMoreMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel Booking</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{booking.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{booking.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{booking.seats} seats</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className={`w-4 h-4 ${iconColorClass}`} />
                  <span className={`text-sm font-medium ${priceTextColorClass}`}>₹{booking.price}</span>
                </div>
              </div>

              {booking.pickupLocation && (
                <div className="flex items-center space-x-2 mb-4 p-3 bg-blue-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">Pickup: {booking.pickupLocation}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusTextColorClass} bg-opacity-10 ${
                  booking.status === 'confirmed' ? 'bg-green-100' :
                  booking.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewBookingDetails(booking)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleTrackRide(booking)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Track Ride
                    </button>
                  )}
                  <button
                    onClick={() => alert(`Calling driver: ${booking.driver}\nPhone: +91 98765 43210`)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    title="Call Driver"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowTrackingModal(true);
                      setTrackingTab('chat');
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    title="Message Driver"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600 mb-6">Start by searching and booking your first ride!</p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('change-page', { detail: 'home' }))}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Find Rides
          </button>
        </div>
      )}
    </div>
  );

  const renderMyRides = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">My Published Rides</h3>
        <button
          onClick={handleCreateRide}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Ride</span>
        </button>
      </div>

      <div className="grid gap-4">
        {createdRides.map((ride) => (
          <div key={ride.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{ride.from} → {ride.to}</h4>
                <p className="text-sm text-gray-600">{ride.description}</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{ride.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{ride.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{ride.seats} seats</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">₹{ride.price}/seat</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
                Active
              </span>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Edit
                </button>
                <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  View Bookings
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {createdRides.length === 0 && (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rides published yet</h3>
          <p className="text-gray-600 mb-6">Create your first ride and start earning!</p>
          <button 
            onClick={handleCreateRide}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Ride
          </button>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{user.email}</h3>
            <p className="text-gray-600">Member since {new Date(user.created_at || '').toLocaleDateString()}</p>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">4.8</span>
              <span className="text-sm text-gray-500">(24 reviews)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              placeholder="Add phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Add your full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive booking confirmations and updates</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-600">Get ride updates via text message</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">My Account</h1>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: UserIcon },
                  { id: 'bookings', label: 'My Bookings', icon: Calendar },
                  { id: 'my-rides', label: 'My Rides', icon: Car },
                  { id: 'profile', label: 'Profile', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'my-rides' && renderMyRides()}
            {activeTab === 'profile' && renderProfile()}
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && !showTrackingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  ×
                </button>
              </div>

              {/* Ride Photo */}
              <div className="relative mb-6 rounded-xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Ride"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-lg font-semibold">{selectedBooking.from} → {selectedBooking.to}</h4>
                  <p className="text-sm opacity-90">with {selectedBooking.driver}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <p className="text-gray-900">{selectedBooking.date} at {selectedBooking.time}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seats Booked</label>
                  <p className="text-gray-900">{selectedBooking.seats} seats</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                  <p className="text-gray-900 font-semibold">₹{selectedBooking.price}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedBooking.status === 'confirmed' ? 'text-green-700 bg-green-100' :
                    selectedBooking.status === 'pending' ? 'text-yellow-700 bg-yellow-100' : 
                    'text-red-700 bg-red-100'
                  }`}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </span>
                </div>
              </div>

              {selectedBooking.pickupLocation && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <label className="block text-sm font-medium text-blue-700 mb-1">Pickup Location</label>
                  <p className="text-blue-900">{selectedBooking.pickupLocation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Close
                </button>
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => handleTrackRide(selectedBooking)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Track Ride
                  </button>
                )}
                {selectedBooking.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Tracking Modal */}
      {showTrackingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowTrackingModal(false)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Car className="w-8 h-8" />
                  <h3 className="text-xl font-semibold">Live Ride Tracking</h3>
                </div>
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              <p className="text-white/90">{selectedBooking.from} → {selectedBooking.to}</p>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Journey Progress</span>
                  <span>38%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full" style={{ width: '38%' }}></div>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span>Started</span>
                  <span>ETA: 2 hours 30 minutes</span>
                  <span>Destination</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setTrackingTab('tracking')}
                className={`flex items-center space-x-2 px-6 py-3 ${trackingTab === 'tracking' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <Navigation className="w-4 h-4" />
                <span>Live Tracking</span>
              </button>
              <button
                onClick={() => setTrackingTab('details')}
                className={`flex items-center space-x-2 px-6 py-3 ${trackingTab === 'details' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <Car className="w-4 h-4" />
                <span>Ride Details</span>
              </button>
              <button
                onClick={() => setTrackingTab('chat')}
                className={`flex items-center space-x-2 px-6 py-3 ${trackingTab === 'chat' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Driver</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="h-96 overflow-y-auto">
              {/* Live Tracking Tab */}
              {trackingTab === 'tracking' && (
                <div className="relative h-full">
                  <LiveMapTracking
                    from={selectedBooking.from}
                    to={selectedBooking.to}
                    driverName={selectedBooking.driver}
                  />
                </div>
              )}

              {/* Ride Details Tab */}
              {trackingTab === 'details' && (
                <div className="p-6 space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Trip Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">From</label>
                        <p className="text-gray-900 font-semibold">{selectedBooking.from}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">To</label>
                        <p className="text-gray-900 font-semibold">{selectedBooking.to}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Date</label>
                        <p className="text-gray-900">{selectedBooking.date}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Time</label>
                        <p className="text-gray-900">{selectedBooking.time}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Seats Booked</label>
                        <p className="text-gray-900">{selectedBooking.seats} seats</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Total Price</label>
                        <p className="text-gray-900 font-semibold">₹{selectedBooking.price}</p>
                      </div>
                    </div>
                  </div>

                  {selectedBooking.pickupLocation && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <label className="text-sm font-medium text-blue-900">Pickup Location</label>
                      </div>
                      <p className="text-gray-900">{selectedBooking.pickupLocation}</p>
                    </div>
                  )}

                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Driver Details</h4>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{selectedBooking.driver}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <Star className="w-4 h-4 text-gray-300 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">(4.8 rating)</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">156 trips completed</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">+91 98765 43210</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Honda City • KA-01-AB-1234</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-sm font-medium text-green-800">Ride is currently in progress</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Tab */}
              {trackingTab === 'chat' && (
                <div className="h-full flex flex-col">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h4>
                        <p className="text-gray-600 text-sm">Send a message to start chatting with your driver</p>
                      </div>
                    ) : (
                      chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'} rounded-lg px-4 py-2`}>
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>{msg.time}</p>
                          </div>
                        </div>
                      ))
                    )}

                    {/* Sample messages for demo */}
                    <div className="flex justify-start">
                      <div className="max-w-xs bg-gray-200 text-gray-900 rounded-lg px-4 py-2">
                        <p className="text-sm">Hi! I'm on my way to pick you up. I'll be there in about 10 minutes.</p>
                        <p className="text-xs mt-1 text-gray-500">10:30 AM</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-xs bg-blue-600 text-white rounded-lg px-4 py-2">
                        <p className="text-sm">Great! I'll be waiting at the main gate.</p>
                        <p className="text-xs mt-1 text-blue-200">10:32 AM</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-xs bg-gray-200 text-gray-900 rounded-lg px-4 py-2">
                        <p className="text-sm">Perfect! See you soon.</p>
                        <p className="text-xs mt-1 text-gray-500">10:33 AM</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && chatMessage.trim()) {
                            setChatMessages([...chatMessages, {
                              sender: 'user',
                              message: chatMessage,
                              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                            }]);
                            setChatMessage('');
                          }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          if (chatMessage.trim()) {
                            setChatMessages([...chatMessages, {
                              sender: 'user',
                              message: chatMessage,
                              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                            }]);
                            setChatMessage('');
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-6 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedBooking.driver}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}