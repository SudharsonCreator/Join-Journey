import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Users, IndianRupee, FileText } from 'lucide-react';
import { supabase, isSupabaseConfigured, saveRideToLocal } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

// Comprehensive list of Indian cities and states
const INDIAN_CITIES = [
  // Major Metropolitan Cities
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat',
  'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
  'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
  
  // Tamil Nadu Cities (Comprehensive)
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur',
  'Erode', 'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi',
  'Karur', 'Udhagamandalam', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Kumbakonam',
  'Pudukkottai', 'Vaniyambadi', 'Ambur', 'Nagapattinam', 'Rajapalayam', 'Pollachi',
  'Ramanathapuram', 'Mayiladuthurai', 'Gobichettipalayam', 'Neyveli', 'Palladam',
  'Virudhunagar', 'Aruppukkottai', 'Gudiyatham', 'Krishnagiri', 'Dharmapuri',
  'Namakkal', 'Rasipuram', 'Attur', 'Yercaud', 'Mettur', 'Bhavani', 'Anthiyur',
  'Sathyamangalam', 'Taramani', 'Velachery', 'Tambaram', 'Avadi', 'Ambattur',
  
  // Karnataka Cities
  'Bangalore', 'Mysore', 'Hubli', 'Dharwad', 'Mangalore', 'Belgaum', 'Gulbarga',
  'Davanagere', 'Bellary', 'Bijapur', 'Shimoga', 'Tumkur', 'Raichur', 'Bidar',
  'Hospet', 'Hassan', 'Gadag-Betageri', 'Udupi', 'Robertsonpet', 'Bhadravati',
  
  // Kerala Cities
  'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad',
  'Alappuzha', 'Malappuram', 'Kannur', 'Kasaragod', 'Kottayam', 'Pathanamthitta',
  'Idukki', 'Wayanad', 'Ernakulam', 'Munnar', 'Varkala', 'Kumarakom',
  
  // Andhra Pradesh & Telangana
  'Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool',
  'Rajahmundry', 'Kadapa', 'Kakinada', 'Tirupati', 'Anantapur', 'Vizianagaram',
  'Eluru', 'Ongole', 'Nandyal', 'Machilipatnam', 'Adoni', 'Tenali', 'Chittoor',
  'Hindupur', 'Proddatur', 'Bhimavaram', 'Madanapalle', 'Guntakal', 'Dharmavaram',
  'Gudivada', 'Narasaraopet', 'Tadipatri', 'Mangalagiri', 'Chilakaluripet',
  
  // Maharashtra Cities
  'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur',
  'Amravati', 'Kolhapur', 'Sangli', 'Malegaon', 'Jalgaon', 'Akola', 'Latur',
  'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Ichalkaranji', 'Jalna',
  'Ambajogai', 'Bhusawal', 'Panvel', 'Badlapur', 'Beed', 'Gondia', 'Satara',
  
  // Gujarat Cities
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar',
  'Junagadh', 'Gandhinagar', 'Anand', 'Navsari', 'Morbi', 'Nadiad',
  'Surendranagar', 'Bharuch', 'Mehsana', 'Bhuj', 'Porbandar', 'Palanpur',
  'Valsad', 'Vapi', 'Gondal', 'Veraval', 'Godhra', 'Patan', 'Kalol',
  
  // Rajasthan Cities
  'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara',
  'Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Kishangarh',
  'Baran', 'Dhaulpur', 'Tonk', 'Beawar', 'Hanumangarh', 'Churu', 'Dholpur',
  
  // Uttar Pradesh Cities
  'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad',
  'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida',
  'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Rampur', 'Shahjahanpur',
  'Farrukhabad', 'Mau', 'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr',
  
  // West Bengal Cities
  'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda', 'Bardhaman',
  'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Dhulian',
  'Raniganj', 'Haldia', 'Raiganj', 'Krishnanagar', 'Nabadwip', 'Medinipur',
  
  // Madhya Pradesh Cities
  'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas',
  'Satna', 'Ratlam', 'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa',
  'Bhind', 'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Chhatarpur',
  
  // Punjab Cities
  'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali',
  'Firozpur', 'Batala', 'Pathankot', 'Moga', 'Abohar', 'Malerkotla',
  'Khanna', 'Phagwara', 'Muktsar', 'Barnala', 'Rajpura', 'Hoshiarpur',
  
  // Haryana Cities
  'Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak',
  'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa',
  'Bahadurgarh', 'Jind', 'Thanesar', 'Kaithal', 'Rewari', 'Narnaul',
  
  // Bihar Cities
  'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga',
  'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra',
  'Danapur', 'Saharsa', 'Hajipur', 'Sasaram', 'Dehri', 'Siwan',
  
  // Jharkhand Cities
  'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro',
  'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar', 'Chirkunda',
  
  // Odisha Cities
  'Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur',
  'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda',
  
  // Assam Cities
  'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia',
  'Tezpur', 'Bongaigaon', 'Dhubri', 'North Lakhimpur',
  
  // Himachal Pradesh Cities
  'Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Palampur', 'Baddi',
  'Nahan', 'Paonta Sahib', 'Sundarnagar', 'Chamba',
  
  // Uttarakhand Cities
  'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur',
  'Rishikesh', 'Kotdwar', 'Ramnagar', 'Pithoragarh',
  
  // Jammu & Kashmir Cities
  'Srinagar', 'Jammu', 'Baramulla', 'Anantnag', 'Sopore', 'KathuaUdhampur',
  'Punch', 'Rajauri', 'Kupwara',
  
  // Goa Cities
  'Panaji', 'Vasco da Gama', 'Margao', 'Mapusa', 'Ponda', 'Bicholim',
  'Curchorem', 'Sanquelim',
  
  // Tripura Cities
  'Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar', 'Belonia',
  
  // Manipur Cities
  'Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur',
  
  // Meghalaya Cities
  'Shillong', 'Tura', 'Nongstoin',
  
  // Nagaland Cities
  'Kohima', 'Dimapur', 'Mokokchung',
  
  // Mizoram Cities
  'Aizawl', 'Lunglei', 'Saiha',
  
  // Arunachal Pradesh Cities
  'Itanagar', 'Naharlagun', 'Pasighat',
  
  // Sikkim Cities
  'Gangtok', 'Namchi', 'Geyzing',
  
  // Chandigarh
  'Chandigarh',
  
  // Delhi NCR
  'New Delhi', 'Delhi', 'Noida', 'Greater Noida', 'Ghaziabad', 'Faridabad', 'Gurgaon',
  
  // Puducherry
  'Puducherry', 'Karaikal', 'Mahe', 'Yanam',
  
  // Andaman & Nicobar
  'Port Blair',
  
  // Lakshadweep
  'Kavaratti',
  
  // Ladakh
  'Leh', 'Kargil'
];

