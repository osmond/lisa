# 🌿 Kaymaria v2

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/built%20with-vite-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/react-18+-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

A minimalist, mobile-first plant care app built with **React**, **Vite**, and **Tailwind CSS**. Kaymaria helps you track watering, fertilizing, notes, and more — all with gentle weather-based suggestions and beautiful swipeable UI.

---

Includes:
- Basic routing (Home, Timeline, Gallery)
- Sample plant data
- Styled PlantCard components
- Tasks generated dynamically from plant data


## Weather Feature

Kaymaria can display local weather data and suggest when to water
your plants. The app retrieves current conditions from OpenWeather
using an API key you provide.
A `.env.example` file is included at the project root and lists the required environment variable.

### Get an API Key

1. Sign up at [OpenWeather](https://openweathermap.org/api) and create a key.
2. Copy `.env.example` to `.env` in the project root and replace `your_key_here`
   with your actual API key.

### How It Works

Vite exposes `VITE_WEATHER_API_KEY` to the frontend. The Home page uses
this key to fetch today’s weather and adjust watering tasks based on the
temperature and conditions.

### Viewing Suggestions

Run the dev server with `npm run dev` after adding your key. Open the
app in your browser to see weather info and watering suggestions on the
home screen.

## Running Tests

Run `npm install` before `npm test`:

```bash
npm install
npm test
```

## Requirements
- Node.js 18 or later

## Installation
```bash
npm install
```

## Running the Dev Server
```bash
npm run dev
```
This command prints a local development URL (usually `http://localhost:5173/`).
Open that URL in your browser to view the app.

## Building for Production
```bash
npm run build
```

When deploying to a subdirectory (for example `/lisa/`), set the
`VITE_BASE_PATH` environment variable to that path. `vite.config.js` reads this
variable to configure the build `base` option, and the router uses the same
value via `basename` so asset paths resolve correctly. If the variable is not
set, it defaults to `/`.

After building you can preview the production build with:
```bash
npm run preview
```
This starts a local server and outputs a URL to open the optimized app in your browser.

## Mobile Browser Testing

Swipe gestures were manually tested on Chrome, Safari and Firefox on iOS and Android devices.

- **Chrome**: gestures trigger the correct actions with smooth animation.
- **Safari**: works as expected with no visual issues.
- **Firefox**: swipe detection works but animations are slightly less smooth.


## License

[MIT](LICENSE)
