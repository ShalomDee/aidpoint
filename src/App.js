import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader
} from "@react-google-maps/api";
import {
  Search,
  Home,
  MapPin,
  Users,
  Phone,
  ArrowLeft,
  Plus,
  Check
} from "lucide-react";

// ---- CONFIG ----
const GOOGLE_MAPS_LIBRARIES = ["places"];
const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060 }; // NYC fallback
const NEARBY_RADIUS_METERS = 3500; // tweak as needed

// Category mapping -> Google Places types or keywords
const CATEGORY_TO_PLACES = {
  "Police Station": { type: "police", keyword: "police" },
  "Clinic/Hospital": { type: "hospital", keyword: "hospital" },
  "Food Bank": { type: "food_bank", keyword: "food bank" },
  "Housing/Shelter": { type: "lodging", keyword: "shelter" },
  "Legal Aid": { type: "lawyer", keyword: "legal aid" },
  Transportation: { type: "transit_station", keyword: "bus station" }
};

// ---- STATIC DATA (offline-friendly) ----
const resourceCategories = [
  { name: "Police Station", image: "/images/police.jpg" },
  { name: "Clinic/Hospital", image: "/images/hospital_desk.jpg" },
  { name: "Food Bank", image: "/images/food.jpg" },
  { name: "Housing/Shelter", image: "/images/houses.jpg" },
  { name: "Legal Aid", image: "/images/law.jpg" },
  { name: "Transportation", image: "/images/bus.jpg" }
];

const emergencyContacts = [
  { name: "Emergency Services", number: "911" },
  { name: "Suicide & Crisis Lifeline", number: "988" },
  { name: "National Domestic Violence Hotline", number: "800-799-7233" },
  { name: "RAINN (Rape, Abuse & Incest National Network)", number: "800-656-4673" }
];

// Minimal offline sample resources (fallback when offline/no API)
const OFFLINE_RESOURCES = [
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
  }
];

// ---- UTIL ----
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
};

const formatPhoneDigits = (s = "") => s.replace(/\D/g, "");

// Simple debounce hook for queries
const useDebounced = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

// ---- APP ----
export default function App() {
  return (
    <div className="App">
      <ResourceFinderApp />
    </div>
  );
}

