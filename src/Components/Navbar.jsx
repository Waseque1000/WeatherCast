 


// import { SunIcon, MoonIcon, MagnifyingGlassIcon, CloudIcon } from '@heroicons/react/24/outline'
// import { useState, useEffect } from 'react'

// export default function Navbar({ darkMode, toggleDarkMode, onSearch }) {
//   const [searchQuery, setSearchQuery] = useState('')
//   const [isScrolled, setIsScrolled] = useState(false)
  
//   // Track scroll for navbar shadow effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10)
//     }
    
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (searchQuery.trim()) {
//       onSearch(searchQuery)
//     }
//   }

//   return (
//     <nav className={`sticky top-0 z-50 transition-all duration-300 
//       ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-500 to-sky-600'} 
//       ${isScrolled ? 'shadow-xl' : ''}`}>
//       <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
//         <div className="flex items-center mb-4 md:mb-0 group">
//           <div className="mr-2 relative">
//             <CloudIcon className={`h-8 w-8 ${darkMode ? 'text-sky-400' : 'text-white'} transition-transform group-hover:scale-110`} />
//             <span className="absolute -top-1 -right-1 flex h-3 w-3">
//               <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${darkMode ? 'bg-yellow-400' : 'bg-yellow-300'} opacity-75`}></span>
//               <span className={`relative inline-flex rounded-full h-3 w-3 ${darkMode ? 'bg-yellow-500' : 'bg-yellow-400'}`}></span>
//             </span>
//           </div>
//           <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-white'} tracking-tight`}>
//             <span className="font-extrabold">Weather</span>
//             <span className={`${darkMode ? 'text-sky-400' : 'text-yellow-300'}`}>Cast</span>
//           </h1>
//         </div>
        
//         <form onSubmit={handleSubmit} className="flex w-full md:w-2/5 mb-4 md:mb-0 transform transition hover:scale-102">
//           <div className="relative w-full shadow-lg">
//             <input
//               type="text"
//               placeholder="Search city..."
//               className={`w-full py-3 px-5 rounded-full focus:outline-none focus:ring-2 
//                 ${darkMode ? 'bg-gray-800 text-white focus:ring-sky-500 border-gray-700' : 'bg-white text-gray-800 focus:ring-blue-400'} 
//                 border transition-all`}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <button 
//               type="submit"
//               className={`absolute right-0 top-0 h-full px-5 flex items-center justify-center rounded-r-full transition-colors
//                 ${darkMode 
//                   ? 'bg-sky-600 hover:bg-sky-700 text-white' 
//                   : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
//             >
//               <MagnifyingGlassIcon className="h-5 w-5" />
//             </button>
//           </div>
//         </form>
        
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={toggleDarkMode}
//             className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110
//               ${darkMode 
//                 ? 'bg-gray-800 hover:bg-gray-700 ring-1 ring-sky-500' 
//                 : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'}`}
//             aria-label="Toggle dark mode"
//           >
//             {darkMode ? (
//               <SunIcon className="h-6 w-6 text-yellow-300" />
//             ) : (
//               <MoonIcon className="h-6 w-6 text-white" />
//             )}
//           </button>
//         </div>
//       </div>
//     </nav>
//   )
// }

import { useState, useEffect, useRef } from 'react';
import { SunIcon, MoonIcon, MagnifyingGlassIcon, CloudIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Navbar({ darkMode, toggleDarkMode, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch city suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=5&appid=YOUR_API_KEY`
          );
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      };
      
      const debounceTimer = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSuggestionClick = (city) => {
    setSearchQuery(`${city.name}, ${city.country}`);
    onSearch(`${city.name}, ${city.country}`);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-500 to-sky-600'}`}>
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center mb-4 md:mb-0">
          <CloudIcon className={`h-8 w-8 ${darkMode ? 'text-sky-400' : 'text-white'}`} />
          <h1 className={`text-2xl font-bold ml-2 ${darkMode ? 'text-white' : 'text-white'}`}>
            Weather<span className={darkMode ? 'text-sky-400' : 'text-yellow-300'}>Cast</span>
          </h1>
        </div>
        
        {/* Search with Autocomplete */}
        <form onSubmit={handleSubmit} className="relative w-full md:w-2/5 mb-4 md:mb-0" ref={suggestionsRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search city..."
              className={`w-full py-3 px-5 rounded-full focus:outline-none focus:ring-2 
                ${darkMode ? 'bg-gray-800 text-white focus:ring-sky-500' : 'bg-white text-gray-800 focus:ring-blue-400'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
            />
            <button 
              type="submit"
              className={`absolute right-0 top-0 h-full px-5 rounded-r-full 
                ${darkMode ? 'bg-sky-600 hover:bg-sky-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg 
              ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <ul>
                {suggestions.map((city, index) => (
                  <li 
                    key={`${city.name}-${index}`}
                    className={`px-4 py-2 cursor-pointer hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} 
                      flex items-center`}
                    onClick={() => handleSuggestionClick(city)}
                  >
                    <MapPinIcon className={`h-5 w-5 mr-2 ${darkMode ? 'text-sky-400' : 'text-blue-500'}`} />
                    <div>
                      <p className={darkMode ? 'text-white' : 'text-gray-800'}>{city.name}, {city.country}</p>
                      {city.state && <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{city.state}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
        
        {/* Dark Mode Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full transition-colors
              ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white/20 hover:bg-white/30'} text-white`}
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6 text-yellow-300" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}