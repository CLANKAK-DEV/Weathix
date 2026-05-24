import React, { useEffect, useMemo, useState } from 'react';
import emailjs from '@emailjs/browser';

const FAQ_DATA = [
  {
    q: 'How is the data sourced?',
    a: 'We aggregate data from multiple global meteorological stations, cross-referencing satellite telemetry with ground-level sensors to ensure architectural-grade precision.'
  },
  {
    q: 'Can I use this offline?',
    a: 'The app caches the last known forecast for saved locations. However, real-time updates and radar imagery require an active internet connection.'
  },
  {
    q: 'How often does the radar update?',
    a: 'High-resolution radar imagery is refreshed every 5 minutes in active precipitation zones, and every 15 minutes globally.'
  },
  {
    q: 'What do the density metrics mean?',
    a: 'Density metrics provide a combined reading of humidity, pressure, and particulate matter to indicate the \'heaviness\' of the local atmosphere.'
  }
];

function FAQItem({ q, a, index }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className="card--glass group cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
      style={{
        padding: '24px',
        marginBottom: '4px',
        transition: 'all 0.2s ease',
        background: 'var(--surface-container-low)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-variant)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-container-low)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontWeight: 800, color: 'var(--on-surface)', fontSize: '15px' }}>{q}</h4>
        <span className="material-symbols-outlined" style={{ 
          color: 'var(--outline)', 
          transform: isOpen ? 'rotate(-180deg)' : 'rotate(0)',
          transition: 'transform 0.25s ease'
        }}>expand_more</span>
      </div>
      <div style={{
        maxHeight: isOpen ? '200px' : '0',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isOpen ? 1 : 0,
      }}>
        <p style={{ 
          color: 'var(--on-surface-variant)', 
          fontSize: '13px', 
          lineHeight: '1.7', 
          paddingTop: '16px',
          marginTop: '16px',
          borderTop: '1px solid rgba(0,0,0,0.08)' 
        }}>
          {a}
        </p>
      </div>
    </div>
  );
}

function Support() {
  const [form, setForm] = useState({ name: '', email: '', category: 'Data Discrepancy', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendError, setSendError] = useState('');

  const emailConfig = useMemo(() => ({
    serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
    templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
    publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
  }), []);

  const isEmailConfigured = Boolean(emailConfig.serviceId && emailConfig.templateId && emailConfig.publicKey);

  useEffect(() => {
    if (emailConfig.publicKey) {
      emailjs.init({ publicKey: emailConfig.publicKey });
    }
  }, [emailConfig.publicKey]);

  const getEmailErrorMessage = (error) => {
    const detail = error?.text ? ` EmailJS says: ${error.text}` : '';
    const text = error?.text || '';

    if (text.toLowerCase().includes('invalid grant')) {
      return 'EmailJS is connected, but Gmail authorization expired. Reconnect the Gmail service in EmailJS, then use "Send test email" in the EmailJS dashboard.';
    }

    if (error?.status === 412) {
      return `EmailJS rejected the request. Check your service, template, public key, and required template variables.${detail}`;
    }
    if (error?.status === 403) return 'EmailJS blocked this request. Check allowed origins and account restrictions.';
    if (error?.status === 429) return 'Too many support requests were sent. Please wait a moment and try again.';
    return `Failed to send message. Please try again later.${detail}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendError('');

    if (!isEmailConfigured) {
      setSendError('EmailJS is not configured. Add service ID, template ID, and public key to .env, then restart the dev server.');
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        {
          name: form.name,
          from_name: form.name,
          user_name: form.name,
          email: form.email,
          from_email: form.email,
          user_email: form.email,
          reply_to: form.email,
          title: form.category,
          subject: form.category,
          category: form.category,
          message: form.message,
          time: new Date().toLocaleString(),
          to_email: 'clankcmc@gmail.com'
        },
        emailConfig.publicKey
      );
      setSubmitted(true);
      setForm({ name: '', email: '', category: 'Data Discrepancy', message: '' });
    } catch (error) {
      console.error('EmailJS request failed:', { status: error?.status, text: error?.text });
      setSendError(getEmailErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page" style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      <div className="support-heading" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--on-surface)', marginBottom: '8px' }}>Support</h2>
        <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--outline)' }}>Technical Assistance & Queries</p>
      </div>

      <div className="support-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
        {/* Left Column: Form */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card--glass support-card" style={{ padding: '40px', background: 'var(--surface-container-low)' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--on-surface)', marginBottom: '32px' }}>Submit a Request</h3>
            
            {submitted ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)', marginBottom: '16px' }}>check_circle</span>
                <p style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '14px' }}>Request Transmitted</p>
                <button onClick={() => setSubmitted(false)} style={{ marginTop: '24px', background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', padding: '12px 24px', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', cursor: 'pointer' }}>New Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {sendError && (
                  <div style={{ background: 'var(--error-container)', color: 'var(--on-error-container)', border: '1px solid var(--error)', padding: '12px 14px', fontSize: 12, lineHeight: 1.5, fontWeight: 700 }}>
                    {sendError}
                  </div>
                )}
                <div className="support-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="support-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)' }}>Name</label>
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      required
                      style={{ width: '100%', minWidth: 0, background: 'transparent', border: 'none', borderBottom: '1px solid var(--outline-variant)', padding: '8px 0', fontSize: '14px', color: 'var(--on-surface)', outline: 'none' }}
                    />
                  </div>
                  <div className="support-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)' }}>Email</label>
                    <input 
                      type="email" 
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      required
                      style={{ width: '100%', minWidth: 0, background: 'transparent', border: 'none', borderBottom: '1px solid var(--outline-variant)', padding: '8px 0', fontSize: '14px', color: 'var(--on-surface)', outline: 'none' }}
                    />
                  </div>
                </div>

                <div className="support-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)' }}>Query Category</label>
                  <select 
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                    style={{ width: '100%', minWidth: 0, background: 'transparent', border: 'none', borderBottom: '1px solid var(--outline-variant)', padding: '8px 0', fontSize: '14px', color: 'var(--on-surface)', outline: 'none', appearance: 'none' }}
                  >
                    <option>Data Discrepancy</option>
                    <option>Account Issue</option>
                    <option>API Access</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="support-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)' }}>Message Details</label>
                  <textarea 
                    placeholder="Describe the technical issue..."
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    required
                    style={{ width: '100%', minWidth: 0, background: 'transparent', border: 'none', borderBottom: '1px solid var(--outline-variant)', padding: '8px 0', fontSize: '14px', color: 'var(--on-surface)', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ paddingTop: '16px' }}>
                  <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                      background: 'var(--primary)', 
                      color: 'var(--on-primary)', 
                      border: 'none', 
                      padding: '16px 32px', 
                      fontWeight: 900, 
                      textTransform: 'uppercase', 
                      fontSize: '11px', 
                      letterSpacing: '0.12em', 
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Right Column: FAQ & Contact */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h3 style={{ 
              fontSize: '11px', 
              fontWeight: 900, 
              textTransform: 'uppercase', 
              letterSpacing: '0.14em', 
              color: 'var(--on-surface)', 
              marginBottom: '24px',
              paddingLeft: '16px',
              borderLeft: '4px solid var(--primary)'
            }}>Knowledge Base</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {FAQ_DATA.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
          </div>

          <div className="card--glass" style={{ padding: '32px', display: 'flex', gap: '20px', alignItems: 'flex-start', background: 'var(--primary-container)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--on-primary-container)' }}>mail</span>
            <div>
              <h5 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-primary)', marginBottom: '4px' }}>Direct Email</h5>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--on-primary-container)' }}>clankcmc@gmail.com</p>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-primary-container)', opacity: 0.7, marginTop: '8px' }}>Response time: &lt; 2 hours</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Support;
