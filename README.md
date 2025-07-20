# 🌿 Lisa

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/built%20with-vite-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/react-18+-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

A minimalist, mobile-first plant care app built with **React**, **Vite**, and **Tailwind CSS**. Lisa helps you track watering, fertilizing, notes, and more — all with gentle weather-based suggestions and beautiful swipeable UI.

---

Includes:
- Basic routing (Today, Timeline)
- Sample plant data
- Styled PlantCard components
- Tasks generated dynamically from plant data
- Floating action button for adding plants or rooms
- Persistent bottom navigation tabs for easy access
- Placeholder photos fetched from iNaturalist when a plant has none. Images are loaded directly from iNaturalist and retain their original attribution and license.
- Multi-step Add Plant flow with optional notes and schedule
- Organize plants by room and create custom rooms
- Badge indicator on the All Plants tab for overdue tasks
- Watering and fertilizing progress overlays on plant photos
- Customizable weather location and units from the Settings page

## Using the UI

Lisa keeps a tab bar pinned to the bottom of the screen so you can quickly switch between **Today**, **All Plants** and **Timeline**. A **More** button reveals extra links such as your profile. A circular **+** button floats above the bar; tap it to open shortcuts for adding a new plant or room.

Task cards support swipe gestures for quick actions. A partial swipe reveals edit, reschedule and delete buttons so you can manage care directly from the list. Plant cards also remain interactive and support swiping or keyboard shortcuts through the underlying `PlantCard` component.
Both the Today and Tasks pages group care by plant using a `UnifiedTaskCard` that shows a thumbnail, upcoming needs and quick "Water Now" or "Fertilize Now" buttons when due.
When no tasks are due a "happy plant" illustration invites you to add notes or photos.

## Plant Detail View

Each plant page opens with a full-width hero image and a set of badges
summarizing light, humidity and care difficulty.  Below the details is a
swipeable gallery carousel of your uploaded photos.
Watering and fertilizing progress appear as small overlays on the hero image so
you can glance at upcoming care.

Click or tap a photo on the plant’s detail page to open the Lightbox viewer. Navigate between
images with the on-screen arrows or your keyboard’s Left/Right keys, and
close the viewer with **Esc** or the “×” button. If your plant has many
photos, use the **View All Photos** button to open the viewer starting at the
first image. The collapsible **Timeline** section on this page lists your
watering, fertilizing and note history.
Visit `/gallery` to see all of your photos in one place. This page currently only displays a placeholder unless you enhance it.

## Weather Feature

Lisa can display local weather data and suggest when to water
your plants. The app retrieves current conditions from OpenWeather
using an API key you provide.
A `.env.example` file is included at the project root and lists the environment variables. The Express API automatically loads `.env` when you run `npm run server`.
You can change the city and switch between Fahrenheit and Celsius from the **Settings** page.

### Get an API Key

1. Sign up at [OpenWeather](https://openweathermap.org/api) and create a key.
2. Copy `.env.example` to `.env` in the project root and replace `your_key_here`
   with your actual API key.
3. (Optional) Add `VITE_OPENAI_API_KEY` (or `OPENAI_API_KEY`) to enable featured plant facts, Coach, and Care Plan features.

### How It Works

Vite exposes `VITE_WEATHER_API_KEY` to the frontend. The Home page uses
this key to fetch today’s weather and adjust watering tasks based on the
temperature and conditions.

### Viewing Suggestions

Run the dev server with `npm run dev` after adding your key. Open the
app in your browser to see weather info and watering suggestions on the
home screen.

## Plant Facts (Optional)

Provide an OpenAI API key in `.env` as `VITE_OPENAI_API_KEY` (or `OPENAI_API_KEY`) to display a short
fact about the featured plant. The same key is required for the Coach and Care Plan endpoints. If the key is missing or the request fails,
Lisa falls back to a brief summary from Wikipedia.
You can enable or disable these features from the **Settings → Preferences** page.
Requests to the OpenAI API may incur charges.

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
Start the Express API in one terminal:
```bash
npm run server
```
The server automatically loads environment variables from `.env`.
Then run Vite in another terminal:
```bash
npm run dev
```
The dev server prints a local URL (usually `http://localhost:5173/`). Requests to
`/api/coach` are automatically forwarded to the Express server running on
`http://localhost:3000`.

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

Lisa includes a web app manifest and service worker so you can install it on mobile devices and continue using it offline. After building and serving the app, visit it in your browser and choose **Add to Home Screen** to install.

## Dark Mode

Lisa ships with built‑in light and dark themes. A tiny inline script in `index.html` runs before React loads and adds the correct `dark` class to `<html>`, preventing flashes of the wrong theme. A toggle on the **Settings** page lets you switch modes manually, and your choice is stored in `localStorage` so the app remembers it on refresh.

## Safe Area Padding

The Tailwind config includes a small plugin that adds a `.pb-safe` utility. This applies `padding-bottom: env(safe-area-inset-bottom)` so content respects the safe area on devices with display cutouts.

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
