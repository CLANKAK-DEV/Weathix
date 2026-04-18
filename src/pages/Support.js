import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useTheme } from '../contexts/ThemeContext';

const Ic = {
  ChevronLeft:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronDown:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Help:         (props) => <IconWrapper src="/icons/question_line.png" alt="FAQ" size={22} {...props} />,
  Mail:         (props) => <IconWrapper src="/icons/support_mail.png" alt="Email" size={22} {...props} />,
  Check:        () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Send:         (props) => <IconWrapper src="/icons/message_line.png" alt="Message" size={20} {...props} />,
  Phone:        () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Clock:        (props) => <IconWrapper src="/icons/clock.png" alt="Response" size={20} {...props} />,
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

const FAQ_DATA = [
  {
    q: 'How accurate is the weather data?',
    a: 'Our data is sourced from Open-Meteo, which aggregates several national meteorological models (NOAA, ECMWF, DWD). Current conditions refresh in real time; hourly forecasts cover the next 48 hours, daily forecasts up to 14 days ahead.'
  },
  {
    q: 'What cities can I search for?',
    a: 'Any city worldwide. Start typing in the search bar and we geocode candidates from a global database. Select one to instantly fetch its current weather and forecast.'
  },
  {
    q: 'How does the AI Weather Assistant work?',
    a: 'The AI assistant uses Venice AI to analyze the current conditions for your active city and answer questions in natural language — clothing suggestions, rain timing, UV safety, etc. There is a daily request limit per user shown in the chat header.'
  },
  {
    q: 'Is my location data stored on a server?',
    a: 'No. Coordinates are sent only to the weather API for that one request and are not retained. Your saved cities are kept locally in your browser (localStorage) — they never leave your device.'
  },
  {
    q: 'Can I use the app offline?',
    a: 'An internet connection is required to fetch live weather data, but your saved-city list and app state persist locally, so switching between saved cities is instant once you come back online.'
  },
  {
    q: 'How do I save a city?',
    a: 'Open a city on the dashboard and click "+ Save Location" on the hero card. The city appears in the left sidebar for one-click switching, and can be removed from the sidebar or the Saved Locations page.'
  },
  {
    q: 'Why are some days in the calendar empty?',
    a: 'Forecast data is only available for the next 14 days. Days beyond that window show a "···" placeholder — there simply is no forecast for them yet.'
  },
  {
    q: 'How often is the data updated?',
    a: 'Weather data refreshes each time you open or change cities. The clock in the top header updates every 30 seconds; switch between saved locations to pull the latest reading.'
  }
];

function FAQItem({ q, a, isOpen, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        background: isOpen ? 'rgba(0,98,255,0.06)' : hov ? 'var(--bg-input)' : 'var(--bg-input)',
        border: `1px solid ${isOpen ? 'rgba(0,98,255,0.25)' : hov ? 'var(--border)' : 'var(--border)'}`,
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <button
        onClick={onClick}
        style={{
          width: '100%', padding: '16px 20px', textAlign: 'left',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
          background: 'transparent', border: 'none', color: 'var(--text-main)',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 14, color: isOpen ? '#3b9eff' : '#f1f5f9' }}>{q}</span>
        <span style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isOpen ? 'rgba(0,98,255,0.2)' : 'var(--bg-input)',
          color: isOpen ? '#3b9eff' : 'var(--text-muted)',
          transform: isOpen ? 'rotate(-180deg)' : 'rotate(0)',
          transition: 'all 0.25s ease',
        }}>
          <Ic.ChevronDown />
        </span>
      </button>
      <div style={{
        maxHeight: isOpen ? 240 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}>
        <div style={{
          padding: '0 20px 18px', fontSize: 13.5, lineHeight: 1.65, color: 'var(--text-muted)',
          borderTop: '1px solid var(--border)', paddingTop: 14
        }}>
          {a}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: 1.2, color: 'var(--text-muted)', marginBottom: 8,
      }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = (focused) => ({
  width: '100%',
  background: 'var(--bg-input)',
  border: `1px solid ${focused ? '#0062ff' : 'var(--border)'}`,
  borderRadius: 11,
  padding: '12px 14px',
  color: 'var(--text-main)',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.18s ease, background 0.18s ease',
  boxShadow: focused ? '0 0 0 3px rgba(0,98,255,0.15)' : 'none',
});

function Support() {
  const [openFAQ, setOpenFAQ] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', category: 'Bug report', subject: '', message: '' });
  const [focused, setFocused] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    const templateParams = {
      name: form.name,
      email: form.email,
      title: `${form.category}: ${form.subject || 'No Subject'}`,
      message: form.message,
      time: new Date().toLocaleString(),
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setSubmitted(true);
      setForm({ name: '', email: '', category: 'Bug report', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('EmailJS Error:', err);
      setError('Failed to send message. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const valid = form.name.trim() && form.email.trim() && form.message.trim();

  return (
    <div style={{ color: 'var(--text-main)' }}>
      <section style={{ marginBottom: 32 }}>
        <div className="fade-up" style={{
          background: 'linear-gradient(135deg, rgba(0,98,255,0.1), rgba(255,157,0,0.05))',
          border: '1px solid rgba(0,98,255,0.2)',
          borderRadius: 22,
          padding: '28px 32px',
          display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 28, alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.8px', marginBottom: 8 }}>
              How can we help you today?
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 640 }}>
              Found a bug, have a feature request, or just a question? Use the form below and we'll respond as soon as we can. Most common questions are answered in the FAQ section.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#3b9eff', opacity: 0.8 }}><Ic.Mail /></span>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Email</div>
                <div style={{ fontSize: 12, color: 'var(--text-main)', fontWeight: 600 }}>clankcmc@gmail.com</div>
              </div>
            </div>
            <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#4ade80', opacity: 0.8 }}><Ic.Clock /></span>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Response</div>
                <div style={{ fontSize: 12, color: 'var(--text-main)', fontWeight: 600 }}>Within 24 hours</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)', gap: 28 }}>

        <section className="fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ color: '#3b9eff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic.Send width={24} height={24} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.4px' }}>Contact Us</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Describe your issue or suggestion</p>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: 26,
            minHeight: 520,
            boxShadow: 'var(--shadow)'
          }}>
            {submitted ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '60px 20px', animation: 'popIn .3s ease',
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#4ade80', marginBottom: 20,
                }}>
                  <Ic.Check />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#4ade80', marginBottom: 8 }}>
                  Message Sent!
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 320 }}>
                  Thanks for reaching out — we'll get back to you at <strong style={{ color: 'var(--text-main)' }}>{form.email}</strong> within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {error && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fca5a5',
                    fontSize: 13,
                    marginBottom: 10
                  }}>
                    {error}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Name">
                    <input
                      type="text" required
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused('')}
                      style={inputStyle(focused === 'name')}
                      placeholder="Your full name"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      type="email" required
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      style={inputStyle(focused === 'email')}
                      placeholder="you@example.com"
                    />
                  </Field>
                </div>

                <Field label="Category">
                  <select
                    value={form.category}
                    onChange={e => update('category', e.target.value)}
                    onFocus={() => setFocused('category')}
                    onBlur={() => setFocused('')}
                    style={{ ...inputStyle(focused === 'category'), cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\'><polyline points=\'2,2 6,6 10,2\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36 }}
                  >
                    <option style={{ background: 'var(--bg-surface)', color: 'var(--text-main)' }}>Bug report</option>
                    <option style={{ background: 'var(--bg-surface)', color: 'var(--text-main)' }}>Feature request</option>
                    <option style={{ background: 'var(--bg-surface)', color: 'var(--text-main)' }}>Data accuracy issue</option>
                    <option style={{ background: 'var(--bg-surface)', color: 'var(--text-main)' }}>Other</option>
                  </select>
                </Field>

                <Field label="Subject">
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => update('subject', e.target.value)}
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused('')}
                    style={inputStyle(focused === 'subject')}
                    placeholder="Brief summary"
                  />
                </Field>

                <Field label="Message">
                  <textarea
                    required rows={6} maxLength={1000}
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused('')}
                    style={{ ...inputStyle(focused === 'message'), resize: 'vertical', minHeight: 120 }}
                    placeholder="Tell us what's happening. If it's a bug, include steps to reproduce, the browser you're using, and any screenshots if possible."
                  />
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 8, fontWeight: 600 }}>
                    {form.message.length}/1000 characters
                  </div>
                </Field>

                <button
                  type="submit"
                  disabled={!valid || loading}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: 12,
                    background: valid && !loading ? 'linear-gradient(135deg, #0062ff 0%, #0052d9 100%)' : 'var(--bg-input)',
                    border: 'none',
                    color: valid && !loading ? '#fff' : 'var(--text-muted)',
                    fontSize: 15, fontWeight: 700,
                    cursor: valid && !loading ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    boxShadow: valid && !loading ? '0 8px 24px rgba(0,98,255,0.3)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    fontFamily: 'inherit',
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Ic.Send /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ color: '#ffb84d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic.Help width={24} height={24} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.4px' }}>Frequently Asked Questions</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{FAQ_DATA.length} answers to common questions</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQ_DATA.map((faq, i) => (
              <FAQItem
                key={i}
                q={faq.q}
                a={faq.a}
                isOpen={openFAQ === i}
                onClick={() => setOpenFAQ(openFAQ === i ? -1 : i)}
              />
            ))}
          </div>

          <div style={{
            marginTop: 20, padding: '18px 20px', borderRadius: 14,
            background: 'var(--bg-input)', border: '1px dashed var(--border)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ fontSize: 28 }}>💡</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>Still need help?</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Fill out the form on the left and we'll follow up personally.</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Support;
