# Project Steps — Skyline Weather App

A running log of every stage of the project. Each step lists **what was built**, **files touched**, and **why**.

---

## Stage 1 — Project scaffold (Create React App)

**Goal:** bootstrap a clean React app without Vite/Next, ready for Tailwind + Axios.

**Actions**
- Created the project folder `weather-app/`.
- Wrote `package.json` with React 18, `react-scripts` 5, `axios`, `tailwindcss`, `postcss`, `autoprefixer`.
- Wrote CRA-compatible entry files: `public/index.html`, `public/manifest.json`, `src/index.js`, `src/index.css`.
- Added Tailwind config files: `tailwind.config.js`, `postcss.config.js`.
- Added `.gitignore`, `.env.example`, `README.md`.

**Files created**
- `package.json`, `tailwind.config.js`, `postcss.config.js`
- `public/index.html`, `public/manifest.json`
- `src/index.js`, `src/index.css`
- `.env.example`, `.gitignore`, `README.md`

**Why** — Ship the same structure `npx create-react-app` produces, but written directly so setup is instant.

---

## Stage 2 — Core weather features (v1)

**Goal:** working single-page weather app with geolocation, search, current conditions, hourly + 5-day forecast, dynamic theme and background.

**Actions**
- Built the OpenWeather service layer (`axios` with `units=metric`).
- Built first-pass components: `SearchBar`, `WeatherCard`, `Forecast`, `Details`, `Background`.
- Added the theme map that maps `weather[0].main` → gradient + card + text + background image (clear / clouds / rain / drizzle / thunderstorm / snow / mist / default).
- `App.js` wired geolocation → weather + forecast fetch, with loading + error states, manual city fallback.
- Tailwind `index.css`: glassmorphism helper (`.glass`), custom `fade-in` / `slide-up` animations, Inter font.

**Files created**
- `src/services/weatherService.js`
- `src/utils/themes.js`
- `src/components/SearchBar.js`
- `src/components/WeatherCard.js`
- `src/components/Forecast.js`
- `src/components/Details.js`
- `src/components/Background.js`
- `src/App.js`

**Why** — Match the required feature set: browser Geolocation API, OpenWeather `/weather` + `/forecast`, metric units, clean Tailwind UI, dynamic theme per condition.

---

## Stage 3 — Install + first run

**Actions**
- `cd weather-app && npm install` — 1301 packages installed (~2 min).
- Created `.env` with `REACT_APP_OPENWEATHER_API_KEY=...`.
- `npm start` → served at `http://localhost:3000`, compiled successfully.

**Note** — OpenWeather keys take a few minutes to activate. A fresh key returned HTTP 401 until propagation completed. Swapping to a second active key resolved it, with a dev-server restart to reload `.env`.

---

## Stage 4 — Professional redesign (landing + dashboard)

**Goal:** promote the app from one-page to a real product with a landing experience and a dashboard, following the user-provided spec:
- Landing page with human hero, IP fallback when location is denied.
- Week strip that scrolls into view (mirrors the reference screenshot).
- Dashboard with left sidebar (saved cities, search, add/edit/remove, use-my-location) and right detail panel.
- Full current + hourly + 5-day weekly forecast with week average.
- Wind map at the bottom.

**Dependencies added**
- `react-router-dom@^6.27` — routing between landing (`/`) and dashboard (`/app`).
- `leaflet@^1.9`, `react-leaflet@^4.2` — map for the wind overlay.

**Actions — services & utils**
- Extended `weatherService.js` with `searchCities` (`/geo/1.0/direct` autocomplete), `reverseGeo` (`/geo/1.0/reverse`), `weatherTileUrl(layer)` → `tile.openweathermap.org/map/{layer}/{z}/{x}/{y}`.
- New `geoService.js` — IP fallback via `ipapi.co` → `ipwho.is` (keyless).
- New `utils/storage.js` — localStorage persistence for saved cities (`add`, `remove`, `rename`, `load`).
- New `utils/forecast.js` — shared helpers: `groupDailyForecast`, `dayLabel`, `hourLabel`.

