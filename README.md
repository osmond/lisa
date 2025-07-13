# Kaymaria v2

Starter React + Vite + Tailwind CSS project for a plant care app.

Includes:
- Basic routing (Home, Timeline, Gallery)
- Sample plant data
- Styled PlantCard components
- Tasks generated dynamically from plant data


## Weather Feature

Kaymaria can display local weather data and suggest when to water
your plants. The app retrieves current conditions from OpenWeather
using an API key you provide.

### Get an API Key

1. Sign up at [OpenWeather](https://openweathermap.org/api) and create a key.
2. In the project root, create a `.env` file containing:

   ```
   VITE_WEATHER_API_KEY=your_key_here
   ```

### How It Works

Vite exposes `VITE_WEATHER_API_KEY` to the frontend. The Home page uses
this key to fetch today’s weather and adjust watering tasks based on the
temperature and conditions.

### Viewing Suggestions

Run the dev server with `npm run dev` after adding your key. Open the
app in your browser to see weather info and watering suggestions on the
home screen.

## Running Tests

Install dependencies and run the test suite with:

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
```bash
npm run build
```

When deploying to a subdirectory (for example `/lisa/`), set `base` in
`vite.config.js` and pass the same value as the router `basename` so asset paths
resolve correctly.

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
