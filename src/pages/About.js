import React from 'react';

function About() {
  return (
    <div className="fade-up" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 900, color: 'var(--on-surface)', tracking: '-0.04em', marginBottom: '8px', textTransform: 'uppercase' }}>About Weathix</h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em' }}>Architectural Ledger & Meteorological Intelligence</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <section className="card--glass" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '100%', background: 'var(--primary)' }}></div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--on-surface)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>The Philosophy</h2>
          <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--on-surface-variant)' }}>
            Weathix is built on the concept of an <strong>Architectural Ledger</strong>. It treats weather data not just as information, but as a record of environmental truth. The design language emphasizes precision, structural integrity, and high-contrast clarity, inspired by technical blueprints and ledger sheets.
          </p>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <section className="card--glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--primary)', marginBottom: '16px' }}>Technology Stack</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'React.js', desc: 'Core Application Framework' },
                { label: 'Open-Meteo', desc: 'Precision Meteorological API' },
                { label: 'NVIDIA AI', desc: 'Predictive Weather Intelligence' },
                { label: 'Leaflet', desc: 'High-Fidelity Geospatial Visualization' }
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '13px' }}>{item.label}</span>
                  <span style={{ fontSize: '10px', color: 'var(--outline)', textTransform: 'uppercase', fontWeight: 700 }}>{item.desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card--glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--primary)', marginBottom: '16px' }}>Project Credits</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--on-surface-variant)' }}>
              Designed and developed with a focus on minimalist utility and aesthetic excellence. Part of the CLANKAK-DEV web ecosystem.
            </p>
          </section>
        </div>

        <section style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--outline)' }}>Precision Engineered for the Modern Web</p>
          <p style={{ fontSize: '14px', fontWeight: 900, color: 'var(--primary)', marginTop: '8px' }}>© 2026 WEATHIX METEOROLOGY</p>
          <p style={{ marginTop: '16px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Powered by <a href="https://www.lahoucinechouker.online/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', borderBottom: '1px solid var(--primary)' }}>Lahoucine Chouker</a>
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
