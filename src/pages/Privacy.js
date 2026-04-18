import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ic } from '../utils/icons';
import { useTheme } from '../contexts/ThemeContext';

function Privacy() {
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
            <h1 style={{ fontSize: 20, fontWeight: 800, color: darkMode ? '#f1f5f9' : '#1e293b' }}>Privacy Policy</h1>
            <p style={{ fontSize: 12, color: darkMode ? '#64748b' : '#64748b' }}>Last updated: January 2026</p>
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

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Introduction
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              Weathix Weather ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our weather application.
            </p>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Information We Collect
            </h2>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: darkMode ? '#e2e8f0' : '#1e293b', marginBottom: 8 }}>
                Location Data
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
                We collect your location data solely to provide accurate weather information. This includes:
              </p>
              <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20, marginTop: 8 }}>
                <li>GPS coordinates (when you enable location services)</li>
                <li>IP-based location estimation (as a fallback)</li>
                <li>City names you search for and save</li>
              </ul>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: darkMode ? '#e2e8f0' : '#1e293b', marginBottom: 8 }}>
                Local Storage Data
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
                We store the following data locally on your device:
              </p>
              <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20, marginTop: 8 }}>
                <li>Your saved cities list</li>
                <li>Language preferences</li>
                <li>Theme preferences (dark/light mode)</li>
                <li>Location service settings</li>
                <li>AI assistant usage count (daily limit tracking)</li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: darkMode ? '#e2e8f0' : '#1e293b', marginBottom: 8 }}>
                AI Assistant Data
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
                When you use our AI Weather Assistant:
              </p>
              <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20, marginTop: 8 }}>
                <li>Your questions are sent to NVIDIA's API for processing</li>
                <li>Current weather data for your selected location is included</li>
                <li>We do not store your conversation history on our servers</li>
                <li>Messages are processed in real-time and not retained</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              How We Use Your Information
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              We use your information solely to:
            </p>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20, marginTop: 8 }}>
              <li>Provide accurate weather forecasts and current conditions</li>
              <li>Save your preferred cities for quick access</li>
              <li>Personalize your app experience (language, theme)</li>
              <li>Generate AI-powered weather advice and tips</li>
              <li>Enforce daily usage limits for the AI assistant</li>
            </ul>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Data Storage and Security
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              <strong>Local Storage:</strong> Most of your data is stored locally on your device using browser storage mechanisms. This data never leaves your device unless you explicitly share it.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', marginTop: 12 }}>
              <strong>API Communications:</strong> Weather data is fetched from Open-Meteo's public API. AI requests are sent to NVIDIA's API. Both services have their own privacy policies which we encourage you to review.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', marginTop: 12 }}>
              <strong>No Server Storage:</strong> We do not maintain user accounts, databases, or any server-side storage of personal information.
            </p>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Third-Party Services
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              Our app integrates with the following third-party services:
            </p>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20, marginTop: 8 }}>
              <li><strong>Open-Meteo:</strong> Weather data provider</li>
              <li><strong>NVIDIA:</strong> AI processing for the weather assistant</li>
              <li><strong>OpenStreetMap/Nominatim:</strong> Geocoding and reverse geocoding services</li>
            </ul>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Your Rights
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              You have the right to:
            </p>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20, marginTop: 8 }}>
              <li>Clear your local storage data at any time</li>
              <li>Disable location services in your device settings or app settings</li>
              <li>Remove saved cities from your list</li>
              <li>Reset your AI usage counter</li>
              <li>Choose not to use the AI assistant</li>
            </ul>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Children's Privacy
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Contact Us
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              If you have questions about this Privacy Policy, please contact us through the Support page in the app.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}

export default Privacy;
