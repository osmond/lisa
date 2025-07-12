import { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weather';

export default function WeatherWidget({ city = 'London' }) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather(city)
      .then(setWeather)
      .catch(err => setError(err.message));
  }, [city]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!weather) {
    return <div>Loading weather...</div>;
  }

  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-lg font-medium">{weather.name}</span>
      <span>{Math.round(weather.main.temp)}°C</span>
      <span>{weather.weather[0].main}</span>
    </div>
  );
}
