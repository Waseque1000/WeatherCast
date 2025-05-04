 

import { getWeatherIcon } from '../utils/weatherIcons'
import { motion } from 'framer-motion'

export default function Forecast({ data, darkMode }) {
  // Group forecast by day
  const dailyForecast = data.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(item)
    return acc
  }, {})

  // Get one forecast per day (around noon)
  const forecastDays = Object.keys(dailyForecast).map(date => {
    const dayForecasts = dailyForecast[date]
    const noonForecast = dayForecasts.reduce((closest, forecast) => {
      const forecastHour = new Date(forecast.dt * 1000).getHours()
      const closestHour = new Date(closest.dt * 1000).getHours()
      return (Math.abs(forecastHour - 12) < Math.abs(closestHour - 12)) ? forecast : closest
    })
    
    const minTemp = Math.min(...dayForecasts.map(f => f.main.temp_min))
    const maxTemp = Math.max(...dayForecasts.map(f => f.main.temp_max))
    
    return {
      date,
      data: noonForecast,
      minTemp,
      maxTemp
    }
  }).slice(1, 6)
  
  const getTrend = () => {
    if (forecastDays.length < 2) return "stable"
    const firstDay = forecastDays[0].maxTemp
    const lastDay = forecastDays[forecastDays.length - 1].maxTemp
    const diff = lastDay - firstDay
    
    if (diff > 3) return "warming"
    if (diff < -3) return "cooling"
    return "stable"
  }
  
  const trend = getTrend()
  
  const getTrendIcon = () => {
    return (
      <motion.div 
        animate={{ 
          y: [0, -3, 0],
          transition: { repeat: Infinity, duration: 2 }
        }}
      >
        {trend === "warming" ? (
          <svg className="h-6 w-6 text-orange-500" viewBox="0 0 24 24" fill="none">
            <path d="M12 18V6M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 6l4 4m0-4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : trend === "cooling" ? (
          <svg className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none">
            <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 18l4-4m0 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg className="h-6 w-6 text-emerald-500" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </motion.div>
    )
  }

  return (
    <div className={`rounded-3xl mt-10 overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} shadow-2xl`}>
      {/* Animated header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative p-6 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-300 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">5-Day Weather Forecast</h2>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={`flex items-center px-4 py-2 rounded-full ${trend === "warming" ? 'bg-orange-500/20' : trend === "cooling" ? 'bg-blue-500/20' : 'bg-emerald-500/20'} backdrop-blur-sm border ${trend === "warming" ? 'border-orange-500/30' : trend === "cooling" ? 'border-blue-500/30' : 'border-emerald-500/30'}`}
          >
            {getTrendIcon()}
            <span className={`ml-2 font-semibold ${trend === "warming" ? 'text-orange-200' : trend === "cooling" ? 'text-blue-200' : 'text-emerald-200'}`}>
              {trend} trend
            </span>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Forecast cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        {forecastDays.map((day, index) => (
          <ForecastDay key={index} day={day} index={index} darkMode={darkMode}/>
        ))}
      </div>
    </div>
  )
}

function ForecastDay({ day, index, darkMode }) {
  const date = new Date(day.data.dt * 1000)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const weatherMain = day.data.weather[0].main.toLowerCase()
  const weatherDesc = day.data.weather[0].description
  
  const getWeatherGradient = () => {
    if (weatherMain.includes('rain')) return 'from-blue-400 to-blue-600'
    if (weatherMain.includes('clear')) return 'from-yellow-400 to-orange-500'
    if (weatherMain.includes('cloud')) return 'from-gray-400 to-gray-600'
    if (weatherMain.includes('snow')) return 'from-blue-200 to-blue-400'
    if (weatherMain.includes('thunder')) return 'from-purple-500 to-indigo-700'
    return 'from-gray-300 to-gray-500'
  }
  
  const weatherGradient = getWeatherGradient()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
    >
      {/* Weather card header */}
      <div className={`p-4 bg-gradient-to-r ${weatherGradient} text-white`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-lg">{dayName}</p>
            <p className="text-sm opacity-90">{dateStr}</p>
          </div>
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 0],
              transition: { repeat: Infinity, duration: 5 } 
            }}
            className="text-4xl"
          >
            {getWeatherIcon(day.data.weather[0].icon, 40)}
          </motion.div>
        </div>
      </div>
      
      {/* Temperature display */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current</p>
            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {Math.round(day.data.main.temp)}°
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`text-sm font-medium capitalize ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {weatherDesc}
            </p>
          </div>
        </div>
        
        {/* Temperature range */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className={darkMode ? 'text-blue-300' : 'text-blue-600'}>Low: {Math.round(day.minTemp)}°</span>
            <span className={darkMode ? 'text-orange-300' : 'text-orange-600'}>High: {Math.round(day.maxTemp)}°</span>
          </div>
          <div className="relative h-2 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-orange-400"
              style={{ 
                width: `${((day.data.main.temp - day.minTemp) / (day.maxTemp - day.minTemp)) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        
        {/* Weather stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>Humidity</p>
            <p className="font-bold">{day.data.main.humidity}%</p>
          </div>
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>Wind</p>
            <p className="font-bold">{Math.round(day.data.wind.speed)} m/s</p>
          </div>
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>Rain</p>
            <p className="font-bold">{day.data.rain ? `${day.data.rain['3h']}mm` : '0mm'}</p>
          </div>
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>Pressure</p>
            <p className="font-bold">{day.data.main.pressure}hPa</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}