interface CreateRideProps {
  user: User | null;
}

export function CreateRide({ user }: CreateRideProps) {
  const [formData, setFormData] = useState({
    fromCity: '',
    toCity: '',
    departureDate: '',
    departureTime: '',
    availableSeats: 1,
    pricePerSeat: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Handle city suggestions
    if (name === 'fromCity') {
      if (value.length > 0) {
        const filtered = INDIAN_CITIES.filter(city =>
          city.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 8);
        setFromSuggestions(filtered);
        setShowFromSuggestions(true);
      } else {
        setShowFromSuggestions(false);
      }
    } else if (name === 'toCity') {
      if (value.length > 0) {
        const filtered = INDIAN_CITIES.filter(city =>
          city.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 8);
        setToSuggestions(filtered);
        setShowToSuggestions(true);
      } else {
        setShowToSuggestions(false);
      }
    }
  };

  const selectFromCity = (city: string) => {
    setFormData(prev => ({ ...prev, fromCity: city }));
    setShowFromSuggestions(false);
  };

  const selectToCity = (city: string) => {
    setFormData(prev => ({ ...prev, toCity: city }));
    setShowToSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      // Dispatch event to open auth modal
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'login' }));
      return;
    }

    setLoading(true);
    
    // Create ride object
    const newRide = {
      id: `ride-${Date.now()}`,
      driver_id: user.id,
      from_city: formData.fromCity,
      to_city: formData.toCity,
      departure_date: formData.departureDate,
      departure_time: formData.departureTime,
      available_seats: formData.availableSeats,
      price_per_seat: parseFloat(formData.pricePerSeat),
      description: formData.description,
      driver_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Driver',
      driver_rating: 4.5,
      created_at: new Date().toISOString()
    };

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('rides')
          .insert([newRide])
          .select();

        if (error) throw error;
        
        // Also save to local storage as backup
        saveRideToLocal(newRide);
      } else {
        // Save to local storage in demo mode
        saveRideToLocal(newRide);
      }

      // Also save to createdRides for user profile
      const existingCreatedRides = JSON.parse(localStorage.getItem('createdRides') || '[]');
      const createdRide = {
        id: newRide.id,
        from: newRide.from_city,
        to: newRide.to_city,
        date: newRide.departure_date,
        time: newRide.departure_time,
        seats: newRide.available_seats,
        price: newRide.price_per_seat,
        description: newRide.description,
        createdAt: newRide.created_at
      };
      existingCreatedRides.push(createdRide);
      localStorage.setItem('createdRides', JSON.stringify(existingCreatedRides));

      alert('🎉 Ride created successfully! You can view it in your profile.');
      setFormData({
        fromCity: '',
        toCity: '',
        departureDate: '',
        departureTime: '',
        availableSeats: 1,
        pricePerSeat: '',
        description: ''
      });
    } catch (error) {
      console.error('Error creating ride:', error);
      // Save to local storage as fallback
      saveRideToLocal(newRide);
      
      // Also save to createdRides for user profile
      const existingCreatedRides = JSON.parse(localStorage.getItem('createdRides') || '[]');
      const createdRide = {
        id: newRide.id,
        from: newRide.from_city,
        to: newRide.to_city,
        date: newRide.departure_date,
        time: newRide.departure_time,
        seats: newRide.available_seats,
        price: newRide.price_per_seat,
        description: newRide.description,
        createdAt: newRide.created_at
      };
      existingCreatedRides.push(createdRide);
      localStorage.setItem('createdRides', JSON.stringify(existingCreatedRides));
      
      alert('🎉 Ride created successfully! You can view it in your profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to publish a ride.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Publish Your Ride</h1>
          <p className="text-blue-100 mt-2">Share your journey and earn money while helping others travel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Route Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                From City
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fromCity"
                  value={formData.fromCity}
                  onChange={handleInputChange}
                  onFocus={() => formData.fromCity && setShowFromSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowFromSuggestions(false), 300)}
                  required
                  placeholder="e.g., Mumbai"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                {showFromSuggestions && fromSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-50 max-h-60 overflow-y-auto">
                    {fromSuggestions.map((city, index) => (
                      <button
                        key={index}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectFromCity(city)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg flex items-center space-x-2"
                      >
                        <MapPin className="h-4 w-4 text-blue-400" />
                        <span>{city}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                To City
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="toCity"
                  value={formData.toCity}
                  onChange={handleInputChange}
                  onFocus={() => formData.toCity && setShowToSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowToSuggestions(false), 300)}
                  required
                  placeholder="e.g., Pune"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                {showToSuggestions && toSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-50 max-h-60 overflow-y-auto">
                    {toSuggestions.map((city, index) => (
                      <button
                        key={index}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectToCity(city)}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg flex items-center space-x-2"
                      >
                        <MapPin className="h-4 w-4 text-green-400" />
                        <span>{city}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Departure Date
              </label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Departure Time
              </label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Seats and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Available Seats
              </label>
              <select
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num} seat{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IndianRupee className="inline h-4 w-4 mr-1" />
                Price per Seat (₹)
              </label>
              <input
                type="number"
                name="pricePerSeat"
                value={formData.pricePerSeat}
                onChange={handleInputChange}
                required
                min="50"
                max="5000"
                placeholder="500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Additional Information (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Tell passengers about your ride: car model, music preferences, stops, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg'
              }`}
            >
              {loading ? 'Publishing...' : 'Publish Ride'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}