import React, { useState, useEffect } from 'react';
import { MapPin, Clock, User, Star, Phone, MessageCircle, Navigation, Car, X, CheckCircle, AlertCircle, Route, Zap, Camera } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface BookingDashboardProps {
  user: SupabaseUser | null;
  bookingId: string;
  onClose: () => void;
  pickupLocation?: string;
}

interface LiveBooking {
  id: string;
  ride: {
    from_city: string;
    to_city: string;
    departure_date: string;
    departure_time: string;
    driver_name: string;
    driver_rating: number;
    driver_phone: string;
    price_per_seat: number;
  };
  status: 'confirmed' | 'in_progress' | 'completed';
  driver_location: {
    lat: number;
    lng: number;
    address: string;
  };
  passenger_location: {
    lat: number;
    lng: number;
    address: string;
  };
  estimated_arrival: string;
  distance_remaining: string;
  journey_progress: number;
}

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function BookingDashboard({ user, bookingId, onClose, pickupLocation }: BookingDashboardProps) {
  const [booking, setBooking] = useState<LiveBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tracking' | 'details' | 'chat'>('tracking');
  const [ridePhoto, setRidePhoto] = useState<string>('');

  useEffect(() => {
    // Simulate loading booking data
    setTimeout(() => {
      // Use pickup location if provided, otherwise use default
      const defaultPickupAddress = pickupLocation || 'T. Nagar, Chennai';

      const mockBooking: LiveBooking = {
        id: bookingId,
        ride: {
          from_city: 'Chennai',
          to_city: 'Coimbatore',
          departure_date: '2025-01-25',
          departure_time: '10:00',
          driver_name: 'Rajesh Kumar',
          driver_rating: 4.8,
          driver_phone: '+91 9876543210',
          price_per_seat: 800
        },
        status: 'in_progress',
        driver_location: {
          lat: 11.0168,
          lng: 76.9558,
          address: 'NH44, Near Salem Toll Plaza'
        },
        passenger_location: {
          lat: 13.0827,
          lng: 80.2707,
          address: defaultPickupAddress
        },
        estimated_arrival: '2 hours 30 minutes',
        distance_remaining: '180 km',
        journey_progress: 35
      };
      setBooking(mockBooking);
      
      // Set a sample ride photo
      setRidePhoto('https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800');
      
      setLoading(false);
    }, 1000);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setBooking(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          journey_progress: Math.min(prev.journey_progress + Math.random() * 2, 100),
          driver_location: {
            ...prev.driver_location,
            lat: prev.driver_location.lat + (Math.random() - 0.5) * 0.01,
            lng: prev.driver_location.lng + (Math.random() - 0.5) * 0.01
          }
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [bookingId, pickupLocation]);
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-300 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-900">🚗 Loading your ride details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your booking details.</p>
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto my-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">🚗 Live Ride Tracking</h1>
              <p className="text-purple-100 mt-1">
                {booking.ride.from_city} → {booking.ride.to_city}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Status Bar */}
          <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Journey Progress</span>
              <span className="text-white font-bold">{Math.round(booking.journey_progress)}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-green-400 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${booking.journey_progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-purple-100 mt-2">
              <span>Started</span>
              <span>ETA: {booking.estimated_arrival}</span>
              <span>Destination</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex space-x-1">
            {[
              { id: 'tracking', label: '🗺️ Live Tracking', icon: Navigation },
              { id: 'details', label: '📋 Ride Details', icon: Car },
              { id: 'chat', label: '💬 Chat with Driver', icon: MessageCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Live Tracking Tab */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              {/* OpenStreetMap */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-80">
                <MapContainer
                  center={[
                    (booking.driver_location.lat + booking.passenger_location.lat) / 2,
                    (booking.driver_location.lng + booking.passenger_location.lng) / 2
                  ]}
                  zoom={8}
                  className="h-full w-full"
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Driver Marker */}
                  <Marker
                    position={[booking.driver_location.lat, booking.driver_location.lng]}
                    icon={driverIcon}
                  >
                    <Popup>
                      <div className="text-center">
                        <strong>🚗 Driver Location</strong>
                        <br />
                        <span className="text-sm">{booking.ride.driver_name}</span>
                        <br />
                        <span className="text-xs text-gray-600">{booking.driver_location.address}</span>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Passenger Marker */}
                  <Marker
                    position={[booking.passenger_location.lat, booking.passenger_location.lng]}
                    icon={userIcon}
                  >
                    <Popup>
                      <div className="text-center">
                        <strong>👤 Your Location</strong>
                        <br />
                        <span className="text-sm">Pickup Point</span>
                        <br />
                        <span className="text-xs text-gray-600">{booking.passenger_location.address}</span>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Route Line */}
                  <Polyline
                    positions={[
                      [booking.passenger_location.lat, booking.passenger_location.lng],
                      [booking.driver_location.lat, booking.driver_location.lng]
                    ]}
                    color="#8B5CF6"
                    weight={4}
                    opacity={0.7}
                    dashArray="10, 5"
                  />
                </MapContainer>
              </div>

              {/* Location Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-blue-500 rounded-full p-3">
                      <Car className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">🚗 Driver Location</h3>
                      <p className="text-blue-600">Live GPS Tracking</p>
                    </div>
                  </div>
                  <p className="text-blue-800 font-medium">{booking.driver_location.address}</p>
                  <div className="mt-4 flex items-center space-x-4 text-sm text-blue-700">
                    <span>📍 Lat: {booking.driver_location.lat.toFixed(4)}</span>
                    <span>📍 Lng: {booking.driver_location.lng.toFixed(4)}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-500 rounded-full p-3">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-green-900">👤 Your Location</h3>
                      <p className="text-green-600">Pickup Point</p>
                    </div>
                  </div>
                  <p className="text-green-800 font-medium">{booking.passenger_location.address}</p>
                  <div className="mt-4 flex items-center space-x-4 text-sm text-green-700">
                    <span>📍 Lat: {booking.passenger_location.lat.toFixed(4)}</span>
                    <span>📍 Lng: {booking.passenger_location.lng.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              {/* Journey Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-lg border border-purple-100">
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{booking.estimated_arrival}</div>
                    <div className="text-sm text-gray-600">ETA</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg border border-orange-100">
                  <div className="text-center">
                    <Route className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">{booking.distance_remaining}</div>
                    <div className="text-sm text-gray-600">Remaining</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg border border-green-100">
                  <div className="text-center">
                    <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{Math.round(booking.journey_progress)}%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600 capitalize">{booking.status.replace('_', ' ')}</div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ride Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Ride Photo */}
              {ridePhoto && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src={ridePhoto} 
                      alt="Ride Photo" 
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-2 text-white">
                        <Camera className="h-5 w-5" />
                        <span className="font-semibold">📸 Ride Photo</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                      <span className="font-semibold text-gray-900">
                        {booking.ride.from_city} → {booking.ride.to_city}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Driver Info */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <User className="h-6 w-6 mr-2 text-purple-600" />
                  👤 Driver Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
                        <User className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{booking.ride.driver_name}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.floor(booking.ride.driver_rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-yellow-600">{booking.ride.driver_rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">{booking.ride.driver_phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Car className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">Toyota Innova - TN 01 AB 1234</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors duration-200">
                      <Phone className="h-5 w-5" />
                      <span>📞 Call Driver</span>
                    </button>
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors duration-200">
                      <MessageCircle className="h-5 w-5" />
                      <span>💬 Send Message</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                  🗺️ Trip Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">From</label>
                      <p className="text-lg font-bold text-gray-900">{booking.ride.from_city}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">To</label>
                      <p className="text-lg font-bold text-gray-900">{booking.ride.to_city}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Date & Time</label>
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(booking.ride.departure_date).toLocaleDateString()} at {booking.ride.departure_time}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Price</label>
                      <p className="text-lg font-bold text-green-600">₹{booking.ride.price_per_seat}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
                  💬 Chat with {booking.ride.driver_name}
                </h3>
                
                {/* Chat Messages */}
                <div className="bg-white rounded-xl p-4 h-64 overflow-y-auto mb-4 space-y-3">
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-3 max-w-xs">
                      <p className="text-sm">Hi! I'm on my way to pick you up. I'll be there in about 15 minutes.</p>
                      <p className="text-xs text-gray-500 mt-1">Driver • 2 min ago</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm p-3 max-w-xs">
                      <p className="text-sm">Great! I'll be waiting at the pickup point.</p>
                      <p className="text-xs text-blue-200 mt-1">You • 1 min ago</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-3 max-w-xs">
                      <p className="text-sm">Perfect! Look for a white Toyota Innova. License plate TN 01 AB 1234.</p>
                      <p className="text-xs text-gray-500 mt-1">Driver • Just now</p>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200">
                    Send
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors duration-200">
                  <Phone className="h-5 w-5" />
                  <span>📞 Call Driver</span>
                </button>
                <button className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors duration-200">
                  <AlertCircle className="h-5 w-5" />
                  <span>🚨 Emergency</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}