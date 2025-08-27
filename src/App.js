import React, { useState, useEffect, useRef } from 'react';
import { Search, Home, MapPin, Users, Phone, ArrowLeft, Plus, Check } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import './App.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ResourceFinderApp = () => {
  // Main app state
  const [currentScreen, setCurrentScreen] = useState('home');
  const [contactsSubScreen, setContactsSubScreen] = useState('hotlines');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Location state
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapRef = useRef(null);
  
  // Contacts state
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
    const [contacts, setContacts] = useState([
    { id: 1, name: 'Dr. Amelia Carter', phone: '555-123-4567' },
    { id: 2, name: 'Liam Harper', phone: '555-987-6543' }
  ]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Static data
  const resourceCategories = [
    { name: 'Police Station', image: '/images/police.jpg' },
    { name: 'Clinic/Hospital', image: '/images/hospital_desk.jpg' },
    { name: 'Food Bank', image: '/images/food.jpg' },
    { name: 'Housing/Shelter', image: '/images/houses.jpg' },
    { name: 'Legal Aid', image: '/images/law.jpg' },
    { name: 'Transportation', image: '/images/bus.jpg' }
  ];

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911' },
    { name: 'Suicide & Crisis Lifeline', number: '988' },
    { name: 'National Domestic Violence Hotline', number: '800-799-7233' },
    { name: 'RAINN (Rape, Abuse & Incest National Network)', number: '800-656-4673' }
  ];

  const resources = [
    { 
      name: "Central Police Station", 
      type: "police", 
      lat: 40.7128, 
      lng: -74.006, 
      address: "123 Justice Way, Anytown, USA", 
      phone: "(555) 123-4567" 
    },
    { 
      name: "General Hospital", 
      type: "hospital", 
      lat: 40.7142, 
      lng: -74.01, 
      address: "456 Health Ave, Anytown, USA", 
      phone: "(555) 987-6543" 
    },
    { 
      name: "Community Shelter", 
      type: "shelter", 
      lat: 40.7135, 
      lng: -74.008, 
      address: "789 Care St, Anytown, USA", 
      phone: "(555) 111-2222" 
    },
  ];

  // Get user location on component mount
  useEffect(() => {
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser.");
        // Set default location as fallback
        setUserLocation({ lat: 40.7128, lng: -74.006 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationError(null);
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = "Location access denied or not available.";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage = "Unknown location error.";
          }
          
          setLocationError(errorMessage);
          // Set default location as fallback
          setUserLocation({ lat: 40.7128, lng: -74.006 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    };

    getUserLocation();
  }, []);

  // Utility functions
  const addContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      setContacts(prev => [...prev, {
        id: Date.now(),
        name: newContact.name.trim(),
        phone: newContact.phone.trim()
      }]);
      setNewContact({ name: '', phone: '' });
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMapReady = () => {
    setIsMapReady(true);
  };

  // Components
  const Header = ({ title, showBack = false, onBack,}) => (
    <div className="flex items-center bg-[#121416] p-4 pb-2 justify-between pt-6">
      {showBack ? (
        <button
          onClick={onBack || (() => setCurrentScreen('home'))}
          className="text-white flex size-12 shrink-0 items-center hover:bg-gray-700 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
      ) : (
        <div className="w-12" />
      )}
      <h2 className="text-[#6ee7b7] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
        {title}
      </h2>
      {/* Right spacer for symmetry */}
      <div className="w-12" />
    </div>
  );

  const Navigation = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1e2124] border-t border-[#2c3135] max-w-md mx-auto">
      <div className="flex justify-around py-1">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'map', icon: MapPin, label: 'Map' },
          { id: 'contacts', icon: Users, label: 'Contacts' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => {
              setCurrentScreen(id);
              if (id === 'contacts') setContactsSubScreen('hotlines');
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
              currentScreen === id 
                ? 'text-white' 
                : 'text-[#a2abb3] hover:bg-gray-700'
            }`}
          >
            <Icon size={20} fill={currentScreen === id ? 'currentColor' : 'none'} />
            <span className="text-xs font-medium leading-normal tracking-[0.015em] mt-1">
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );

  const LoadingScreen = ({ message }) => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-300">{message}</p>
      </div>
    </div>
  );

  const ErrorBanner = ({ error }) => (
    <div className="absolute top-4 left-4 right-4 z-[1000]">
      <div className="bg-red-600 bg-opacity-90 px-4 py-2 rounded-lg text-white text-sm shadow-lg">
        <span className="mr-2">⚠️</span>
        {error}
      </div>
    </div>
  );

  // Screen components
  const HomeScreen = () => (
    <div className="flex flex-col h-screen">
      <Header title="Local Emergency Resource Finder"/>
      
      <div className="flex-1 flex flex-col pb-20 overflow-hidden">
        <div className="grid grid-cols-2 gap-2 px-3 py-2 flex-1 min-h-0">
          {resourceCategories.map((resource, index) => (
            <div 
              key={index} 
              className="flex flex-col gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                setCurrentScreen('map');
                setSearchQuery(resource.name);
              }}
            >
              <div
                className="w-full bg-center bg-no-repeat bg-cover rounded-lg flex-1 min-h-0"
                style={{ backgroundImage: `url(${resource.image})` }}
              />
              <p className="text-white text-sm font-medium leading-normal text-center">
                {resource.name}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center px-4 pt-2 pb-2">
          <button 
            onClick={() => window.open('tel:911')}
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 bg-[#6ee7b7] text-[#121416] text-base font-bold leading-normal tracking-[0.015em] px-6 gap-3 hover:bg-green-400 transition-colors"
          >
            <Phone size={20} />
            Emergency Call
          </button>
        </div>
      </div>
    </div>
  );

  const MapScreen = () => (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2 shadow-sm">
          <Search className="text-gray-400 mr-2 flex-shrink-0" size={20} />
          <input
            type="text"
            placeholder="Search police, hospitals, shelters..."
            className="bg-transparent text-white w-full outline-none placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-white ml-2 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-gray-400 text-sm mt-2">
            Found {filteredResources.length} result{filteredResources.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="relative flex-1 pb-16">
        {!userLocation ? (
          <LoadingScreen message="Getting your location..." />
        ) : (
          <>
            <MapContainer
              ref={mapRef}
              center={[userLocation.lat, userLocation.lng]}
              zoom={14}
              scrollWheelZoom={true}
              className="h-full w-full z-0"
              whenReady={handleMapReady}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
                maxZoom={19}
              />
              
              {isMapReady && userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>
                    <div className="text-center">
                      <strong>📍 You are here</strong>
                      <br />
                      <small>Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}</small>
                    </div>
                  </Popup>
                </Marker>
              )}
              
              {isMapReady && filteredResources.map((resource, index) => {
                if (!resource.lat || !resource.lng || !resource.name) {
                  console.warn('Invalid resource data:', resource);
                  return null;
                }
                
                return (
                  <Marker key={`${resource.name}-${index}`} position={[resource.lat, resource.lng]}>
                    <Popup maxWidth={300} minWidth={200}>
                      <div className="p-1">
                        <strong className="text-lg">{resource.name}</strong>
                        {resource.address && (
                          <>
                            <br />
                            <span className="text-gray-600">{resource.address}</span>
                          </>
                        )}
                        {resource.phone && (
                          <>
                            <br />
                            <a 
                              href={`tel:${resource.phone.replace(/\D/g, "")}`}
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              📞 {resource.phone}
                            </a>
                          </>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
            
            {!isMapReady && (
              <LoadingScreen message="Loading map..." />
            )}
          </>
        )}
        
        {locationError && <ErrorBanner error={locationError} />}
      </div>
    </div>
  );

  const ContactsScreen = () => {
    if (contactsSubScreen === 'add') {
      return (
        <div className="flex flex-col h-screen">
          <Header
            title="Add Contact"
            showBack
            onBack={() => setContactsSubScreen('hotlines')}
          />
          
          <div className="flex-1 pb-16 p-4">
            {showConfirmation && (
              <div className="bg-green-600 bg-opacity-90 p-3 rounded-lg mb-4 flex items-center gap-2">
                <Check size={20} className="text-white" />
                <span className="text-white font-medium">Contact added successfully!</span>
              </div>
            )}
            
            <div className="flex flex-col gap-4 mt-8">
              <input
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="w-full resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] h-14 placeholder:text-[#a2abb3] p-4 text-base font-normal leading-normal"
              />
              <input
                placeholder="Phone Number"
                type="tel"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="w-full resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] h-14 placeholder:text-[#a2abb3] p-4 text-base font-normal leading-normal"
              />
              <div className="flex justify-center mt-4">
                <button
                  onClick={addContact}
                  disabled={!newContact.name.trim() || !newContact.phone.trim()}
                  className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-[#dce8f3] text-[#121416] text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 transition-colors"
                >
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (contactsSubScreen === 'your') {
      return (
        <div className="flex flex-col h-screen">
          <Header
            title="Your Contacts"
            showBack
            onBack={() => setContactsSubScreen('hotlines')}
          />
          
          <div className="flex-1 pb-16 overflow-y-auto">
            <div className="p-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-4 bg-[#2c3135] rounded-xl px-4 py-3 mb-3">
                  <div className="text-white flex items-center justify-center rounded-lg bg-[#121416] shrink-0 size-12">
                    <Phone size={24} />
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <p className="text-white text-base font-medium leading-normal">
                      {contact.name}
                    </p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-[#6ee7b7] text-sm font-normal leading-normal hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                  <button
                    onClick={() => window.open(`tel:${contact.phone}`)}
                    className="bg-[#6ee7b7] text-[#121416] px-4 py-2 rounded-full font-bold text-sm hover:bg-green-400 transition-colors"
                  >
                    Call
                  </button>
                </div>
              ))}
              
              {contacts.length === 0 && (
                <div className="text-center text-[#a2abb3] mt-8">
                  <p>No contacts added yet.</p>
                  <button
                    onClick={() => setContactsSubScreen('add')}
                    className="mt-4 text-[#6ee7b7] hover:underline"
                  >
                    Add your first contact
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Default hotlines view
    return (
      <div className="flex flex-col h-screen">
        <Header title="Emergency Contacts" />
        
        <div className="flex-1 pb-16 overflow-y-auto">
          <div className="flex justify-center gap-4 p-4 border-b border-[#2c3135]">
            <button
              onClick={() => setContactsSubScreen('add')}
              className="flex items-center gap-2 bg-[#2c3135] px-4 py-2 rounded-full text-white hover:bg-[#3c4147] transition-colors"
            >
              <Plus size={18} />
              Add Contact
            </button>
            <button
              onClick={() => setContactsSubScreen('your')}
              className="flex items-center gap-2 bg-[#2c3135] px-4 py-2 rounded-full text-white hover:bg-[#3c4147] transition-colors"
            >
              <Users size={18} />
              Your Contacts
            </button>
          </div>

          <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Local Hotlines
          </h2>
          
          <div className="px-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center gap-4 bg-[#2c3135] rounded-xl px-4 py-3 mb-3">
                <div className="text-white flex items-center justify-center rounded-lg bg-[#121416] shrink-0 size-12">
                  <Phone size={24} />
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <p className="text-white text-base font-medium leading-normal">
                    {contact.name}
                  </p>
                  <a
                    href={`tel:${contact.number}`}
                    className="text-[#6ee7b7] text-sm font-normal leading-normal hover:underline"
                  >
                    {contact.number}
                  </a>
                </div>
                <button
                  onClick={() => window.open(`tel:${contact.number}`)}
                  className="bg-[#6ee7b7] text-[#121416] px-4 py-2 rounded-full font-bold text-sm hover:bg-green-400 transition-colors"
                >
                  Call
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'map':
        return <MapScreen />;
      case 'contacts':
        return <ContactsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="relative bg-[#121416] text-white font-['Space_Grotesk','Noto_Sans',sans-serif] max-w-md mx-auto h-screen overflow-hidden">
      {renderCurrentScreen()}
      <Navigation />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <ResourceFinderApp />
    </div>
  );
}

export default App;