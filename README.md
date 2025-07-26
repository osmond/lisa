# 🌿 Lisa

[![Vite](https://img.shields.io/badge/built%20with-vite-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev) [![React](https://img.shields.io/badge/react-18+-61DAFB?logo=react)](https://reactjs.org/) [![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

Lisa is a **mobile-first** plant care app with weather-driven reminders, an AI Coach and swipeable card UI.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Getting Started](#getting-started)
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

<details>
<summary>Advanced</summary>

- Weather-based scheduling
- OpenAI Coach & care plan
- Discoverable plant suggestions
- Offline PWA support
- Photo uploads via Cloudinary
</details>

## Getting Started
### Prerequisites
- Node.js ≥18
- MySQL database (see [.env.example](.env.example))

### Install & Run
```bash
npm install
cp .env.example .env   # add your API keys and DB URL
npx prisma migrate deploy
npm run server   # Express API on :3000
npm run dev      # Vite on :5173
```

## API Reference

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET    | `/api/plants` | List all plants |
| POST   | `/api/plants` | Create a plant |
| PUT    | `/api/plants/:id` | Update a plant |
| DELETE | `/api/plants/:id` | Delete a plant |
| POST   | `/api/plants/:id/photos` | Upload images |

## Contributing

Contributions are welcome!
1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-idea`)
3. Commit your changes and push
4. Open a Pull Request

## License

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
