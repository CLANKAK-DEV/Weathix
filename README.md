# Weathix

A clean React weather app built with Create React App, Tailwind CSS, and the OpenWeather API. Dynamic themes adapt background and card colors to the current weather condition.

## Setup

```bash
cd weather-app
npm install
```

Create a `.env` file in `weather-app/` with your OpenWeather API key:

```
REACT_APP_OPENWEATHER_API_KEY=your_key_here
```

Get a free key at https://openweathermap.org/api.

## Run

```bash
npm start
```

Opens http://localhost:3000.

## Build

```bash
npm run build
```

## Structure

```
src/
  App.js
  index.js
  index.css
  components/
    SearchBar.js
    WeatherCard.js
    Forecast.js
    Details.js
    Background.js
  services/
    weatherService.js
  utils/
    themes.js
```

## Features

- Geolocation on first load, with manual city search fallback
- Current conditions, next-hours list, and 5-day forecast
- Dynamic theme + background image per weather condition (clear / clouds / rain / snow / thunderstorm / mist)
- Loading and error states
- Glassmorphism UI with soft shadows and fade/slide animations
