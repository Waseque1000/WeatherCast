import { useState, useEffect } from 'react'
import CurrentWeather from './CurrentWeather'
import Forecast from './Forecast'
import LoadingSpinner from './LoadingSpinner'

const API_KEY  = import.meta.env.VITE_OPENWEATHER_API_KEY;

export default function WeatherDashboard({ location }) {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch current weather
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
        )
        
        if (!weatherResponse.ok) {
          throw new Error('City not found')
        }
        
        const weatherData = await weatherResponse.json()
        setWeatherData(weatherData)
        
        // Fetch forecast
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`
        )
        const forecastData = await forecastResponse.json()
        setForecastData(forecastData)
        
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchWeather()
  }, [location])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>
  if (!weatherData) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <CurrentWeather data={weatherData} />
      <Forecast data={forecastData} />
    </div>
  )
}