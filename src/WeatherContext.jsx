import { createContext, useContext, useEffect, useState } from 'react'

const WeatherContext = createContext()

export function WeatherProvider({ children }) {
  const [forecast, setForecast] = useState(null)
  const [error, setError] = useState('')
  const [location, setLocation] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('weatherLocation')
      if (stored) return stored
    }
    return 'Saint Paul, Minnesota'
  })
  const [units, setUnits] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('weatherUnits')
      if (stored) return stored
    }
    return 'imperial'
  })

  useEffect(() => {
    const key = process.env.VITE_WEATHER_API_KEY
    if (!key) return
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=${units}&appid=${key}`
    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok')
        }
        return res.json()
      })
      .then(data => {
        if (data && data.list && data.list.length > 0) {
          const next = data.list[0]
          const rainfall = next.pop ? Math.round(next.pop * 100) : 0
          const symbol = units === 'imperial' ? '°F' : '°C'
          setForecast({
            temp: Math.round(next.main.temp) + symbol,
            condition: next.weather?.[0]?.main,
            rainfall,
          })
          setError('')
        }
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load weather data')
      })
  }, [location, units])

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('weatherLocation', location)
    }
  }, [location])

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('weatherUnits', units)
    }
  }, [units])

  return (
    <WeatherContext.Provider value={{ forecast, location, setLocation, units, setUnits, error }}>
      {error && (
        <div
          role="alert"
          className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center p-2 z-50"
        >
          {error}
        </div>
      )}
      {children}
    </WeatherContext.Provider>
  )
}

export const useWeather = () => useContext(WeatherContext)
