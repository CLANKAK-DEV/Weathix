import axios from 'axios';

// Resolve the visitor's approximate coordinates via IP lookup, with a fallback provider.
export async function getIpLocation() {
  try {
    const { data } = await axios.get('https://ipapi.co/json/', { timeout: 8000 });
    if (data?.latitude && data?.longitude) {
      return {
        lat: data.latitude,
        lon: data.longitude,
        city: data.city,
        region: data.region,
        country: data.country_name,
      };
    }
  } catch (_) {}

  try {
    const { data } = await axios.get('https://ipwho.is/', { timeout: 8000 });
    if (data?.success && data.latitude && data.longitude) {
      return {
        lat: data.latitude,
        lon: data.longitude,
        city: data.city,
        region: data.region,
        country: data.country,
      };
    }
  } catch (_) {}

  return null;
}
