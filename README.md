# 🌿 Lisa

[![Vite](https://img.shields.io/badge/built%20with-vite-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev) [![React](https://img.shields.io/badge/react-18+-61DAFB?logo=react)](https://reactjs.org/) [![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

Lisa is a **mobile-first** plant care app with weather-driven reminders, an AI Coach and swipeable card UI.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Demo
<!-- screenshot or gif here -->

## Features
### Core
- Today, All Plants and Timeline views
- Add/edit/delete plants
- Photo gallery & tasks per plant
- Set hero image from gallery thumbnails
- Placeholder images come from Wikipedia with a local fallback

<details>
<summary>Advanced</summary>

- Weather-based scheduling
- OpenAI Coach & care plan
- Discoverable plant suggestions
- If the API for suggestions fails, fallback picks from a local list are displayed
- Offline PWA support
- Photo uploads via Cloudinary
</details>

## Getting Started
### Prerequisites
- Node.js ≥18
- MySQL database (local or remote)
  - Run `docker compose up -d` to start the provided MySQL container, **or**
    update `DATABASE_URL` in `.env` to point at an existing instance.

### Install & Run
```bash
npm install
cp .env.example .env   # add your API keys and DB URL
# optional: change JSON_LIMIT to adjust Express JSON body size (default 1mb)
# start MySQL here if using Docker
npx prisma migrate deploy
# optional: seed sample data
SEED_EXAMPLE_DATA=true npx prisma db seed
# or: npm run seed:sample
npm start        # Express API + Vite (on :3000 and :5173)
# optional: run them separately
npm run server   # Express API on :3000
npm run dev      # Vite on :5173 (LAN accessible)
```

If the `/api/plants` endpoint is unavailable, the app falls back to sample
plants from `src/__fixtures__/plants.json` so you can explore the UI without
running the server.


### Personal Use Tips
- View the app on your laptop at `http://localhost:5173`.
- From your phone, open `http://<your-ip>:5173` and "Add to Home Screen" for
  an offline-capable PWA.
- Build production assets with `npm run build` and deploy the Express server and
  `dist/` folder wherever you host your projects. Use HTTPS for best results.

## Testing
Install dependencies and run the Jest suite:
```bash
npm install
npm test
```

## API Reference

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET    | `/api/plants` | List all plants |
| POST   | `/api/plants` | Create a plant |
| PUT    | `/api/plants/:id` | Update a plant |
| DELETE | `/api/plants/:id` | Delete a plant |
| POST   | `/api/plants/:id/photos` | Upload images |
| POST   | `/api/coach` | Ask the AI plant coach |
| POST   | `/api/care-plan` | Generate a plant care plan |
| POST   | `/api/auto-tag` | Auto-tag notes with keywords |
| POST   | `/api/plant-fact` | Fetch a fun plant fact |
| POST   | `/api/timeline-summary` | Summarize recent care events |
| POST   | `/api/photos` | Upload a single photo |

## Contributing

Contributions are welcome!
1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-idea`)
3. Commit your changes and push
4. Open a Pull Request

## License

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
