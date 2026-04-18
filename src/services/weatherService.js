import axios from 'axios';

async function getWithRetry(url, opts = {}, retries = 1) {
  const config = { timeout: 10000, ...opts };
  try {
    return await axios.get(url, config);
  } catch (err) {
    const transient = !err.response || err.code === 'ECONNABORTED' || err.message === 'Network Error';
    if (retries > 0 && transient) {
      await new Promise(r => setTimeout(r, 600));
      return getWithRetry(url, opts, retries - 1);
    }
    throw err;
  }
}

const WMO_MAP = {
  0:  { label: 'Clear Sky',           icon: 'clear',             group: 'clear'   },
  1:  { label: 'Mainly Clear',        icon: 'partly-cloudy',     group: 'clouds'  },
  2:  { label: 'Partly Cloudy',       icon: 'partly-cloudy',     group: 'clouds'  },
  3:  { label: 'Overcast',            icon: 'overcast',          group: 'clouds'  },
  45: { label: 'Foggy',               icon: 'fog',               group: 'fog'     },
  48: { label: 'Foggy',               icon: 'fog',               group: 'fog'     },
  51: { label: 'Light Drizzle',       icon: 'drizzle',           group: 'drizzle' },
  53: { label: 'Drizzle',             icon: 'drizzle',           group: 'drizzle' },
  55: { label: 'Heavy Drizzle',       icon: 'drizzle',           group: 'drizzle' },
  61: { label: 'Light Rain',          icon: 'rain-light',        group: 'rain'    },
  63: { label: 'Moderate Rain',       icon: 'rain-moderate',     group: 'rain'    },
  65: { label: 'Heavy Rain',          icon: 'rain-heavy',        group: 'rain'    },
  80: { label: 'Rain Showers',        icon: 'rain-intermittent', group: 'showers' },
  81: { label: 'Rain Showers',        icon: 'rain-intermittent', group: 'showers' },
  82: { label: 'Rain Showers',        icon: 'rain-intermittent', group: 'showers' },
  71: { label: 'Light Snow',          icon: 'snow',              group: 'snow'    },
  73: { label: 'Moderate Snow',       icon: 'snow',              group: 'snow'    },
  75: { label: 'Heavy Snow',          icon: 'snow',              group: 'snow'    },
  85: { label: 'Snow Showers',        icon: 'snow-showers',      group: 'snow'    },
  86: { label: 'Snow Showers',        icon: 'snow-showers',      group: 'snow'    },
  95: { label: 'Thunderstorm',        icon: 'thunder',           group: 'thunder' },
  96: { label: 'Thunderstorm',        icon: 'thunder-severe',    group: 'thunder' },
  99: { label: 'Severe Thunderstorm', icon: 'thunder-severe',    group: 'thunder' },
};

function interpretWeather(code, temp, isNight, precip = 0) {
  let weather = WMO_MAP[code] || { label: 'Cloudy', icon: 'cloudy', group: 'clouds' };

  if (weather.group === 'fog' && temp > 22) {
    weather = { label: 'Hazy', icon: 'overcast', group: 'clouds' };
  }

  let finalIcon = weather.icon;
  if (precip > 0 && precip < 15 && (weather.group === 'clear' || weather.group === 'clouds')) {
    finalIcon = 'rain-intermittent';
    weather.label = 'Light Showers';
  }

  let iconName = finalIcon;
  if (['clear', 'partly-cloudy', 'rain-intermittent'].includes(finalIcon)) {
    iconName = isNight ? `${finalIcon}-night` : `${finalIcon}-day`;
  }

  return {
    label: weather.label,
    icon: `/animated/${iconName}.svg`,
    group: weather.group,
  };
}

function smoothTemperatures(temps) {
  const result = [...temps];
  for (let i = 1; i < temps.length - 1; i++) {
    const prev = temps[i - 1];
    const curr = temps[i];
    const next = temps[i + 1];
    const smoothed = (prev + curr + next) / 3;

    if (Math.abs(smoothed - prev) > 6) {
      result[i] = prev + (smoothed > prev ? 6 : -6);
    } else {
      result[i] = smoothed;
    }
  }
  return result;
}

