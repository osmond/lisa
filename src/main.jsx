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
import { WishlistProvider } from './WishlistContext.jsx'
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
                  <WishlistProvider>
                    <BrowserRouter
                      basename={import.meta.env.VITE_BASE_PATH}
                      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
                    >
                      <App />
                    </BrowserRouter>
                  </WishlistProvider>
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

