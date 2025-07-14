import { useTheme } from '../ThemeContext.jsx'
import { useWeather } from '../WeatherContext.jsx'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { location, setLocation } = useWeather()

  return (
    <div className="space-y-4 text-gray-700 dark:text-gray-200">
      <h1 className="text-2xl font-bold font-headline">Settings</h1>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
      >
        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </button>
      <div className="grid gap-1 max-w-xs">
        <label htmlFor="location" className="font-medium">Weather Location</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="border rounded p-2"
        />
      </div>
    </div>
  )
}
