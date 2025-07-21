import { createContext, useContext, useEffect, useState } from "react";

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("weatherLocation");
      if (stored) return stored;
    }
    return "Saint Paul, Minnesota";
  });
  const [units, setUnits] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("weatherUnits");
      if (stored) return stored;
    }
    return "imperial";
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const key = process.env.VITE_WEATHER_API_KEY;
    if (!key) return;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=${units}&appid=${key}`;
    setLoading(true);
    fetch(url, { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.list && data.list.length > 0) {
          const next = data.list[0];
          const rainfall = next.pop ? Math.round(next.pop * 100) : 0;
          const symbol = units === "imperial" ? "°F" : "°C";
          setForecast({
            temp: Math.round(next.main.temp) + symbol,
            condition: next.weather?.[0]?.main,
            rainfall,
            humidity: next.main.humidity,
          });
          setError("");
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Failed to load weather data");
        }
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      controller.abort();
    };
  }, [location, units]);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("weatherLocation", location);
    }
  }, [location]);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("weatherUnits", units);
    }
  }, [units]);

  useEffect(() => {
    if (forecast) {
      window.dispatchEvent(
        new CustomEvent("weather-updated", { detail: forecast }),
      );
    }
  }, [forecast]);

  return (
    <WeatherContext.Provider
      value={{
        forecast,
        location,
        setLocation,
        units,
        setUnits,
        error,
        loading,
      }}
    >
      {loading && (
        <div
          role="status"
          className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center p-2 z-50"
        >
          Loading weather…
        </div>
      )}
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
  );
}

export const useWeather = () => useContext(WeatherContext);
