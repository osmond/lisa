# 🌿 Lisa // a minimalist plant care app

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/built%20with-vite-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/react-18+-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

A lightweight, mobile-first plant care app built with **React**, **Vite**, and **Tailwind CSS**. Lisa helps you track watering, fertilizing, and notes — with gentle, weather-based suggestions and a swipeable UI.

---

## 🌱 Features

- Plant care dashboard with weather awareness
- Add water, fertilizer, and custom notes per plant
- Swipeable task cards
- Local photo gallery per plant
- Timeline journaling
- Mobile-first layout

---

## ☀️ Weather Suggestions

Lisa adjusts plant care based on today’s local weather.

1. [Get a free API key from OpenWeather](https://openweathermap.org/api)
2. Copy `.env.example` to `.env` and replace the placeholder with your API key
3. Run `npm run dev` and open the app to see real-time weather-based watering advice

The weather feature uses `VITE_WEATHER_API_KEY`, exposed to the frontend via Vite.

---

## 🧪 Running Tests

Install dependencies before testing:

```bash
npm install
npm test
```

---

## 🔍 Linting

Run ESLint to check for code issues:
```bash
npm run lint
```

Automatically fix problems with:
```bash
npm run lint:fix
```

---

## ⚙️ Getting Started

### Install dependencies:
```bash
npm install
```

### Run the development server:
```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Production Build & Deploy

### 1. Build the app

If you’re hosting under a subdirectory (e.g. `/lisa/`), set the base path:

**macOS/Linux:**
```bash
VITE_BASE_PATH=/lisa/ npm run build
```

**Windows (CMD):**
```cmd
set VITE_BASE_PATH=/lisa/ && npm run build
```

**Windows (PowerShell):**
```powershell
$env:VITE_BASE_PATH="/lisa/"
npm run build
```

If deploying at the root of a domain (e.g. `example.com`), skip the base path:
```bash
npm run build
```

### 2. Preview locally (optional)
```bash
npm run preview
```

### 3. Deploy
Upload the contents of the `dist/` folder to your web host. Be sure to match your base path if applicable.

---

## 📱 Mobile Testing

Swipe gestures were manually tested across:

- **Chrome**: Works smoothly
- **Safari**: Fully functional
- **Firefox**: Functional with slightly choppier animations

---

## 🪴 License

[MIT](LICENSE)
