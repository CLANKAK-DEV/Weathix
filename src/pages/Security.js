import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ic } from '../utils/icons';
import { useTheme } from '../contexts/ThemeContext';

function Security() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const containerStyle = {
    minHeight: '100vh',
    background: darkMode ? 'linear-gradient(140deg,#0e110f 0%,#0a1e3e 45%,#1a1d1a 100%)' : '#f8fafc',
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
            <h1 style={{ fontSize: 20, fontWeight: 800, color: darkMode ? '#f1f5f9' : '#1e293b' }}>Security</h1>
            <p style={{ fontSize: 12, color: darkMode ? '#64748b' : '#64748b' }}>How we protect your data</p>
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
              Our Security Commitment
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              Weathix Weather takes security seriously. We implement multiple layers of protection to ensure your data remains safe and your privacy is maintained.
            </p>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Data Protection Measures
            </h2>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: darkMode ? '#e2e8f0' : '#1e293b', marginBottom: 8 }}>
                Local-First Architecture
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
                Your data stays on your device. We use browser local storage for:
              </p>
              <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20, marginTop: 8 }}>
                <li>Saved cities and preferences</li>
                <li>Theme and language settings</li>
                <li>AI usage tracking (for limits only)</li>
              </ul>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', marginTop: 8 }}>
                This means no personal data is transmitted to our servers or stored in our databases.
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: darkMode ? '#e2e8f0' : '#1e293b', marginBottom: 8 }}>
                Input Sanitization
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
                All user inputs are sanitized before processing:
              </p>
              <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20, marginTop: 8 }}>
                <li>URLs and links are automatically removed</li>
                <li>Text length is limited to prevent abuse</li>
                <li>Special characters are properly escaped</li>
                <li>AI prompts are constrained to weather-related topics only</li>
              </ul>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: darkMode ? '#e2e8f0' : '#1e293b', marginBottom: 8 }}>
                Rate Limiting
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
                To prevent abuse and ensure fair usage:
              </p>
              <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20, marginTop: 8 }}>
                <li>AI assistant limited to 50 requests per day per user</li>
                <li>Usage tracking is done locally on your device</li>
                <li>Limits reset automatically every 24 hours</li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: darkMode ? '#e2e8f0' : '#1e293b', marginBottom: 8 }}>
                API Key Protection
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
                NVIDIA API keys are:
              </p>
              <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20, marginTop: 8 }}>
                <li>Stored in environment variables (never in client code)</li>
                <li>Only used server-side for API authentication</li>
                <li>Never exposed to browser or client applications</li>
                <li>Rotated regularly following security best practices</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              AI Assistant Security
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              Our AI Weather Assistant includes several security measures:
            </p>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20, marginTop: 8 }}>
              <li><strong>System Prompt Enforcement:</strong> The AI is instructed to only answer weather-related questions</li>
              <li><strong>Context Injection:</strong> Only relevant weather data is sent with each request</li>
              <li><strong>No Conversation Storage:</strong> Chat history is not stored on our servers</li>
              <li><strong>Input Validation:</strong> All inputs are sanitized before being sent to the AI</li>
              <li><strong>Response Filtering:</strong> AI responses are monitored for inappropriate content</li>
            </ul>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Third-Party Security
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              We carefully select our third-party service providers based on their security practices:
            </p>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20, marginTop: 8 }}>
              <li><strong>Open-Meteo:</strong> Free, open-source weather API with no authentication required</li>
              <li><strong>NVIDIA:</strong> Enterprise-grade AI platform with robust security measures</li>
              <li><strong>OpenStreetMap:</strong> Community-maintained geocoding service</li>
            </ul>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', marginTop: 12 }}>
              Each provider has its own security and privacy policies which we encourage you to review.
            </p>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              What We Don't Do
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              To protect your privacy and security, we:
            </p>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20, marginTop: 8 }}>
              <li>Do not create user accounts or require login</li>
              <li>Do not store personal information on our servers</li>
              <li>Do not track your browsing behavior across the web</li>
              <li>Do not sell your data to third parties</li>
              <li>Do not use cookies for tracking purposes</li>
              <li>Do not collect analytics or usage statistics</li>
            </ul>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Best Practices for Users
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              To further protect your privacy:
            </p>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569', paddingLeft: 20, marginTop: 8 }}>
              <li>Clear your browser's local storage if using a shared device</li>
              <li>Disable location services if you prefer manual city selection</li>
              <li>Don't share sensitive information in AI conversations</li>
              <li>Keep your browser and operating system updated</li>
              <li>Use a modern browser with security features enabled</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Reporting Security Issues
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              If you discover a security vulnerability or have concerns about our security practices, please contact us through the Support page. We take all security reports seriously and will respond promptly.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
              Security Updates
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: darkMode ? '#cbd5e1' : '#475569' }}>
              We regularly review and update our security practices. Any significant changes to our security measures will be documented in this Security page.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}

export default Security;
