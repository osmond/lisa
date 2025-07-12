export async function fetchWeather(city) {
  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;
  if (!apiKey) {
    throw new Error('Missing OpenWeather API key');
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch weather');
  }
  return res.json();
}
