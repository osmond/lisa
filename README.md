# Kaymaria v2

Starter React + Vite + Tailwind CSS project for a plant care app.

Includes:
- Basic routing (Home, Timeline, Gallery)
- Sample plant data
- Styled PlantCard components


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

After building you can preview the production build with:
```bash
npm run preview
```
This starts a local server and outputs a URL to open the optimized app in your browser.

## Weather API

The Home page displays local weather using the OpenWeather API. Create a `.env` file with your API key:

```bash
VITE_OPENWEATHER_KEY=your_api_key_here
```

Restart the dev server after adding the file so Vite can load the environment variable.

