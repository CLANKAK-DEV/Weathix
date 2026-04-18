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
          background: 'rgba(0,98,255,0.9)', border: 'none', color: '#fff',
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


function MapControlWrapper({ setMapLayer, mapLayer, setMapFull, mapFull, onLocate }) {
  const map = useMap();
  
  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  
  return <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onLocate={onLocate} setMapLayer={setMapLayer} mapLayer={mapLayer} setMapFull={setMapFull} mapFull={mapFull} />;
}


const Ic = {
  Dashboard: (props) => <IconWrapper src="/icons/dashboard.png" alt="Dashboard" {...props} />,
  Map:       (props) => <IconWrapper src="/icons/map_line.png" alt="Map" size={18} {...props} />,
  Pin:       (props) => <IconWrapper src="/icons/pin_line.png" alt="Saved" size={18} {...props} />,
  Calendar:  (props) => <IconWrapper src="/icons/calendar_line.png" alt="Calendar" size={18} {...props} />,
  Settings:  (props) => <IconWrapper src="/icons/settings_line.png" alt="Settings" size={18} {...props} />,
  Help:      (props) => <IconWrapper src="/icons/question_line.png" alt="FAQ" size={18} {...props} />,
  Bell:      (props) => <IconWrapper src="/icons/bell_line.png" alt="Alerts" size={18} {...props} />,
  Search:    (props) => <IconWrapper src="/icons/search_line.png" alt="Search" size={16} {...props} />,
  Locate:    (props) => <IconWrapper src="/icons/locate_line.png" alt="Locate" size={18} {...props} />,
  Expand:    (props) => <IconWrapper src="/icons/expand_line.png" alt="Expand" size={18} {...props} />,
  Collapse:  (props) => <IconWrapper src="/icons/expand_line.png" alt="Collapse" size={18} style={{ transform: 'rotate(180deg)' }} {...props} />,
  Wind:      (props) => <IconWrapper src="/icons/wind.png" alt="Wind" size={22} {...props} />,
  Eye:       (props) => <IconWrapper src="/icons/visibility.png" alt="Visibility" size={22} {...props} />,
  Drop:      (props) => <IconWrapper src="/icons/humidity.png" alt="Humidity" size={22} {...props} />,
  Gauge:     (props) => <IconWrapper src="/icons/uv.png" alt="UV Index" size={22} {...props} />,
  Thermo:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>,
  Pressure:  (props) => <IconWrapper src="/icons/pressure.png" alt="Pressure" size={22} {...props} />,
  Plus:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Rain:      (props) => <IconWrapper src="/icons/precipitation.png" alt="Precipitation" size={22} {...props} />,
  Sunrise:   (props) => <IconWrapper src="/icons/daylight.png" alt="Sunrise" size={22} {...props} />,
  Sunset:    (props) => <IconWrapper src="/icons/daylight.png" alt="Sunset" size={22} style={{ transform: 'scaleX(-1)' }} {...props} />,
  Cloud:     (props) => <IconWrapper src="/icons/clouds.png" alt="Clouds" size={22} {...props} />,
  Snow:      (props) => <IconWrapper src="/icons/snow.png" alt="Snow" size={22} {...props} />,
  MapRain:   (props) => <IconWrapper src="/icons/map_rain.png" alt="Rain" size={18} {...props} />,
  ChevronLeft:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Filter:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Trash:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
  Clock:     (props) => <IconWrapper src="/icons/clock.png" alt="Time" size={18} {...props} />,
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
        filter: darkMode ? 'invert(1) contrast(200%) brightness(1.2)' : 'none', 
        mixBlendMode: darkMode ? 'screen' : 'multiply',
        ...style 
      }} 
      {...props} 
    />
  );
}







const MAP_LAYERS = [
  { id: 'precipitation_new', label: 'Rain',   color: '#0062ff', icon: <Ic.Rain width={20} height={20} /> },
  { id: 'temp_new',          label: 'Temp',   color: '#ff9d00', icon: <Ic.Thermo /> },
  { id: 'wind_new',          label: 'Wind',   color: '#10b981', icon: <Ic.Wind width={20} height={20} /> },
  { id: 'clouds_new',        label: 'Clouds', color: '#94a3b8', icon: <Ic.Cloud width={20} height={20} /> },
  { id: 'pressure_new',      label: 'Pressure', color: '#a855f7', icon: <Ic.Pressure width={20} height={20} /> },
];

const RANDOM_LOCATIONS = [
  { name: 'Tokyo', lat: 35.6895, lon: 139.6917, country: 'Japan' },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'France' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'USA' },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'Australia' },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708, country: 'UAE' },
  { name: 'Agadir', lat: 30.4278, lon: -9.5981, country: 'Morocco' },
];


