import React from 'react';
import { useChatViewModel } from '../viewmodels/useChatViewModel';

function ChatAgent({ weather }) {
  const vm = useChatViewModel(weather);
  const { open, toggleOpen, messages, input, setInput, loading, usage, listRef, submit, ask } = vm;

  const quickActions = ['Weather tips', 'What to wear?', 'Is it going to rain?', 'Temperature forecast'];

  return (
    <>
      <button
        onClick={toggleOpen}
        title="AI Weather Assistant"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 40,
          height: '64px',
          width: open ? '64px' : 'auto',
          borderRadius: '32px',
          background: 'linear-gradient(135deg, #0062ff 0%, #3b9eff 50%, #ff9d00 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          boxShadow: '0 12px 40px rgba(0, 98, 255, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: open ? '0' : '0 28px',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 18px 48px rgba(0, 98, 255, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 98, 255, 0.4)';
        }}
      >
        {!open ? (
          <>
            <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(0,98,255,0.3)' }}>
              <img src="/icons/ai_bot.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>AI Assistant</span>
          </>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        )}
      </button>

      {open && (
        <div style={{
          position: 'fixed',
          bottom: '108px',
          right: '24px',
          zIndex: 40,
          width: '420px',
          maxWidth: 'calc(100vw - 2rem)',
          height: '600px',
          borderRadius: '28px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(32px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'chatPop .4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}>
          <style>
            {`
              @keyframes chatPop {
                from { opacity: 0; transform: translateY(30px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              .chat-msg { animation: msgIn .3s ease-out forwards; }
              @keyframes msgIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
              ::-webkit-scrollbar { width: 4px; }
              ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}
          </style>

          <header style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, var(--bg-input) 0%, transparent 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(0, 98, 255, 0.2)',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                <img src="/icons/ai_bot.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Weathix AI</div>
                <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
                  Online
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', background: 'var(--bg-input)', padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, color: usage.used >= usage.limit ? '#ef4444' : '#0062ff' }}>
                {usage.used}/{usage.limit}
              </div>
              <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>Requests</div>
            </div>
          </header>

          <div ref={listRef} style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            scrollBehavior: 'smooth'
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className="chat-msg"
                style={{
                  maxWidth: '88%',
                  fontSize: '14.5px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  borderRadius: '18px',
                  padding: '12px 18px',
                  marginLeft: m.role === 'user' ? 'auto' : 0,
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, #0062ff 0%, #0052d9 100%)'
                    : m.isError
                    ? 'rgba(239, 68, 68, 0.12)'
                    : 'var(--bg-input)',
                  color: m.role === 'user' ? '#fff' : m.isError ? '#ef4444' : 'var(--text-main)',
                  borderBottomLeftRadius: m.role === 'user' ? '18px' : '4px',
                  borderBottomRightRadius: m.role === 'user' ? '4px' : '18px',
                  border: '1px solid ' + (m.role === 'user' ? 'rgba(255,255,255,0.1)' : m.isError ? 'rgba(239, 68, 68, 0.2)' : 'var(--border)'),
                  boxShadow: m.role === 'user' ? '0 4px 12px rgba(0,98,255,0.25)' : 'none'
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '18px',
                borderBottomLeftRadius: '4px',
                padding: '12px 18px',
                width: 'fit-content',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0062ff', animation: 'chatWait 1.4s infinite ease-in-out both' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0062ff', animation: 'chatWait 1.4s infinite ease-in-out both', animationDelay: '0.2s' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0062ff', animation: 'chatWait 1.4s infinite ease-in-out both', animationDelay: '0.4s' }} />
                </div>
                <style>
                  {`
                    @keyframes chatWait {
                      0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
                      40% { transform: scale(1.0); opacity: 1; }
                    }
                  `}
                </style>
              </div>
            )}
          </div>

          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            background: 'rgba(255,255,255,0.01)'
          }}>
            {quickActions.map((a) => (
              <button
                key={a}
                onClick={() => ask(a)}
                disabled={loading}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '7px 14px',
                  borderRadius: '20px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: loading ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                }}
              >
                {a}
              </button>
            ))}
          </div>

          <form onSubmit={submit} style={{
            padding: '20px',
            display: 'flex',
            gap: '12px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-input)'
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Weathix AI..."
              disabled={loading}
              maxLength={500}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '16px',
                padding: '12px 18px',
                outline: 'none',
                fontSize: '14px',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(0, 98, 255, 0.4)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0062ff 0%, #3b9eff 50%, #ff9d00 100%)',
                border: 'none',
                color: '#fff',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: loading || !input.trim() ? 'none' : '0 4px 12px rgba(0,98,255,0.3)'
              }}
            >
              {loading ? (
                <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatAgent;
