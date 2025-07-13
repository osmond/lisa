import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { PlantProvider } from './PlantContext.jsx'
import { ThemeProvider } from './ThemeContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <PlantProvider>
        <BrowserRouter basename="/lisa">
          <App />
        </BrowserRouter>
      </PlantProvider>
    </ThemeProvider>
  </React.StrictMode>
)
