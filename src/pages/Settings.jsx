import { useTheme } from '../ThemeContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import { useUser } from '../UserContext.jsx'
import useSnackbar from '../hooks/useSnackbar.jsx'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { location, setLocation, units, setUnits } = useWeather()
  const { username, setUsername, timeZone, setTimeZone } = useUser()
  const { Snackbar, showSnackbar } = useSnackbar()

  return (
    <div className="space-y-4 text-gray-700 dark:text-gray-200 bg-[#FAFAF9] dark:bg-gray-900">
      <h1 className="text-2xl font-bold font-headline">Settings</h1>
      <button
        onClick={() => {
          toggleTheme()
          showSnackbar('Saved \u2713')
        }}
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
      >
        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </button>
      <div className="grid gap-1 max-w-xs">
        <label htmlFor="username" className="font-medium">Name</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => {
            setUsername(e.target.value)
            showSnackbar('Saved \u2713')
          }}
          className="border rounded p-2"
        />
      </div>
      <div className="grid gap-1 max-w-xs">
        <label htmlFor="location" className="font-medium">Weather Location</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={e => {
            setLocation(e.target.value)
            showSnackbar('Saved \u2713')
          }}
          className="border rounded p-2"
        />
      </div>
      <div className="grid gap-1 max-w-xs">
        <label htmlFor="units" className="font-medium">Temperature Units</label>
        <select
          id="units"
          value={units}
          onChange={e => {
            setUnits(e.target.value)
            showSnackbar('Saved \u2713')
          }}
          className="border rounded p-2"
        >
          <option value="imperial">Fahrenheit</option>
          <option value="metric">Celsius</option>
        </select>
      </div>
      <div className="grid gap-1 max-w-xs">
        <label htmlFor="timezone" className="font-medium">Time Zone</label>
        <input
          id="timezone"
          type="text"
          value={timeZone}
          onChange={e => {
            setTimeZone(e.target.value)
            showSnackbar('Saved \u2713')
          }}
          className="border rounded p-2"
        />
      </div>
      <Snackbar />
    </div>
  )
}