function getBg(group, isNight) {
  const g = (group || '').toLowerCase();
  
  if (isNight) {
    if (g === 'clear')   return 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 45%, #312e81 100%)'; // Deep Space
    if (g === 'clouds')  return 'linear-gradient(145deg, #1e293b 0%, #334155 45%, #475569 100%)'; // Dark Slate
    if (g === 'rain' || g === 'drizzle' || g === 'showers') return 'linear-gradient(145deg, #0c1a35 0%, #172554 45%, #1e3a8a 100%)'; // Deep Ocean
    if (g === 'thunder') return 'linear-gradient(145deg, #1e1b4b 0%, #4c1d95 45%, #581c87 100%)'; // Electric Night
    if (g === 'snow')    return 'linear-gradient(145deg, #1e3a8a 0%, #1e40af 45%, #0062ff 100%)'; // Icy Night
    return 'linear-gradient(145deg, #0f172a 0%, #1e293b 45%, #0c4a6e 100%)';
  } else {
    if (g === 'clear')   return 'linear-gradient(145deg, #0062ff 0%, #2dd4bf 45%, #fde047 100%)'; // Golden Hour / Clear
    if (g === 'clouds')  return 'linear-gradient(145deg, #64748b 0%, #94a3b8 45%, #cbd5e1 100%)'; // Cloudy Day
    if (g === 'rain' || g === 'drizzle' || g === 'showers') return 'linear-gradient(145deg, #0052d9 0%, #0062ff 45%, #3b9eff 100%)'; // Rainy Day
    if (g === 'thunder') return 'linear-gradient(145deg, #4c1d95 0%, #7c3aed 45%, #a855f7 100%)'; // Stormy Day
    if (g === 'snow')    return 'linear-gradient(145deg, #94a3b8 0%, #cbd5e1 45%, #f1f5f9 100%)'; // Snowy Day
    return 'linear-gradient(145deg, #0052d9 0%, #3b9eff 45%, #93c5fd 100%)';
  }
}


function PatternOverlay({ group }) {
  const g = (group || '').toLowerCase();
  if (g === 'clear') return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }}>
      <svg width="100%" height="100%"><defs><pattern id="pClear" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#fff"/></pattern></defs><rect width="100%" height="100%" fill="url(#pClear)"/></svg>
    </div>
  );
  if (g === 'rain' || g === 'drizzle' || g === 'showers') return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
      <svg width="100%" height="100%"><defs><pattern id="pRain" x="0" y="0" width="20" height="40" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="10" y2="40" stroke="#fff" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#pRain)"/></svg>
    </div>
  );
  if (g === 'clouds') return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
      <svg width="100%" height="100%"><defs><pattern id="pClouds" x="0" y="0" width="100" height="60" patternUnits="userSpaceOnUse"><circle cx="50" cy="30" r="20" fill="#fff" opacity="0.3"/><circle cx="30" cy="30" r="15" fill="#fff" opacity="0.3"/><circle cx="70" cy="30" r="15" fill="#fff" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(#pClouds)"/></svg>
    </div>
  );
  return null;
}


