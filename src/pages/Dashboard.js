import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { getWeatherData, searchCities, weatherTileUrl, reverseGeocode } from '../services/weatherService';
import { getIpLocation } from '../services/geoService';
import { dayLabel } from '../utils/forecast';
import { useTheme } from '../contexts/ThemeContext';
import WeatherIcon from '../components/WeatherIcon';
import ChatAgent from '../components/ChatAgent';
import { useSavedCitiesViewModel } from '../viewmodels/useSavedCitiesViewModel';
import Support from './Support';
import Settings from './Settings';
import Privacy from './Privacy';
import About from './About';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: iconRetina, iconUrl, shadowUrl });


function Recenter({ lat, lon, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lon != null) map.setView([lat, lon], zoom || 6);
  }, [lat, lon, zoom, map]);
  return null;
}


function MapControls({ onZoomIn, onZoomOut, onLocate, setMapLayer, mapLayer, setMapFull, mapFull }) {
  return (
    <>
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {MAP_LAYERS.map(l => (
          <button
            key={l.id}
            onClick={() => setMapLayer(l.id)}
            style={{
              background: mapLayer === l.id ? l.color : 'rgba(15, 23, 42, 0.9)',
              border: `1px solid ${mapLayer === l.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
              color: '#fff',
              padding: '10px 16px', borderRadius: 12,
              fontSize: 13, fontWeight: 700,
              cursor: 'pointer', backdropFilter: 'blur(16px)',
              minWidth: 120, textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 12,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: mapLayer === l.id ? `0 8px 20px ${l.color}40` : '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', transform: mapLayer === l.id ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.25s ease' }}>{l.icon}</span>
            {l.label}
          </button>
        ))}
        <button onClick={() => setMapFull(!mapFull)} style={{ background: 'transparent', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', minWidth: 90, textAlign: 'left', marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          {mapFull ? <Ic.Collapse /> : <Ic.Expand />} {mapFull ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
      <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1000, display: 'flex', gap: 8 }}>
        <button onClick={onLocate} style={{
          background: 'rgba(27,48,34,0.9)', border: 'none', color: '#fff',
          width: 40, height: 40, borderRadius: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)'
        }} title="Zoom to my location">
          <Ic.Locate />
        </button>
      </div>
      <div style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1000, display: 'flex', flexDirection: 'row', gap: 8 }}>
        <button onClick={onZoomIn} style={{
          background: 'rgba(255,255,255,0.9)', border: 'none', color: '#1e293b',
          width: 40, height: 40, borderRadius: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
          fontSize: 24, fontWeight: 700
        }} title="Zoom in">
          +
        </button>
        <button onClick={onZoomOut} style={{
          background: 'rgba(255,255,255,0.9)', border: 'none', color: '#1e293b',
          width: 40, height: 40, borderRadius: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
          fontSize: 24, fontWeight: 700
        }} title="Zoom out">
          −
        </button>
      </div>
    </>
  );
}




const Ic = {
  Dashboard: (props) => <IconWrapper src="/icons/dashboard.png" alt="Dashboard" {...props} />,
  Map: (props) => <IconWrapper src="/icons/map_line.png" alt="Map" size={18} {...props} />,
  Pin: (props) => <IconWrapper src="/icons/pin_line.png" alt="Saved" size={18} {...props} />,
  Calendar: (props) => <IconWrapper src="/icons/calendar_line.png" alt="Calendar" size={18} {...props} />,
  Settings: (props) => <IconWrapper src="/icons/settings_line.png" alt="Settings" size={18} {...props} />,
  Help: (props) => <IconWrapper src="/icons/question_line.png" alt="FAQ" size={18} {...props} />,
  Bell: (props) => <IconWrapper src="/icons/bell_line.png" alt="Alerts" size={18} {...props} />,
  Search: (props) => <IconWrapper src="/icons/search_line.png" alt="Search" size={16} {...props} />,
  Locate: (props) => <IconWrapper src="/icons/locate_line.png" alt="Locate" size={18} {...props} />,
  Expand: (props) => <IconWrapper src="/icons/expand_line.png" alt="Expand" size={18} {...props} />,
  Collapse: (props) => <IconWrapper src="/icons/expand_line.png" alt="Collapse" size={18} style={{ transform: 'rotate(180deg)' }} {...props} />,
  Wind: (props) => <IconWrapper src="/icons/wind.png" alt="Wind" size={22} {...props} />,
  Eye: (props) => <IconWrapper src="/icons/visibility.png" alt="Visibility" size={22} {...props} />,
  Drop: (props) => <IconWrapper src="/icons/humidity.png" alt="Humidity" size={22} {...props} />,
  Gauge: (props) => <IconWrapper src="/icons/uv.png" alt="UV Index" size={22} {...props} />,
  Thermo: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></svg>,
  Pressure: (props) => <IconWrapper src="/icons/pressure.png" alt="Pressure" size={22} {...props} />,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  Minus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  Rain: (props) => <IconWrapper src="/icons/precipitation.png" alt="Precipitation" size={22} {...props} />,
  Sunrise: (props) => <IconWrapper src="/icons/daylight.png" alt="Sunrise" size={22} {...props} />,
  Sunset: (props) => <IconWrapper src="/icons/daylight.png" alt="Sunset" size={22} style={{ transform: 'scaleX(-1)' }} {...props} />,
  Cloud: (props) => <IconWrapper src="/icons/clouds.png" alt="Clouds" size={22} {...props} />,
  Snow: (props) => <IconWrapper src="/icons/snow.png" alt="Snow" size={22} {...props} />,
  MapRain: (props) => <IconWrapper src="/icons/map_rain.png" alt="Rain" size={18} {...props} />,
  ChevronLeft: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>,
  ChevronRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>,
  Filter: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>,
  Clock: (props) => <IconWrapper src="/icons/clock.png" alt="Time" size={18} {...props} />,
};

function IconWrapper({ src, alt, size, style = {}, ...props }) {
  const { darkMode } = useTheme();
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: props.width || size || 20,
        height: props.height || size || 20,
        objectFit: 'contain',
        filter: darkMode ? 'grayscale(1) invert(1) brightness(1.6) contrast(1.2)' : 'none',
        ...style
      }}
      {...props}
    />
  );
}







const MAP_LAYERS = [
  { id: 'precipitation_new', label: 'Rain', color: '#1b3022', icon: <Ic.Rain width={20} height={20} /> },
  { id: 'temp_new', label: 'Temp', color: '#45645e', icon: <Ic.Thermo /> },
  { id: 'wind_new', label: 'Wind', color: '#10b981', icon: <Ic.Wind width={20} height={20} /> },
  { id: 'clouds_new', label: 'Clouds', color: '#94a3b8', icon: <Ic.Cloud width={20} height={20} /> },
  { id: 'pressure_new', label: 'Pressure', color: '#a855f7', icon: <Ic.Pressure width={20} height={20} /> },
];

const RANDOM_LOCATIONS = [
  { name: 'Tokyo', lat: 35.6895, lon: 139.6917, country: 'Japan' },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'France' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'USA' },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'Australia' },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708, country: 'UAE' },
  { name: 'Agadir', lat: 30.4278, lon: -9.5981, country: 'Morocco' },
];






function getNow() {
  const d = new Date();
  return {
    date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
    day: d.toLocaleDateString('en-US', { weekday: 'long' }),
    time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

function fmtHour(dt) {
  const d = new Date(dt * 1000);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function fmtDate(dt) {
  return new Date(dt * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}









function SearchBar({ onSelect }) {
  const [q, setQ] = useState('');
  const [res, setRes] = useState([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const t = useRef(null);

  const change = e => {
    const v = e.target.value; setQ(v);
    clearTimeout(t.current);
    if (!v.trim()) { setRes([]); setOpen(false); return; }
    t.current = setTimeout(async () => {
      setBusy(true);
      try { const d = await searchCities(v); setRes(d); setOpen(true); }
      catch (_) { } finally { setBusy(false); }
    }, 380);
  };

  const pick = c => { onSelect(c); setQ(''); setRes([]); setOpen(false); };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)',
        padding: '10px 14px', minWidth: 260,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--outline)' }}>search</span>
        <input value={q} onChange={change} onFocus={() => res.length && setOpen(true)} placeholder="Search location…" style={{
          background: 'none', border: 'none', outline: 'none', color: 'var(--on-surface)',
          fontSize: 12, width: '100%', fontFamily: 'inherit',
          letterSpacing: '0.02em',
        }} />
        {busy && <span style={{ width: 12, height: 12, border: '2px solid var(--outline-variant)', borderTopColor: 'var(--primary-container)', animation: 'spin .7s linear infinite', flexShrink: 0 }} />}
      </div>
      {open && res.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 2000,
          background: 'var(--surface)', border: '1px solid var(--outline-variant)',
          overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
        }}>
          {res.map((c, i) => (
            <button key={i} onClick={() => pick(c)} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
              padding: '11px 14px', background: 'none', border: 'none',
              color: 'var(--on-surface-variant)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
              borderBottom: i < res.length - 1 ? '1px solid var(--outline-variant)' : 'none',
            }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container-low)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--outline)' }}>location_on</span>
              <span style={{ fontWeight: 800, color: 'var(--on-surface)', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 11 }}>{c.name}</span>
              {c.state && <span style={{ color: 'var(--outline)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.state}</span>}
              <span style={{ marginLeft: 'auto', color: 'var(--outline)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{c.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


function Stat({ icon, label, value, subValue }) {
  return (
    <div
      style={{
        background: 'var(--surface-container-high)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flex: 1,
        minWidth: 160,
        position: 'relative',
        border: '1px solid var(--outline-variant)',
      }}
    >
      <div style={{
        width: 32, height: 32,
        display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: 'var(--primary)',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: '9px', color: 'var(--outline)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--on-surface)', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
        {subValue && <div style={{ fontSize: '10px', color: 'var(--on-surface-variant)', marginTop: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subValue}</div>}
      </div>
    </div>
  );
}


function PermissionModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5, 7, 6, 0.4)', backdropFilter: 'blur(24px)',
      padding: '20px', animation: 'fadeUp 0.3s ease-out',
    }} onClick={onClose}>
      <div className="slab--glass" style={{ width: '100%', maxWidth: 480, padding: 40, boxShadow: '0 32px 64px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, color: 'var(--primary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32 }}>location_off</span>
          <h2 style={{ fontSize: 24, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: 'var(--on-surface)' }}>Access Denied</h2>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--on-surface-variant)', marginBottom: 32 }}>
          Location permissions are currently disabled for Weathix. To use the "Locate Me" feature, please enable location access in your browser settings and try again.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--surface-container-low)', padding: 16, border: '1px solid var(--outline-variant)' }}>
            <h4 style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--outline)', marginBottom: 8 }}>How to activate:</h4>
            <ol style={{ fontSize: 12, color: 'var(--on-surface)', paddingLeft: 18, lineHeight: 1.6 }}>
              <li>Click the <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle' }}>settings</span> icon in your address bar</li>
              <li>Toggle <strong>Location</strong> to "Allow"</li>
              <li>Refresh the page to sync your position</li>
            </ol>
          </div>
          <button onClick={onClose} style={{
            marginTop: 8, padding: '14px', background: 'var(--primary)', color: 'var(--on-primary)',
            border: 'none', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer'
          }}>I Understand</button>
        </div>
      </div>
    </div>
  );
}
function CitySearchModal({ onClose, onSelect }) {
  const [q, setQ] = useState('');
  const [res, setRes] = useState([]);
  const [busy, setBusy] = useState(false);
  const t = useRef(null);

  const change = e => {
    const v = e.target.value; setQ(v);
    clearTimeout(t.current);
    if (!v.trim()) { setRes([]); return; }
    t.current = setTimeout(async () => {
      setBusy(true);
      try { const d = await searchCities(v); setRes(d); }
      catch (_) { } finally { setBusy(false); }
    }, 380);
  };

  const pick = c => { onSelect(c); onClose(); };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: 'rgba(5, 7, 6, 0.4)', backdropFilter: 'blur(24px)',
      padding: '80px 20px', animation: 'fadeUp 0.3s ease-out',
    }} onClick={onClose}>

      <div
        className="slab--glass"
        style={{
          width: '100%', maxWidth: 640,
          position: 'relative',
          overflow: 'hidden',
          padding: '40px',
          animation: 'slabIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'uppercase', color: 'var(--on-surface)' }}>Add New Region</h2>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--outline)', marginTop: 4 }}>Global Meteorological Database</p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--outline)', cursor: 'pointer' }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)',
          padding: '16px 20px', marginBottom: 24,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24, color: 'var(--outline)' }}>search</span>
          <input
            autoFocus
            value={q}
            onChange={change}
            placeholder="Type city name..."
            style={{
              background: 'none', border: 'none', outline: 'none', color: 'var(--on-surface)',
              fontSize: 16, width: '100%', fontFamily: 'inherit', fontWeight: 600
            }}
          />
          {busy && <div style={{ width: 20, height: 20, border: '2px solid var(--outline-variant)', borderTopColor: 'var(--primary)', animation: 'spin .7s linear infinite' }} />}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {res.map((c, i) => (
            <button key={i} onClick={() => pick(c)} style={{
              display: 'flex', alignItems: 'center', gap: 16, width: '100%', textAlign: 'left',
              padding: '16px 20px', background: 'var(--surface-container-low)', border: 'none',
              color: 'var(--on-surface)', cursor: 'pointer', transition: 'all 0.2s ease',
            }} onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-container)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-container-low)'}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>location_on</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 13 }}>{c.name}</div>
                <div style={{ fontSize: 10, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{c.state ? `${c.state}, ` : ''}{c.country}</div>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>add_circle</span>
            </button>
          ))}
          {q.trim() && !busy && res.length === 0 && (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--outline)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              No results found for "{q}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HourlySlot({ h }) {
  const { unit } = useTheme();
  const [hov, setHov] = useState(false);
  const pop = h.precip || 0;

  const formatTemp = (celsius) => {
    if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
    return Math.round(celsius);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      minWidth: 110, padding: '18px 12px', flex: '1 0 auto',
      background: hov ? 'var(--primary-container)' : 'var(--surface-container-low)',
      color: hov ? 'var(--on-primary)' : 'var(--on-surface)',
      border: '1px solid var(--outline-variant)',
      cursor: 'default',
      position: 'relative',
    }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: hov ? 'rgba(255,255,255,0.8)' : 'var(--outline)' }}>{fmtHour(h.dt)}</span>

      <WeatherIcon data={h} size={40} />

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', color: 'inherit' }}>{formatTemp(h.temp)}°</div>
        <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4, color: hov ? 'rgba(255,255,255,0.75)' : 'var(--on-surface-variant)' }}>{h.label}</div>
      </div>

      {pop > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2, padding: '3px 8px', background: hov ? 'rgba(255,255,255,0.15)' : 'var(--surface-container-highest)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>water_drop</span>
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em' }}>{pop}%</span>
        </div>
      )}
    </div>
  );
}


function ForecastModal({ day, onClose, hourlyData }) {

  useEffect(() => {
    const content = document.getElementById('dashboard-content');
    if (content) {
      const originalStyle = content.style.overflowY;
      content.style.overflowY = 'hidden';
      return () => { content.style.overflowY = originalStyle; };
    }
  }, []);

  if (!day) return null;

  const dayHourly = hourlyData.filter(h => {
    const d = new Date(h.dt * 1000);
    const dayDate = new Date(day.dt * 1000);
    return d.getDate() === dayDate.getDate();
  });

  const accent = day.group === 'clear' ? '#45645e' : day.group === 'rain' ? '#84a59d' : day.group === 'thunder' ? '#a855f7' : '#94a3b8';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: 'rgba(5, 7, 6, 0.4)', backdropFilter: 'blur(24px)',
      padding: '40px 20px', animation: 'fadeUp 0.3s ease-out',
      overflowY: 'auto',
    }} onClick={onClose}>

      <div
        className="slab--glass"
        style={{
          width: '100%', maxWidth: 760,
          margin: 'auto',
          position: 'relative',
          overflow: 'hidden',
          animation: 'slabIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: 'var(--surface-container-highest)',
          border: '1px solid var(--outline-variant)', color: 'var(--on-surface-variant)', width: 36, height: 36,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
        </button>

        <div style={{ padding: '32px 40px', background: 'var(--primary-container)', color: 'var(--on-primary)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
            <div style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WeatherIcon data={day} size={88} />
            </div>
            <div style={{ flex: '1 0 200px' }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', opacity: 0.7 }}>Detail</div>
              <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase', marginTop: 4 }}>{dayLabel(day.dt)}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>{fmtDate(day.dt)}</span>
                <span style={{ width: 4, height: 4, background: 'rgba(255,255,255,0.5)' }} />
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{day.label}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flex: '1 0 100px' }}>
              <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em' }}>{Math.round(day.max)}°</div>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', opacity: 0.75, marginTop: 6 }}>Low {Math.round(day.min)}°</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 1, marginBottom: 32, background: 'var(--outline-variant)' }}>
            <Stat icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>water_drop</span>} label="Precipitation" value={`${day.precip}%`} />
            <Stat icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>air</span>} label="Wind" value={`${Math.round(day.max * 1.5)}`} subValue="km/h" />
            <Stat icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>wb_sunny</span>} label="UV" value={day.uv_index.toFixed(1)} />
            <Stat icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>device_thermostat</span>} label="Range" value={`${Math.round(day.max)}/${Math.round(day.min)}°`} />
          </div>

          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--outline-variant)' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--outline)' }}>Section</div>
              <div style={{ fontSize: 16, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: 'var(--on-surface)' }}>Hourly Timeline</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 1, overflowX: 'auto', background: 'var(--outline-variant)' }}>
            {dayHourly.length > 0 ? dayHourly.map((h, i) => (
              <div key={i} style={{
                minWidth: 100, padding: '16px 12px', background: 'var(--surface)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--outline)' }}>{fmtHour(h.dt)}</span>
                <WeatherIcon data={h} size={36} />
                <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--on-surface)', letterSpacing: '-0.03em' }}>{h.temp}°</span>
              </div>
            )) : (
              <div style={{ color: 'var(--on-surface-variant)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'var(--surface)', padding: '24px', width: '100%', textAlign: 'center', border: '1px dashed var(--outline-variant)' }}>
                No hourly data.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



function ForecastDayCard({ d, idx, onClick }) {
  const [hov, setHov] = useState(false);
  const pop = d.precip || 0;
  const date = fmtDate(d.dt);
  const label = idx === 0 ? 'Today' : dayLabel(d.dt);
  const isToday = idx === 0;

  return (
    <div
      onClick={() => onClick(d)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'stretch',
        gap: 10, minWidth: 0, padding: '18px 14px',
        background: isToday ? 'var(--primary-container)' : hov ? 'var(--surface-container-low)' : 'var(--surface)',
        color: isToday ? 'var(--on-primary)' : 'var(--on-surface)',
        border: '1px solid var(--outline-variant)',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'inherit' }}>{label}</span>
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.65 }}>{date}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 0' }}>
        <WeatherIcon data={d} size={48} />
      </div>

      <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, textAlign: 'center' }}>{Math.round(d.max)}°</span>

      <div style={{
        background: isToday ? 'rgba(255,255,255,0.15)' : 'var(--surface-container-highest)',
        padding: '6px 8px',
        textAlign: 'center', width: '100%',
      }}>
        <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.label}</div>
        <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Lo {Math.round(d.min)}°</div>
      </div>

      {pop > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>water_drop</span> {pop}%
        </div>
      )}
    </div>
  );
}

function SidebarSavedItem({ city, onSelect, active }) {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    let alive = true;
    setFailed(false);
    getWeatherData(city.lat, city.lon)
      .then(res => { if (alive) setData(res.current); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, [city.lat, city.lon]);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%',
        marginBottom: 2,
        background: active ? 'var(--primary-container)' : hov ? 'var(--secondary-container)' : 'transparent',
        color: active ? 'var(--on-primary)' : 'var(--on-surface)',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background 0.15s ease',
      }}
    >
      <div onClick={() => onSelect(city)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px' }}>
        {data ? (
          <>
            <WeatherIcon data={data} size={26} />
            <div style={{ overflow: 'hidden', flex: 1, lineHeight: 1.2 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{city.name}</div>
              <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '-0.02em' }}>{Math.round(data.temp)}°</div>
            </div>
          </>
        ) : failed ? (
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{city.name}</div>
            <div style={{ fontSize: 9, color: 'var(--error)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Offline</div>
          </div>
        ) : (
          <div style={{ fontSize: 10, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Loading…</div>
        )}
      </div>
      {hov && (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect({ ...city, _remove: true }); }}
          style={{
            background: 'var(--error)',
            border: 'none',
            color: 'var(--on-error)',
            width: 36,
            alignSelf: 'stretch',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Remove"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
        </button>
      )}
    </div>
  );
}

function SavedLocationCard({ city, onSelect, onRemove }) {
  const { unit } = useTheme();
  const [data, setData] = useState(null);

  const formatTemp = (celsius) => {
    if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
    return Math.round(celsius);
  };
  const [hov, setHov] = useState(false);

  useEffect(() => {
    getWeatherData(city.lat, city.lon).then(res => setData(res.current));
  }, [city.lat, city.lon]);

  if (!data) return <div style={{ minHeight: '240px', background: 'var(--surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading...</div>;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--surface-container-low)',
        color: 'var(--on-surface)',
        padding: '24px', minHeight: '240px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: '16px', right: '16px', opacity: hov ? 1 : 0, transition: 'opacity 0.2s' }}>
        <button onClick={onRemove} style={{ background: 'var(--error)', color: 'var(--on-error)', border: 'none', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
        </button>
      </div>

      <div onClick={onSelect} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '4px' }}>{city.name}</h3>
          <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--outline)' }}>{city.country}</p>
        </div>
        <WeatherIcon data={data} size={48} />
      </div>

      <div onClick={onSelect} style={{ cursor: 'pointer', marginTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '48px', fontWeight: 900, tracking: '-0.04em' }}>{Math.round(formatTemp(data.temp))}°</span>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)' }}>{data.label}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--outline-variant)' }}>
          <div style={{ background: 'var(--surface-container-low)', padding: '8px 0' }}>
            <span style={{ display: 'block', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--outline)', marginBottom: '4px' }}>Wind</span>
            <span style={{ fontSize: '13px', fontWeight: 800 }}>{Math.round(data.wind_speed)} km/h</span>
          </div>
          <div style={{ background: 'var(--surface-container-low)', padding: '8px 0', paddingLeft: '12px' }}>
            <span style={{ display: 'block', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--outline)', marginBottom: '4px' }}>Humidity</span>
            <span style={{ fontSize: '13px', fontWeight: 800 }}>{data.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SavedLocationRow({ city, onRemove }) {
  const { unit } = useTheme();
  const [data, setData] = useState(null);

  const formatTemp = (celsius) => {
    if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
    return Math.round(celsius);
  };

  useEffect(() => {
    getWeatherData(city.lat, city.lon).then(res => setData(res.current));
  }, [city.lat, city.lon]);

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '3fr 2fr 2fr 2fr 2fr 1fr', gap: '16px',
      padding: '20px 24px', background: 'var(--surface)', alignItems: 'center',
      borderBottom: '1px solid var(--surface-container-highest)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '15px', fontWeight: 800 }}>{city.name}</span>
        <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--outline)' }}>{city.country}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {data && <WeatherIcon data={data} size={20} />}
        <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{data?.label || '...'}</span>
      </div>
      <div style={{ fontSize: '18px', fontWeight: 900 }}>{data ? formatTemp(data.temp) : '...'}°</div>
      <div style={{ fontSize: '13px', fontWeight: 700 }}>{data ? Math.round(data.wind_speed) : '...'} km/h</div>
      <div style={{ fontSize: '13px', fontWeight: 700 }}>{data ? data.humidity : '...'}%</div>
      <div style={{ textAlign: 'right' }}>
        <button onClick={onRemove} style={{ background: 'transparent', border: 'none', color: 'var(--outline)', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--error)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--outline)'}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
        </button>
      </div>
    </div>
  );
}

const FC_FILTERS = [
  { id: 'next7', label: 'Next 7 days' },
  { id: '14days', label: '14 Days' },
];

const HR_FILTERS = [
  { id: '24h', label: '24h (today)' },
  { id: '48h', label: '48h' },
];


export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('dashboard');
  const [now, setNow] = useState(getNow());
  const [mapLayer, setMapLayer] = useState('precipitation_new');
  const [mapFull, setMapFull] = useState(false);
  const [fcFilter, setFcFilter] = useState('next7');
  const [hrFilter, setHrFilter] = useState('24h');
  const [selectedDay, setSelectedDay] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [savedFilter, setSavedFilter] = useState('');
  const [savedSort, setSavedSort] = useState('name');
  const [searchOpen, setSearchOpen] = useState(false);
  const [permissionOpen, setPermissionOpen] = useState(false);
  const hourlyRef = useRef(null);

  const { saved, toggleSave } = useSavedCitiesViewModel();
  const { darkMode, unit } = useTheme();

  useEffect(() => { const t = setInterval(() => setNow(getNow()), 30000); return () => clearInterval(t); }, []);

  const lastCoords = useRef(null);
  const load = useCallback(async (lat, lon, name = null) => {
    lastCoords.current = { lat, lon, name };
    setLoading(true); setError(null);
    try {
      const res = await getWeatherData(lat, lon);
      if (!name) {
        try {
          const geo = await reverseGeocode(lat, lon);
          res.current.name = geo?.name || res.name;
          res.current.country = geo?.country;
        } catch {
          res.current.name = res.name;
        }
      } else {
        res.current.name = name;
      }
      setData(res);
    } catch (e) {
      const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
      setError(offline
        ? 'You appear to be offline. Check your internet connection.'
        : 'Could not reach the weather service. Please try again.');
    }
    finally { setLoading(false); }
  }, []);

  const retryLoad = useCallback(() => {
    const c = lastCoords.current;
    if (c) load(c.lat, c.lon, c.name);
  }, [load]);

  const handleSelect = useCallback(c => load(c.lat, c.lon, c.name), [load]);

  const locateMe = useCallback(async () => {
    setLoading(true);
    const fallback = () => {
      const random = RANDOM_LOCATIONS[Math.floor(Math.random() * RANDOM_LOCATIONS.length)];
      load(random.lat, random.lon, random.name);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => load(coords.latitude, coords.longitude),
        async (err) => {
          if (err.code === 1) {
            setPermissionOpen(true);
            setLoading(false);
          } else {
            const ip = await getIpLocation();
            if (ip) load(ip.lat, ip.lon, ip.city);
            else fallback();
          }
        },
        { timeout: 8000 }
      );
    } else {
      const ip = await getIpLocation();
      if (ip) load(ip.lat, ip.lon, ip.city);
      else fallback();
    }
  }, [load]);

  useEffect(() => { locateMe(); }, []); // eslint-disable-line

  const weather = data?.current;

  const hourly = (data?.hourly || []).slice(0, hrFilter === '24h' ? 24 : 48);
  const daily = (data?.daily || []).slice(0, fcFilter === 'next7' ? 7 : 14);

  const filteredSaved = saved
    .filter(c => c.name.toLowerCase().includes(savedFilter.toLowerCase()) || c.country.toLowerCase().includes(savedFilter.toLowerCase()))
    .sort((a, b) => {
      if (savedSort === 'name') return a.name.localeCompare(b.name);
      if (savedSort === 'country') return a.country.localeCompare(b.country);
      return 0;
    });

  const formatTemp = (celsius) => {
    if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
    return Math.round(celsius);
  };

  const S = {
    sectionHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 900, color: 'var(--on-surface)', letterSpacing: '-0.02em', textTransform: 'uppercase' },
    filterGroup: { display: 'flex', gap: 0, background: 'var(--surface-container-highest)', padding: 2, border: '1px solid var(--outline-variant)' },
    card: { background: 'var(--surface)', border: '1px solid var(--outline-variant)', padding: '28px' },
  };

  const NavItem = ({ icon, label, active, onClick }) => {
    const [hov, setHov] = useState(false);
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          background: active ? 'var(--primary)' : hov ? 'rgba(0,0,0,0.05)' : 'transparent',
          color: active ? 'var(--on-primary)' : 'var(--on-surface)',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'left',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
        <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</span>
      </button>
    );
  };

  const FilterBtn = ({ id, label, active, onClick }) => {
    const [hov, setHov] = useState(false);
    return (
      <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
        padding: '7px 14px', border: 'none',
        background: active ? 'var(--primary-container)' : hov ? 'var(--surface-container-low)' : 'transparent',
        color: active ? 'var(--on-primary)' : 'var(--on-surface-variant)',
        fontSize: 10, fontWeight: active ? 800 : 700, textTransform: 'uppercase', letterSpacing: '0.1em',
        cursor: 'pointer', fontFamily: 'inherit',
      }}>{label}</button>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter',system-ui,sans-serif", background: 'var(--bg-app)', color: 'var(--text-main)', fontSize: '18px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:var(--text-muted)}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
        .fade-up{animation:fadeUp .45s ease forwards}
        .slide-in{animation:slideIn .35s ease forwards}
        input::placeholder{color:var(--text-dim)}
        button{font-family:inherit}
      `}</style>

      <aside className="slab--glass" style={{ width: 256, flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '32px 0', overflowY: 'auto', border: 'none', borderRight: '1px solid var(--outline-variant)', zIndex: 10 }}>
        <div style={{ padding: '0 32px', marginBottom: 32 }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--primary-container)', textTransform: 'uppercase' }}>Weathix</h1>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)', marginTop: 4 }}>Architectural Ledger</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 16px', marginBottom: 24 }}>
          <NavItem icon={<span className="material-symbols-outlined" style={{ fontSize: 20 }}>dashboard</span>} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavItem icon={<span className="material-symbols-outlined" style={{ fontSize: 20 }}>map</span>} label="Maps" active={view === 'map'} onClick={() => setView('map')} />
          <NavItem icon={<span className="material-symbols-outlined" style={{ fontSize: 20 }}>bookmark</span>} label="Saved Locations" active={view === 'saved'} onClick={() => setView('saved')} />
          <NavItem icon={<span className="material-symbols-outlined" style={{ fontSize: 20 }}>calendar_today</span>} label="Calendar" active={view === 'calendar'} onClick={() => setView('calendar')} />
          <NavItem icon={<span className="material-symbols-outlined" style={{ fontSize: 20 }}>help</span>} label="Support" active={view === 'support'} onClick={() => setView('support')} />
          <NavItem icon={<span className="material-symbols-outlined" style={{ fontSize: 20 }}>settings</span>} label="Settings" active={view === 'settings'} onClick={() => setView('settings')} />
        </nav>

        {saved.length > 0 && (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--outline)', padding: '0 32px', marginBottom: 10 }}>Saved</div>
            <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 240, overflowY: 'auto', padding: '0 16px' }}>
              {saved.map((c) => (
                <SidebarSavedItem
                  key={`${c.lat}-${c.lon}`}
                  city={c}
                  active={weather && weather.lat === c.lat && weather.lon === c.lon}
                  onSelect={(city) => {
                    if (city._remove) toggleSave(city);
                    else { handleSelect(city); setView('dashboard'); }
                  }}
                />
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: 'auto', padding: '0 16px' }}>
          <button
            onClick={locateMe}
            style={{
              width: '100%',
              background: 'var(--primary)',
              color: 'var(--on-primary)',
              border: 'none',
              padding: '14px',
              fontSize: '11px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>my_location</span>
            Locate Me
          </button>
        </div>

        <div style={{ marginTop: 'auto', padding: '24px 20px 0 20px', borderTop: '1px solid var(--outline-variant)' }}>
          <p style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--outline)', marginBottom: '8px' }}>Developer</p>
          <a
            href="https://www.lahoucinechouker.online/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '11px', fontWeight: 900, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Lahoucine Chouker
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
          </a>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', background: 'var(--background)', borderBottom: '1px solid var(--outline-variant)', flexShrink: 0, position: 'sticky', top: 0, zIndex: 100, gap: 16 }}>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--on-surface)', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
              {view === 'support' ? 'Support' : view === 'settings' ? 'Settings' : view === 'map' ? 'Maps' : view === 'calendar' ? 'Calendar' : view === 'saved' ? 'Saved Locations' : 'Dashboard'}
            </h1>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--outline)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {view === 'support' ? 'Technical Assistance & Queries'
                : view === 'settings' ? 'System Configuration'
                  : `${now.day} • ${now.date} • ${now.time}`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {weather && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)' }}>
                <WeatherIcon data={weather} size={28} />
                <div style={{ lineHeight: 1.1 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>{Math.round(weather.temp)}°</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{weather.name}</div>
                </div>
              </div>
            )}
            <SearchBar onSelect={(c) => { handleSelect(c); setView('dashboard'); }} />
          </div>
        </header>

        <div id="dashboard-content" style={{ flex: 1, overflowY: 'auto', padding: view === 'map' ? 0 : '28px 32px 40px', display: 'flex', flexDirection: 'column', gap: view === 'map' ? 0 : 28 }}>
          {loading && !weather && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '55vh', gap: 16 }}>
              <div style={{ width: 36, height: 36, border: '2px solid var(--outline-variant)', borderTopColor: 'var(--primary-container)', animation: 'spin .9s linear infinite' }} />
              <p style={{ color: 'var(--on-surface-variant)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Detecting your location…</p>
            </div>
          )}
          {error && (
            <div style={{ background: 'var(--error-container)', border: '1px solid var(--error)', color: 'var(--on-error-container)', padding: '14px 18px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                {error}
              </span>
              <button onClick={retryLoad} style={{ background: 'var(--error)', border: 'none', color: 'var(--on-primary)', padding: '8px 14px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'inherit' }}>
                Retry
              </button>
            </div>
          )}

          {view === 'dashboard' && weather && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 430px)', gap: 20, alignItems: 'stretch' }}>
                <div className="card--glass" style={{ padding: '32px 36px', background: 'var(--primary-container)', color: 'var(--on-primary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 380, border: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'uppercase', marginBottom: 4, color: 'var(--on-primary)' }}>
                        {weather.name}{weather.country ? `, ${weather.country}` : ''}
                      </h2>
                      <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.7)' }}>
                        {weather.label} • {weather.isNight ? 'Night' : 'Day'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {!saved.find(s => s.lat === weather.lat && s.lon === weather.lon) && (
                        <button
                          onClick={() => toggleSave(weather)}
                          style={{
                            background: 'var(--secondary-container)',
                            color: 'var(--primary-container)',
                            padding: '8px 14px',
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>bookmark_add</span>
                          Save
                        </button>
                      )}
                      <WeatherIcon data={weather} size={96} style={{ filter: 'brightness(1.1)' }} />
                    </div>
                  </div>

                  <div style={{ marginTop: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 110, fontWeight: 900, lineHeight: 0.85, letterSpacing: '-0.05em', color: 'var(--on-primary)' }}>{formatTemp(weather.temp)}</span>
                      <span style={{ fontSize: 40, fontWeight: 600, marginTop: 12, color: 'rgba(255,255,255,0.6)' }}>°{unit}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(255,255,255,0.12)', padding: '6px 12px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Feels {Math.round(weather.feels_like)}°
                      </span>
                      <span style={{ background: 'rgba(255,255,255,0.12)', padding: '6px 12px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 12, verticalAlign: 'middle', marginRight: 4 }}>wb_sunny</span>
                        {new Date(weather.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span style={{ background: 'rgba(255,255,255,0.12)', padding: '6px 12px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 12, verticalAlign: 'middle', marginRight: 4 }}>nights_stay</span>
                        {new Date(weather.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, marginTop: 32, background: 'rgba(255,255,255,0.12)' }}>
                    <Stat icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>water_drop</span>} label="Humidity" value={`${weather.humidity}%`} subValue={`Dew ${formatTemp(weather.dew_point)}°`} accent="rgba(255,255,255,0.1)" />
                    <Stat icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>air</span>} label="Wind" value={`${Math.round(weather.wind_speed)}`} subValue={`${weather.wind_deg}° km/h`} accent="rgba(255,255,255,0.1)" />
                    <Stat icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>wb_sunny</span>} label="UV Index" value={weather.uv_index.toFixed(1)} subValue={weather.uv_index < 3 ? 'Low' : weather.uv_index < 6 ? 'Moderate' : weather.uv_index < 8 ? 'High' : 'Very High'} accent="rgba(255,255,255,0.1)" />
                    <Stat icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>visibility</span>} label="Visibility" value={`${(weather.visibility / 1000).toFixed(1)}`} subValue={weather.visibility > 10000 ? 'Excellent' : weather.visibility > 5000 ? 'Good' : 'Reduced'} accent="rgba(255,255,255,0.1)" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, marginTop: 1, background: 'rgba(255,255,255,0.12)' }}>
                    <Stat icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>speed</span>} label="Pressure" value={`${weather.pressure}`} subValue={weather.pressure > 1013 ? 'High' : weather.pressure < 1000 ? 'Low' : 'Normal'} accent="rgba(255,255,255,0.1)" />
                    <Stat icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>cloud</span>} label="Clouds" value={`${weather.clouds || 0}%`} subValue={weather.clouds < 25 ? 'Clear' : weather.clouds < 50 ? 'Partly' : weather.clouds < 75 ? 'Mostly' : 'Overcast'} accent="rgba(255,255,255,0.1)" />
                    <Stat icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>schedule</span>} label="Daylight" value={`${Math.round((new Date(weather.sunset) - new Date(weather.sunrise)) / 3600000)}h`} subValue="Sun hours" accent="rgba(255,255,255,0.1)" />
                    <Stat icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>rainy</span>} label="Precip" value={`${weather.precipitation || 0}%`} subValue={weather.precipitation > 50 ? 'Likely' : weather.precipitation > 20 ? 'Possible' : 'Unlikely'} accent="rgba(255,255,255,0.1)" />
                  </div>
                </div>
                <div style={{ overflow: 'hidden', background: 'var(--surface)', border: mapFull ? 'none' : '1px solid var(--outline-variant)', position: mapFull ? 'fixed' : 'relative', top: mapFull ? 0 : 'auto', left: mapFull ? 0 : 'auto', right: mapFull ? 0 : 'auto', bottom: mapFull ? 0 : 'auto', zIndex: mapFull ? 9999 : 'auto', minHeight: mapFull ? '100vh' : '350px', height: mapFull ? '100vh' : '100%' }}>
                  <MapContainer center={[weather.lat, weather.lon]} zoom={6} zoomControl={true} style={{ width: '100%', height: '100%', minHeight: mapFull ? '100vh' : '350px' }} touchZoom={true} scrollWheelZoom={true} doubleClickZoom={true}>
                    <Recenter lat={weather.lat} lon={weather.lon} />
                    <TileLayer url={`https://{s}.basemaps.cartocdn.com/${darkMode ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`} />
                    <TileLayer key={mapLayer} url={weatherTileUrl(mapLayer)} />
                    <Marker position={[weather.lat, weather.lon]} />
                  </MapContainer>
                  <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 4, background: 'var(--surface)', border: '1px solid var(--outline-variant)', padding: 4 }}>
                    {MAP_LAYERS.map(l => (
                      <button key={l.id} onClick={(e) => { e.stopPropagation(); setMapLayer(l.id); }} style={{ background: mapLayer === l.id ? 'var(--primary-container)' : 'transparent', border: 'none', color: mapLayer === l.id ? 'var(--on-primary)' : 'var(--on-surface-variant)', padding: '7px 12px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', minWidth: 110, textAlign: 'left' }}>{l.label}</button>
                    ))}
                  </div>
                  <div style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1000, display: 'flex', gap: 0, background: 'var(--surface)', border: '1px solid var(--outline-variant)' }}>
                    <button onClick={(e) => { e.stopPropagation(); setMapFull(!mapFull); }} title={mapFull ? 'Exit Fullscreen' : 'Fullscreen'} style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-variant)', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--outline-variant)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{mapFull ? 'close_fullscreen' : 'open_in_full'}</span>
                    </button>
                    <button onClick={locateMe} title="Zoom to my location" style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-variant)', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>my_location</span>
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--surface)', border: '1px solid var(--outline-variant)', padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--outline-variant)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--primary-container)' }}>schedule</span>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--outline)' }}>Section 02</div>
                      <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase', color: 'var(--on-surface)' }}>24-Hour Timeline</div>
                    </div>
                  </div>
                  <div style={S.filterGroup}>{HR_FILTERS.map(f => <FilterBtn key={f.id} {...f} active={hrFilter === f.id} onClick={() => setHrFilter(f.id)} />)}</div>
                </div>
                <div ref={hourlyRef} style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 10 }}>{hourly.map((h, i) => <HourlySlot key={i} h={h} />)}</div>
              </div>

              <div style={{ background: 'var(--surface)', border: '1px solid var(--outline-variant)', padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--outline-variant)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--primary-container)' }}>calendar_today</span>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--outline)' }}>Section 03</div>
                      <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase', color: 'var(--on-surface)' }}>7-Day Outlook</div>
                    </div>
                  </div>
                  <div style={S.filterGroup}>{FC_FILTERS.map(f => <FilterBtn key={f.id} {...f} active={fcFilter === f.id} onClick={() => setFcFilter(f.id)} />)}</div>
                </div>
                {daily.length <= 7 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${daily.length}, minmax(0, 1fr))`, gap: 12 }}>
                    {daily.map((d, i) => <ForecastDayCard key={i} d={d} idx={i} onClick={setSelectedDay} />)}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
                    {daily.map((d, i) => <div key={i} style={{ flex: '0 0 140px' }}><ForecastDayCard d={d} idx={i} onClick={setSelectedDay} /></div>)}
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'map' && weather && (
            <div className="fade-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', height: '100%', minHeight: 'calc(100vh - 80px)' }}>
              <MapContainer center={[weather.lat, weather.lon]} zoom={6} zoomControl={true} style={{ width: '100%', height: '100%', flex: 1, zIndex: 0 }} touchZoom={true} scrollWheelZoom={true} doubleClickZoom={true}>
                <Recenter lat={weather.lat} lon={weather.lon} />
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <TileLayer key={mapLayer} url={weatherTileUrl(mapLayer)} />
                <Marker position={[weather.lat, weather.lon]} />
              </MapContainer>
              <div style={{ position: 'absolute', bottom: 24, left: 24, zIndex: 1000, background: 'var(--surface)', border: '1px solid var(--outline-variant)', padding: 0, minWidth: 240 }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--outline-variant)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-container-low)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary-container)' }}>layers</span>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--outline)' }}>Overlay</div>
                    <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: 'var(--on-surface)' }}>Map Layers</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {MAP_LAYERS.map(l => (
                    <button key={l.id} onClick={() => setMapLayer(l.id)} style={{
                      background: mapLayer === l.id ? 'var(--primary-container)' : 'transparent',
                      color: mapLayer === l.id ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                      border: 'none', borderBottom: '1px solid var(--outline-variant)',
                      padding: '12px 16px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
                      cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <span style={{ width: 8, height: 8, background: mapLayer === l.id ? 'var(--on-primary)' : 'var(--outline)' }} />
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 1000, display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: '1px solid var(--outline-variant)' }}>
                <button onClick={locateMe} title="Zoom to my location" style={{
                  background: 'transparent', border: 'none', color: 'var(--on-surface-variant)',
                  width: 48, height: 48, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderBottom: '1px solid var(--outline-variant)',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>my_location</span>
                </button>
                <button onClick={() => setMapFull(f => !f)} title="Fullscreen" style={{
                  background: 'transparent', border: 'none', color: 'var(--on-surface-variant)',
                  width: 48, height: 48, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>open_in_full</span>
                </button>
              </div>
            </div>
          )}

          {view === 'calendar' && (() => {
            const today = new Date();
            const year = calendarDate.getFullYear();
            const month = calendarDate.getMonth();
            const startOfMonth = new Date(year, month, 1);
            const endOfMonth = new Date(year, month + 1, 0);
            const monthName = calendarDate.toLocaleDateString('en-US', { month: 'long' });

            const days = [];
            // Padding for previous month
            for (let i = 0; i < startOfMonth.getDay(); i++) {
              days.push({ empty: true, key: `e${i}` });
            }
            // Days of current month
            for (let d = 1; d <= endOfMonth.getDate(); d++) {
              const date = new Date(year, month, d);
              const isToday = date.toDateString() === today.toDateString();
              const forecast = data?.daily?.find(f => new Date(f.dt * 1000).toDateString() === date.toDateString());
              days.push({ d, date, isToday, forecast, key: `d${d}` });
            }

            return (
              <div className="fade-up" style={{ maxWidth: '1152px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Header Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', paddingBottom: '32px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    <div>
                      <h2 style={{ fontSize: '48px', fontWeight: 900, color: 'var(--on-surface)', tracking: '-0.04em', marginBottom: '8px' }}>{monthName} {year}</h2>
                      <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--secondary)' }}>{weather?.name || 'Local'} • Long Range Forecast</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--surface-container-low)', padding: '4px' }}>
                      <button onClick={() => setCalendarDate(new Date(year, month - 1, 1))} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
                      </button>
                      <span style={{ px: '16px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Today</span>
                      <button onClick={() => setCalendarDate(new Date(year, month + 1, 1))} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid Container */}
                  <div style={{ background: 'var(--surface-container-low)', padding: '4px' }}>
                    {/* Days of Week Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} style={{ background: 'var(--surface)', padding: '12px 0', textAlign: 'center', fontSize: '10px', fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>{d}</div>
                      ))}
                    </div>
                    {/* Days Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                      {days.map(item => {
                        if (item.empty) {
                          return <div key={item.key} style={{ background: 'var(--surface-container-highest)', minHeight: '120px', padding: '12px', opacity: 0.4 }}>
                            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--outline)' }}>·</span>
                          </div>;
                        }
                        const { d, isToday, forecast } = item;
                        return (
                          <div
                            key={item.key}
                            onClick={() => forecast && setSelectedDay(forecast)}
                            style={{
                              background: isToday ? 'var(--primary-container)' : 'var(--surface)',
                              color: isToday ? 'var(--on-primary)' : 'var(--on-surface)',
                              minHeight: '120px', padding: '12px',
                              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                              cursor: forecast ? 'pointer' : 'default',
                              border: isToday ? 'none' : '1px solid transparent',
                              transition: 'all 0.2s ease',
                              position: 'relative',
                            }}
                            onMouseEnter={e => !isToday && (e.currentTarget.style.background = 'var(--surface-container-highest)')}
                            onMouseLeave={e => !isToday && (e.currentTarget.style.background = 'var(--surface)')}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <span style={{ fontSize: '18px', fontWeight: 900, lineHeight: 1 }}>{d}</span>
                              {isToday && <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary-container)' }}>Today</span>}
                            </div>
                            {forecast && (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <WeatherIcon data={forecast} size={32} />
                                <div style={{ display: 'flex', gap: '8px', fontSize: '13px', fontWeight: 800 }}>
                                  <span>{Math.round(forecast.max)}°</span>
                                  <span style={{ opacity: 0.5 }}>{Math.round(forecast.min)}°</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contextual Data Slabs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '32px' }}>
                    <div style={{ background: 'var(--surface-container-low)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--outline)' }}>Monthly Avg High</span>
                      <span style={{ fontSize: '48px', fontWeight: 900, color: 'var(--on-surface)', tracking: '-0.04em' }}>22°</span>
                    </div>
                    <div style={{ background: 'var(--surface-container-low)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--outline)' }}>Monthly Avg Low</span>
                      <span style={{ fontSize: '48px', fontWeight: 900, color: 'var(--on-surface)', tracking: '-0.04em' }}>14°</span>
                    </div>
                    <div style={{ background: 'var(--surface-container-low)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--outline)' }}>Precipitation Days</span>
                      <span style={{ fontSize: '48px', fontWeight: 900, color: 'var(--on-surface)', tracking: '-0.04em' }}>8</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {view === 'saved' && (
            <div className="fade-up" style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
                  <div>
                    <h2 style={{ fontSize: '48px', fontWeight: 900, color: 'var(--on-surface)', tracking: '-0.04em', marginBottom: '8px' }}>Saved Locations</h2>
                    <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--outline)' }}>Managing {filteredSaved.length} regions</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', padding: '0 12px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--outline)' }}>search</span>
                      <input
                        value={savedFilter}
                        onChange={(e) => setSavedFilter(e.target.value)}
                        placeholder="Filter list..."
                        style={{ background: 'transparent', border: 'none', padding: '10px 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface)', outline: 'none', width: '160px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', padding: '0 12px', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--outline)' }}>sort_by_alpha</span>
                      <select
                        value={savedSort}
                        onChange={(e) => setSavedSort(e.target.value)}
                        style={{ background: 'transparent', border: 'none', padding: '10px 0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface)', outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="name">Sort by Name</option>
                        <option value="country">Sort by Country</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                  {/* Add City Card */}
                  <button
                    onClick={() => setSearchOpen(true)}
                    style={{ background: 'var(--surface-container-low)', border: '1px dashed var(--outline-variant)', minHeight: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '16px' }}
                  >
                    <div style={{ width: '64px', height: '64px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--outline-variant)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--primary)' }}>add</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ display: 'block', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface)' }}>Add New City</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--outline)' }}>Global Database</span>
                    </div>
                  </button>

                  {filteredSaved.map((c, i) => (
                    <SavedLocationCard key={`${c.lat}-${c.lon}`} city={c} onSelect={() => { load(c.lat, c.lon, c.name); setView('dashboard'); }} onRemove={() => toggleSave(c)} />
                  ))}
                </div>

                <div style={{ marginTop: '32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '24px' }}>Detailed Register</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {/* Table Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 2fr 2fr 2fr 1fr', gap: '16px', padding: '12px 24px', background: 'var(--surface-container-lowest)', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--outline)', borderBottom: '1px solid var(--surface-container-highest)' }}>
                      <div>Location</div>
                      <div>Condition</div>
                      <div>Temp</div>
                      <div>Wind</div>
                      <div>Humidity</div>
                      <div style={{ textAlign: 'right' }}>Action</div>
                    </div>
                    {/* Table Rows */}
                    {filteredSaved.map((c, i) => (
                      <SavedLocationRow key={`${c.lat}-${c.lon}`} city={c} onRemove={() => toggleSave(c)} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}


          {view === 'support' && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <Support />
            </div>
          )}

          {view === 'settings' && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <Settings setView={setView} />
            </div>
          )}

          {view === 'privacy' && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <Privacy setView={setView} />
            </div>
          )}

          {view === 'about' && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <About />
            </div>
          )}
        </div>
      </main>

      <ChatAgent weather={data?.current} />
      {selectedDay && <ForecastModal day={selectedDay} onClose={() => setSelectedDay(null)} hourlyData={data?.hourly} />}
      {searchOpen && <CitySearchModal onClose={() => setSearchOpen(false)} onSelect={(c) => { handleSelect(c); setView('dashboard'); }} />}
      {permissionOpen && <PermissionModal onClose={() => setPermissionOpen(false)} />}
    </div>
  );
}
