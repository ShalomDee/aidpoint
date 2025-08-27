// src/App.js
import React, { useState, useEffect } from 'react';
import { Search, Home, MapPin, Users, Phone, Settings, ArrowLeft } from 'lucide-react';
import './App.css';

const ResourceFinderApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Dr. Amelia Carter', phone: '555-123-4567' },
    { id: 2, name: 'Liam Harper', phone: '555-987-6543' }
  ]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });

  const resourceCategories = [
    {
      name: 'Police Station',
      image: '/images/police.jpg'
    },
    {
      name: 'Clinic/Hospital',
      image: '/images/hospital_desk.jpg'
    },
    {
      name: 'Food Bank',
      image: '/images/food.jpg'
    },
    {
      name: 'Housing/Shelter',
      image: '/images/houses.jpg'
    },
    {
      name: 'Legal Aid',
      image: '/images/law.jpg'
    },
    {
      name: 'Transportation',
      image: '/images/bus.jpg'
    }
  ];

  const suggestedResources = [
    {
      name: 'Grocery Store',
      image: '/images/grocery.jpg'
    },
    {
      name: 'Pharmacy',
      image: '/images/pharmacy.jpg'
    },
    {
      name: 'Community Center',
      image: '/images/community.jpg'
    },
    {
      name: 'Food Bank',
      image: '/images/food_bank.jpg'
    }
  ];

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911' },
    { name: 'Suicide & Crisis Lifeline', number: '988' },
    { name: 'National Domestic Violence Hotline', number: '800-799-7233' },
    { name: 'RAINN (Rape, Abuse & Incest National Network)', number: '800-656-4673' }
  ];

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, {
        id: Date.now(),
        name: newContact.name,
        phone: newContact.phone
      }]);
      setNewContact({ name: '', phone: '' });
    }
  };

  const Header = ({ title, showBack = false }) => (
    <div className="flex items-center bg-[#121416] p-4 pb-2 justify-between">
      {showBack ? (
        <button 
          onClick={() => setCurrentScreen('home')}
          className="text-white flex size-12 shrink-0 items-center"
        >
          <ArrowLeft size={24} />
        </button>
      ) : (
        <div className="w-12" />
      )}
      <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
        {title}
      </h2>
      <div className="flex w-12 items-center justify-end">
        <button className="flex items-center justify-center h-12 bg-transparent text-white p-0">
          <Settings size={24} />
        </button>
      </div>
    </div>
  );

  const Navigation = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1e2124] border-t border-[#2c3135] max-w-md mx-auto">
      <div className="flex justify-around py-2">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'search', icon: Search, label: 'Search' },
          { id: 'map', icon: MapPin, label: 'Map' },
          { id: 'contacts', icon: Users, label: 'Contacts' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentScreen(id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${
              currentScreen === id 
                ? 'text-white' 
                : 'text-[#a2abb3] hover:bg-gray-700'
            }`}
          >
            <Icon size={24} fill={currentScreen === id ? 'currentColor' : 'none'} />
            <span className="text-xs font-medium leading-normal tracking-[0.015em] mt-1">
              {label}
            </span>
          </button>
        ))}
      </div>
      <div className="h-5 bg-[#1e2124]" />
    </nav>
  );

  const HomeScreen = () => (
    <div className="flex-1 flex flex-col">
      <Header title="Local Emergency Resource Finder" />
      
      {/* <div className="px-4 py-2">
        <div className="flex w-full flex-1 items-stretch rounded-xl h-10">
          <div className="text-[#a2abb3] flex border-none bg-[#2c3135] items-center justify-center pl-4 rounded-l-xl">
            <Search size={20} />
          </div>
          <input
            placeholder="Search for resources"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] h-full placeholder:text-[#a2abb3] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
          />
        </div>
      </div> */}

      <div className="grid grid-cols-2 gap-2 px-3 py-2 flex-1">
        {resourceCategories.map((resource, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div
              className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
              style={{ backgroundImage: `url(${resource.image})` }}
            />
            <p className="text-white text-sm font-medium leading-normal">
              {resource.name}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center px-4 pb-24 pt-2">
        <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 bg-[#dce8f3] text-[#121416] text-base font-bold leading-normal tracking-[0.015em] px-6 gap-3">
          <Phone size={20} />
          Emergency Call
        </button>
      </div>
    </div>
  );

  const SearchScreen = () => (
    <div className="flex-1">
      <Header title="Search" />
      
      <div className="px-4 py-3">
        <div className="flex w-full flex-1 items-stretch rounded-xl h-12">
          <div className="text-[#a2abb3] flex border-none bg-[#2c3135] items-center justify-center pl-4 rounded-l-xl">
            <Search size={24} />
          </div>
          <input
            placeholder="Search for resources"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] h-full placeholder:text-[#a2abb3] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
          />
        </div>
      </div>

      <div className="flex gap-3 p-3 overflow-x-hidden">
        <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#2c3135] pl-4 pr-2">
          <p className="text-white text-sm font-medium leading-normal">Location/Nearest</p>
          <span className="text-white">▼</span>
        </button>
      </div>

      <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Suggested
      </h3>
      
      <div className="grid grid-cols-2 gap-3 px-4 pb-24">
        {suggestedResources.map((resource, index) => (
          <div key={index} className="flex flex-col gap-3">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
              style={{ backgroundImage: `url(${resource.image})` }}
            />
            <p className="text-white text-base font-medium leading-normal">
              {resource.name}
            </p>
          </div>
        ))}
      </div>

    </div>
  );

  const MapScreen = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            setLocationError("Location access denied");
            console.log("Location error:", error);
          }
        );
      } else {
        setLocationError("Location not supported");
      }
    }, []);

    return (
      <div className="flex-1">
        <div className="relative flex-grow">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop)' }}
          />
          
          {/* Location Status */}
          {userLocation && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-green-600 bg-opacity-90 px-3 py-1 rounded-full text-white text-sm">
                📍 Location Found
              </div>
            </div>
          )}

          {locationError && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-red-600 bg-opacity-90 px-3 py-1 rounded-full text-white text-sm">
                ❌ {locationError}
              </div>
            </div>
          )}
          
          <div className="absolute top-4 right-4 z-10">
            <button className="p-2 rounded-full bg-gray-800 bg-opacity-70 hover:bg-gray-700">
              <Settings className="text-[#6ee7b7]" size={24} />
            </button>
          </div>

          <div className="absolute bottom-20 left-0 right-0 p-4">
            <div className="bg-gray-800 bg-opacity-90 p-4 rounded-xl shadow-lg text-white">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-xl font-bold">Central Police Station</h2>
                  <p className="text-sm text-gray-300">Open 24 hours</p>
                  {userLocation && (
                    <p className="text-xs text-green-400">
                      Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#6ee7b7]">5 min</p>
                  <p className="text-sm text-gray-300">1.2 mi</p>
                </div>
              </div>
              <div className="border-t border-gray-600 pt-3">
                <div className="flex items-center mb-3">
                  <MapPin className="text-gray-400 mr-4" size={20} />
                  <p>123 Justice Way, Anytown, USA</p>
                </div>
                <div className="flex items-center">
                  <Phone className="text-gray-400 mr-4" size={20} />
                  <a href="tel:+15551234567" className="text-blue-400 hover:underline">
                    (555) 123-4567
                  </a>
                </div>
              </div>
              <div className="flex justify-between mt-4 gap-2">
                <button 
                  onClick={() => userLocation && window.open(`https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/123+Justice+Way,Anytown,USA`)}
                  className="flex items-center justify-center flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700"
                >
                  <MapPin className="mr-2" size={18} />
                  Directions
                </button>
                <button className="flex items-center justify-center bg-gray-600 text-white font-bold p-2 rounded-full hover:bg-gray-700">
                  <span>📤</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ContactsScreen = () => (
    <div className="flex-1">
      <Header title="Emergency Contacts" showBack />
      
      <div className="pb-24">
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Local Hotlines
        </h2>
        
        {emergencyContacts.map((contact, index) => (
          <div key={index} className="flex items-center gap-4 bg-[#121416] px-4 min-h-[72px] py-2">
            <div className="text-white flex items-center justify-center rounded-lg bg-[#2c3135] shrink-0 size-12">
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
              className="bg-[#6ee7b7] text-[#121416] px-4 py-2 rounded-full font-bold text-sm hover:bg-green-400"
            >
              Call
            </button>
          </div>
        ))}

        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Add Contacts
        </h2>
        
        <div className="flex flex-col gap-4 px-4">
          <input
            placeholder="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            className="w-full resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] h-14 placeholder:text-[#a2abb3] p-4 text-base font-normal leading-normal"
          />
          <input
            placeholder="Phone Number"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            className="w-full resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] h-14 placeholder:text-[#a2abb3] p-4 text-base font-normal leading-normal"
          />
          <div className="flex justify-end">
            <button
              onClick={addContact}
              className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#dce8f3] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              Add Contact
            </button>
          </div>
        </div>

        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Your Contacts
        </h2>
        
        {contacts.map((contact) => (
          <div key={contact.id} className="flex items-center gap-4 bg-[#121416] px-4 min-h-[72px] py-2">
            <div className="text-white flex items-center justify-center rounded-lg bg-[#2c3135] shrink-0 size-12">
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
              className="bg-[#6ee7b7] text-[#121416] px-4 py-2 rounded-full font-bold text-sm hover:bg-green-400"
            >
              Call
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'search':
        return <SearchScreen />;
      case 'map':
        return <MapScreen />;
      case 'contacts':
        return <ContactsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#121416] text-white font-['Space_Grotesk','Noto_Sans',sans-serif] max-w-md mx-auto">
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