// Fetch current + hourly + 14-day forecast from Open-Meteo.
export async function getWeatherData(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility,uv_index,dew_point_2m&hourly=temperature_2m,weather_code,precipitation_probability,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max&timezone=auto&forecast_days=14`;

  const { data } = await getWithRetry(url);
  const cur = data.current;

  const smoothedHourlyTemps = smoothTemperatures(data.hourly.temperature_2m);

  const hourly = data.hourly.time.map((t, i) => {
    const time = new Date(t);
    const dayIndex = Math.floor(i / 24);
    const sunrise = new Date(data.daily.sunrise[dayIndex]);
    const sunset = new Date(data.daily.sunset[dayIndex]);
    const isNight = time < sunrise || time > sunset;
    const precip = data.hourly.precipitation_probability[i];
    const temp = smoothedHourlyTemps[i];

    return {
      dt: Math.floor(time.getTime() / 1000),
      temp: Math.round(temp),
      precip: precip >= 15 ? precip : 0,
      uv_index: data.hourly.uv_index[i],
      ...interpretWeather(data.hourly.weather_code[i], temp, isNight, precip),
    };
  });

  const daily = data.daily.time.map((t, i) => {
    const tempMax = data.daily.temperature_2m_max[i];
    const precip = data.daily.precipitation_probability_max[i];

    return {
      dt: Math.floor(new Date(t).getTime() / 1000),
      max: Math.round(tempMax),
      min: Math.round(data.daily.temperature_2m_min[i]),
      precip: precip >= 15 ? precip : 0,
      uv_index: data.daily.uv_index_max[i],
      ...interpretWeather(data.daily.weather_code[i], tempMax, false, precip),
    };
  });

  const currentIsNight = cur.is_day === 0;
  const currentInterpret = interpretWeather(cur.weather_code, cur.temperature_2m, currentIsNight);

  return {
    name: data.timezone,
    current: {
      temp: Math.round(cur.temperature_2m),
      feels_like: Math.round(cur.apparent_temperature),
      humidity: cur.relative_humidity_2m,
      pressure: cur.surface_pressure,
      wind_speed: cur.wind_speed_10m,
      wind_deg: cur.wind_direction_10m,
      visibility: cur.visibility,
      uv_index: cur.uv_index,
      dew_point: cur.dew_point_2m,
      lat,
      lon,
      isNight: currentIsNight,
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
      ...currentInterpret,
    },
    hourly,
    daily,
  };
}

// Coordinates → nearest city name (via OpenStreetMap Nominatim).
export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    const { data } = await getWithRetry(url, { headers: { 'User-Agent': 'WeatherApp/1.0' } });
    return {
      name: data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county || 'Unknown',
      state: data.address.state,
      country: data.address.country,
    };
  } catch (e) {
    return null;
  }
}

// City name → up to 5 location matches (via Open-Meteo geocoding).
export async function searchCities(q) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;
    const { data } = await getWithRetry(url);
    return (data.results || []).map(c => ({
      name: c.name,
      state: c.admin1,
      country: c.country,
      lat: c.latitude,
      lon: c.longitude,
    }));
  } catch (e) {
    return [];
  }
}

// Build an OpenWeatherMap tile URL for the given layer (rain/temp/wind/etc.).
export const weatherTileUrl = (layer) => {
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
  return `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${apiKey}`;
};

export const getWeatherByCoords   = async (lat, lon) => (await getWeatherData(lat, lon)).current;
export const getForecastByCoords  = async (lat, lon) => ({ list: (await getWeatherData(lat, lon)).hourly });
export const getExtendedForecast  = async (lat, lon) => (await getWeatherData(lat, lon)).daily;
export const getIconUrl           = (data) => data.icon;
