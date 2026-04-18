import React, { useState, useEffect } from 'react';
import { Ic } from '../utils/icons';
import { useTheme } from '../contexts/ThemeContext';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', rtl: false },
  { code: 'es', name: 'Spanish', native: 'Español', rtl: false },
  { code: 'fr', name: 'French', native: 'Français', rtl: false },
  { code: 'de', name: 'German', native: 'Deutsch', rtl: false },
  { code: 'it', name: 'Italian', native: 'Italiano', rtl: false },
  { code: 'pt', name: 'Portuguese', native: 'Português', rtl: false },
  { code: 'ru', name: 'Russian', native: 'Русский', rtl: false },
  { code: 'ja', name: 'Japanese', native: '日本語', rtl: false },
  { code: 'ko', name: 'Korean', native: '한국어', rtl: false },
  { code: 'zh', name: 'Chinese', native: '中文', rtl: false },
  { code: 'ar', name: 'Arabic', native: 'العربية', rtl: true },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', rtl: false },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', rtl: false },
  { code: 'ur', name: 'Urdu', native: 'اردو', rtl: true },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', rtl: false },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', rtl: false },
  { code: 'th', name: 'Thai', native: 'ไทย', rtl: false },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', rtl: false },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', rtl: false },
  { code: 'pl', name: 'Polish', native: 'Polski', rtl: false },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', rtl: false },
  { code: 'sv', name: 'Swedish', native: 'Svenska', rtl: false },
  { code: 'da', name: 'Danish', native: 'Dansk', rtl: false },
  { code: 'no', name: 'Norwegian', native: 'Norsk', rtl: false },
  { code: 'fi', name: 'Finnish', native: 'Suomi', rtl: false },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', rtl: false },
  { code: 'he', name: 'Hebrew', native: 'עברית', rtl: true },
  { code: 'fa', name: 'Persian', native: 'فارسی', rtl: true },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', rtl: false },
  { code: 'cs', name: 'Czech', native: 'Čeština', rtl: false },
];

const TRANSLATIONS = {
  en: {
    settings: 'Settings',
    language: 'Language',
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    location: 'Location',
    locationEnabled: 'Location Services Enabled',
    locationDisabled: 'Location Services Disabled',
    locationDesc: 'Allow the app to access your location for accurate weather data',
    aiSettings: 'AI Assistant',
    dailyLimit: 'Daily Request Limit',
    resetUsage: 'Reset Daily Usage',
    learn: 'Learn More',
    privacy: 'Privacy Policy',
    security: 'Security',
    about: 'About',
    save: 'Save Changes',
  },
  fr: {
    settings: 'Paramètres',
    language: 'Langue',
    appearance: 'Apparence',
    darkMode: 'Mode Sombre',
    lightMode: 'Mode Clair',
    location: 'Localisation',
    locationEnabled: 'Services de Localisation Activés',
    locationDisabled: 'Services de Localisation Désactivés',
    locationDesc: 'Autoriser l\'application à accéder à votre localisation pour des données météo précises',
    aiSettings: 'Assistant IA',
    dailyLimit: 'Limite Quotidienne',
    resetUsage: 'Réinitialiser l\'Utilisation',
    learn: 'En Savoir Plus',
    privacy: 'Politique de Confidentialité',
    security: 'Sécurité',
    about: 'À Propos',
    save: 'Enregistrer',
  },
  ar: {
    settings: 'الإعدادات',
    language: 'اللغة',
    appearance: 'المظهر',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    location: 'الموقع',
    locationEnabled: 'خدمات الموقع مفعلة',
    locationDisabled: 'خدمات الموقع معطلة',
    locationDesc: 'السماح للتطبيق بالوصول إلى موقعك للحصول على بيانات الطقس الدقيقة',
    learn: 'معرفة المزيد',
    privacy: 'سياسة الخصوصية',
    security: 'الأمان',
    about: 'حول',
    save: 'حفظ التغييرات',
  },
};

