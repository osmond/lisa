import { useTheme } from '../ThemeContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import { useUser } from '../UserContext.jsx'
import { useOpenAI } from '../OpenAIContext.jsx'

import { User, MapPin, Clock } from 'phosphor-react'
import Panel from '../components/Panel.jsx'
import ToggleSwitch from '../components/ToggleSwitch.jsx'
import PageContainer from '../components/PageContainer.jsx'
import Avatar from '../components/Avatar.jsx'
import useToast from '../hooks/useToast.jsx'



export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { location, setLocation, units, setUnits, forecast } = useWeather()
  const { username, setUsername, timeZone, setTimeZone } = useUser()
  const { enabled, setEnabled } = useOpenAI()
  const { Toast, showToast } = useToast()

  const handleThemeToggle = checked => {
    toggleTheme()
    showToast(checked ? 'Dark mode enabled' : 'Light mode enabled')
  }

  const handleOpenAIToggle = checked => {
    setEnabled(checked)
    showToast(checked ? 'AI features enabled' : 'AI features disabled')
  }

  const handleReset = () => {
    if (window.confirm('This will clear all data. Continue?')) {
      if (typeof localStorage !== 'undefined') {
        localStorage.clear()
      }
      window.location.reload()
    }
  }

  const weatherIcon = forecast?.condition
    ? {
        Clear: '☀️',
        Clouds: '☁️',
        Rain: '🌧️',
        Drizzle: '🌦️',
        Thunderstorm: '⛈️',
        Snow: '❄️',
        Mist: '🌫️',
      }[forecast.condition] || '🌡️'
    : ''

  return (
    <PageContainer size="md" className="space-y-6 text-gray-700 dark:text-gray-200">
      <Toast />
      <h1 className="text-heading font-semibold font-headline">Settings</h1>

      <div className="space-y-6">
        <Panel>
          <h2 className="flex items-center gap-2 mb-4 pb-2 border-b border-green-100 dark:border-green-800 text-lg font-semibold font-headline">
            <User className="w-5 h-5 text-green-600" aria-hidden="true" />
            Profile
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <Avatar name={username} />
            <div className="grid gap-1 max-w-xs">
              <label htmlFor="username" className="font-medium">Name</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid gap-1 max-w-xs">
              <label htmlFor="timezone" className="font-medium">Time Zone</label>
              <input
                id="timezone"
                type="text"
                value={timeZone}
                onChange={e => setTimeZone(e.target.value)}
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>
        </Panel>

        <Panel>
          <h2 className="flex items-center gap-2 mb-4 pb-2 border-b border-green-100 dark:border-green-800 text-lg font-semibold font-headline">
            <MapPin className="w-5 h-5 text-green-600" aria-hidden="true" />
            Weather &amp; Location
          </h2>
          {forecast && (
            <p className="text-sm mb-2 text-gray-600 dark:text-gray-300">
              {weatherIcon} {forecast.temp} in {location}
            </p>
          )}
          <div className="space-y-4">
            <div className="grid gap-1 max-w-xs">
              <label htmlFor="location" className="font-medium">Weather Location</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div className="grid gap-1 max-w-xs">
              <label htmlFor="units" className="font-medium">Temperature Units</label>
              <select
                id="units"
                value={units}
                onChange={e => setUnits(e.target.value)}
                className="dropdown-select focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <option value="imperial">Fahrenheit</option>
                <option value="metric">Celsius</option>
              </select>
            </div>
          </div>
        </Panel>

        <Panel>
          <h2 className="flex items-center gap-2 mb-4 pb-2 border-b border-green-100 dark:border-green-800 text-lg font-semibold font-headline">
            <Clock className="w-5 h-5 text-green-600" aria-hidden="true" />
            Preferences
          </h2>
          <div className="space-y-4">
            <ToggleSwitch
              checked={theme === 'dark'}
              onChange={handleThemeToggle}
              label="🌙 Enable Dark Mode for a softer nighttime experience"
            />
            <ToggleSwitch
              checked={enabled}
              onChange={handleOpenAIToggle}
              label="🤖 Enable AI-powered features"
            />
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 text-sm text-red-600 underline"
          >
            Reset App
          </button>
        </Panel>
      </div>

    </PageContainer>
  )
}
