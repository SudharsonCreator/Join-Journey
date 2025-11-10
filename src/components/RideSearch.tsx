import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Navigation } from 'lucide-react';

interface RideSearchProps {
  onSearch: (searchData: {
    fromCity: string;
    toCity: string;
    date: string;
    passengers: number;
    pickupLocation?: string;
  }) => void;
}

// Major Indian cities for autocomplete
const INDIAN_CITIES = [
  // Major Indian Cities
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat',
  'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  
  // Tamil Nadu Cities (Comprehensive List)
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur',
  'Erode', 'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi',
  'Karur', 'Udhagamandalam', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Kumarakonam',
  'Pudukkottai', 'Vaniyambadi', 'Ambur', 'Nagapattinam', 'Rajapalayam', 'Pudukkottai',
  'Pollachi', 'Ramanathapuram', 'Kumbakonam', 'Mayiladuthurai', 'Gobichettipalayam',
  'Neyveli', 'Palladam', 'Virudhunagar', 'Aruppukkottai', 'Gudiyatham', 'Vaniyambadi',
  'Krishnagiri', 'Dharmapuri', 'Namakkal', 'Rasipuram', 'Attur', 'Yercaud', 'Mettur',
  'Bhavani', 'Anthiyur', 'Sathyamangalam', 'Taramani', 'Velachery', 'Tambaram',
  'Avadi', 'Ambattur', 'Chromepet', 'Pallavaram', 'Anakaputhur', 'Selaiyur',
  'Medavakkam', 'Sholinganallur', 'Perungudi', 'Thoraipakkam', 'Adyar', 'Mylapore',
  'T. Nagar', 'Anna Nagar', 'Kilpauk', 'Egmore', 'Nungambakkam', 'Kodambakkam',
  'Vadapalani', 'Ashok Nagar', 'K.K. Nagar', 'Saidapet', 'Guindy', 'Alandur',
  'St. Thomas Mount', 'Meenambakkam', 'Pallikaranai', 'Perungalathur', 'Poonamallee',
  'Avadi', 'Tiruvallur', 'Gummidipoondi', 'Uthukottai', 'Thiruvottiyur', 'Manali',
  'Ennore', 'Madhavaram', 'Perambur', 'Vyasarpadi', 'Tondiarpet', 'Washermanpet',
  'Royapuram', 'Sowcarpet', 'George Town', 'Parrys Corner', 'High Court', 'Fort St. George',
  'Marina Beach', 'Besant Nagar', 'Thiruvanmiyur', 'Injambakkam', 'Akkarai', 'Uthandi',
  'Kovalam', 'Mahabalipuram', 'Kalpakkam', 'Chengalpattu', 'Madurantakam', 'Kancheepuram',
  'Sriperumbudur', 'Oragadam', 'Irungattukottai', 'Singaperumal Koil', 'Guduvanchery',
  'Urapakkam', 'Vandalur', 'Kelambakkam', 'Siruseri', 'Padur', 'Thiruporur',
  'Mamallapuram', 'Pondicherry', 'Cuddalore', 'Villupuram', 'Tindivanam', 'Gingee',
  'Vikravandi', 'Ulundurpet', 'Kallakurichi', 'Sankarapuram', 'Tirukoilur', 'Vridhachalam',
  'Chidambaram', 'Sirkazhi', 'Mayiladuthurai', 'Poompuhar', 'Tranquebar', 'Karaikal',
  'Nagapattinam', 'Velankanni', 'Thiruvarur', 'Mannargudi', 'Thiruthuraipoondi',
  'Needamangalam', 'Papanasam', 'Kumbakonam', 'Darasuram', 'Swamimalai', 'Thiruvidaimarudur',
  'Thanjavur', 'Orathanadu', 'Pattukkottai', 'Peravurani', 'Aranthangi', 'Pudukkottai',
  'Alangudi', 'Thirumayam', 'Kunnam', 'Manamelkudi', 'Karaikudi', 'Devakottai',
  'Manamadurai', 'Singampunari', 'Tirupathur', 'Ramnad', 'Paramakudi', 'Mudukulathur',
  'Ramanathapuram', 'Rameswaram', 'Mandapam', 'Pamban', 'Dhanushkodi', 'Erwadi',
  'Kilakarai', 'Sayalkudi', 'Thondi', 'Adirampattinam', 'Devipattinam', 'Vedaranyam',
  'Kodikkarai', 'Muthupet', 'Thiruthuraipoondi', 'Mannargudi', 'Thiruvarur',
  
  // Other Major Cities
  'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
  'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
  'Ranchi', 'Howrah', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Raipur', 'Kota',
  'Chandigarh', 'Guwahati', 'Solapur', 'Hubli-Dharwad', 'Bareilly', 'Mysore', 'Gurgaon',
  'Aligarh', 'Jalandhar', 'Bhubaneswar', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur',
  'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack',
  'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol',
  'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain'
];

