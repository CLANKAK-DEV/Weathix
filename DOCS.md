# Weather Dashboard — Project Documentation

A modern, privacy-focused weather web app. Real-time conditions, 14-day forecast,
interactive radar map, and an AI weather assistant — all in a clean interface
built around the app's sun-and-cloud logo.

---

## 1. Tech Stack

| Layer            | Tool                            | Why it's here                                 |
| ---------------- | ------------------------------- | --------------------------------------------- |
| Framework        | **React 18**                    | Hooks-first UI, Create-React-App scaffold     |
| Routing          | **react-router-dom v6**         | Client-side routes for `/dashboard`, etc.     |
| HTTP             | **axios**                       | Fetch with timeout + single-retry wrapper     |
| Maps             | **leaflet** + **react-leaflet** | Interactive weather radar overlay             |
| Email            | **@emailjs/browser**            | Support-form submissions without a backend    |
| Fonts            | **Inter** (Google Fonts)        | Weights 300–900                               |
| Build            | **react-scripts** (CRA)         | `npm start` / `npm run build`                 |

### External APIs

| Service                           | Purpose                                   |
| --------------------------------- | ----------------------------------------- |
| **Open-Meteo forecast**           | Current, hourly, and 14-day forecast data |
| **Open-Meteo geocoding**          | City-name search                          |
| **OpenStreetMap Nominatim**       | Reverse geocoding (coords → city)         |
| **OpenWeatherMap tiles**          | Raster map overlays (rain / temp / wind)  |
| **ipapi.co** (+ ipwho.is fallback)| Approximate location from IP              |
| **Venice AI**                     | Natural-language weather assistant        |

### Environment variables (`.env`)

```ini
REACT_APP_OPENWEATHER_API_KEY=...    # tile overlays
REACT_APP_VENICE_API_KEY=...         # AI chat assistant
REACT_APP_EMAILJS_SERVICE_ID=...     # support form
REACT_APP_EMAILJS_TEMPLATE_ID=...
REACT_APP_EMAILJS_PUBLIC_KEY=...
```

---

## 2. Project Layout

```
weather-app/
├── public/
│   ├── animated/            # Condition SVG icons (clear-day, rain-heavy, ...)
│   └── icons/               # UI icons (ai_bot, message_line, ...)
├── src/
│   ├── index.js             # React entry
│   ├── index.css            # SINGLE stylesheet — design system + utilities
│   ├── App.js               # Routes
│   ├── contexts/
│   │   └── ThemeContext.js  # darkMode provider, persists to localStorage
│   ├── services/
│   │   ├── weatherService.js   # Open-Meteo + geocoding + tile URLs
│   │   ├── geoService.js       # IP → coordinates
│   │   └── nvidiaAIService.js  # Venice AI chat calls + daily quota
│   ├── models/                 # MVVM: plain data factories + invariants
│   │   ├── ChatMessageModel.js
│   │   ├── CityModel.js
│   │   ├── WeatherModel.js
│   │   ├── UsageModel.js
│   │   └── index.js            # barrel export
│   ├── viewmodels/             # MVVM: hook-based state + logic
│   │   ├── useChatViewModel.js
│   │   ├── useSavedCitiesViewModel.js
│   │   ├── useWeatherViewModel.js
│   │   ├── useSearchViewModel.js
│   │   ├── useSettingsViewModel.js
│   │   └── index.js
│   ├── utils/
│   │   ├── forecast.js      # dayLabel helper
│   │   └── icons.js         # <Ic.*> SVG icon set
│   ├── components/
│   │   ├── ChatAgent.js     # Floating AI assistant widget (View)
│   │   └── WeatherIcon.js   # <img> for /animated/*.svg icons
│   └── pages/
│       ├── Dashboard.js     # Main app shell — all views live here
│       ├── Support.js       # Contact form + FAQ
│       ├── Settings.js      # Language / theme / location
│       ├── About.js         # App info
│       ├── Privacy.js       # Privacy policy
│       └── Security.js      # Security practices
├── .env
├── package.json
└── DOCS.md                  # (this file)
```

### Routing

```
/              →  redirects to /dashboard
/dashboard     →  Dashboard (includes Map, Calendar, Saved, Support, Settings
                   as inline views — not separate routes)
/support       →  Support (standalone fallback)
/settings      →  Settings (standalone fallback)
/privacy       →  Privacy
/security      →  Security
/about         →  About
```

---

## 3. Design System: Architectural Ledger

The interface follows a strict, zero-radius industrial aesthetic. It is built on a "slab" metaphor where elements are flat, high-contrast panels with sharp edges and uppercase labels.

### Architectural Palette

