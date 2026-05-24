const DEFAULT_TITLE = 'Weathix | Real-Time Weather Dashboard';
const DEFAULT_DESCRIPTION = 'Real-time weather, 14-day forecasts, radar maps, saved locations, and AI weather guidance.';

export const SEO_ROUTES = {
  '/dashboard': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  '/support': {
    title: 'Support | Weathix Weather Dashboard',
    description: 'Contact Weathix support for help with weather data, city search, saved locations, maps, and AI weather guidance.',
  },
  '/settings': {
    title: 'Settings | Weathix Weather Dashboard',
    description: 'Customize Weathix weather units, theme, and dashboard preferences.',
  },
  '/privacy': {
    title: 'Privacy Policy | Weathix Weather Dashboard',
    description: 'Learn how Weathix protects location, weather, saved city, and support request data.',
  },
  '/security': {
    title: 'Security | Weathix Weather Dashboard',
    description: 'Review the security practices behind Weathix weather data, AI prompts, and browser storage.',
  },
  '/about': {
    title: 'About | Weathix Weather Dashboard',
    description: 'Learn about the Weathix weather dashboard, real-time forecasts, radar maps, and AI weather assistant.',
  },
};

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

export function applyRouteSeo(pathname) {
  if (typeof document === 'undefined') return;

  const routeSeo = SEO_ROUTES[pathname] || SEO_ROUTES['/dashboard'];
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const canonicalPath = pathname === '/' ? '/dashboard' : pathname;
  const canonicalUrl = `${origin}${canonicalPath}`;

  document.title = routeSeo.title;

  upsertMeta('meta[name="description"]', { name: 'description', content: routeSeo.description });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: routeSeo.title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: routeSeo.description });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: routeSeo.title });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: routeSeo.description });
  upsertLink('canonical', canonicalUrl);
}
