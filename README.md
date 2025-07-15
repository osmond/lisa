# 🌿 Kaymaria v2

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/built%20with-vite-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/react-18+-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

A minimalist, mobile-first plant care app built with **React**, **Vite**, and **Tailwind CSS**. Kaymaria helps you track watering, fertilizing, notes, and more — all with gentle weather-based suggestions and beautiful swipeable UI.

---

Includes:
- Basic routing (Home, Timeline)
- Sample plant data
- Styled PlantCard components
- Tasks generated dynamically from plant data
- Quick Add floating button for new plants

## Using the UI

Task cards can be swiped **right** to mark them complete and **left** to edit or delete them. Plant cards respond to the same gestures. Keyboard users can hit the **Left/Right** arrow keys or **Enter** to trigger these actions thanks to the underlying `PlantCard` and `TaskCard` components.

## Plant Detail View

Each plant page opens with a full-width hero image and a set of badges
summarizing light, humidity and care difficulty.  Below the details is a
swipeable gallery carousel of your uploaded photos.

Click or tap a photo to launch the Lightbox viewer. Navigate between
images with the on-screen arrows or your keyboard’s Left/Right keys, and
close the viewer with **Esc** or the “×” button. The collapsible **Timeline**
section on this page lists your watering, fertilizing and note history.


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

## Progressive Web App

Kaymaria includes a web app manifest and service worker so you can install it on mobile devices and continue using it offline. After building and serving the app, visit it in your browser and choose **Add to Home Screen** to install.

## useSwipe Hook

`useSwipe` provides basic swipe detection. It returns the current horizontal distance and functions you can attach to your element's pointer events.

```jsx
import useSwipe from './src/hooks/useSwipe'

function Example() {
  const { dx, start, move, end } = useSwipe(diff => {
    if (diff > 50) console.log('swiped right')
    else if (diff < -50) console.log('swiped left')
  })

  return (
    <div
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      style={{ transform: `translateX(${dx}px)` }}
    >
      Swipe me
    </div>
  )
}
```

## Mobile Browser Testing

Swipe gestures were manually tested on Chrome, Safari and Firefox on iOS and Android devices.

- **Chrome**: gestures trigger the correct actions with smooth animation.
- **Safari**: works as expected with no visual issues.
- **Firefox**: swipe detection works but animations are slightly less smooth.

## Security

After updating dependencies to `vite@7` and `@vitejs/plugin-react@4.6.0`, running `npm audit` reports **0 vulnerabilities**.

## License

[MIT](LICENSE)
