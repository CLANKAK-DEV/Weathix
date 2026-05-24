import React from 'react';
import { useChatViewModel } from '../viewmodels/useChatViewModel';
import { MAX_CHAT_TEXT_LENGTH } from '../services/deepSeekAIService';

function ChatAgent({ weather }) {
  const { open, toggleOpen, messages, input, setInput, loading, usage, listRef, submit, ask } = useChatViewModel(weather);

  const quickActions = ['Weather tips', 'What to wear?', 'Is it going to rain?', 'Temperature forecast'];
  const exhausted = usage.used >= usage.limit;

  return (
    <>
      <style>{`
        .chat-toggle-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
        }
        .chat-window {
          position: fixed;
          bottom: 96px;
          right: 24px;
          width: 420px;
          height: 600px;
          max-width: calc(100vw - 2rem);
          max-height: calc(100vh - 120px);
          border-radius: 24px;
        }
        @media (max-width: 600px) {
          .chat-toggle-btn {
            bottom: 16px;
            right: 16px;
          }
          .chat-window {
            bottom: 0;
            right: 0;
            width: 100vw;
            height: 100vh;
            max-width: 100vw;
            max-height: 100vh;
            border-radius: 0;
          }
        }
        @keyframes chatWait { 0%,80%,100% { transform: scale(0); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
      `}</style>
      <button
        className="chat-toggle-btn"
        onClick={toggleOpen}
        title="AI Weather Assistant"
        style={{
          zIndex: 40,
          height: 56,
          width: open ? 56 : 'auto',
          padding: open ? 0 : '0 20px',
          background: 'var(--primary)',
          color: 'var(--on-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: 'var(--shadow-lg)',
          transition: 'background 0.2s ease, width 0.25s ease',
          borderRadius: 28,
          border: 'none',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-container)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary)'; }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
          {open ? 'close' : 'smart_toy'}
        </span>
        {!open && (
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            AI Assistant
          </span>
        )}
      </button>

      {open && (
        <div
          className="slab--glass slab-in chat-window"
          style={{
            zIndex: 40,
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <header
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--outline-variant)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--surface-container-low)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  background: 'var(--primary-container)',
                  color: 'var(--on-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>smart_toy</span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--on-surface)' }}>
                  WEATHER AI
                </div>
                <div style={{ fontSize: 10, color: 'var(--secondary)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <span style={{ width: 6, height: 6, background: 'var(--secondary)' }} />
                  Online
                </div>
              </div>
            </div>
            <div
              style={{
                textAlign: 'right',
                background: 'var(--surface-container-highest)',
                padding: '6px 10px',
                border: '1px solid var(--outline-variant)',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 900, color: exhausted ? 'var(--error)' : 'var(--primary-container)' }}>
                {usage.used}/{usage.limit}
              </div>
              <div style={{ fontSize: 8, color: 'var(--outline)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Requests
              </div>
            </div>
          </header>

          <div
            ref={listRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: 'var(--background)',
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  maxWidth: '88%',
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  padding: '10px 14px',
                  marginLeft: m.role === 'user' ? 'auto' : 0,
                  background: m.role === 'user'
                    ? 'var(--primary-container)'
                    : m.isError
                      ? 'var(--error-container)'
                      : 'var(--surface-container-low)',
                  color: m.role === 'user'
                    ? 'var(--on-primary)'
                    : m.isError
                      ? 'var(--on-error-container)'
                      : 'var(--on-surface)',
                  border: '1px solid ' + (m.isError ? 'var(--error)' : 'var(--outline-variant)'),
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  background: 'var(--surface-container-low)',
                  padding: '10px 14px',
                  width: 'fit-content',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  border: '1px solid var(--outline-variant)',
                }}
              >
                <div style={{ display: 'flex', gap: 4 }}>
                  <div style={{ width: 6, height: 6, background: 'var(--primary-container)', animation: 'chatWait 1.4s infinite ease-in-out both' }} />
                  <div style={{ width: 6, height: 6, background: 'var(--primary-container)', animation: 'chatWait 1.4s infinite ease-in-out both', animationDelay: '0.2s' }} />
                  <div style={{ width: 6, height: 6, background: 'var(--primary-container)', animation: 'chatWait 1.4s infinite ease-in-out both', animationDelay: '0.4s' }} />
                </div>
                <style>{`@keyframes chatWait { 0%,80%,100% { transform: scale(0); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }`}</style>
              </div>
            )}
          </div>

          <div
            style={{
              padding: '10px 16px',
              borderTop: '1px solid var(--outline-variant)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              background: 'var(--surface-container-low)',
            }}
          >
            {quickActions.map((a) => (
              <button
                key={a}
                onClick={() => ask(a)}
                disabled={loading || exhausted}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '7px 12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--outline-variant)',
                  color: 'var(--on-surface-variant)',
                  cursor: loading || exhausted ? 'not-allowed' : 'pointer',
                  opacity: loading || exhausted ? 0.5 : 1,
                }}
                onMouseEnter={(e) => { if (!loading && !exhausted) { e.currentTarget.style.background = 'var(--primary-container)'; e.currentTarget.style.color = 'var(--on-primary)'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--on-surface-variant)'; }}
              >
                {a}
              </button>
            ))}
          </div>

          <form
            onSubmit={submit}
            style={{
              padding: '16px 16px 22px',
              display: 'flex',
              gap: 10,
              borderTop: '1px solid var(--outline-variant)',
              background: 'var(--surface)',
              position: 'relative',
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={exhausted ? 'Daily request limit reached' : 'Message Weather AI...'}
              disabled={loading || exhausted}
              maxLength={MAX_CHAT_TEXT_LENGTH}
              style={{
                flex: 1,
                background: 'var(--surface-container-low)',
                padding: '12px 14px',
                outline: 'none',
                fontSize: 13,
                color: 'var(--on-surface)',
                border: '1px solid var(--outline-variant)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary-container)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--outline-variant)')}
            />
            <span style={{ position: 'absolute', left: 18, bottom: 4, fontSize: 9, color: 'var(--outline)', fontWeight: 700 }}>
              {input.length}/{MAX_CHAT_TEXT_LENGTH}
            </span>
            <button
              type="submit"
              disabled={loading || exhausted || !input.trim()}
              style={{
                width: 44,
                height: 44,
                background: loading || exhausted || !input.trim() ? 'var(--surface-container-highest)' : 'var(--primary)',
                color: loading || exhausted || !input.trim() ? 'var(--outline)' : 'var(--on-primary)',
                border: 'none',
                cursor: loading || exhausted || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {loading ? (
                <span style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', animation: 'spin .8s linear infinite' }} />
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatAgent;