function Settings() {
  const { darkMode, toggleTheme } = useTheme();
  const [language, setLanguage] = useState(() => localStorage.getItem('app_language') || 'en');
  const [locationEnabled, setLocationEnabled] = useState(() => localStorage.getItem('location_enabled') !== 'false');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [activePolicy, setActivePolicy] = useState(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isRTL = LANGUAGES.find(l => l.code === language)?.rtl || false;

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('app_language', language);
  }, [language, isRTL]);

  useEffect(() => {
    localStorage.setItem('location_enabled', locationEnabled);
  }, [locationEnabled]);

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLanguage = LANGUAGES.find(l => l.code === language);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setShowLangDropdown(false);
  };

  return (
    <div style={{
      fontFamily: "'Inter',system-ui,sans-serif",
      direction: isRTL ? 'rtl' : 'ltr',
      color: 'var(--text-main)'
    }}>
      <section style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
            {t.language}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Select your preferred language
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              color: 'var(--text-main)',
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.18s'
            }}
          >
            <span>{selectedLanguage?.native} ({selectedLanguage?.name})</span>
            {isRTL ? <Ic.ChevronLeft /> : <Ic.ChevronRight />}
          </button>

          {showLangDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 8,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              maxHeight: 300,
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              zIndex: 100
            }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text-main)',
                  fontSize: 14,
                  outline: 'none'
                }}
              />
              <div style={{ maxHeight: 250, overflowY: 'auto' }}>
                {filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: lang.code === language
                        ? (darkMode ? 'rgba(0,98,255,0.2)' : 'rgba(0,98,255,0.1)')
                        : 'transparent',
                      border: 'none',
                      color: 'var(--text-main)',
                      fontSize: 14,
                      cursor: 'pointer',
                      textAlign: isRTL ? 'right' : 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.18s'
                    }}
                  >
                    <span>{lang.native}</span>
                    <span style={{ fontSize: 12, opacity: 0.6 }}>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
            {t.appearance}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Customize the app's appearance
          </p>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 16,
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>
                {darkMode ? t.darkMode : t.lightMode}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {darkMode ? 'Dark theme enabled' : 'Light theme enabled'}
              </div>
            </div>
            <button
              onClick={toggleTheme}
              style={{
                width: 52,
                height: 28,
                background: darkMode ? '#0062ff' : '#cbd5e1',
                border: 'none',
                borderRadius: 14,
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 2,
                [isRTL ? 'right' : 'left']: darkMode ? 26 : 2,
                width: 24,
                height: 24,
                background: '#fff',
                borderRadius: '50%',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </button>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
            {t.location}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {t.locationDesc}
          </p>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 16,
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>
                {locationEnabled ? t.locationEnabled : t.locationDisabled}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {locationEnabled ? 'GPS and IP-based location enabled' : 'Manual city selection only'}
              </div>
            </div>
            <button
              onClick={() => setLocationEnabled(!locationEnabled)}
              style={{
                width: 52,
                height: 28,
                background: locationEnabled ? '#0062ff' : '#cbd5e1',
                border: 'none',
                borderRadius: 14,
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 2,
                [isRTL ? 'right' : 'left']: locationEnabled ? 26 : 2,
                width: 24,
                height: 24,
                background: '#fff',
                borderRadius: '50%',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </button>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
            {t.learn}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Learn more about our app
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => setActivePolicy('privacy')}
            style={{
              padding: '16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              color: 'var(--text-main)',
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.18s',
              boxShadow: 'var(--shadow)'
            }}>
            <span>{t.privacy}</span>
            {isRTL ? <Ic.ChevronLeft /> : <Ic.ChevronRight />}
          </button>

          <button
            onClick={() => setActivePolicy('security')}
            style={{
              padding: '16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              color: 'var(--text-main)',
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.18s',
              boxShadow: 'var(--shadow)'
            }}>
            <span>{t.security}</span>
            {isRTL ? <Ic.ChevronLeft /> : <Ic.ChevronRight />}
          </button>

          <button
            onClick={() => setActivePolicy('about')}
            style={{
              padding: '16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              color: 'var(--text-main)',
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.18s',
              boxShadow: 'var(--shadow)'
            }}>
            <span>{t.about}</span>
            {isRTL ? <Ic.ChevronLeft /> : <Ic.ChevronRight />}
          </button>
        </div>
      </section>

      {activePolicy && (
        <PolicyModal
          type={activePolicy}
          darkMode={darkMode}
          isRTL={isRTL}
          onClose={() => setActivePolicy(null)}
        />
      )}
    </div>
  );
}

function PolicyModal({ type, darkMode, isRTL, onClose }) {
  const titles = {
    privacy: 'Privacy Policy',
    security: 'Security Information',
    about: 'About Weather Dashboard'
  };

  const content = {
    privacy: [
      'Your privacy is important to us. This app collects location data only to provide accurate weather forecasts.',
      'We do not sell or share your personal data with third parties.',
      'Location data is processed locally whenever possible and only sent to weather providers to fetch data for your current area.',
      'You can disable location services at any time in the settings menu.'
    ],
    security: [
      'We use industry-standard encryption to protect any data sent between your device and our servers.',
      'Our API integrations use secure tokens and environment variables to prevent unauthorized access.',
      'We regularly audit our dependencies to ensure no known vulnerabilities are present in the codebase.',
      'The application runs in a sandbox environment within your browser.'
    ],
    about: [
      'Weather Dashboard v2.0 - A premium weather experience.',
      'Built with React, OpenWeatherMap API, and EmailJS.',
      'Designed to provide beautiful, accurate, and fast weather updates globally.',
      'Developed with a focus on UX/UI excellence and user privacy.'
    ]
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(2, 6, 17, 0.9)', backdropFilter: 'blur(16px)',
      padding: 20
    }} onClick={onClose}>
      <div
        style={{
          width: '100%', maxWidth: 500, background: 'var(--bg-surface)',
          borderRadius: 24, padding: 32, position: 'relative',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          direction: isRTL ? 'rtl' : 'ltr',
          textAlign: isRTL ? 'right' : 'left'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: 20, right: isRTL ? 'auto' : 20, left: isRTL ? 20 : 'auto',
          background: 'none', border: 'none', color: 'var(--text-dim)',
          fontSize: 20, cursor: 'pointer'
        }}>✕</button>

        <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>
          {titles[type]}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {content[type].map((p, i) => (
            <p key={i} style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>
              • {p}
            </p>
          ))}
        </div>

        <button onClick={onClose} style={{
          marginTop: 32, width: '100%', padding: '14px',
          background: '#0062ff', color: '#fff', border: 'none',
          borderRadius: 14, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,98,255,0.3)'
        }}>Close</button>
      </div>
    </div>
  );
}

export default Settings;
