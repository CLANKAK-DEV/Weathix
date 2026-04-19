import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function Settings({ setView }) {
  const { darkMode, toggleTheme, unit, setUnit } = useTheme();
  const [backgroundAccess, setBackgroundAccess] = useState(true);
  const [preciseLocation, setPreciseLocation] = useState(false);

  const handleReset = () => {
    if (window.confirm("ARE YOU SURE? THIS WILL PURGE ALL SAVED DATA AND CONFIGURATIONS.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 900, color: 'var(--on-surface)', tracking: '-0.04em', marginBottom: '8px', textTransform: 'uppercase' }}>System Configuration</h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em' }}>Adjust environmental parameters and data retention</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Settings Form Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', gridColumn: 'span 2' }}>
          
          {/* Appearance Section */}
          <section className="card--glass" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '100%', background: 'var(--primary-container)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>palette</span>
              <h2 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--on-surface)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Appearance</h2>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--on-surface)', marginBottom: '4px' }}>Interface Theme</h3>
                <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>Switch between light and dark ambient modes</p>
              </div>
              <div style={{ display: 'flex', background: 'var(--surface-container-highest)', padding: '4px' }}>
                <button 
                  onClick={() => !darkMode && null} 
                  disabled={!darkMode}
                  style={{ 
                    padding: '8px 16px', 
                    background: !darkMode ? 'var(--primary)' : 'transparent', 
                    color: !darkMode ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                    border: 'none', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' 
                  }}
                  onClick={darkMode ? toggleTheme : undefined}
                >Light</button>
                <button 
                  onClick={darkMode ? undefined : toggleTheme}
                  style={{ 
                    padding: '8px 16px', 
                    background: darkMode ? 'var(--primary)' : 'transparent', 
                    color: darkMode ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                    border: 'none', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' 
                  }}
                >Dark</button>
              </div>
            </div>
          </section>

          {/* Units Section */}
          <section className="card--glass" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '100%', background: 'var(--primary-container)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>thermostat</span>
              <h2 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--on-surface)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Measurement Units</h2>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--on-surface)', marginBottom: '4px' }}>Temperature Scale</h3>
                <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>Select primary thermal reading format</p>
              </div>
              <div style={{ display: 'flex', background: 'var(--surface-container-highest)', padding: '4px' }}>
                <button 
                  onClick={() => setUnit('C')}
                  style={{ 
                    padding: '8px 16px', 
                    background: unit === 'C' ? 'var(--primary)' : 'transparent', 
                    color: unit === 'C' ? 'var(--on-primary)' : 'var(--on-surface-variant)', 
                    border: 'none', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' 
                  }}
                >Celsius (°C)</button>
                <button 
                  onClick={() => setUnit('F')}
                  style={{ 
                    padding: '8px 16px', 
                    background: unit === 'F' ? 'var(--primary)' : 'transparent', 
                    color: unit === 'F' ? 'var(--on-primary)' : 'var(--on-surface-variant)', 
                    border: 'none', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' 
                  }}
                >Fahrenheit (°F)</button>
              </div>
            </div>
          </section>

          {/* Permissions Section */}
          <section className="card--glass" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '100%', background: 'var(--primary-container)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>location_on</span>
              <h2 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--on-surface)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Location Privacy</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--on-surface)', marginBottom: '4px' }}>Background Access</h3>
                  <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>Allow persistent tracking for passive alerts</p>
                </div>
                <div 
                  onClick={() => setBackgroundAccess(!backgroundAccess)}
                  style={{ 
                    width: '44px', height: '24px', background: backgroundAccess ? 'var(--secondary)' : 'var(--surface-variant)', 
                    padding: '2px', cursor: 'pointer', transition: 'background 0.3s ease', position: 'relative' 
                  }}
                >
                  <div style={{ 
                    width: '20px', height: '20px', background: '#fff', 
                    transform: backgroundAccess ? 'translateX(20px)' : 'translateX(0)', 
                    transition: 'transform 0.3s ease' 
                  }}></div>
                </div>
              </div>
              
              <div style={{ height: '1px', background: 'var(--surface-container-highest)' }}></div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--on-surface)', marginBottom: '4px' }}>Precise Location</h3>
                  <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>Enable micro-climate targeting</p>
                </div>
                <div 
                  onClick={() => setPreciseLocation(!preciseLocation)}
                  style={{ 
                    width: '44px', height: '24px', background: preciseLocation ? 'var(--secondary)' : 'var(--surface-variant)', 
                    padding: '2px', cursor: 'pointer', transition: 'background 0.3s ease', position: 'relative' 
                  }}
                >
                  <div style={{ 
                    width: '20px', height: '20px', background: '#fff', 
                    transform: preciseLocation ? 'translateX(20px)' : 'translateX(0)', 
                    transition: 'transform 0.3s ease' 
                  }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section style={{ background: 'var(--error-container)', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '100%', background: 'var(--error)' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--on-error-container)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>System Reset</h2>
                <p style={{ fontSize: '13px', color: 'var(--on-error-container)', opacity: 0.8, maxWidth: '400px' }}>Purge all local cache, saved architectural coordinates, and user preferences. This action is irreversible.</p>
              </div>
              <button 
                onClick={handleReset}
                style={{ background: 'var(--error)', color: 'var(--on-error)', border: 'none', padding: '12px 24px', fontWeight: 900, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em', cursor: 'pointer' }}
              >Reset All Data</button>
            </div>
          </section>
        </div>

        {/* Sidebar Info Slab */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className="card--glass" style={{ padding: '32px', color: 'var(--on-primary-container)', background: 'var(--primary-container)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', marginBottom: '16px', display: 'block', color: 'var(--on-primary)' }}>info</span>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--on-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>System Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '4px' }}>Version</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--on-primary)' }}>v4.2.0-stable</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '4px' }}>Last Sync</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--on-primary)' }}>Today, 10:28 AM</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '4px' }}>Local Storage</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--on-primary)' }}>12.4 MB Used</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface-container-low)', padding: '24px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface)', marginBottom: '16px', borderBottom: '2px solid var(--surface-container-highest)', paddingBottom: '8px' }}>Need Assistance?</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button 
                onClick={() => setView?.('privacy')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--surface-container-highest)', cursor: 'pointer', color: 'var(--secondary)', fontWeight: 700, fontSize: '13px' }}
              >
                Privacy Policy
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </button>
              <button 
                onClick={() => setView?.('about')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--secondary)', fontWeight: 700, fontSize: '13px' }}
              >
                About Project
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Settings;
