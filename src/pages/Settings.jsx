import { useTheme } from '../ThemeContext.jsx'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="space-y-4 text-gray-700 dark:text-gray-200">
      <h1 className="text-xl font-bold">Settings</h1>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
      >
        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  )
}
