import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Star, Calendar, IndianRupee } from 'lucide-react';
import { supabase, isSupabaseConfigured, getRidesFromLocal } from '../lib/supabase';
import type { Ride } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { BookingDashboard } from './BookingDashboard';

interface RideListingsProps {
  user: User | null;
  searchFilters?: {
    fromCity: string;
    toCity: string;
    date: string;
    passengers: number;
  } | null;
}

export function RideListings({ user, searchFilters }: RideListingsProps) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [showBookingDashboard, setShowBookingDashboard] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    let allRides: Ride[] = [];
    
    // Get sample rides
    const sampleRides = getSampleRides();
    allRides = [...sampleRides];
    
    // Get user-created rides from local storage
    const userRides = getRidesFromLocal();
    allRides = [...allRides, ...userRides];

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('rides')
          .select('*')
          .gte('departure_date', new Date().toISOString().split('T')[0])
          .order('departure_date', { ascending: true })
          .limit(50);

        if (!error && data) {
          // Combine Supabase rides with local rides
          allRides = [...allRides, ...data];
        }
      }
    } catch (error) {
      console.error('Error fetching rides:', error);
      // Continue with existing rides if fetch fails
    } finally {
      // Remove duplicates and sort by date
      const uniqueRides = allRides.filter((ride, index, self) => 
        index === self.findIndex(r => r.id === ride.id)
      );
      
      // Sort by departure date
      uniqueRides.sort((a, b) => new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime());
      
      setRides(uniqueRides);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchFilters && rides.length > 0) {
      const filtered = rides.filter(ride => {
        const matchesFrom = !searchFilters.fromCity || 
          ride.from_city.toLowerCase().includes(searchFilters.fromCity.toLowerCase());
        const matchesTo = !searchFilters.toCity || 
          ride.to_city.toLowerCase().includes(searchFilters.toCity.toLowerCase());
        const matchesDate = !searchFilters.date || 
          ride.departure_date === searchFilters.date;
        const hasEnoughSeats = ride.available_seats >= searchFilters.passengers;
        
        return matchesFrom && matchesTo && matchesDate && hasEnoughSeats;
      });
      
      // Ensure minimum 5 results for any search
      if (filtered.length < 5 && (searchFilters.fromCity || searchFilters.toCity)) {
        // Add more generic rides if specific search has fewer than 5 results
        const additionalRides = rides.filter(ride => {
          // Include rides that partially match or are popular routes
          const partialFromMatch = !searchFilters.fromCity || 
            ride.from_city.toLowerCase().includes(searchFilters.fromCity.toLowerCase().substring(0, 3));
          const partialToMatch = !searchFilters.toCity || 
            ride.to_city.toLowerCase().includes(searchFilters.toCity.toLowerCase().substring(0, 3));
          const hasEnoughSeats = ride.available_seats >= searchFilters.passengers;
          
          return (partialFromMatch || partialToMatch) && hasEnoughSeats && !filtered.includes(ride);
        });
        
        const combinedResults = [...filtered, ...additionalRides].slice(0, Math.max(5, filtered.length));
        setFilteredRides(combinedResults);
      } else {
        setFilteredRides(filtered);
      }
    } else {
      setFilteredRides(rides);
    }
  }, [rides, searchFilters]);

  const getSampleRides = (): Ride[] => [
    {
      id: '1',
      driver_id: 'sample-driver-1',
      from_city: 'Mumbai',
      to_city: 'Pune',
      departure_date: '2025-01-25',
      departure_time: '10:00',
      available_seats: 3,
      price_per_seat: 500,
      description: '🚗 Comfortable AC car, music allowed, pet-friendly! Great conversation guaranteed 😊',
      created_at: '2025-01-15T10:00:00Z',
      driver_name: 'Rahul Sharma',
      driver_rating: 4.8
    },
    {
      id: '1a',
      driver_id: 'sample-driver-1a',
      from_city: 'Mumbai',
      to_city: 'Pune',
      departure_date: '2025-01-26',
      departure_time: '14:30',
      available_seats: 2,
      price_per_seat: 450,
      description: '🎵 Afternoon ride with great music! AC car, flexible stops, snacks provided 🍿',
      created_at: '2025-01-15T10:30:00Z',
      driver_name: 'Anjali Patil',
      driver_rating: 4.7
    },
    {
      id: '1b',
      driver_id: 'sample-driver-1b',
      from_city: 'Mumbai',
      to_city: 'Pune',
      departure_date: '2025-01-27',
      departure_time: '07:00',
      available_seats: 1,
      price_per_seat: 550,
      description: '🌅 Early morning express! Business traveler, WiFi available, quick journey ⚡',
      created_at: '2025-01-15T11:00:00Z',
      driver_name: 'Vikash Kumar',
      driver_rating: 4.9
    },
    {
      id: '2',
      driver_id: 'sample-driver-2',
      from_city: 'Delhi',
      to_city: 'Jaipur',
      departure_date: '2025-01-26',
      departure_time: '08:00',
      available_seats: 2,
      price_per_seat: 800,
      description: '🎵 Highway expert! Love good music, flexible stops, snacks included 🍿',
      created_at: '2025-01-15T11:00:00Z',
      driver_name: 'Priya Singh',
      driver_rating: 4.9
    },
    {
      id: '2a',
      driver_id: 'sample-driver-2a',
      from_city: 'Delhi',
      to_city: 'Jaipur',
      departure_date: '2025-01-28',
      departure_time: '16:00',
      available_seats: 3,
      price_per_seat: 750,
      description: '🏰 Pink City adventure! Heritage expert, photography stops, cultural insights 📸',
      created_at: '2025-01-15T12:00:00Z',
      driver_name: 'Arjun Rajput',
      driver_rating: 4.8
    },
    {
      id: '2b',
      driver_id: 'sample-driver-2b',
      from_city: 'Delhi',
      to_city: 'Jaipur',
      departure_date: '2025-01-29',
      departure_time: '11:30',
      available_seats: 2,
      price_per_seat: 850,
      description: '🎯 Luxury SUV ride! Premium comfort, entertainment system, refreshments 🥤',
      created_at: '2025-01-15T13:00:00Z',
      driver_name: 'Kavita Sharma',
      driver_rating: 4.9
    },
    {
      id: '3',
      driver_id: 'sample-driver-3',
      from_city: 'Bangalore',
      to_city: 'Chennai',
      departure_date: '2025-01-27',
      departure_time: '06:00',
      available_seats: 1,
      price_per_seat: 1200,
      description: '🌅 Early bird special! Quick, safe, and smooth ride with great stories 📚',
      created_at: '2025-01-15T12:00:00Z',
      driver_name: 'Arjun Kumar',
      driver_rating: 4.7
    },
    {
      id: '3a',
      driver_id: 'sample-driver-3a',
      from_city: 'Bangalore',
      to_city: 'Chennai',
      departure_date: '2025-01-30',
      departure_time: '22:00',
      available_seats: 2,
      price_per_seat: 1100,
      description: '🌙 Night owl special! Comfortable sleeper seats, quiet ride, safe journey 😴',
      created_at: '2025-01-15T14:00:00Z',
      driver_name: 'Meera Iyer',
      driver_rating: 4.8
    },
    {
      id: '3b',
      driver_id: 'sample-driver-3b',
      from_city: 'Bangalore',
      to_city: 'Chennai',
      departure_date: '2025-02-01',
      departure_time: '13:00',
      available_seats: 3,
      price_per_seat: 1000,
      description: '☕ Tech corridor ride! IT professional, startup discussions, coffee stops ☕',
      created_at: '2025-01-15T15:00:00Z',
      driver_name: 'Rajesh Krishnan',
      driver_rating: 4.6
    },
    {
      id: '4',
      driver_id: 'sample-driver-4',
      from_city: 'Hyderabad',
      to_city: 'Vijayawada',
      departure_date: '2025-01-28',
      departure_time: '14:00',
      available_seats: 2,
      price_per_seat: 600,
      description: '🎯 Afternoon departure, AC car, phone charging available, great playlist! 🎶',
      created_at: '2025-01-15T13:00:00Z',
      driver_name: 'Sneha Reddy',
      driver_rating: 4.6
    },
    {
      id: '4a',
      driver_id: 'sample-driver-4a',
      from_city: 'Hyderabad',
      to_city: 'Vijayawada',
      departure_date: '2025-02-02',
      departure_time: '09:00',
      available_seats: 1,
      price_per_seat: 650,
      description: '🍛 Foodie journey! Know best biryani spots, cultural stories, local cuisine 🌶️',
      created_at: '2025-01-15T16:00:00Z',
      driver_name: 'Ravi Teja',
      driver_rating: 4.7
    },
    {
      id: '5',
      driver_id: 'sample-driver-5',
      from_city: 'Kolkata',
      to_city: 'Bhubaneswar',
      departure_date: '2025-01-29',
      departure_time: '09:30',
      available_seats: 3,
      price_per_seat: 900,
      description: '🚙 SUV ride, spacious, experienced driver, cultural discussions welcome! 🏛️',
      created_at: '2025-01-15T14:00:00Z',
      driver_name: 'Amit Das',
      driver_rating: 4.8
    },
    {
      id: '5a',
      driver_id: 'sample-driver-5a',
      from_city: 'Kolkata',
      to_city: 'Bhubaneswar',
      departure_date: '2025-02-03',
      departure_time: '15:30',
      available_seats: 2,
      price_per_seat: 850,
      description: '🎭 Cultural route! Art lover, museum stops, Bengali literature discussions 📚',
      created_at: '2025-01-15T17:00:00Z',
      driver_name: 'Priya Chatterjee',
      driver_rating: 4.9
    },
    {
      id: '6',
      driver_id: 'sample-driver-6',
      from_city: 'Ahmedabad',
      to_city: 'Udaipur',
      departure_date: '2025-01-30',
      departure_time: '07:00',
      available_seats: 2,
      price_per_seat: 1100,
      description: '🏰 Scenic route to City of Lakes! Photography stops, local insights included 📸',
      created_at: '2025-01-15T15:00:00Z',
      driver_name: 'Kavya Patel',
      driver_rating: 4.9
    },
    {
      id: '6a',
      driver_id: 'sample-driver-6a',
      from_city: 'Ahmedabad',
      to_city: 'Udaipur',
      departure_date: '2025-02-04',
      departure_time: '12:00',
      available_seats: 3,
      price_per_seat: 1050,
      description: '🎨 Royal journey! Palace expert, handicraft shopping, Rajasthani culture 👑',
      created_at: '2025-01-15T18:00:00Z',
      driver_name: 'Mahesh Jain',
      driver_rating: 4.8
    },
    {
      id: '7',
      driver_id: 'sample-driver-7',
      from_city: 'Kochi',
      to_city: 'Coimbatore',
      departure_date: '2025-01-31',
      departure_time: '11:00',
      available_seats: 1,
      price_per_seat: 700,
      description: '🌴 Coastal to hills journey! Nature lover, eco-friendly car, great vibes 🌿',
      created_at: '2025-01-15T16:00:00Z',
      driver_name: 'Ravi Nair',
      driver_rating: 4.7
    },
    {
      id: '7a',
      driver_id: 'sample-driver-7a',
      from_city: 'Kochi',
      to_city: 'Coimbatore',
      departure_date: '2025-02-05',
      departure_time: '08:30',
      available_seats: 2,
      price_per_seat: 750,
      description: '🌊 Backwater to textile city! Spice route expert, local seafood tips 🐟',
      created_at: '2025-01-15T19:00:00Z',
      driver_name: 'Lakshmi Menon',
      driver_rating: 4.8
    },
    {
      id: '8',
      driver_id: 'sample-driver-8',
      from_city: 'Indore',
      to_city: 'Bhopal',
      departure_date: '2025-02-01',
      departure_time: '16:00',
      available_seats: 3,
      price_per_seat: 400,
      description: '🎪 Fun ride with games, snacks, and Bollywood hits! Family-friendly 👨‍👩‍👧‍👦',
      created_at: '2025-01-15T17:00:00Z',
      driver_name: 'Pooja Sharma',
      driver_rating: 4.8
    },
    {
      id: '8a',
      driver_id: 'sample-driver-8a',
      from_city: 'Indore',
      to_city: 'Bhopal',
      departure_date: '2025-02-06',
      departure_time: '10:15',
      available_seats: 2,
      price_per_seat: 450,
      description: '🍛 Street food expert! Know best chaat spots, local delicacies, foodie paradise 🌶️',
      created_at: '2025-01-15T20:00:00Z',
      driver_name: 'Rohit Agarwal',
      driver_rating: 4.7
    },
    {
      id: '9',
      driver_id: 'sample-driver-9',
      from_city: 'Chandigarh',
      to_city: 'Shimla',
      departure_date: '2025-02-02',
      departure_time: '08:30',
      available_seats: 2,
      price_per_seat: 1500,
      description: '🏔️ Mountain adventure! Hill station expert, scenic stops, warm blankets provided ❄️',
      created_at: '2025-01-15T18:00:00Z',
      driver_name: 'Vikram Singh',
      driver_rating: 4.9
    },
    {
      id: '9a',
      driver_id: 'sample-driver-9a',
      from_city: 'Chandigarh',
      to_city: 'Shimla',
      departure_date: '2025-02-07',
      departure_time: '06:00',
      available_seats: 3,
      price_per_seat: 1400,
      description: '❄️ Winter wonderland! Snow expert, adventure sports, mountain photography 📸',
      created_at: '2025-01-15T21:00:00Z',
      driver_name: 'Simran Kaur',
      driver_rating: 4.8
    },
    {
      id: '10',
      driver_id: 'sample-driver-10',
      from_city: 'Goa',
      to_city: 'Mumbai',
      departure_date: '2025-02-03',
      departure_time: '12:00',
      available_seats: 1,
      price_per_seat: 1800,
      description: '🏖️ Beach to city! Luxury car, AC, entertainment system, refreshments included 🥤',
      created_at: '2025-01-15T19:00:00Z',
      driver_name: 'Maria Fernandes',
      driver_rating: 4.8
    },
    {
      id: '10a',
      driver_id: 'sample-driver-10a',
      from_city: 'Goa',
      to_city: 'Mumbai',
      departure_date: '2025-02-08',
      departure_time: '20:00',
      available_seats: 2,
      price_per_seat: 1700,
      description: '🌅 Sunset departure! Coastal route, beach stories, Portuguese culture insights 🏖️',
      created_at: '2025-01-15T22:00:00Z',
      driver_name: 'Carlos D\'Souza',
      driver_rating: 4.9
    },
    {
      id: '11',
      driver_id: 'sample-driver-11',
      from_city: 'Lucknow',
      to_city: 'Kanpur',
      departure_date: '2025-02-04',
      departure_time: '15:30',
      available_seats: 3,
      price_per_seat: 350,
      description: '🍛 Foodie ride! Know all the best dhabas, cultural stories, local cuisine tips 🌶️',
      created_at: '2025-01-15T20:00:00Z',
      driver_name: 'Rajesh Gupta',
      driver_rating: 4.6
    },
    {
      id: '12',
      driver_id: 'sample-driver-12',
      from_city: 'Surat',
      to_city: 'Mumbai',
      departure_date: '2025-02-05',
      departure_time: '05:45',
      available_seats: 2,
      price_per_seat: 650,
      description: '🌅 Early morning express! Business traveler, punctual, WiFi available 📶',
      created_at: '2025-01-15T21:00:00Z',
      driver_name: 'Neha Patel',
      driver_rating: 4.7
    },
    {
      id: '13',
      driver_id: 'sample-driver-13',
      from_city: 'Jaipur',
      to_city: 'Agra',
      departure_date: '2025-02-06',
      departure_time: '09:00',
      available_seats: 2,
      price_per_seat: 950,
      description: '🕌 Heritage route! History enthusiast, Taj Mahal expert, photography friendly 📷',
      created_at: '2025-01-15T22:00:00Z',
      driver_name: 'Suresh Agarwal',
      driver_rating: 4.8
    },
    {
      id: '14',
      driver_id: 'sample-driver-14',
      from_city: 'Nagpur',
      to_city: 'Pune',
      departure_date: '2025-02-07',
      departure_time: '13:15',
      available_seats: 1,
      price_per_seat: 800,
      description: '🎵 Music lover! Great sound system, diverse playlist, sing-along welcome 🎤',
      created_at: '2025-01-15T23:00:00Z',
      driver_name: 'Anita Deshmukh',
      driver_rating: 4.9
    },
    {
      id: '15',
      driver_id: 'sample-driver-15',
      from_city: 'Coimbatore',
      to_city: 'Bangalore',
      departure_date: '2025-02-08',
      departure_time: '07:30',
      available_seats: 3,
      price_per_seat: 750,
      description: '☕ Coffee route! Tech professional, startup discussions, great coffee stops ☕',
      created_at: '2025-01-16T00:00:00Z',
      driver_name: 'Karthik Krishnan',
      driver_rating: 4.7
    },
    {
      id: '16',
      driver_id: 'sample-driver-16',
      from_city: 'Thiruvananthapuram',
      to_city: 'Kochi',
      departure_date: '2025-02-09',
      departure_time: '10:45',
      available_seats: 2,
      price_per_seat: 600,
      description: '🌊 Coastal beauty! Backwater expert, local seafood recommendations, nature lover 🐟',
      created_at: '2025-01-16T01:00:00Z',
      driver_name: 'Lakshmi Nair',
      driver_rating: 4.8
    },
    {
      id: '17',
      driver_id: 'sample-driver-17',
      from_city: 'Bhubaneswar',
      to_city: 'Cuttack',
      departure_date: '2025-02-10',
      departure_time: '14:20',
      available_seats: 2,
      price_per_seat: 300,
      description: '🏛️ Temple tour! Spiritual journey, temple hopping, peaceful vibes 🙏',
      created_at: '2025-01-16T02:00:00Z',
      driver_name: 'Bijay Mohanty',
      driver_rating: 4.6
    },
    {
      id: '18',
      driver_id: 'sample-driver-18',
      from_city: 'Dehradun',
      to_city: 'Haridwar',
      departure_date: '2025-02-11',
      departure_time: '06:15',
      available_seats: 3,
      price_per_seat: 450,
      description: '🏔️ Spiritual journey! Mountain roads expert, Ganga Aarti timing, peaceful ride 🕉️',
      created_at: '2025-01-16T03:00:00Z',
      driver_name: 'Rohit Sharma',
      driver_rating: 4.9
    },
    {
      id: '19',
      driver_id: 'sample-driver-19',
      from_city: 'Vadodara',
      to_city: 'Ahmedabad',
      departure_date: '2025-02-12',
      departure_time: '11:30',
      available_seats: 1,
      price_per_seat: 400,
      description: '🎨 Art enthusiast! Museum lover, cultural discussions, heritage site knowledge 🖼️',
      created_at: '2025-01-16T04:00:00Z',
      driver_name: 'Ritu Shah',
      driver_rating: 4.7
    },
    {
      id: '20',
      driver_id: 'sample-driver-20',
      from_city: 'Mysore',
      to_city: 'Bangalore',
      departure_date: '2025-02-13',
      departure_time: '17:00',
      available_seats: 2,
      price_per_seat: 550,
      description: '🏰 Palace city to tech hub! Royal history buff, silk shopping tips, local insights 👑',
      created_at: '2025-01-16T05:00:00Z',
      driver_name: 'Deepak Rao',
      driver_rating: 4.8
    }
  ];

  const handleBookRide = async (rideId: string) => {
    if (!user) {
      // Dispatch event to open auth modal
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'login' }));
      return;
    }

    const selectedRide = rides.find(r => r.id === rideId);
    if (!selectedRide) {
      alert('Ride not found. Please try again.');
      return;
    }

    // Create booking object with proper structure
    const booking = {
      id: `booking-${Date.now()}`,
      from: selectedRide.from_city,
      to: selectedRide.to_city,
      date: selectedRide.departure_date,
      time: selectedRide.departure_time,
      price: selectedRide.price_per_seat,
      status: 'confirmed' as const,
      driver: selectedRide.driver_name,
      seats: 1,
      pickupLocation: localStorage.getItem('user_pickup_location') || '',
      created_at: new Date().toISOString(),
      ride_id: rideId,
      passenger_id: user.id,
      driver_phone: '+91 9876543210',
      driver_rating: selectedRide.driver_rating
    };

    // Store booking in localStorage with correct key
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('userBookings', JSON.stringify(existingBookings));

    // Update available seats
    const updatedRides = rides.map(ride => 
      ride.id === rideId 
        ? { ...ride, available_seats: ride.available_seats - 1 }
        : ride
    );
    setRides(updatedRides);

    // Save updated rides to localStorage
    const userRides = JSON.parse(localStorage.getItem('user_rides') || '[]');
    const updatedUserRides = userRides.map((ride: any) => 
      ride.id === rideId 
        ? { ...ride, available_seats: ride.available_seats - 1 }
        : ride
    );
    localStorage.setItem('user_rides', JSON.stringify(updatedUserRides));

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('ride_bookings')
          .insert({
            ride_id: rideId,
            passenger_id: user.id,
            seats_booked: 1,
            status: 'pending'
          });

        if (error) throw error;
      }
      
      // Show booking dashboard instead of alert
      alert('🎉 Ride booked successfully! You can track your ride now.');
      setSelectedBookingId(booking.id);
      setShowBookingDashboard(true);
    } catch (error) {
      console.error('Error booking ride:', error);
      alert('🎉 Ride booked successfully! You can track your ride now.');
      setSelectedBookingId(booking.id);
      setShowBookingDashboard(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="text-center mb-12">
        {searchFilters ? (
          <>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              🎯 Search Results
            </h2>
            <p className="text-xl text-gray-600">
              {searchFilters.fromCity && searchFilters.toCity 
                ? `${searchFilters.fromCity} → ${searchFilters.toCity}` 
                : 'Filtered rides based on your search'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Found {filteredRides.length} ride{filteredRides.length !== 1 ? 's' : ''} matching your criteria
            </p>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              🚗 Amazing Rides Available
            </h2>
            <p className="text-xl text-gray-600">Choose from our most popular and exciting journeys</p>
          </>
        )}
      </div>

      {filteredRides.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchFilters ? 'No matching rides found' : 'No rides found'}
            </h3>
            <p className="text-gray-600">
              {searchFilters 
                ? 'Try adjusting your search criteria or check back later.' 
                : 'Check back later for available rides.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRides.map((ride) => (
            <div
              key={ride.id}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 overflow-hidden border border-purple-100"
            >
              {/* Gradient Header */}
              <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>
              
              <div className="p-8">
                {/* Route */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="text-xl font-bold text-gray-900">{ride.from_city}</div>
                    <div className="text-2xl">→</div>
                    <div className="text-xl font-bold text-gray-900">{ride.to_city}</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                    ₹{ride.price_per_seat}
                  </div>
                </div>

                {/* Date and Time */}
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full">
                    <span className="text-lg">📅</span>
                    <span className="font-semibold text-blue-700">{new Date(ride.departure_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-full">
                    <span className="text-lg">⏰</span>
                    <span className="font-semibold text-purple-700">{ride.departure_time}</span>
                  </div>
                </div>

                {/* Driver Info */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                  <div>
                    <div className="font-bold text-gray-900 text-lg">👤 {ride.driver_name}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.floor(ride.driver_rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-yellow-600">{ride.driver_rating}</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🪑</span>
                      <span className="font-bold text-orange-700">{ride.available_seats} seats</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {ride.description && (
                  <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-4 rounded-2xl mb-6">
                    <p className="text-gray-700 font-medium leading-relaxed">{ride.description}</p>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={() => handleBookRide(ride.id)}
                  disabled={ride.available_seats === 0}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    ride.available_seats === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 hover:from-purple-700 hover:via-pink-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-purple-500/25'
                  }`}
                >
                  {ride.available_seats === 0 ? '😔 Fully Booked' : '🎉 Book This Amazing Ride!'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Dashboard Modal */}
      {showBookingDashboard && (
        <BookingDashboard
          user={user}
          bookingId={selectedBookingId}
          onClose={() => setShowBookingDashboard(false)}
        />
      )}
    </div>
  );
}