| Token                  | Hex       | Role                                    |
| ---------------------- | --------- | --------------------------------------- |
| `--primary`            | `#061b0e` | Deep Forest. Sidebar, main headers.     |
| `--primary-container`  | `#1b3022` | Dark Sage. Hero backgrounds, active navigation. |
| `--on-primary`         | `#ffffff` | Absolute White. High-contrast text on primary. |
| `--secondary`          | `#45645e` | Muted Moss. Accents, secondary metrics. |
| `--surface`            | `#ffffff` | Pure White. Main content slabs.         |
| `--surface-container`  | `#f8f9f8` | Off-white. Subtle background separation. |
| `--outline`            | `#000000` | Black. Borders, hair-line dividers.    |

### Typography

- **Primary Font**: Inter (Weights 400-900)
- **Labels**: Uppercase, letter-spacing: 0.12em - 0.14em.
- **Precision**: Numbers use bold weights with tight tracking (-0.04em).

---

## 4. Architectural Patterns

| Class                | Effect                                                       |
| -------------------- | ------------------------------------------------------------ |
| `.slab`              | Flat container with zero radius and 1px outline.             |
| `.slab-primary`      | Dark forest green container for high-priority info.          |
| `.label-uppercase`   | Standardized small-caps labelling system.                    |
| `.fade-up`           | Structural entry animation (14px rise).                      |
| `.data-grid`         | Strict 1px-gap grid system for metrics.                      |

### Example

```jsx
<div className="card fade-up">
  <h3 className="text-brand">Weather</h3>
  <p className="text-muted">Partly cloudy, 18°C</p>
  <button className="btn-primary">Refresh</button>
</div>
```

---

## 5. MVVM Architecture

The app follows the **Model-View-ViewModel** pattern, adapted to React's hook
system. Each layer has one job and only one job.

```
┌──────────┐      reads       ┌────────────┐    shapes    ┌────────┐
│  View    │ ───────────────▶ │ ViewModel  │ ───────────▶ │ Model  │
│ (JSX)    │ ◀─── state ───── │  (hook)    │ ◀── data ─── │ (data) │
└──────────┘                  └─────┬──────┘              └────────┘
                                    │ calls
                                    ▼
                              ┌────────────┐
                              │  Service   │  ← HTTP, localStorage, APIs
                              └────────────┘
```

### Layer responsibilities

| Layer         | Location              | Contains                                    | Does NOT contain                   |
| ------------- | --------------------- | ------------------------------------------- | ---------------------------------- |
| **Model**     | `src/models/`         | Shapes, factories, pure helpers             | State, side effects, JSX           |
| **ViewModel** | `src/viewmodels/`     | `useXxxViewModel()` React hooks             | JSX, inline styles                 |
| **View**      | `src/pages/`, `src/components/` | JSX, styling, event wiring        | `fetch`, localStorage, business rules |
| **Service**   | `src/services/`       | Network calls (axios), external APIs        | React state, UI concerns           |

### Models (`src/models/`)

Plain JS factories that describe the *shape* of domain data and provide small
pure helpers. No React, no network, no `localStorage` — just data.

```js
// src/models/ChatMessageModel.js
export const ROLE = Object.freeze({ USER: 'user', BOT: 'bot' });
export function createMessage(role, text, { isError = false } = {}) {
  return { role, text, isError };
}
export const userMessage  = (text) => createMessage(ROLE.USER, text);
export const botMessage   = (text) => createMessage(ROLE.BOT, text);
export const errorMessage = (text) => createMessage(ROLE.BOT, text, { isError: true });
```

Current models: `WeatherModel`, `CityModel`, `ChatMessageModel`, `UsageModel`.

### ViewModels (`src/viewmodels/`)

Custom hooks that own state, orchestrate services, and expose a clean API to
the view. Every VM is a **`use*ViewModel()` hook** returning a plain object of
values and callbacks. The view never imports a service directly.

```js
// src/viewmodels/useChatViewModel.js  (excerpt)
export function useChatViewModel(weather) {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [usage, setUsage]       = useState(getDailyUsage());

  const ask = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    setMessages(m => [...m, userMessage(text)]);
    setLoading(true);
    const result = await getWeatherAIResponse(text, weather);
    setMessages(m => [...m, result.error ? errorMessage(result.error) : botMessage(result.response)]);
    setUsage(getDailyUsage());
    setLoading(false);
  }, [loading, weather]);

  return { messages, input, setInput, loading, usage, ask, /* ... */ };
}
```

Current viewmodels:

| Hook                          | Wraps                                                     |
| ----------------------------- | --------------------------------------------------------- |
| `useChatViewModel`            | AI chat messages, input, quota, send flow                 |
| `useSavedCitiesViewModel`     | Saved-city list + `localStorage` persistence              |
| `useWeatherViewModel`         | Current city + forecast fetch + loading/error + IP-locate |
| `useSearchViewModel`          | Debounced city search                                     |
| `useSettingsViewModel`        | Theme, language, location-toggle persistence              |

### Views

