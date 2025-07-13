import { createContext, useContext, useEffect, useState } from 'react'

const WeatherContext = createContext()

export function WeatherProvider({ children }) {
  const [forecast, setForecast] = useState(null)
  const [location, setLocation] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('weatherLocation')
      if (stored) return stored
    }
    return 'London'
  })

  useEffect(() => {
    const key = process.env.VITE_WEATHER_API_KEY
    if (!key) return
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=metric&appid=${key}`
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.list && data.list.length > 0) {
          const next = data.list[0]
          const rainfall = next.pop ? Math.round(next.pop * 100) : 0
          setForecast({
            temp: Math.round(next.main.temp) + '°C',
            condition: next.weather?.[0]?.main,
            rainfall,
          })
        }
      })
      .catch(err => console.error(err))
  }, [location])

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('weatherLocation', location)
    }
  }, [location])

  return (
    <WeatherContext.Provider value={{ forecast, location, setLocation }}>
      {children}
    </WeatherContext.Provider>
  )
}

export const useWeather = () => useContext(WeatherContext)
