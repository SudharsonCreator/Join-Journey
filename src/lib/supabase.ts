import { createClient } from '@supabase/supabase-js';

// Supabase configuration - Add your credentials here
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have valid Supabase credentials
const isValidSupabaseConfig = supabaseUrl && supabaseKey && 
  supabaseUrl !== '' && supabaseKey !== '' &&
  supabaseUrl.includes('supabase.co') && supabaseKey.length > 20;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

export type Ride = {
  id: string;
  driver_id: string;
  from_city: string;
  to_city: string;
  departure_date: string;
  departure_time: string;
  available_seats: number;
  price_per_seat: number;
  description?: string;
  created_at: string;
  driver_name: string;
  driver_rating: number;
};

export const isSupabaseConfigured = isValidSupabaseConfig;

export type RideBooking = {
  id: string;
  ride_id: string;
  passenger_id: string;
  seats_booked: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  ride?: Ride;
};

// Local storage functions for demo mode
export const saveRideToLocal = (ride: Ride) => {
  const existingRides = JSON.parse(localStorage.getItem('user_rides') || '[]');
  existingRides.push(ride);
  localStorage.setItem('user_rides', JSON.stringify(existingRides));
};

export const getRidesFromLocal = (): Ride[] => {
  return JSON.parse(localStorage.getItem('user_rides') || '[]');
};

export const getUserRidesFromLocal = (userId: string): Ride[] => {
  const allRides = getRidesFromLocal();
  return allRides.filter(ride => ride.driver_id === userId);
};