function ResourceFinderApp() {
  // Nav + UI state
  const [currentScreen, setCurrentScreen] = useState("home");
  const [contactsSubScreen, setContactsSubScreen] = useState("hotlines");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounced(searchQuery, 400);

  // Connectivity
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  // Location
  const [userLocation, setUserLocation] = useLocalStorage("rf:lastLocation", DEFAULT_CENTER);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    const id = navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const loc = { lat: latitude, lng: longitude };
        setUserLocation(loc);
        setLocationError(null);
      },
      (error) => {
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
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
    return () => {
      try { navigator.geolocation.clearWatch?.(id); } catch {}
    };
  }, [setUserLocation]);

  // Contacts
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [contacts, setContacts] = useLocalStorage("rf:contacts", [
    { id: 1, name: "Dr. Amelia Carter", phone: "555-123-4567" },
    { id: 2, name: "Liam Harper", phone: "555-987-6543" }
  ]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const addContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      setContacts((prev) => [
        ...prev,
        { id: Date.now(), name: newContact.name.trim(), phone: newContact.phone.trim() }
      ]);
      setNewContact({ name: "", phone: "" });
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    }
  };

  // Google Maps - only destructure isLoaded since loadError is not used
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  const mapRef = useRef(null);
  const [places, setPlaces] = useState([]); // Places results when online
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Use useCallback to memoize the onLoad function
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Perform Places Nearby Search when online + query or category is set
  useEffect(() => {
    if (!isOnline || !mapRef.current || !isLoaded || !userLocation) return;

    const q = debouncedQuery?.trim();
    if (!q) {
      setPlaces([]);
      return;
    }

    const service = new window.google.maps.places.PlacesService(mapRef.current);

    const request = {
      location: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: NEARBY_RADIUS_METERS,
      keyword: q
    };

    setIsSearching(true);
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results || []);
      } else {
        setPlaces([]);
      }
      setIsSearching(false);
    });
  }, [debouncedQuery, isOnline, isLoaded, userLocation]);

  // When opening an info window, optionally hydrate phone number via getDetails
  const fetchPlaceDetails = (place) => {
    if (!isOnline || !mapRef.current) return;
    const service = new window.google.maps.places.PlacesService(mapRef.current);
    service.getDetails(
      { placeId: place.place_id, fields: ["name", "formatted_phone_number", "website", "formatted_address"] },
      (details, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && details) {
          // Merge the original place data with the detailed data
          setSelectedPlace({ 
            ...place, 
            details,
            // Ensure we have a name from either the original place or details
            displayName: details.name || place.name || 'Unknown Location'
          });
        } else {
          setSelectedPlace({ 
            ...place,
            displayName: place.name || 'Unknown Location'
          });
        }
      }
    );
  };

  // Derived list for offline mode (filter by text over static list)
  const offlineFiltered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    return OFFLINE_RESOURCES.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.address?.toLowerCase().includes(q) ||
      r.type?.toLowerCase().includes(q)
    );
  }, [debouncedQuery]);

  // ---- UI components ----
  const Header = ({ title, showBack = false, onBack }) => (
    <div className="flex items-center bg-[#121416] p-4 pb-2 justify-between pt-6">
      {showBack ? (
        <button
          onClick={onBack || (() => setCurrentScreen("home"))}
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
      <div className="w-12" />
    </div>
  );

  const Navigation = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1e2124] border-t border-[#2c3135] max-w-md mx-auto">
      <div className="flex justify-around py-1">
        {[
          { id: "home", icon: Home, label: "Home" },
          { id: "map", icon: MapPin, label: "Map" },
          { id: "contacts", icon: Users, label: "Contacts" }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => {
              setCurrentScreen(id);
              if (id === "contacts") setContactsSubScreen("hotlines");
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
              currentScreen === id ? "text-[#6ee7b7]" : "text-[#a2abb3] hover:bg-gray-700"
            }`}
          >
            <Icon size={20} />
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

  // ---- Screens ----
  const HomeScreen = () => (
    <div className="flex flex-col h-screen">
      <Header title="Local Emergency Resource Finder" />

      <div className="flex-1 flex flex-col pb-20 overflow-hidden p-4">
        <div className="grid grid-cols-2 gap-4 px-2 py-2 flex-1 min-h-0">
          {resourceCategories.map((resource, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                const mapping = CATEGORY_TO_PLACES[resource.name];
                setCurrentScreen("map");
                setSearchQuery(mapping?.keyword || resource.name);
              }}
            >
              <div
                className="w-full bg-center bg-no-repeat bg-cover rounded-lg flex-1 min-h-0"
                style={{ backgroundImage: `url(${resource.image})` }}
              />
              <p className="text-[#6ee7b7] text-sm font-medium leading-normal text-center">
                {resource.name}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center px-4 pt-2 pb-2">
          <button
            onClick={() => window.open("tel:911")}
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
      <div className="p-4 bg-[#121416] border-b border-gray-700">
        <div className="flex items-center bg-[#2c3135] rounded-lg px-3 py-2 shadow-sm">
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
              onClick={() => setSearchQuery("")}
              className="text-gray-400 hover:text-white ml-2 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-gray-400 text-sm mt-2">
            {isOnline ? (
              isSearching ? "Searching…" : `Found ${places.length} result${places.length !== 1 ? "s" : ""}`
            ) : (
              `Offline results: ${offlineFiltered.length}`
            )}
          </p>
        )}
      </div>

      <div className="relative flex-1 pb-16">
        {!isLoaded ? (
          <LoadingScreen message="Loading Google Maps…" />
        ) : !userLocation ? (
          <LoadingScreen message="Getting your location…" />
        ) : (
          <GoogleMap
            center={userLocation}
            zoom={14}
            onLoad={onMapLoad}  // Use the memoized callback
            mapContainerStyle={{ height: "100%", width: "100%" }}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {/* You are here */}
            <Marker 
              position={userLocation} 
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="27" height="43" viewBox="0 0 27 43" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 0C6.044 0 0 6.044 0 13.5C0 21.75 13.5 43 13.5 43S27 21.75 27 13.5C27 6.044 20.956 0 13.5 0Z" fill="#1e2124"/>
                    <circle cx="13.5" cy="13.5" r="6" fill="#000000"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(27, 43),
                anchor: new window.google.maps.Point(13.5, 43)
              }}
            />

            {/* Online Places */}
            {isOnline && places.map((p, idx) => (
              <Marker
                key={p.place_id || idx}
                position={{
                  lat: p.geometry.location.lat(),
                  lng: p.geometry.location.lng(),
                }}
                onClick={() => fetchPlaceDetails(p)}
              />
            ))}

            {/* Offline static markers */}
            {!isOnline && offlineFiltered.map((r, idx) => (
              <Marker
                key={`${r.name}-${idx}`}
                position={{ lat: r.lat, lng: r.lng }}
                onClick={() => setSelectedPlace({
                  name: r.name,
                  displayName: r.name,
                  vicinity: r.address,
                  phone: r.phone,
                  geometry: { 
                    location: {
                      lat: () => r.lat,
                      lng: () => r.lng
                    }
                  },
                })}
              />
            ))}

            {/* Info Window */}
            {selectedPlace && (
              <InfoWindow
                position={{
                  lat: typeof selectedPlace.geometry.location.lat === 'function' 
                    ? selectedPlace.geometry.location.lat() 
                    : selectedPlace.geometry.location.lat,
                  lng: typeof selectedPlace.geometry.location.lng === 'function' 
                    ? selectedPlace.geometry.location.lng() 
                    : selectedPlace.geometry.location.lng,
                }}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div className="max-w-[240px]">
                  {/* Display name with multiple fallbacks */}
                  <strong className="block text-base mb-2 text-gray-900">
                    {selectedPlace.displayName || 
                     selectedPlace.details?.name || 
                     selectedPlace.name || 
                     'Location'}
                  </strong>
                  
                  {/* Address */}
                  {(selectedPlace.details?.formatted_address || selectedPlace.vicinity) && (
                    <p className="text-sm text-gray-700 mb-2">
                      {selectedPlace.details?.formatted_address || selectedPlace.vicinity}
                    </p>
                  )}
                  
                  {/* Phone */}
                  {(selectedPlace.details?.formatted_phone_number || selectedPlace.phone) && (
                    <p className="text-sm mb-1">
                      📞 <span className="text-[#1daf75] underline">
                        <a href={`tel:${formatPhoneDigits(selectedPlace.details?.formatted_phone_number || selectedPlace.phone)}`}>
                          {selectedPlace.details?.formatted_phone_number || selectedPlace.phone}
                        </a>
                      </span>
                    </p>
                  )}
                  
                  {/* Website */}
                  {selectedPlace.details?.website && (
                    <div className="mt-1">
                      🌐 <span className="text-[#1daf75] underline">
                        <a
                          href={selectedPlace.details.website}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Website
                        </a>
                      </span>
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}

        {locationError && <ErrorBanner error={locationError} />}
        {!isOnline && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#2c3135] text-white text-xs px-3 py-1 rounded-full opacity-90">
            Offline mode – showing cached items
          </div>
        )}
      </div>
    </div>
  );

  const ContactsScreen = () => {
    if (contactsSubScreen === "add") {
      return (
        <div className="flex flex-col h-screen">
          <Header title="Add Contact" showBack onBack={() => setContactsSubScreen("hotlines")} />

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
                className="w-full resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] h-14 placeholder:text-[#a2abb3] p-4 text-base"
              />
              <input
                placeholder="Phone Number"
                type="tel"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="w-full resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] h-14 placeholder:text-[#a2abb3] p-4 text-base"
              />
              <div className="flex justify-center mt-4">
                <button
                  onClick={addContact}
                  disabled={!newContact.name.trim() || !newContact.phone.trim()}
                  className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-[#dce8f3] text-[#121416] text-base font-bold tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 transition-colors"
                >
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (contactsSubScreen === "your") {
      return (
        <div className="flex flex-col h-screen">
          <Header title="Your Contacts" showBack onBack={() => setContactsSubScreen("hotlines")} />

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
                      href={`tel:${formatPhoneDigits(contact.phone)}`}
                      className="text-[#6ee7b7] text-sm hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                  <button
                    onClick={() => window.open(`tel:${formatPhoneDigits(contact.phone)}`)}
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
                    onClick={() => setContactsSubScreen("add")}
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
              onClick={() => setContactsSubScreen("add")}
              className="flex items-center gap-2 bg-[#2c3135] px-4 py-2 rounded-full text-white hover:bg-[#3c4147] transition-colors"
            >
              <Plus size={18} />
              Add Contact
            </button>
            <button
              onClick={() => setContactsSubScreen("your")}
              className="flex items-center gap-2 bg-[#2c3135] px-4 py-2 rounded-full text-white hover:bg-[#3c4147] transition-colors"
            >
              <Users size={18} />
              Your Contacts
            </button>
          </div>

          <h2 className="text-white text-[22px] font-bold tracking-[-0.015em] px-4 pb-3 pt-5">
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
                    href={`tel:${formatPhoneDigits(contact.number)}`}
                    className="text-[#6ee7b7] text-sm hover:underline"
                  >
                    {contact.number}
                  </a>
                </div>
                <button
                  onClick={() => window.open(`tel:${formatPhoneDigits(contact.number)}`)}
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
      case "home":
        return <HomeScreen />;
      case "map":
        return <MapScreen />;
      case "contacts":
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
}