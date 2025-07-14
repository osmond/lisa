import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { PlantProvider } from './PlantContext.jsx'
import { ThemeProvider } from './ThemeContext.jsx'
import { WeatherProvider } from './WeatherContext.jsx'
import { UserProvider } from './UserContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <ThemeProvider>
        <WeatherProvider>
          <PlantProvider>
            <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
              <App />
            </BrowserRouter>
          </PlantProvider>
        </WeatherProvider>
      </ThemeProvider>
    </UserProvider>
  </React.StrictMode>
)
