import { useTheme } from '../ThemeContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import {
  Sun,
  Moon,
  MapPin,
  Clock,
  Thermometer,
} from 'phosphor-react'

import Button from "../components/Button.jsx"
export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const {
    location,
    setLocation,
    timezone,
    setTimezone,
    units,
    setUnits,
  } = useWeather()

  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-200">
      <h1 className="text-headline font-bold font-display">Settings</h1>

      <section className="space-y-2 p-4 bg-stone dark:bg-gray-800 rounded-xl shadow-sm">
        <h2 className="text-subhead font-semibold font-display flex items-center gap-2">
          {theme === 'dark' ? (
            <Moon className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Sun className="w-5 h-5" aria-hidden="true" />
          )}
          Appearance
        </h2>
        <Button onClick={toggleTheme} className="px-4 py-2 bg-accent text-white">
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </Button>
      </section>

      <section className="space-y-2 p-4 bg-stone dark:bg-gray-800 rounded-xl shadow-sm">
        <h2 className="text-subhead font-semibold font-display flex items-center gap-2">
          <MapPin className="w-5 h-5" aria-hidden="true" />
          Weather Location
        </h2>
        <div className="grid gap-1 max-w-xs">
          <label htmlFor="location" className="font-medium text-label">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="border rounded p-2"
          />
        </div>
      </section>

      <section className="space-y-2 p-4 bg-stone dark:bg-gray-800 rounded-xl shadow-sm">
        <h2 className="text-subhead font-semibold font-display flex items-center gap-2">
          <Clock className="w-5 h-5" aria-hidden="true" />
          Time Zone
        </h2>
        <div className="grid gap-1 max-w-xs">
          <label htmlFor="timezone" className="font-medium text-label">Time Zone</label>
          <input
            id="timezone"
            type="text"
            value={timezone}
            onChange={e => setTimezone(e.target.value)}
            className="border rounded p-2"
          />
        </div>
      </section>

      <section className="space-y-2 p-4 bg-stone dark:bg-gray-800 rounded-xl shadow-sm">
        <h2 className="text-subhead font-semibold font-display flex items-center gap-2">
          <Thermometer className="w-5 h-5" aria-hidden="true" />
          Temperature Units
        </h2>
        <div className="grid gap-1 max-w-xs">
          <label htmlFor="units" className="font-medium text-label">Units</label>
          <select
            id="units"
            value={units}
            onChange={e => setUnits(e.target.value)}
            className="border rounded p-2"
          >
            <option value="metric">Celsius</option>
            <option value="imperial">Fahrenheit</option>
          </select>
        </div>
      </section>
    </div>
  )
}