export function RideSearch({ onSearch }: RideSearchProps) {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const getCurrentLocation = () => {
    setShowLocationInput(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Use reverse geocoding to get address
          if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            const latlng = { lat: latitude, lng: longitude };
            
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status === 'OK' && results[0]) {
                setPickupLocation(results[0].formatted_address);
              } else {
                setPickupLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
              }
            });
          } else {
            // Fallback to approximate address based on coordinates
            setPickupLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setPickupLocation('Location access denied. Please enter manually.');
        }
      );
    } else {
      setPickupLocation('Geolocation not supported. Please enter manually.');
    }
  };
  const handleFromCityChange = (value: string) => {
    setFromCity(value);
    if (value.length > 0) {
      const filtered = INDIAN_CITIES.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setFromSuggestions(filtered);
      setShowFromSuggestions(true);
    } else {
      setShowFromSuggestions(false);
    }
  };

  const handleToCityChange = (value: string) => {
    setToCity(value);
    if (value.length > 0) {
      const filtered = INDIAN_CITIES.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setToSuggestions(filtered);
      setShowToSuggestions(true);
    } else {
      setShowToSuggestions(false);
    }
  };

  const selectFromCity = (city: string) => {
    setFromCity(city);
    setShowFromSuggestions(false);
  };

  const selectToCity = (city: string) => {
    setToCity(city);
    setShowToSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCity || !toCity) {
      alert('Please select both departure and destination cities');
      return;
    }
    
    // Store pickup location globally
    if (pickupLocation) {
      localStorage.setItem('user_pickup_location', pickupLocation);
    }
    
    onSearch({ fromCity, toCity, date, passengers, pickupLocation });
  };

  return (
    <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl mx-4 lg:mx-auto max-w-6xl -mt-20 relative z-20 p-8 border border-purple-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          🔍 Find Your Perfect Ride
        </h2>
        <p className="text-gray-600">Discover amazing journeys with fellow travelers</p>
      </div>
      
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* From */}
          <div className="relative group">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">🚀</span>
              From
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 h-5 w-5 text-purple-400 group-hover:text-purple-600 transition-colors duration-200 z-10" />
              <input
                type="text"
                value={fromCity}
                onChange={(e) => handleFromCityChange(e.target.value)}
                onFocus={() => fromCity && setShowFromSuggestions(true)}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 300)}
                placeholder="Departure city"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-purple-300 bg-gradient-to-r from-white to-purple-50/30"
              />
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-purple-200 rounded-2xl mt-2 shadow-xl z-50 max-h-60 overflow-y-auto">
                  {fromSuggestions.map((city, index) => (
                    <button
                      key={index}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectFromCity(city)}
                      className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl flex items-center space-x-2"
                    >
                      <MapPin className="h-4 w-4 text-purple-400" />
                      <span>{city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* To */}
          <div className="relative group">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">🎯</span>
              To
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 h-5 w-5 text-pink-400 group-hover:text-pink-600 transition-colors duration-200 z-10" />
              <input
                type="text"
                value={toCity}
                onChange={(e) => handleToCityChange(e.target.value)}
                onFocus={() => toCity && setShowToSuggestions(true)}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 300)}
                placeholder="Destination city"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 hover:border-pink-300 bg-gradient-to-r from-white to-pink-50/30"
              />
              {showToSuggestions && toSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-pink-200 rounded-2xl mt-2 shadow-xl z-50 max-h-60 overflow-y-auto">
                  {toSuggestions.map((city, index) => (
                    <button
                      key={index}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectToCity(city)}
                      className="w-full text-left px-4 py-3 hover:bg-pink-50 transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl flex items-center space-x-2"
                    >
                      <MapPin className="h-4 w-4 text-pink-400" />
                      <span>{city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="relative group">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">📅</span>
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-4 h-5 w-5 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-200" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-300 bg-gradient-to-r from-white to-indigo-50/30"
              />
            </div>
          </div>

          {/* Passengers */}
          <div className="relative group">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">👥</span>
              Passengers
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-4 h-5 w-5 text-green-400 group-hover:text-green-600 transition-colors duration-200" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 hover:border-green-300 bg-gradient-to-r from-white to-green-50/30"
              >
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} passenger{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pickup Location Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Navigation className="h-5 w-5 mr-2 text-green-600" />
              📍 Your Pickup Location
            </h3>
            <button
              type="button"
              onClick={() => setShowLocationInput(!showLocationInput)}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              {showLocationInput ? 'Hide' : 'Set Location'}
            </button>
          </div>
          
          {showLocationInput && (
            <div className="space-y-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Enter your pickup address..."
                  className="flex-1 px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-colors duration-200"
                >
                  <Navigation className="h-5 w-5" />
                  <span>📍 Use Current</span>
                </button>
              </div>
              {pickupLocation && (
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <strong>Pickup Point:</strong> {pickupLocation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="text-center pt-4">
          <button
            type="submit"
            className="group bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 hover:from-purple-700 hover:via-pink-600 hover:to-indigo-700 text-white px-16 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 inline-flex items-center space-x-3"
          >
            <Search className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
            <span>🔍 Search Amazing Rides</span>
          </button>
        </div>
      </form>
    </div>
  );
}