**Actions — components**
- Rewrote `SearchBar.js` with debounced (300 ms) autocomplete driven by OpenWeather geocoding; dropdown list with city/state/country; click-outside to close.
- New `WeekStrip.js` — horizontal glass cards (today, weekdays, high + low) matching the provided screenshot.
- New `Sidebar.js` — saved cities list, active-row highlight, inline rename (✎), remove (✕), 📍 locate button, embedded compact search.
- New `WeatherDetails.js` — unified panel: current hero + stat tiles (humidity / wind / pressure / visibility) + next-hours strip (with POP %) + weekly list with H / L and week-average.
- New `WindMap.js` — Leaflet `MapContainer` + OSM base tile + `wind_new` tile overlay + marker on selected city. Default Leaflet marker icons fixed for CRA's webpack.
- `Background.js` unchanged (already theme-driven).

**Actions — pages & routing**
- New `pages/Landing.js` — hero section, auto GPS → IP fallback, current-weather card with CTA to dashboard, scroll sections (week strip → three feature cards → final CTA). Inline search jumps to dashboard with the picked city pre-loaded via router state.
- New `pages/Dashboard.js` — orchestrates sidebar + details + wind map, manages saved cities, responds to route state from the landing page.
- Rewrote `App.js` as a `BrowserRouter` with `/` → `Landing`, `/app` → `Dashboard`, `*` → `Landing`.
- `index.css` — added Leaflet popup text color override so map popups stay readable over the global white body color.

**Files created**
- `src/services/geoService.js`
- `src/utils/storage.js`
- `src/utils/forecast.js`
- `src/components/WeekStrip.js`
- `src/components/Sidebar.js`
- `src/components/WeatherDetails.js`
- `src/components/WindMap.js`
- `src/pages/Landing.js`
- `src/pages/Dashboard.js`

**Files updated**
- `package.json` — added `react-router-dom`, `leaflet`, `react-leaflet`.
- `src/App.js` — converted to a router shell.
- `src/components/SearchBar.js` — rewrote for autocomplete.
- `src/services/weatherService.js` — added geocoding + tile-URL helpers.
- `src/index.css` — Leaflet popup color fix.

---

## Stage 5 — Compile fix

**Symptom** — First build failed with `react-hooks/rules-of-hooks`: the ESLint rule treated the inner helper `useCoords` as a hook because of the `use` prefix, even though it was a plain async function.

**Fix** — Renamed `useCoords` → `applyCoords` inside `Dashboard.js`. Recompiled successfully.

---

## Stage 6 — Professional redesign (dark cards + navbar + chat agent)

**Goal:** match the reference dashboard screenshots — clean dark card grid, sticky navbar with contact/support, floating chat assistant for weather tips. Single-page dashboard showing everything at once.

**Actions — styling**
- `themes.js` rewritten around a dark base (slate-950/900 gradients). Each condition now adjusts only the accent color and a subtle tint — no more photo backgrounds.
- `Background.js` rewritten: dark gradient + two soft blurred color blobs + a 4 %-opacity dotted grid. Much cleaner, loads instantly (no image requests).
- `index.css` keeps Leaflet overrides from before.

**Actions — new components**
- `Navbar.js` — sticky top bar with logo, links (Home / Dashboard / Features / Contact / Support), "Launch app" CTA, and a mobile hamburger menu.
- `ChatAgent.js` — floating 💬 button → slide-up chat window. Rule-based replies for "tips", "temperature", "rain", "wind", "help", "hello". Tips adapt to the currently loaded weather (passed in as a prop). Quick-action chips for common questions.
- `CurrentWeatherCard.js` — left card in the dashboard grid. Big temperature, description, "feels like", four stat tiles (Wind Speed in km/h, Humidity, Pressure, Visibility). Matches reference image #1.
- `SevenDayCard.js` — right card. Day label, icon + description, probability-of-precipitation %, H/L temps per row.
- `HourlyCard.js` — next 6 slots with icons and temps, plus an SVG polyline chart of the trend and POP % below each.
- `RadarMap.js` — replaces `WindMap.js`. Same Leaflet setup but adds a pill-shaped layer switcher (Precipitation / Temperature / Wind) that swaps the OpenWeather tile overlay on click.
- `utils/tips.js` — generates tip list from weather data (rain → umbrella, clear + hot → sunscreen, cold → coat, windy → secure items, etc.).

