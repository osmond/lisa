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
- Quick Add floating button for new plants
- Dual progress rings visualize watering and fertilizing progress

## Progress Rings

Two overlapping rings summarize your care tasks. The inner blue ring tracks
watering while the outer green ring tracks fertilizing. Each ring's length is
`completed / total` for that task type (capped at 100%), and the SVG exposes the
percentage for assistive technology.

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

Install dependencies if you haven't already, then run:

```bash
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

1. **Install dependencies** (only the first time):
   ```bash
   npm install
   ```

2. **Run the build**. If you plan to host the app under a subdirectory such as `/lisa/`, set the `VITE_BASE_PATH` variable when invoking the command so Vite and the router know where the app lives:
   - macOS/Linux
     ```bash
     VITE_BASE_PATH=/lisa/ npm run build
     ```
   - Windows (Command Prompt)
     ```cmd
     set VITE_BASE_PATH=/lisa/ && npm run build
     ```
   - Windows (PowerShell)
     ```powershell
     $env:VITE_BASE_PATH="/lisa/"
     npm run build
     ```

   If the app will be served from the site root (for example `https://example.com/`), you can omit `VITE_BASE_PATH`:
   ```bash
   npm run build
   ```

3. **Preview locally (optional)**. After building, test the optimized build:
   ```bash
   npm run preview
   ```
   This starts a local server and prints a URL for you to open in the browser.

4. **Deploy**. Upload the contents of the generated `dist/` folder to your web server. If you used a base path, ensure the files are hosted under that same subdirectory.

## Mobile Browser Testing

Swipe gestures were manually tested on Chrome, Safari and Firefox on iOS and Android devices.

- **Chrome**: gestures trigger the correct actions with smooth animation.
- **Safari**: works as expected with no visual issues.
- **Firefox**: swipe detection works but animations are slightly less smooth.


## License

[MIT](LICENSE)
