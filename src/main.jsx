import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { PlantProvider } from './PlantContext.jsx'
import { RoomProvider } from './RoomContext.jsx'
import { ThemeProvider } from './ThemeContext.jsx'
import { WeatherProvider } from './WeatherContext.jsx'
import { UserProvider } from './UserContext.jsx'
import { OpenAIProvider } from './OpenAIContext.jsx'
import SnackbarProvider, { Snackbar } from './hooks/SnackbarProvider.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SnackbarProvider>
      <UserProvider>
        <OpenAIProvider>
          <ThemeProvider>
            <WeatherProvider>
              <PlantProvider>
                <RoomProvider>
                  <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
                    <App />
                  </BrowserRouter>
                </RoomProvider>
              </PlantProvider>
              <Snackbar />
            </WeatherProvider>
          </ThemeProvider>
        </OpenAIProvider>
      </UserProvider>
    </SnackbarProvider>
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const base = import.meta.env.VITE_BASE_PATH || '/'
    const swPath = `${base.endsWith('/') ? base : base + '/'}sw.js`
    navigator.serviceWorker.register(swPath).catch((err) => {
      console.error('Service worker registration failed:', err)
    })
  })
}