Views — `src/pages/*.js` and `src/components/*.js` — call a VM hook and render.
They own nothing except JSX, inline styling, and user-event wiring.

```jsx
// src/components/ChatAgent.js  (excerpt)
function ChatAgent({ weather }) {
  const { messages, input, setInput, loading, usage, submit, ask, listRef,
          open, toggleOpen } = useChatViewModel(weather);

  return (
    <>
      <button onClick={toggleOpen}>AI Assistant</button>
      {open && (
        <form onSubmit={submit}>
          <input value={input} onChange={e => setInput(e.target.value)} />
          {messages.map(m => <div key={m.id}>{m.text}</div>)}
        </form>
      )}
    </>
  );
}
```

### Why it's structured this way

- **Testability** — ViewModels are plain hooks. Test them with
  `@testing-library/react`'s `renderHook` without touching the DOM.
- **Swappable services** — The VM is the only layer that calls services. Swap
  Open-Meteo for another provider by editing one file, not fifteen.
- **Thin views** — Pages focus on layout, not business rules. Moving a feature
  from Dashboard to its own page is a copy-paste job.
- **Predictable state** — Every piece of persisted state (saved cities, theme,
  language) lives in exactly one VM. No duplication, no sync bugs.

### Before / after — saved cities

```js
// ❌ Before: Dashboard owned persistence, storage key, and merge logic
const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem('saved_cities') || '[]'));
useEffect(() => { localStorage.setItem('saved_cities', JSON.stringify(saved)); }, [saved]);
const toggleSave = useCallback((city) => {
  setSaved(prev => {
    const exists = prev.find(s => s.lat === city.lat && s.lon === city.lon);
    if (exists) return prev.filter(s => s !== exists);
    return [...prev, { name: city.name, lat: city.lat, lon: city.lon, country: city.country }];
  });
}, []);

// ✅ After
const { saved, toggleSave } = useSavedCitiesViewModel();
```

### Adding a new feature — the checklist

1. **Model** — define the data shape in `src/models/FooModel.js`.
2. **Service** — if it talks to a network/storage, add a function in
   `src/services/`. Return `null`/`[]` on failure, never throw to the VM.
3. **ViewModel** — create `src/viewmodels/useFooViewModel.js`. It calls the
   service, manages state, and returns values + callbacks.
4. **View** — import the VM from a page or component. Render JSX.

---

## 6. Development

```bash
npm install
npm start         # dev server on http://localhost:3000
npm run build     # production bundle in build/
```

### Code conventions

- **One stylesheet.** All CSS lives in `src/index.css`. Inline styles are used
  for per-instance tuning but should reference CSS variables (e.g.
  `color: 'var(--text-main)'`) rather than hard-coded hexes.
- **No ad-hoc colors.** When a color is needed, it comes from the brand palette
  in `src/index.css`.
- **Comments are scarce.** Self-documenting names do the talking. A short
  one-line comment above an exported function is fine when the purpose isn't
  obvious from the signature.
- **Services return safe defaults.** Every network call in `src/services` has a
  `try/catch` and returns `null` or `[]` on failure — the UI never crashes on a
  transient error.

---

## 7. Report Summary & Project Specifications
*Use this section for generating technical reports or academic documentation (Word/PDF).*

### Executive Summary
**Weathix** is an advanced meteorological dashboard that leverages modern web technologies to provide precision weather data through an "Architectural Ledger" design language. The system focuses on high-performance data visualization, user privacy (via local-only storage), and AI-driven insights.

### System Architecture
- **Paradigm**: MVVM (Model-View-ViewModel).
- **Frontend State**: React Hooks + Context API.
- **Data Persistence**: Browser LocalStorage (Zero Server Dependency).
- **Communication**: RESTful APIs via Axios with custom retry logic.

### Technical Specification Table
| Category | Specification |
| :--- | :--- |
| **Framework** | React 18 (Functional Components) |
| **Style Architecture** | Semantic CSS Variables + CSS Grid/Flexbox |
| **Mapping Engine** | Leaflet.js with custom TileLayer integration |
| **AI Processing** | NVIDIA Llama-3.1-405B via Venice AI API |
| **Weather Engine** | Open-Meteo V2 (WMO Standard) |
| **Language Support** | Dynamic (Global Localization) |

### Core Functional Modules
1. **Meteorological Processor**: Orchestrates real-time weather data fetching, unit conversion (Celsius/Fahrenheit), and coordinate translation.
2. **Geospatial Engine**: Manages interactive maps with atmospheric overlays (precipitation, wind speed, cloud cover).
3. **Intelligence Layer**: A context-aware AI assistant that interprets weather data into actionable advice.
4. **Vault Module**: Manages encrypted-at-rest (browser) user data, including saved cities and session preferences.

---
---
*Weather Dashboard — Precision Engineered for the Modern Web.*
