import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const carIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LiveMapTrackingProps {
  from: string;
  to: string;
  driverName: string;
}

// Component to auto-fit bounds
function MapBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, bounds]);

  return null;
}

export function LiveMapTracking({ from, to, driverName }: LiveMapTrackingProps) {
  // Sample coordinates - in production, these would come from geocoding API or database
  const getCoordinatesForCity = (city: string): [number, number] => {
    const cityCoords: { [key: string]: [number, number] } = {
      // Major Metro Cities
      'mumbai': [19.0760, 72.8777],
      'pune': [18.5204, 73.8567],
      'bangalore': [12.9716, 77.5946],
      'bengaluru': [12.9716, 77.5946],
      'chennai': [13.0827, 80.2707],
      'delhi': [28.7041, 77.1025],
      'new delhi': [28.6139, 77.2090],
      'hyderabad': [17.3850, 78.4867],
      'kolkata': [22.5726, 88.3639],
      'ahmedabad': [23.0225, 72.5714],
      'jaipur': [26.9124, 75.7873],
      'surat': [21.1702, 72.8311],
      'lucknow': [26.8467, 80.9462],
      'kanpur': [26.4499, 80.3319],
      'nagpur': [21.1458, 79.0882],
      'indore': [22.7196, 75.8577],
      'thane': [19.2183, 72.9781],
      'bhopal': [23.2599, 77.4126],
      'visakhapatnam': [17.6869, 83.2185],
      'pimpri': [18.6298, 73.7997],
      'patna': [25.5941, 85.1376],
      'vadodara': [22.3072, 73.1812],
      'ghaziabad': [28.6692, 77.4538],
      'ludhiana': [30.9010, 75.8573],
      'agra': [27.1767, 78.0081],
      'nashik': [19.9975, 73.7898],
      'faridabad': [28.4089, 77.3178],
      'meerut': [28.9845, 77.7064],
      'rajkot': [22.3039, 70.8022],
      'kalyan': [19.2403, 73.1305],
      'vasai': [19.4612, 72.7987],
      'varanasi': [25.3176, 82.9739],
      'srinagar': [34.0837, 74.7973],
      'aurangabad': [19.8762, 75.3433],
      'dhanbad': [23.7957, 86.4304],
      'amritsar': [31.6340, 74.8723],
      'navi mumbai': [19.0330, 73.0297],
      'allahabad': [25.4358, 81.8463],
      'ranchi': [23.3441, 85.3096],
      'howrah': [22.5958, 88.2636],
      'coimbatore': [11.0168, 76.9558],
      'jabalpur': [23.1815, 79.9864],
      'gwalior': [26.2183, 78.1828],
      'vijayawada': [16.5062, 80.6480],
      'jodhpur': [26.2389, 73.0243],
      'madurai': [9.9252, 78.1198],
      'raipur': [21.2514, 81.6296],
      'kota': [25.2138, 75.8648],
      'chandigarh': [30.7333, 76.7794],
      'guwahati': [26.1445, 91.7362],
      'solapur': [17.6599, 75.9064],
      'hubli': [15.3647, 75.1240],
      'mysore': [12.2958, 76.6394],
      'mysuru': [12.2958, 76.6394],
      'tiruppur': [11.1075, 77.3398],
      'moradabad': [28.8389, 78.7378],
      'salem': [11.6643, 78.1460],
      'gurgaon': [28.4595, 77.0266],
      'aligarh': [27.8974, 78.0880],
      'jalandhar': [31.3260, 75.5762],
      'tiruchirappalli': [10.7905, 78.7047],
      'trichy': [10.7905, 78.7047],
      'bhubaneswar': [20.2961, 85.8245],
      'warangal': [17.9784, 79.6000],
      'thiruvananthapuram': [8.5241, 76.9366],
      'trivandrum': [8.5241, 76.9366],
      'guntur': [16.3067, 80.4365],
      'bhiwandi': [19.2961, 73.0631],
      'saharanpur': [29.9680, 77.5552],
      'gorakhpur': [26.7606, 83.3732],
      'bikaner': [28.0229, 73.3119],
      'amravati': [20.9374, 77.7796],
      'noida': [28.5355, 77.3910],
      'jamshedpur': [22.8046, 86.2029],
      'bhilai': [21.2095, 81.3784],
      'cuttack': [20.5240, 85.8378],
      'firozabad': [27.1591, 78.3957],
      'kochi': [9.9312, 76.2673],
      'cochin': [9.9312, 76.2673],
      'nellore': [14.4426, 79.9865],
      'bhavnagar': [21.7645, 72.1519],
      'dehradun': [30.3165, 78.0322],
      'durgapur': [23.5204, 87.3119],
      'asansol': [23.6739, 86.9524],
      'nanded': [19.1383, 77.2898],
      'kolhapur': [16.7050, 74.2433],
      'ajmer': [26.4499, 74.6399],
      'akola': [20.7002, 77.0082],
      'gulbarga': [17.3297, 76.8343],
      'jamnagar': [22.4707, 70.0577],
      'ujjain': [23.1765, 75.7885],
      'loni': [28.7572, 77.2856],
      'siliguri': [26.7271, 88.3953],
      'jhansi': [25.4484, 78.5685],
      'ulhasnagar': [19.2183, 73.1382],
      'jammu': [32.7266, 74.8570],
      'sangli': [16.8524, 74.5815],
      'mangalore': [12.9141, 74.8560],
      'erode': [11.3410, 77.7172],
      'belgaum': [15.8497, 74.4977],
      'ambattur': [13.1143, 80.1548],
      'tirunelveli': [8.7139, 77.7567],
      'malegaon': [20.5579, 74.5287],
      'gaya': [24.7955, 84.9994],
      'tirupati': [13.6288, 79.4192],
      'davanagere': [14.4644, 75.9216],
      'kozhikode': [11.2588, 75.7804],
      'calicut': [11.2588, 75.7804],
      'kurnool': [15.8281, 78.0373],
      'bokaro': [23.6693, 86.1511],
      'rajahmundry': [17.0005, 81.8040],
      'ballari': [15.1394, 76.9214],
      'agartala': [23.8315, 91.2868],
      'bhagalpur': [25.2425, 86.9842],
      'latur': [18.3981, 76.5604],
      'dhule': [20.9042, 74.7749],
      'rohtak': [28.8955, 76.6066],
      'korba': [22.3595, 82.7501],
      'bhilwara': [25.3467, 74.6405],
      'brahmapur': [19.3150, 84.7941],
      'muzaffarpur': [26.1225, 85.3906],
      'ahmednagar': [19.0948, 74.7480],
      'mathura': [27.4924, 77.6737],
      'kollam': [8.8932, 76.6141],
      'avadi': [13.1067, 80.1000],
      'kadapa': [14.4674, 78.8241],
      'kamarhati': [22.6710, 88.3745],
      'sambalpur': [21.4669, 83.9812],
      'bilaspur': [22.0797, 82.1409],
      'shahjahanpur': [27.8801, 79.9050],
      'satara': [17.6805, 74.0183],
      'bijapur': [16.8302, 75.7100],
      'rampur': [28.8153, 79.0256],
      'shivamogga': [13.9299, 75.5681],
      'chandrapur': [19.9615, 79.2961],
      'junagadh': [21.5222, 70.4579],
      'thrissur': [10.5276, 76.2144],
      'alwar': [27.5530, 76.6346],
      'bardhaman': [23.2324, 87.8615],
      'kulti': [23.7283, 86.8446],
      'kakinada': [16.9891, 82.2475],
      'nizamabad': [18.6725, 78.0941],
      'parbhani': [19.2608, 76.7611],
      'tumkur': [13.3392, 77.1013],
      'khammam': [17.2473, 80.1514],
      'ozhukarai': [11.9649, 79.7738],
      'bihar sharif': [25.1989, 85.5226],
      'panipat': [29.3909, 76.9635],
      'darbhanga': [26.1542, 85.8918],
      'bally': [22.6520, 88.3407],
      'aizawl': [23.7271, 92.7176],
      'dewas': [22.9676, 76.0534],
      'ichalkaranji': [16.6917, 74.4604],
      'karnal': [29.6857, 76.9905],
      'bathinda': [30.2110, 74.9455],
      'jalna': [19.8347, 75.8800],
      'eluru': [16.7107, 81.0952],
      'kirari suleman nagar': [28.7578, 77.0366],
      'barasat': [22.7210, 88.4853],
      'purnia': [25.7771, 87.4753],
      'satna': [24.6005, 80.8322],
      'mira-bhayandar': [19.2952, 72.8544],
      'farrukhabad': [27.3882, 79.5820],
      'durg': [21.1871, 81.2849],
      'imphal': [24.8170, 93.9368],
      'ratlam': [23.3315, 75.0367],
      'hapur': [28.7304, 77.7761],
      'anantapur': [14.6819, 77.6006],
      'arrah': [25.5562, 84.6644],
      'karimnagar': [18.4386, 79.1288],
      'etawah': [26.7855, 79.0215],
      'ambarnath': [19.1881, 73.1900],
      'north dumdum': [22.6549, 88.4197],
      'bharatpur': [27.2173, 77.4900],
      'begusarai': [25.4182, 86.1272],
      'chhapra': [25.7802, 84.7278],
      'ramagundam': [18.7553, 79.4747],
      'pali': [25.7711, 73.3234],
      'vizianagaram': [18.1066, 83.3955],
      'katihar': [25.5333, 87.5833],
      'hardwar': [29.9457, 78.1642],
      'sonipat': [28.9949, 77.0216],
      'nagercoil': [8.1790, 77.4347],
      'thanjavur': [10.7870, 79.1378],
      'murwara': [23.8388, 80.3979],
      'naihati': [22.8932, 88.4194],
      'sambhal': [28.5855, 78.5708],
      'nadiad': [22.6939, 72.8614],
      'yamunanagar': [30.1290, 77.2674],
      'english bazar': [25.0119, 88.1425],
      'munger': [25.3753, 86.4731],
      'panchkula': [30.6942, 76.8606],
      'burhanpur': [21.3008, 76.2311],
      'raurkela industrial township': [22.2497, 84.8643],
      'kharagpur': [22.3460, 87.2319],
      'dindigul': [10.3673, 77.9803],
      'gandhinagar': [23.2156, 72.6369],
      'hospet': [15.2687, 76.3872],
      'nangloi jat': [28.6833, 77.0667],
      'malda': [25.0119, 88.1425],
      'ongole': [15.5057, 80.0499],
      'deoghar': [24.4847, 86.6997],
      'chapra': [25.7802, 84.7278],
      'haldia': [22.0255, 88.0584],
      'khandwa': [21.8333, 76.3500],
      'nandyal': [15.4769, 78.4830],
      'morena': [26.4944, 77.9944],
      'amroha': [28.9036, 78.4677],
      'anand': [22.5645, 72.9289],
      'bhind': [26.5653, 78.7789],
      'bhalswa jahangir pur': [28.7373, 77.1634],
      'madhyamgram': [22.6990, 88.4585],
      'bhiwani': [28.7933, 76.1395],
      'navi mumbai panvel raigad': [19.0330, 73.0297],
      'baharampur': [24.1000, 88.2500],
      'ambala': [30.3782, 76.7767],
      'morbi': [22.8173, 70.8373],
      'fatehpur': [25.9295, 80.8116],
      'rae bareli': [26.2124, 81.2615],
      'khora': [28.7576, 77.2056],
      'bhusawal': [21.0438, 75.7849],
      'orai': [25.9897, 79.4502],
      'bahraich': [27.5742, 81.5947],
      'vellore': [12.9165, 79.1325],
      'mahesana': [23.5880, 72.3693],
      'raiganj': [25.6145, 88.1246],
      'sirsa': [29.5353, 75.0289],
      'danapur': [25.6331, 85.0478],
      'serampore': [22.7500, 88.3400],
      'sultan pur majra': [28.6981, 77.0847],
      'guna': [24.6506, 77.3112],
      'jaunpur': [25.7466, 82.6836],
      'panvel': [18.9894, 73.1205],
      'shivpuri': [25.4233, 77.6617],
      'surendranagar dudhrej': [22.7039, 71.6378],
      'unnao': [26.5464, 80.4879],
      'hugli-chinsurah': [22.9000, 88.4000],
      'alappuzha': [9.4981, 76.3388],
      'kottayam': [9.5916, 76.5222],
      'machilipatnam': [16.1875, 81.1389],
      'shimla': [31.1048, 77.1734],
      'adoni': [15.6281, 77.2750],
      'udupi': [13.3409, 74.7421],
      'tenali': [16.2428, 80.6514],
      'proddatur': [14.7502, 78.5482],
      'saharsa': [25.8750, 86.5958],
      'hindupur': [13.8283, 77.4914],
      'sasaram': [24.9522, 84.0331],
      'hajipur': [25.6892, 85.2095],
      'bhimavaram': [16.5449, 81.5212],
      'dehri': [24.9025, 84.1828],
      'madanapalle': [13.5503, 78.5026],
      'siwan': [26.2183, 84.3589],
      'bettiah': [26.8022, 84.5028],
      'guntakal': [15.1667, 77.3667],
      'srikakulam': [18.2949, 83.8938],
      'motihari': [26.6517, 84.9178],
      'dharmavaram': [14.4144, 77.7211],
      'gudivada': [16.4333, 81.0000],
      'narasaraopet': [16.2346, 80.0493],
      'bagaha': [27.0992, 84.0906],
      'miryalaguda': [16.8667, 79.5667],
      'tadipatri': [14.9095, 78.0109],
      'kishanganj': [26.1064, 87.9506],
      'karaikudi': [10.0667, 78.7667],
      'suryapet': [17.1500, 79.6167],
      'jamalpur': [25.3156, 86.4892],
      'kavali': [14.9167, 79.9833],
      'tadepalligudem': [16.8167, 81.5167],
      'amaravati': [16.5742, 80.3589],
      'buxar': [25.5647, 83.9789],
      'jehanabad': [25.2167, 84.9833],
      'gobichettipalayam': [11.4544, 77.4386],
    };

    const cityLower = city.toLowerCase().trim();
    return cityCoords[cityLower] || [12.9716, 77.5946]; // Default to Bangalore
  };

  const startCoords = getCoordinatesForCity(from);
  const endCoords = getCoordinatesForCity(to);

  // Calculate driver's current position (38% of the journey)
  const progress = 0.38;
  const currentDriverPos: [number, number] = [
    startCoords[0] + (endCoords[0] - startCoords[0]) * progress,
    startCoords[1] + (endCoords[1] - startCoords[1]) * progress
  ];

  // Animate driver position
  const [driverPos, setDriverPos] = useState<[number, number]>(currentDriverPos);

  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPos((prev) => {
        const newLat = prev[0] + (endCoords[0] - startCoords[0]) * 0.001;
        const newLng = prev[1] + (endCoords[1] - startCoords[1]) * 0.001;

        // Stop at destination
        if (Math.abs(newLat - endCoords[0]) < 0.01 && Math.abs(newLng - endCoords[1]) < 0.01) {
          return endCoords;
        }

        return [newLat, newLng];
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [startCoords, endCoords]);

  // Create route path
  const routePath: [number, number][] = [
    startCoords,
    driverPos,
    endCoords
  ];

  // Calculate bounds
  const bounds: L.LatLngBoundsExpression = [
    [
      Math.min(startCoords[0], endCoords[0]) - 0.1,
      Math.min(startCoords[1], endCoords[1]) - 0.1
    ],
    [
      Math.max(startCoords[0], endCoords[0]) + 0.1,
      Math.max(startCoords[1], endCoords[1]) + 0.1
    ]
  ];

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={currentDriverPos}
        zoom={8}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds bounds={bounds} />

        {/* Start marker */}
        <Marker position={startCoords} icon={startIcon}>
          <Popup>
            <div className="text-center">
              <strong>{from}</strong>
              <br />
              <span className="text-sm text-gray-600">Start Point</span>
            </div>
          </Popup>
        </Marker>

        {/* End marker */}
        <Marker position={endCoords} icon={endIcon}>
          <Popup>
            <div className="text-center">
              <strong>{to}</strong>
              <br />
              <span className="text-sm text-gray-600">Destination</span>
            </div>
          </Popup>
        </Marker>

        {/* Driver marker */}
        <Marker position={driverPos} icon={carIcon}>
          <Popup>
            <div className="text-center">
              <strong>{driverName}</strong>
              <br />
              <span className="text-sm text-green-600">Current Location</span>
              <br />
              <span className="text-xs text-gray-500">Moving at 60 km/h</span>
            </div>
          </Popup>
        </Marker>

        {/* Route line */}
        <Polyline
          positions={routePath}
          color="#3b82f6"
          weight={4}
          opacity={0.7}
          dashArray="10, 10"
        />
      </MapContainer>

      {/* Live Stats Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex space-x-4 z-[1000] pointer-events-none">
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg pointer-events-auto">
          <p className="text-xs text-gray-600">Distance Remaining</p>
          <p className="text-lg font-bold text-gray-900">186 km</p>
        </div>
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg pointer-events-auto">
          <p className="text-xs text-gray-600">Current Speed</p>
          <p className="text-lg font-bold text-gray-900">60 km/h</p>
        </div>
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg pointer-events-auto">
          <p className="text-xs text-gray-600">ETA</p>
          <p className="text-lg font-bold text-gray-900">2h 30m</p>
        </div>
      </div>
    </div>
  );
}
