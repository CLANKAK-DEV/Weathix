export function createCity({ name, state = '', country = '', lat, lon }) {
  return { name, state, country, lat: Number(lat), lon: Number(lon) };
}

export function cityKey(city) {
  if (!city) return '';
  return `${city.lat.toFixed(3)},${city.lon.toFixed(3)}`;
}

export function sameCity(a, b) {
  return !!a && !!b && cityKey(a) === cityKey(b);
}

export function cityLabel(city) {
  if (!city) return '';
  const parts = [city.name, city.state, city.country].filter(Boolean);
  return parts.join(', ');
}
