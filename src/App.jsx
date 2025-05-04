import { useState, useEffect } from 'react'
// import Navbar from './components/Navbar'
import WeatherDashboard from './components/WeatherDashboard'
import Navbar from './Components/Navbar' 
import Footer from './Components/Footer'
function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [location, setLocation] = useState('London')

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <Navbar  
        darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onSearch={setLocation}
      />
      <WeatherDashboard location={location} />
      <Footer/>
    </div>
  )
}

export default App