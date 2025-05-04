 

import { getWeatherIcon } from '../utils/weatherIcons'
import { useEffect, useRef, useState } from 'react'

export default function CurrentWeather({ data, darkMode }) {
  const canvasRef = useRef(null)
  const [timeOfDay, setTimeOfDay] = useState('')
  
  // Format date
  const date = new Date(data.dt * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Determine if it's day or night based on icon and current time
  const isNight = data.weather[0].icon.includes('n')
  
  // Determine time of day for more specific styling
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 8) setTimeOfDay('dawn')
    else if (hour >= 8 && hour < 17) setTimeOfDay('day')
    else if (hour >= 17 && hour < 20) setTimeOfDay('dusk')
    else setTimeOfDay('night')
  }, [])

  // Get wind direction arrow rotation
  const getWindDirection = (deg) => {
    return {
      transform: `rotate(${deg}deg)`
    }
  }
  
  // Create weather animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const weatherType = data.weather[0].main.toLowerCase()
    
    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    // Create particles array
    let particles = []
    const particleCount = weatherType.includes('rain') ? 100 : 
                         weatherType.includes('snow') ? 80 : 
                         weatherType.includes('cloud') ? 30 : 10
    
    // Create particles based on weather type
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: weatherType.includes('rain') ? Math.random() * 1 + 1 : 
             weatherType.includes('snow') ? Math.random() * 3 + 1 : 
             Math.random() * 5 + 2,
        speedX: weatherType.includes('rain') ? -1 : Math.random() * 1 - 0.5,
        speedY: weatherType.includes('rain') ? Math.random() * 6 + 4 : 
               weatherType.includes('snow') ? Math.random() * 1 + 0.5 : 
               Math.random() * 0.5,
        opacity: Math.random() * 0.8 + 0.2
      })
    }
    
    // Animation function
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      particles.forEach((p, it) => {
        if (weatherType.includes('rain')) {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + p.speedX, p.y + p.size * 2)
          ctx.stroke()
        } else if (weatherType.includes('snow')) {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (weatherType.includes('cloud')) {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.3})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * it * 2)
          ctx.fill()
        }
        
        // Update position
        p.x += p.speedX
        p.y += p.speedY
        
        // Reset if out of bounds
        if (p.y > canvas.height) {
          p.y = 0
          p.x = Math.random() * canvas.width
        }
        if (p.x > canvas.width || p.x < 0) {
          p.x = Math.random() * canvas.width
          p.y = Math.random() * canvas.height
        }
      })
      
      requestAnimationFrame(animate)
    }
    
    // Start animation if weather has precipitation
    if (weatherType.includes('rain') || weatherType.includes('snow') || weatherType.includes('cloud')) {
      animate()
    }
    
    // Clean up
    return () => {
      particles = []
    }
  }, [data.weather])

  // Get background styles based on time of day and weather
  const getBackgroundStyle = () => {
    const weatherMain = data.weather[0].main.toLowerCase()
    
    if (darkMode) {
      if (isNight) {
        if (weatherMain.includes('clear')) {
          return 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900'
        } else if (weatherMain.includes('cloud')) {
          return 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'
        } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
          return 'bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900'
        } else if (weatherMain.includes('thunder')) {
          return 'bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900'
        } else if (weatherMain.includes('snow')) {
          return 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'
        }
        return 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'
      } else {
        if (weatherMain.includes('clear')) {
          return 'bg-gradient-to-b from-blue-900 via-sky-900 to-slate-900'
        } else if (weatherMain.includes('cloud')) {
          return 'bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800'
        } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
          return 'bg-gradient-to-b from-slate-800 via-blue-900 to-slate-900'
        } else if (weatherMain.includes('thunder')) {
          return 'bg-gradient-to-b from-slate-800 via-purple-900 to-slate-900'
        } else if (weatherMain.includes('snow')) {
          return 'bg-gradient-to-b from-slate-800 via-blue-900 to-slate-900'
        }
        return 'bg-gradient-to-b from-blue-900 via-sky-800 to-slate-900'
      }
    } else {
      if (isNight) {
        if (weatherMain.includes('clear')) {
          return 'bg-gradient-to-b from-slate-800 via-indigo-900 to-slate-900'
        } else if (weatherMain.includes('cloud')) {
          return 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900'
        } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
          return 'bg-gradient-to-b from-slate-800 via-blue-900 to-slate-900'
        } else if (weatherMain.includes('thunder')) {
          return 'bg-gradient-to-b from-slate-800 via-purple-900 to-slate-900'
        } else if (weatherMain.includes('snow')) {
          return 'bg-gradient-to-b from-blue-900 via-slate-800 to-slate-900'
        }
        return 'bg-gradient-to-b from-slate-800 via-indigo-900 to-slate-900'
      } else {
        if (weatherMain.includes('clear')) {
          return 'bg-gradient-to-b from-sky-500 via-blue-500 to-indigo-600'
        } else if (weatherMain.includes('cloud')) {
          return 'bg-gradient-to-b from-sky-400 via-slate-400 to-slate-500'
        } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
          return 'bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600'
        } else if (weatherMain.includes('thunder')) {
          return 'bg-gradient-to-b from-indigo-500 via-purple-600 to-purple-700'
        } else if (weatherMain.includes('snow')) {
          return 'bg-gradient-to-b from-blue-300 via-blue-400 to-blue-500'
        }
        return 'bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600'
      }
    }
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl shadow-2xl ${getBackgroundStyle()}`}>
      {/* Canvas for weather animation effects */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.6 }}
      />
      
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={`absolute inset-0 ${darkMode ? 'bg-grid-white/10' : 'bg-grid-white/30'}`}></div>
      </div>
      
      {/* Content container */}
      <div className="relative backdrop-blur-sm">
        {/* Top section - Location and Time */}
        <div className="px-6 pt-6 pb-3 md:px-8 md:pt-8 md:pb-4 backdrop-blur-sm bg-black/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-white/20 backdrop-blur-md">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{data.name}, {data.sys.country}</h2>
                <p className="text-white/70 text-sm">{date}</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-1 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5">
              <svg className={`w-4 h-4 ${
                isNight ? 'text-indigo-300' : (
                  timeOfDay === 'dawn' ? 'text-amber-300' : 
                  timeOfDay === 'day' ? 'text-yellow-300' : 
                  'text-orange-400'
                )
              }`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {isNight ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                )}
              </svg>
              <span className="text-xs font-medium text-white/90 capitalize">
                {isNight ? 'Night' : timeOfDay}
              </span>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center">
            {/* Left column - Temperature & Weather */}
            <div className="flex-1 flex flex-col sm:flex-row items-center md:items-start mb-8 md:mb-0">
              {/* Temperature section */}
              <div className="flex-1 text-center sm:text-left mb-6 sm:mb-0">
                <div className="flex items-center justify-center sm:justify-start mb-2">
                  <div className="relative">
                    <span className="text-7xl md:text-8xl font-black tracking-tighter text-white">
                      {Math.round(data.main.temp)}
                    </span>
                    <span className="absolute -top-1 -right-6 flex items-center justify-center w-8 h-8 text-sm font-bold bg-white/20 backdrop-blur-md rounded-full text-white">°C</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start mt-1 space-x-4">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1.5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span className="text-sm font-medium text-white">{Math.round(data.main.temp_min)}°</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="text-sm font-medium text-white">{Math.round(data.main.temp_max)}°</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-2.5 py-1">
                    <svg className="h-3.5 w-3.5 mr-1 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-medium text-white">Feels {Math.round(data.main.feels_like)}°</span>
                  </div>
                </div>
                
                {/* Weather description */}
                <div className="mt-4">
                  <span className="inline-block bg-white/10 backdrop-blur-md rounded-full px-3.5 py-1.5 text-sm font-medium text-white capitalize">
                    {data.weather[0].description}
                  </span>
                </div>
              </div>
              
              {/* Weather icon */}
              <div className="relative mb-6 sm:mb-0">
                <div className="transform scale-150 transition-transform">
                  {getWeatherIcon(data.weather[0].icon, 84)}
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full blur-2xl opacity-30 bg-white -z-10"></div>
              </div>
            </div>
            
            {/* Right column - Weather metrics */}
            <div className="flex-1 grid grid-cols-2 gap-3 md:gap-4">
              <WeatherMetric
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                }
                label="Humidity"
                value={`${data.main.humidity}%`}
                color={`${darkMode ? 'from-blue-700 to-blue-900' : 'from-blue-600 to-blue-800'}`}
              />
              <WeatherMetric
                icon={
                  <div style={getWindDirection(data.wind.deg)} className="transition-transform duration-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </div>
                }
                label="Wind"
                value={`${data.wind.speed} m/s`}
                subtext={`${data.wind.deg}°`}
                color={`${darkMode ? 'from-teal-700 to-teal-900' : 'from-teal-600 to-teal-800'}`}
              />
              <WeatherMetric
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
                label="Pressure"
                value={`${data.main.pressure}`}
                subtext="hPa"
                color={`${darkMode ? 'from-purple-700 to-purple-900' : 'from-purple-600 to-purple-800'}`}
              />
              <WeatherMetric
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                }
                label="Clouds"
                value={`${data.clouds.all}%`}
                color={`${darkMode ? 'from-slate-700 to-slate-800' : 'from-slate-600 to-slate-700'}`}
              />
            </div>
          </div>
          
          {/* Bottom section - Sunrise/Sunset */}
          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
            <SunriseSunset
              type="sunrise"
              time={new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              darkMode={darkMode}
            />
            
            {/* Sun position indicator */}
            <div className="flex-1 mx-4 relative">
              <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className={`absolute h-1 rounded-full bg-gradient-to-r ${
                    isNight ? 'from-indigo-400 to-purple-500' : 'from-yellow-400 to-amber-500'
                  }`}
                  style={{
                    width: '100%',
                    transformOrigin: 'center',
                    clipPath: 'inset(0 0 0 0)'
                  }}
                ></div>
                
                {/* Sun position indicator */}
                {(() => {
                  const now = new Date().getTime() / 1000
                  const sunrise = data.sys.sunrise
                  const sunset = data.sys.sunset
                  const dayLength = sunset - sunrise
                  let position = 0
                  
                  if (now < sunrise) {
                    position = 0
                  } else if (now > sunset) {
                    position = 100
                  } else {
                    position = ((now - sunrise) / dayLength) * 100
                  }
                  
                  return (
                    <div 
                      className="absolute top-1/2 w-3 h-3 rounded-full bg-white shadow-lg transform -translate-y-1/2"
                      style={{ left: `${position}%` }}
                    ></div>
                  )
                })()}
              </div>
            </div>
            
            <SunriseSunset
              type="sunset"
              time={new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function WeatherMetric({ icon, label, value, color = "from-blue-600 to-blue-800", subtext }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl transition-all duration-300 hover:bg-white/15 group">
      <div className="flex items-center">
        <div className={`bg-gradient-to-br ${color} p-2.5 rounded-xl shadow-lg mr-3 group-hover:scale-110 transition-transform`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        <div>
          <p className="text-xs text-white/60">{label}</p>
          <div className="flex items-baseline">
            <p className="font-bold text-white text-lg">{value}</p>
            {subtext && <span className="text-xs ml-1 text-white/70">{subtext}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

function SunriseSunset({ type, time, darkMode }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`p-3 rounded-full ${
        type === 'sunrise' 
          ? (darkMode ? 'bg-amber-900/30' : 'bg-amber-400/30') 
          : (darkMode ? 'bg-indigo-900/30' : 'bg-indigo-500/30')
      } mb-2`}>
        <svg 
          className={`h-5 w-5 ${
            type === 'sunrise' 
              ? (darkMode ? 'text-amber-400' : 'text-amber-500') 
              : (darkMode ? 'text-indigo-400' : 'text-indigo-600')
          }`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {type === 'sunrise' ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          )}
        </svg>
      </div>
      <div className="text-center">
        <p className="text-xs text-white/70 capitalize">{type}</p>
        <p className="text-sm font-medium text-white">{time}</p>
      </div>
    </div>
  )
}