**Actions — pages**
- `Landing.js` rewritten: navbar, hero with live current-conditions preview + 7-day strip, feature grid, support section, contact form, footer. Chat agent floats over everything.
- `Dashboard.js` rewritten: same header/nav, sidebar preserved, main area now a 3-column grid — current weather (1) + 7-day (2) on top, hourly (1) + radar (2) below. Chat agent floats over everything.

**Files created**
- `src/components/Navbar.js`
- `src/components/ChatAgent.js`
- `src/components/CurrentWeatherCard.js`
- `src/components/SevenDayCard.js`
- `src/components/HourlyCard.js`
- `src/components/RadarMap.js`
- `src/utils/tips.js`

**Files updated**
- `src/utils/themes.js` — dark base + accent/chip per condition.
- `src/components/Background.js` — clean dark gradient + blobs + dots (no images).
- `src/pages/Landing.js` — full rewrite with navbar, contact, support.
- `src/pages/Dashboard.js` — full rewrite with card grid.

**Note** — The old `WindMap.js`, legacy `WeatherCard.js` / `Forecast.js` / `Details.js` stay on disk for reference but aren't imported anywhere.

---

## Current architecture

```
weather-app/
├─ public/
│  ├─ index.html
│  └─ manifest.json
├─ src/
│  ├─ App.js                       # Router shell
│  ├─ index.js                     # React root
│  ├─ index.css                    # Tailwind + glass + Leaflet overrides
│  ├─ pages/
│  │  ├─ Landing.js                # "/"
│  │  └─ Dashboard.js              # "/app"
│  ├─ components/
│  │  ├─ Background.js             # Full-screen theme bg + overlay
│  │  ├─ SearchBar.js              # Debounced autocomplete
│  │  ├─ Sidebar.js                # Saved cities + search + edit
│  │  ├─ WeekStrip.js              # Horizontal 7-day glass cards
│  │  ├─ WeatherDetails.js         # Current + hourly + weekly
│  │  ├─ WindMap.js                # Leaflet + OW wind tiles
│  │  ├─ WeatherCard.js            # (legacy — unused, kept for reference)
│  │  ├─ Forecast.js               # (legacy)
│  │  └─ Details.js                # (legacy)
│  ├─ services/
│  │  ├─ weatherService.js         # OW weather/forecast/geo + tile URL
│  │  └─ geoService.js             # IP fallback (ipapi.co → ipwho.is)
│  └─ utils/
│     ├─ themes.js                 # Condition → gradient/card/text/image
│     ├─ storage.js                # Saved cities (localStorage)
│     └─ forecast.js               # groupDailyForecast / dayLabel / hourLabel
├─ .env                            # REACT_APP_OPENWEATHER_API_KEY=…
├─ .env.example
├─ .gitignore
├─ package.json
├─ tailwind.config.js
├─ postcss.config.js
├─ README.md
└─ docs/
   └─ STEPS.md                     # this file
```

## External APIs used

| Purpose | Endpoint | Key |
|---|---|---|
| Current weather | `api.openweathermap.org/data/2.5/weather` | OpenWeather |
| 5-day / 3-hour forecast | `api.openweathermap.org/data/2.5/forecast` | OpenWeather |
| City autocomplete | `api.openweathermap.org/geo/1.0/direct` | OpenWeather |
| Reverse geocoding | `api.openweathermap.org/geo/1.0/reverse` | OpenWeather |
| Wind map tile layer | `tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png` | OpenWeather |
| IP fallback (primary) | `ipapi.co/json/` | none |
| IP fallback (secondary) | `ipwho.is/` | none |

## Running locally

```bash
cd weather-app
npm install
# .env → REACT_APP_OPENWEATHER_API_KEY=<your key>
npm start
```

Open `http://localhost:3000`.
Barometer ico