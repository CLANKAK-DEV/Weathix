import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ic } from '../utils/icons';
import { useTheme } from '../contexts/ThemeContext';

function About() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const containerStyle = {
    minHeight: '100vh',
    background: darkMode ? 'linear-gradient(140deg,#050a14 0%,#0a1e3e 45%,#0a1628 100%)' : '#f8fafc',
    fontFamily: "'Inter',system-ui,sans-serif",
    color: darkMode ? '#e2e8f0' : '#1e293b'
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>

      <header style={{
        padding: '20px 28px',
        background: darkMode ? 'rgba(5,10,20,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/settings')}
            style={{
              background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
              color: darkMode ? '#cbd5e1' : '#475569',
              width: 36,
              height: 36,
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.18s'
            }}
          >
            <Ic.ChevronLeft />
          </button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: darkMode ? '#f1f5f9' : '#1e293b' }}>About</h1>
            <p style={{ fontSize: 12, color: darkMode ? '#64748b' : '#64748b' }}>Learn about Weathix Weather</p>
          </div>
        </div>
      </header>

      <main style={{ padding: '32px 28px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          background: darkMode ? 'rgba(5,10,20,0.6)' : 'rgba(0,0,0,0.03)',
          border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: 20,
          padding: 40
        }}>

          <section style={{ marginBottom: 40, textAlign: 'center' }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'linear-gradient(135deg,#0062ff 0%,#3b9eff 55%,#ff9d00 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(0,98,255,0.35)'
            }}>
              <span style={{ fontSize: 40, color: '#fff' }}>🌤️</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 8 }}>
              Weathix Weather
            </h2>
            <p style={{ fontSize: 16, color: darkMode ? '#cbd5e1' : '#64748b', marginBottom: 16 }}>
              Your intelligent weather companion
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#94a3b8' : '#64748b', maxWidth: 500, margin: '0 auto' }}>
              Weathix Weather is a modern, privacy-focused weather application that provides accurate forecasts, real-time conditions, and AI-powered weather advice—all without requiring user accounts or storing personal data.
            </p>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Our Mission
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              We believe weather information should be accessible, accurate, and private. Our mission is to provide a beautiful, intuitive weather experience that respects your privacy and gives you the information you need to plan your day.
            </p>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Key Features
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: 20
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🌡</div>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                  Real-Time Data
                </h4>
                <p style={{ fontSize: 13, color: '#94a3b8' }}>
                  Accurate weather conditions updated in real-time from Open-Meteo
                </p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: 20
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🤖</div>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: darkMode ? '#e2e8f0' : '#1e293b', marginBottom: 4 }}>
                  AI Assistant
                </h4>
                <p style={{ fontSize: 13, color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Weather tips and advice powered by NVIDIA AI
                </p>
              </div>

              <div style={{
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 12,
                padding: 20
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🗺</div>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: darkMode ? '#e2e8f0' : '#1e293b', marginBottom: 4 }}>
                  Interactive Map
                </h4>
                <p style={{ fontSize: 13, color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Live weather radar with multiple map layers
                </p>
              </div>

              <div style={{
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 12,
                padding: 20
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: darkMode ? '#e2e8f0' : '#1e293b', marginBottom: 4 }}>
                  Privacy First
                </h4>
                <p style={{ fontSize: 13, color: darkMode ? '#94a3b8' : '#64748b' }}>
                  No accounts, no tracking, local data storage
                </p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Technology Stack
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', marginBottom: 16 }}>
              Weathix Weather is built with modern web technologies:
            </p>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20 }}>
              <li><strong>Frontend:</strong> React with functional components and hooks</li>
              <li><strong>Routing:</strong> React Router for multi-page navigation</li>
              <li><strong>Styling:</strong> Tailwind CSS and inline styles for responsive design</li>
              <li><strong>Maps:</strong> Leaflet with react-leaflet for interactive weather maps</li>
              <li><strong>APIs:</strong> Open-Meteo for weather data, NVIDIA for AI processing</li>
              <li><strong>Icons:</strong> Custom SVG icons for a clean, modern look</li>
            </ul>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Data Sources
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', marginBottom: 16 }}>
              We source our weather data from trusted providers:
            </p>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20 }}>
              <li><strong>Open-Meteo:</strong> Free, open-source weather API providing current conditions, hourly forecasts, and extended forecasts</li>
              <li><strong>NVIDIA AI:</strong> Enterprise-grade AI platform for generating weather-related advice and tips</li>
              <li><strong>OpenStreetMap:</strong> Community-driven mapping project for geocoding and map tiles</li>
            </ul>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Privacy & Security
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', marginBottom: 16 }}>
              Your privacy is our priority:
            </p>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20 }}>
              <li><strong>No User Accounts:</strong> We don't require registration or login</li>
              <li><strong>Local Storage:</strong> Your data stays on your device</li>
              <li><strong>No Tracking:</strong> We don't track your browsing behavior</li>
              <li><strong>Secure APIs:</strong> All API communications use HTTPS</li>
              <li><strong>Input Sanitization:</strong> All inputs are validated and sanitized</li>
            </ul>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', marginTop: 16 }}>
              For more details, see our <span style={{ color: '#3b9eff', cursor: 'pointer' }} onClick={() => navigate('/privacy')}>Privacy Policy</span> and <span style={{ color: '#3b9eff', cursor: 'pointer' }} onClick={() => navigate('/security')}>Security</span> pages.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Version
            </h3>
            <p style={{ fontSize: 14, color: darkMode ? '#cbd5e1' : '#475569' }}>
              Weathix Weather v1.0.0
            </p>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
              © 2026 Weathix Weather. All rights reserved.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}

export default About;