function getNow() {
  const d = new Date();
  return {
    date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
    day:  d.toLocaleDateString('en-US', { weekday: 'long' }),
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

function getWeatherAccent(group) {
  if (group === 'clear') return { bg: 'rgba(255,157,0,0.13)', border: 'rgba(255,157,0,0.35)', color: '#ff9d00', glow: 'rgba(255,157,0,0.22)', label: 'Clear / Sunny' };
  if (group === 'rain' || group === 'drizzle' || group === 'showers') return { bg: 'rgba(0,98,255,0.13)', border: 'rgba(0,98,255,0.35)', color: '#0062ff', glow: 'rgba(0,98,255,0.22)', label: 'Rain / Drizzle' };
  if (group === 'thunder') return { bg: 'rgba(168,85,247,0.13)', border: 'rgba(255,157,0,0.35)', color: '#a855f7', glow: 'rgba(168,85,247,0.22)', label: 'Thunderstorm' };
  if (group === 'snow') return { bg: 'rgba(186,230,253,0.13)', border: 'rgba(186,230,253,0.35)', color: '#bae6fd', glow: 'rgba(186,230,253,0.22)', label: 'Snow' };
  if (group === 'fog' || group === 'clouds') return { bg: 'rgba(148,163,184,0.13)', border: 'rgba(148,163,184,0.35)', color: '#94a3b8', glow: 'rgba(148,163,184,0.22)', label: 'Cloudy / Fog' };
  return { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.07)', color: '#94a3b8', glow: 'transparent', label: 'No forecast' };
}

function getDateKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}




function Btn({ onClick, title, children, style = {} }) {
  const [hov, setHov] = useState(false);
  const { darkMode } = useTheme();
  return (
    <button onClick={onClick} title={title} style={{
      background: hov ? 'var(--border)' : 'var(--bg-input)',
      border: '1px solid var(--border)',
      borderRadius: 8, cursor: 'pointer', color: 'var(--text-muted)',
      width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.18s', flexShrink: 0, ...style,
    }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}


function NavItem({ icon, label, active, onClick }) {
  const [hov, setHov] = useState(false);
  const { darkMode } = useTheme();
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px',
      borderRadius: 10, border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
      background: active ? 'var(--bg-input)' : 'transparent',
      color: active ? 'var(--text-main)' : hov ? 'var(--text-main)' : 'var(--text-muted)',
      fontFamily: 'inherit', fontSize: 14, fontWeight: active ? 700 : 500,
      transition: 'all 0.2s ease',
      opacity: active ? 1 : hov ? 0.9 : 0.7,
      transform: hov ? 'translateX(4px)' : 'none'
    }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {icon}
      <span>{label}</span>
      {active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#0062ff', boxShadow: '0 0 6px #0062ff' }} />}
    </button>
  );
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
      catch (_) {} finally { setBusy(false); }
    }, 380);
  };

  const pick = c => { onSelect(c); setQ(''); setRes([]); setOpen(false); };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--bg-input)', border: '1px solid var(--border)',
        borderRadius: 11, padding: '9px 14px', minWidth: 240,
      }}>
        <span style={{ color: 'var(--text-dim)' }}><Ic.Search /></span>
        <input value={q} onChange={change} onFocus={() => res.length && setOpen(true)} placeholder="Search location…" style={{
          background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)',
          fontSize: 13, width: '100%', fontFamily: 'inherit',
        }} />
        {busy && <span style={{ width: 13, height: 13, border: '2px solid var(--border)', borderTopColor: '#0062ff', borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0 }} />}
      </div>
      {open && res.length > 0 && (
        <div style={{
          position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 2000,
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 11, overflow: 'hidden', boxShadow: 'var(--shadow)',
        }}>
          {res.map((c, i) => (
            <button key={i} onClick={() => pick(c)} style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left',
              padding: '10px 14px', background: 'none', border: 'none',
              color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              borderBottom: i < res.length - 1 ? '1px solid var(--border)' : 'none',
              transition: 'background 0.15s',
            }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,98,255,0.12)'}
               onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>📍</span>
              <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{c.name}</span>
              {c.state && <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>{c.state}</span>}
              <span style={{ marginLeft: 'auto', color: 'var(--text-dim)', fontSize: 11 }}>{c.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


function Stat({ icon, label, value, subValue, accent = '#3b9eff' }) {
  const [hov, setHov] = useState(false);
  return (
    <div 
      onMouseEnter={() => setHov(true)} 
      onMouseLeave={() => setHov(false)}
      style={{ 
        background: hov ? 'var(--border)' : 'var(--bg-input)', 
        backdropFilter: 'blur(10px)',
        borderRadius: 20, 
        padding: '16px 20px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 16,
        border: `1px solid ${hov ? 'rgba(255,255,255,0.12)' : 'var(--border)'}`,
        boxShadow: hov ? `0 12px 32px -8px ${accent}25` : 'var(--shadow)',
        flex: 1,
        minWidth: 160,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'default',
        transform: hov ? 'translateY(-2px)' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ 
        width: 32, height: 32, 
        display: 'flex', 
        alignItems: 'center', justifyContent: 'center', 
        color: accent,
        flexShrink: 0, 
        transition: 'all 0.3s ease'
      }}>
        {React.cloneElement(icon, { width: 28, height: 28 })}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
        {subValue && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subValue}</div>}
      </div>
    </div>
  );
}


function HourlySlot({ h }) {
  const [hov, setHov] = useState(false);
  const pop = h.precip || 0;
  const accent = h.group === 'clear' ? '#ff9d00' : h.group === 'rain' ? '#3b9eff' : h.group === 'thunder' ? '#a855f7' : '#94a3b8';
  
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      minWidth: 120, padding: '24px 16px', borderRadius: 22, flex: '1 0 auto',
      background: hov ? 'var(--border)' : 'var(--bg-input)',
      border: `1px solid ${hov ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`,
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default',
      boxShadow: hov ? `0 16px 32px -12px ${accent}25` : 'none',
      transform: hov ? 'translateY(-6px)' : 'none',
      position: 'relative', overflow: 'hidden'
    }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ position: 'absolute', top: -10, right: -10, width: 40, height: 40, background: accent, filter: 'blur(30px)', opacity: hov ? 0.15 : 0.03 }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-dim)' }}>{fmtHour(h.dt)}</span>
      </div>
      
      <WeatherIcon data={h} size={48} />
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{Math.round(h.temp)}°</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{h.label}</div>
      </div>

      {pop > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, background: `${accent}15`, padding: '4px 8px', borderRadius: 8 }}>
          <span style={{ color: accent, display: 'flex', alignItems: 'center' }}><Ic.Rain width={12} height={12} /></span>
          <span style={{ fontSize: 10, fontWeight: 800, color: accent }}>{pop}%</span>
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

  const accent = day.group === 'clear' ? '#ff9d00' : day.group === 'rain' ? '#3b9eff' : day.group === 'thunder' ? '#a855f7' : '#94a3b8';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, 
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: 'var(--glass-bg)', backdropFilter: 'blur(24px)',
      padding: '40px 20px', animation: 'fadeUp 0.3s ease-out',
      overflowY: 'auto' // The overlay itself handles scrolling if the modal is too tall
    }} onClick={onClose}>
      
      <div 
        style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 32, width: '100%', maxWidth: 760, 
          margin: 'auto', // Smart centering: centers if fits, starts from top if not
          position: 'relative', boxShadow: 'var(--shadow)',
          overflow: 'hidden',
          animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }} 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: 20, right: 20, background: 'var(--bg-input)',
          border: '1px solid var(--border)', color: 'var(--text-main)', width: 40, height: 40, borderRadius: '50%',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
          fontSize: '18px', zIndex: 100
        }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-input)'}>✕</button>

        <div style={{ padding: '40px', background: `linear-gradient(180deg, ${accent}15 0%, transparent 100%)`, borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
            <div style={{ padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WeatherIcon data={day} size={100} />
            </div>
            <div style={{ flex: '1 0 200px' }}>
              <h2 style={{ fontSize: 36, fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1.5px', marginBottom: 2 }}>{dayLabel(day.dt)}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: 'var(--text-dim)', fontSize: 16, fontWeight: 600 }}>{fmtDate(day.dt)}</span>
                <span style={{ color: accent, textTransform: 'uppercase', fontWeight: 800, letterSpacing: 1, fontSize: 12 }}>{day.label}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flex: '1 0 100px' }}>
              <div style={{ fontSize: 56, fontWeight: 900, color: 'var(--text-main)', lineHeight: 1, letterSpacing: '-3px' }}>{Math.round(day.max)}°</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 16, marginTop: 4, fontWeight: 700 }}>LOW {Math.round(day.min)}°</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '32px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
            <Stat icon={<Ic.Rain />} label="Precipitation" value={`${day.precip}%`} accent="#3b9eff" />
            <Stat icon={<Ic.Wind />} label="Wind Speed" value={`${Math.round(day.max * 1.5)} km/h`} accent="#4ade80" />
            <Stat icon={<Ic.Gauge />} label="UV Intensity" value={day.uv_index.toFixed(1)} accent="#ff9d00" />
            <Stat icon={<Ic.Thermo />} label="Temp Range" value={`${Math.round(day.max)}° / ${Math.round(day.min)}°`} accent="#f472b6" />
          </div>

          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 4, height: 20, background: accent, borderRadius: 2 }} />
              Hourly Timeline
            </h3>
          </div>
          
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
            {dayHourly.length > 0 ? dayHourly.map((h, i) => (
              <div key={i} style={{ 
                minWidth: 110, padding: '20px 16px', borderRadius: 20, background: 'var(--bg-input)',
                border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-dim)' }}>{fmtHour(h.dt)}</span>
                <WeatherIcon data={h} size={40} />
                <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)' }}>{h.temp}°</span>
              </div>
            )) : (
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14, background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: 24, width: '100%', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)' }}>
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
  const accent = d.group === 'clear' ? '#ff9d00' : d.group === 'rain' ? '#3b9eff' : d.group === 'thunder' ? '#a855f7' : '#94a3b8';

  return (
    <div
      onClick={() => onClick(d)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 8, minWidth: 0, borderRadius: 16, padding: '18px 14px',
        background: hov ? 'var(--border)' : 'var(--bg-input)',
        border: `1px solid ${hov ? `${accent}55` : 'var(--border)'}`,
        transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
        cursor: 'pointer',
        transform: hov ? 'translateY(-2px)' : 'none',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
        <span style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 600 }}>{date}</span>
      </div>

      <WeatherIcon data={d} size={52} style={{ margin: '4px 0' }} />

      <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.8px', lineHeight: 1 }}>{Math.round(d.max)}°</span>

      <div style={{
        background: 'var(--bg-app)',
        borderRadius: 8, padding: '6px 10px',
        textAlign: 'center', width: '100%',
        border: '1px solid var(--border)'
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.label}</div>
        <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>L:{Math.round(d.min)}°</div>
      </div>

      {pop > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: accent }}>
          <Ic.Rain /> {pop}%
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
        marginTop: 10, width: '100%', borderRadius: 14,
        background: active ? 'rgba(0,98,255,0.15)' : hov ? 'var(--border)' : 'var(--bg-input)',
        border: `1px solid ${active ? 'rgba(0,98,255,0.3)' : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', cursor: 'pointer',
        transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden'
      }}
    >
      <div onClick={() => onSelect(city)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '12px' }}>
        {data ? (
          <>
            <WeatherIcon data={data} size={32} />
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{city.name}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }}>{Math.round(data.temp)}°</div>
            </div>
          </>
        ) : failed ? (
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{city.name}</div>
            <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 600 }}>offline</div>
          </div>
        ) : (
          <div style={{ fontSize: 11, color: '#64748b' }}>Loading {city.name}...</div>
        )}
      </div>
      {hov && (
        <button 
          onClick={(e) => { e.stopPropagation(); onSelect({...city, _remove: true}); }}
          style={{
            background: 'rgba(239,68,68,0.2)', border: 'none', color: '#ef4444',
            width: 32, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', borderLeft: '1px solid rgba(239,68,68,0.2)'
          }}
        >
          <Ic.Trash />
        </button>
      )}
    </div>
  );
}

const FC_FILTERS = [
  { id: 'next7',    label: 'Next 7 days' },
  { id: '14days',   label: '14 Days' },
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
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const hourlyRef = useRef(null);
  
  const { saved, toggleSave } = useSavedCitiesViewModel();

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
        async () => { 
          const ip = await getIpLocation(); 
          if (ip) load(ip.lat, ip.lon, ip.city); 
          else fallback();
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

  const hourly  = (data?.hourly || []).slice(0, hrFilter === '24h' ? 24 : 48);
  const daily   = (data?.daily || []).slice(0, fcFilter === 'next7' ? 7 : 14);

  const S = {
    sectionHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' },
    filterGroup: { display: 'flex', gap: 6, background: 'var(--bg-input)', padding: 4, borderRadius: 10 },
    card: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 24, padding: '32px', boxShadow: 'var(--shadow)' },
  };

  const FilterBtn = ({ id, label, active, onClick }) => {
    const [hov, setHov] = useState(false);
    return (
      <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
        padding: '6px 14px', borderRadius: 7, border: 'none',
        background: active ? '#0062ff' : hov ? 'var(--border)' : 'transparent',
        color: active ? '#fff' : 'var(--text-muted)', fontSize: 12, fontWeight: active ? 700 : 600,
        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
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

      <aside style={{ width: 228, flexShrink: 0, background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '26px 14px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, paddingLeft: 4 }}>
          <img src="/logo.png" alt="Weathix" style={{ width: 44, height: 44, objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,98,255,0.3))' }} />
          <div><div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.8px', color: 'var(--text-main)', background: 'linear-gradient(135deg, var(--text-main) 0%, #0062ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Weathix</div></div>
        </div>
        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 2.5, color: 'var(--text-dim)', paddingLeft: 14, marginBottom: 6 }}>General</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
          <NavItem icon={<Ic.Dashboard />} label="Dashboard" active={view==='dashboard'} onClick={() => setView('dashboard')} />
          <NavItem icon={<Ic.Map />}       label="Map"        active={view==='map'}       onClick={() => setView('map')} />
          <NavItem icon={<Ic.Pin />}       label="Saved Locations" active={view==='saved'}  onClick={() => setView('saved')} />
          <NavItem icon={<Ic.Calendar />}  label="Calendar"   active={view==='calendar'}  onClick={() => setView('calendar')} />
        </nav>
        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 2.5, color: 'var(--text-dim)', paddingLeft: 14, marginBottom: 10, marginTop: 10 }}>Saved Locations</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '300px', overflowY: 'auto', paddingRight: 4 }}>
          {saved.map((c, i) => (
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
          {saved.length === 0 && <div style={{ fontSize: 11, color: '#475569', padding: '10px 14px' }}>No saved cities</div>}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={locateMe} style={{ width: '100%', padding: '11px', borderRadius: 11, background: 'linear-gradient(135deg,#0062ff,#0052d9)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(0,98,255,0.35)' }}>
            <Ic.Locate /> Locate Me
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button onClick={() => setView('support')} style={{ padding: '10px 8px', borderRadius: 11, background: view === 'support' ? 'rgba(255,157,0,0.14)' : 'rgba(255,255,255,0.06)', border: `1px solid ${view === 'support' ? 'rgba(255,157,0,0.35)' : 'rgba(255,255,255,0.1)'}`, color: view === 'support' ? '#ffb84d' : '#cbd5e1', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.18s' }}>
              <Ic.Help /> Support
            </button>
            <button onClick={() => setView('settings')} style={{ padding: '10px 8px', borderRadius: 11, background: view === 'settings' ? 'rgba(0,98,255,0.14)' : 'rgba(255,255,255,0.06)', border: `1px solid ${view === 'settings' ? 'rgba(0,98,255,0.35)' : 'rgba(255,255,255,0.1)'}`, color: view === 'settings' ? '#3b9eff' : '#cbd5e1', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.18s' }}>
              <Ic.Settings /> Settings
            </button>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', background: 'var(--bg-app)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', flexShrink: 0, position: 'sticky', top: 0, zIndex: 100, gap: 16 }}>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
              {view === 'support' ? 'Support Center' : view === 'settings' ? 'Settings' : now.date}
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
              {view === 'support' ? (
                <span>We're here to help — browse FAQ or contact us</span>
              ) : view === 'settings' ? (
                <span>Customize your weather experience</span>
              ) : (
                <>
                  <span>{now.day}</span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#94a3b8' }}><Ic.Clock /> {now.time}</span>
                </>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {weather && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 12, background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
                <WeatherIcon data={weather} size={32} />
                <div style={{ lineHeight: 1.1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>{Math.round(weather.temp)}°</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{weather.name}</div>
                </div>
              </div>
            )}
            <SearchBar onSelect={(c) => { handleSelect(c); setView('dashboard'); }} />
          </div>
        </header>

        <div id="dashboard-content" style={{ flex: 1, overflowY: 'auto', padding: view === 'map' ? 0 : '28px 32px 40px', display: 'flex', flexDirection: 'column', gap: view === 'map' ? 0 : 28 }}>
          {loading && !weather && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '55vh', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(0,98,255,0.2)', borderTopColor: '#0062ff', animation: 'spin .9s linear infinite' }} />
              <p style={{ color: '#475569', fontSize: 14 }}>Detecting your location…</p>
            </div>
          )}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '14px 18px', color: '#fca5a5', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
              <span>⚠ {error}</span>
              <button onClick={retryLoad} style={{ background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.35)', color: '#fecaca', padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Retry
              </button>
            </div>
          )}

          {view === 'dashboard' && weather && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 430px)', gap: 20, alignItems: 'stretch' }}>
                <div style={{ borderRadius: 22, padding: '22px 28px', position: 'relative', overflow: 'hidden', background: getBg(weather?.group, weather?.isNight), border: '1px solid var(--border)', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <PatternOverlay group={weather?.group} />
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 60% at 75% 40%, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 40, position: 'relative' }}>
                    <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', filter: 'blur(30px)' }} />
                       <WeatherIcon data={weather} size={200} style={{ position: 'relative', zIndex: 1 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600 }}>
                          <Ic.Pin /> {weather.name}{weather.country ? `, ${weather.country}` : ''} <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginLeft: 8 }}>{weather.isNight ? 'Night' : 'Day'}</span>
                        </div>
                        {!saved.find(s => s.lat === weather.lat && s.lon === weather.lon) && (
                          <button 
                            onClick={() => toggleSave(weather)}
                            style={{ 
                              background: 'rgba(255,255,255,0.15)',
                              border: '1px solid rgba(255,255,255,0.15)',
                              color: '#fff',
                              padding: '6px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                            }}
                          >
                            + Save Location
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 110, fontWeight: 900, lineHeight: 0.8, color: '#fff', letterSpacing: '-6px' }}>{Math.round(weather.temp)}</span>
                        <span style={{ fontSize: 44, fontWeight: 300, color: 'rgba(255,255,255,0.9)', marginTop: 8 }}>°</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 22 }}>
                        <div style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontWeight: 800, textTransform: 'capitalize', fontSize: 18 }}>{weather.label}</span>
                          <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.25)' }} />
                          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600 }}>Feels {Math.round(weather.feels_like)}°</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#ff9d00' }}><Ic.Sunrise /> {new Date(weather.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#ff7a00' }}><Ic.Sunset /> {new Date(weather.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 28, position: 'relative' }}>
                    <Stat icon={<Ic.Drop />} label="Humidity" value={`${weather.humidity}%`} subValue={`Dew point: ${Math.round(weather.dew_point)}°`} accent="#3b9eff" />
                    <Stat icon={<Ic.Wind />} label="Wind" value={`${Math.round(weather.wind_speed)} km/h`} subValue={`Direction: ${weather.wind_deg}°`} accent="#4ade80" />
                    <Stat icon={<Ic.Gauge />} label="UV Index" value={weather.uv_index.toFixed(1)} subValue={weather.uv_index < 3 ? 'Low' : weather.uv_index < 6 ? 'Moderate' : weather.uv_index < 8 ? 'High' : 'Very High'} accent="#ff9d00" />
                    <Stat icon={<Ic.Eye />} label="Visibility" value={`${(weather.visibility / 1000).toFixed(1)} km`} subValue={weather.visibility > 10000 ? 'Excellent' : weather.visibility > 5000 ? 'Good' : 'Reduced'} accent="#f472b6" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 12, position: 'relative' }}>
                    <Stat icon={<Ic.Pressure />} label="Pressure" value={`${weather.pressure} hPa`} subValue={weather.pressure > 1013 ? 'Above normal' : weather.pressure < 1000 ? 'Below normal' : 'Normal'} accent="#a855f7" />
                    <Stat icon={<Ic.Cloud />} label="Cloud Cover" value={`${weather.clouds || 0}%`} subValue={weather.clouds < 25 ? 'Clear' : weather.clouds < 50 ? 'Partly cloudy' : weather.clouds < 75 ? 'Mostly cloudy' : 'Overcast'} accent="#94a3b8" />
                    <Stat icon={<Ic.Sunrise />} label="Daylight" value={`${Math.round((new Date(weather.sunset) - new Date(weather.sunrise)) / 3600000)}h`} subValue={`${new Date(weather.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(weather.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} accent="#ff9d00" />
                    <Stat icon={<Ic.Rain />} label="Precipitation" value={`${weather.precipitation || 0}%`} subValue={weather.precipitation > 50 ? 'Likely' : weather.precipitation > 20 ? 'Possible' : 'Unlikely'} accent="#3b9eff" />
                  </div>
                </div>
                <div style={{ borderRadius: mapFull ? 0 : 22, overflow: 'hidden', background: 'var(--bg-surface)', border: mapFull ? 'none' : '1px solid var(--border)', position: mapFull ? 'fixed' : 'relative', top: mapFull ? 0 : 'auto', left: mapFull ? 0 : 'auto', right: mapFull ? 0 : 'auto', bottom: mapFull ? 0 : 'auto', zIndex: mapFull ? 9999 : 'auto', minHeight: mapFull ? '100vh' : '350px', height: mapFull ? '100vh' : '100%', '@media (max-width: 768px)': { minHeight: '250px' } }}>
                  <MapContainer center={[weather.lat, weather.lon]} zoom={6} zoomControl={true} style={{ width: '100%', height: '100%', minHeight: mapFull ? '100vh' : '350px', '@media (max-width: 768px)': { minHeight: '250px' } }} touchZoom={true} scrollWheelZoom={true} doubleClickZoom={true}>
                    <Recenter lat={weather.lat} lon={weather.lon} />
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <TileLayer key={mapLayer} url={weatherTileUrl(mapLayer)} />
                    <Marker position={[weather.lat, weather.lon]} />
                  </MapContainer>
                  <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {MAP_LAYERS.map(l => (
                      <button key={l.id} onClick={(e) => { e.stopPropagation(); setMapLayer(l.id); }} style={{ background: mapLayer === l.id ? l.color : 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)', minWidth: 100, textAlign: 'left' }}>{l.emoji} {l.label}</button>
                    ))}
                    <button onClick={(e) => { e.stopPropagation(); setMapFull(!mapFull); }} style={{ background: 'rgba(0,98,255,0.9)', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)', minWidth: 100, textAlign: 'left', marginTop: 8 }}>
                      {mapFull ? <Ic.Collapse /> : <Ic.Expand />} {mapFull ? 'Exit Fullscreen' : 'Fullscreen'}
                    </button>
                  </div>
                  <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1000, display: 'flex', gap: 8 }}>
                    <button onClick={locateMe} style={{
                      background: 'rgba(0,98,255,0.9)', border: 'none', color: '#fff',
                      width: 40, height: 40, borderRadius: 12, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)'
                    }} title="Zoom to my location">
                      <Ic.Locate />
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ ...S.card, background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                <div style={{ ...S.sectionHead, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ padding: 10, background: 'rgba(0,98,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b9eff' }}><Ic.Clock /></div>
                    <span style={{ ...S.sectionTitle, fontSize: 18 }}>Hourly Forecast</span>
                  </div>
                  <div style={S.filterGroup}>{HR_FILTERS.map(f => <FilterBtn key={f.id} {...f} active={hrFilter === f.id} onClick={() => setHrFilter(f.id)} />)}</div>
                </div>
                <div ref={hourlyRef} style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 10 }}>{hourly.map((h, i) => <HourlySlot key={i} h={h} />)}</div>
              </div>

              <div style={{ ...S.card, background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                <div style={{ ...S.sectionHead, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ padding: 10, background: 'rgba(0,98,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b9eff' }}><Ic.Calendar /></div>
                    <span style={{ ...S.sectionTitle, fontSize: 18 }}>Upcoming Forecast</span>
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
              <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MAP_LAYERS.map(l => (
                  <button key={l.id} onClick={() => setMapLayer(l.id)} style={{ background: mapLayer === l.id ? l.color : 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)', minWidth: 120, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'var(--shadow)', transition: 'all 0.2s' }}>
                    <span style={{ fontSize: 16 }}>{l.emoji}</span> {l.label}
                  </button>
                ))}
              </div>

              <div style={{ position: 'absolute', bottom: 30, right: 20, zIndex: 1000, display: 'flex', gap: 8 }}>
                <button onClick={locateMe} style={{
                  background: 'rgba(0,98,255,0.9)', border: 'none', color: '#fff',
                  width: 48, height: 48, borderRadius: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0,98,255,0.4)', backdropFilter: 'blur(4px)',
                  transition: 'transform 0.2s'
                }} title="Zoom to my location" onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <Ic.Locate />
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
            const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
            const monthName = calendarDate.toLocaleDateString('en-US', { month: 'long' });
            const selectedKey = selectedCalendarDate ? getDateKey(selectedCalendarDate) : null;

            const days = [];
            for (let i = 0; i < startOfMonth.getDay(); i++) {
              days.push({ empty: true, key: `e${i}` });
            }
            for (let d = 1; d <= endOfMonth.getDate(); d++) {
              const date = new Date(year, month, d);
              const isToday = date.toDateString() === today.toDateString();
              const isPast = date < today && !isToday;
              const forecast = data?.daily?.find(f => new Date(f.dt * 1000).toDateString() === date.toDateString());
              days.push({ d, date, isToday, isPast, forecast, key: `d${d}` });
            }

            const monthForecastDays = days.filter(item => !item.empty && item.forecast);
            const fallbackDay = monthForecastDays.find(item => item.isToday) || monthForecastDays[0] || null;
            const selectedCalendarDay = monthForecastDays.find(item => getDateKey(item.date) === selectedKey) || fallbackDay;
            const selectedForecast = selectedCalendarDay?.forecast;
            const selectedAccent = getWeatherAccent(selectedForecast?.group);

            return (
              <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <style>{`
                  @keyframes calPop { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
                  .cal-day:hover { background: var(--bg-input) !important; border-color: var(--border) !important; }
                `}</style>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px' }}>
                      {monthName}
                      <span style={{ color: '#0062ff', marginLeft: 10 }}>{year}</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, marginTop: 3 }}>
                      {weather ? `Forecast calendar for ${weather.name}` : 'Monthly weather planner'}
                    </p>
                    <p style={{ color: 'rgba(148,163,184,0.55)', fontSize: 11, fontWeight: 600, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ display: 'inline-flex', width: 14, height: 14, borderRadius: '50%', background: 'rgba(0,98,255,0.2)', color: '#3b9eff', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>i</span>
                      Forecast data is available for the next 14 days only.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {!isCurrentMonth && (
                      <button onClick={() => setCalendarDate(new Date(today.getFullYear(), today.getMonth(), 1))} style={{ padding: '10px 16px', borderRadius: 12, border: '1px solid rgba(0,98,255,0.3)', background: 'rgba(0,98,255,0.1)', color: '#3b9eff', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                        Today
                      </button>
                    )}
                    <button onClick={() => setCalendarDate(new Date(year, month - 1, 1))} style={{ height: 42, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s', padding: '0 13px' }}><Ic.ChevronLeft /> Last month</button>
                    <button onClick={() => setCalendarDate(new Date(year, month + 1, 1))} style={{ height: 42, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s', padding: '0 13px' }}>Next month <Ic.ChevronRight /></button>
                  </div>
                </div>

                {monthForecastDays.length === 0 && (
                  <div style={{ background: 'rgba(255,157,0,0.08)', border: '1px solid rgba(255,157,0,0.25)', borderRadius: 14, padding: '12px 16px', color: '#fde68a', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16 }}>📡</span>
                    <span>This month is outside the 14-day forecast window. Return to <strong style={{ color: '#ff9d00' }}>Today</strong> to see available days.</span>
                  </div>
                )}
                {monthForecastDays.length > 0 && monthForecastDays.length < 10 && (
                  <div style={{ background: 'rgba(0,98,255,0.08)', border: '1px solid rgba(0,98,255,0.22)', borderRadius: 14, padding: '10px 14px', color: '#bfdbfe', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>ℹ</span>
                    <span>Only {monthForecastDays.length} day{monthForecastDays.length === 1 ? '' : 's'} of this month fall within the 14-day forecast window.</span>
                  </div>
                )}

                {selectedForecast ? (
                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '18px 20px', boxShadow: 'var(--shadow)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 60, height: 60, borderRadius: 16, background: selectedAccent.bg, border: `1px solid ${selectedAccent.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <WeatherIcon data={selectedForecast} size={44} />
                        </div>
                        <div>
                          <div style={{ fontSize: 19, fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                            {dayLabel(selectedForecast.dt)}, {fmtDate(selectedForecast.dt)}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: selectedAccent.color, textTransform: 'uppercase', letterSpacing: 0.7 }}>{selectedForecast.label}</span>
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border)' }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{selectedAccent.label}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1.6px', lineHeight: 1 }}>{Math.round(selectedForecast.max)}°</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginTop: 2 }}>Low {Math.round(selectedForecast.min)}°</div>
                      </div>
                    </div>

                    <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
                      <div style={{ borderRadius: 12, border: '1px solid rgba(59,158,255,0.22)', background: 'rgba(59,158,255,0.07)', padding: '9px 12px' }}>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Precipitation</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#3b9eff', marginTop: 3 }}>{selectedForecast.precip}%</div>
                      </div>
                      <div style={{ borderRadius: 12, border: '1px solid rgba(255,157,0,0.22)', background: 'rgba(255,157,0,0.07)', padding: '9px 12px' }}>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>UV Index</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#ff9d00', marginTop: 3 }}>{selectedForecast.uv_index?.toFixed(1)}</div>
                      </div>
                      <div style={{ borderRadius: 12, border: '1px solid rgba(244,114,182,0.22)', background: 'rgba(244,114,182,0.07)', padding: '9px 12px' }}>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Temp Spread</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#f472b6', marginTop: 3 }}>{Math.max(0, Math.round(selectedForecast.max - selectedForecast.min))}°</div>
                      </div>
                    </div>

                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                        Tap another day on the calendar to compare.
                      </span>
                      <button onClick={() => setSelectedDay(selectedForecast)} style={{ border: `1px solid ${selectedAccent.border}`, background: selectedAccent.bg, color: selectedAccent.color, borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                        Open full day timeline
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border)', borderRadius: 16, padding: '16px', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>
                    No forecast details for this month yet. Use Last month or Next month to browse.
                  </div>
                )}

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', padding: '10px 4px' }}>
                  {[
                    { label: 'Today', color: '#3b9eff', bg: 'rgba(0,98,255,0.2)' },
                    { label: 'Clear / Sunny', color: '#ff9d00', bg: 'rgba(255,157,0,0.15)' },
                    { label: 'Rain / Drizzle', color: '#3b9eff', bg: 'rgba(59,158,255,0.15)' },
                    { label: 'Thunderstorm', color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
                    { label: 'Snow / Cloudy', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' },
                  ].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: l.bg, border: `1px solid ${l.color}` }} />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{l.label}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 700 }}>
                      Click a day to view details
                    </span>
                    <span style={{ color: 'var(--text-dim)', fontSize: 11, fontWeight: 700 }}>
                      {monthForecastDays.length} day{monthForecastDays.length === 1 ? '' : 's'} available
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                      <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 800, color: (i === 0 || i === 6) ? '#3b9eff' : 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1.2, paddingBottom: 10 }}>{d}</div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                    {days.map(item => {
                      if (item.empty) return <div key={item.key} style={{ height: 72 }} />;
                      const { d, isToday, isPast, forecast, key } = item;
                      const isSelected = selectedCalendarDay && getDateKey(selectedCalendarDay.date) === getDateKey(item.date);
                      const accent = forecast ? getWeatherAccent(forecast.group) : getWeatherAccent(null);
                      const isWeekend = item.date.getDay() === 0 || item.date.getDay() === 6;
                      return (
                        <div
                          key={key}
                          className={forecast ? 'cal-day' : ''}
                          onClick={() => {
                            if (!forecast) return;
                            setSelectedCalendarDate(item.date);
                          }}
                          style={{
                            height: 72, borderRadius: 10, padding: '6px 8px',
                            display: 'grid', gridTemplateColumns: 'auto 1fr', gridTemplateRows: 'auto 1fr', alignItems: 'center',
                            columnGap: 6,
                            background: isSelected ? accent.bg : isToday ? 'rgba(0,98,255,0.14)' : forecast ? 'var(--bg-input)' : 'var(--bg-input)',
                            border: `1px solid ${isSelected ? accent.color : isToday ? '#0062ff' : forecast ? 'var(--border)' : 'var(--border)'}`,
                            cursor: forecast ? 'pointer' : 'default',
                            transition: 'all 0.2s ease',
                            opacity: isPast && !isToday ? 0.45 : 1,
                            animation: `calPop ${0.08 + d * 0.01}s ease both`,
                            position: 'relative', overflow: 'hidden',
                          }}
                        >
                          {isToday && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #0062ff, #3b9eff)' }} />}
                          <span style={{ gridColumn: '1 / 3', fontSize: 11, fontWeight: 800, color: isToday ? '#0062ff' : isWeekend ? '#3b9eff' : 'var(--text-main)', lineHeight: 1 }}>{d}</span>
                          {forecast ? (
                            <>
                              <div style={{ gridColumn: 1, gridRow: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <WeatherIcon data={forecast} size={30} />
                              </div>
                              <div style={{ gridColumn: 2, gridRow: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', lineHeight: 1 }}>
                                <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-main)' }}>{Math.round(forecast.max)}°</span>
                                <span style={{ fontSize: 10, fontWeight: 700, color: accent.color, marginTop: 2 }}>{Math.round(forecast.min)}°</span>
                              </div>
                            </>
                          ) : (
                            <div style={{ gridColumn: '1 / 3', gridRow: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 14, fontWeight: 800, letterSpacing: 2 }}>
                              ···
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}
          {view === 'saved' && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div style={S.sectionHead}><h2 style={S.sectionTitle}>Saved Locations</h2></div>
              {saved.length === 0 ? (
                <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.5 }}>📍</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>No saved locations</h3>
                  <p style={{ color: '#475569', maxWidth: 300, margin: '0 auto' }}>Search for a city and click "+ Save Location" to add it to your favorites.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                  {saved.map((c, i) => (
                    <div key={i} style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                      <div onClick={() => { load(c.lat, c.lon, c.name); setView('dashboard'); }} style={{ cursor: 'pointer', flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-main)' }}>{c.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{c.country}</div>
                      </div>
                      <button onClick={() => toggleSave(c)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'support' && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <Support />
            </div>
          )}

          {view === 'settings' && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <Settings />
            </div>
          )}
        </div>
      </main>

      <ChatAgent weather={data?.current} />
      {selectedDay && <ForecastModal day={selectedDay} onClose={() => setSelectedDay(null)} hourlyData={data?.hourly} />}
    </div>
  );
}
