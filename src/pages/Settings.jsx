import { useTheme } from '../ThemeContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import { useUser } from '../UserContext.jsx'

import { User, MapPin, Clock } from 'phosphor-react'
import Panel from '../components/Panel.jsx'
import ToggleSwitch from '../components/ToggleSwitch.jsx'
import PageContainer from "../components/PageContainer.jsx"

import useSnackbar from '../hooks/useSnackbar.jsx'


export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { location, setLocation, units, setUnits } = useWeather()
  const { username, setUsername, timeZone, setTimeZone } = useUser()
  const { Snackbar, showSnackbar } = useSnackbar()

  return (
    <PageContainer className="space-y-6 text-gray-700 dark:text-gray-200">
      <h1 className="text-heading font-semibold font-headline">Settings</h1>

      <div className="space-y-4">
        <Panel>
          <h2 className="flex items-center gap-2 mb-4 text-heading font-medium font-headline">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-200" aria-hidden="true" />
            Profile
          </h2>
          <div className="space-y-6">
            <div className="grid gap-1 max-w-xs">
              <label htmlFor="username" className="font-medium">Name</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="border rounded p-2"
              />
            </div>
            <div className="grid gap-1 max-w-xs">
              <label htmlFor="timezone" className="font-medium">Time Zone</label>
              <input
                id="timezone"
                type="text"
                value={timeZone}
                onChange={e => setTimeZone(e.target.value)}
                className="border rounded p-2"
              />
            </div>
          </div>
        </Panel>

        <Panel>
          <h2 className="flex items-center gap-2 mb-4 text-heading font-medium font-headline">
            <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-200" aria-hidden="true" />
            Weather &amp; Location
          </h2>
          <div className="space-y-6">
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
            <div className="grid gap-1 max-w-xs">
              <label htmlFor="units" className="font-medium">Temperature Units</label>
              <select
                id="units"
                value={units}
                onChange={e => setUnits(e.target.value)}
                className="dropdown-select"
              >
                <option value="imperial">Fahrenheit</option>
                <option value="metric">Celsius</option>
              </select>
            </div>
          </div>
        </Panel>

        <Panel>
          <h2 className="flex items-center gap-2 mb-4 text-heading font-medium font-headline">
            <Clock className="w-5 h-5 text-gray-600 dark:text-gray-200" aria-hidden="true" />
            Preferences
          </h2>
          <ToggleSwitch
            checked={theme === 'dark'}
            onChange={toggleTheme}
            label="Dark Mode"
            className="mt-2"
          />
        </Panel>
      </div>

      <Snackbar />
    </PageContainer>
  )
}
