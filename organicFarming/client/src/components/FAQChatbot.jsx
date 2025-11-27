import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import faqs from '../data/faqs';

// tiny matcher: normalize text, score by keyword hits & substring includes
function scoreQuestion(q, userText) {
  const t = userText.toLowerCase().trim();
  const base = q.toLowerCase();
  if (!t) return 0;
  let score = 0;
  // direct contains boost
  if (base.includes(t)) score += 3;
  // keyword overlap
  const words = t.split(/\s+/).filter(Boolean);
  for (const w of words) {
    if (w.length >= 3 && base.includes(w)) score += 1;
  }
  return score;
}

const SUGGESTIONS = [
  'How do I track my order?',
  'Payment methods',
  'Delivery time',
  'Are products organic?',
];

export default function FAQChatbot({ user }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('faq_chat_history');
    return saved ? JSON.parse(saved) : [
      { from: 'bot', text: `Hi${user?.username ? ` ${user.username}` : ''}! 👋 How can I help you today?` }
    ];
  });
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('faq_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const bestAnswers = useMemo(() => {
    const asked = input.trim();
    if (!asked) return [];
    const scored = faqs
      .map(f => ({ ...f, s: scoreQuestion(f.q, asked) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3);
    return scored;
  }, [input]);

  function askBot(text) {
    // push user message
    setMessages(prev => [...prev, { from: 'user', text }]);
    // find best matches
    const scored = faqs
      .map(f => ({ ...f, s: scoreQuestion(f.q, text) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 2);

    const reply = scored.length
      ? scored.map(s => `• ${s.a}`).join('\n\n')
      : "Sorry, I couldn't find that. Try: “track order”, “payment methods”, “delivery time”, or “farmer profile”.";

    // simulate tiny delay
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
    }, 200);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;
    setInput('');
    askBot(t);
  };

  const bubble = (m, i) => (
    <div key={i} style={{
      display: 'flex',
      justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start',
      marginBottom: 8
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '10px 12px',
        borderRadius: 12,
        whiteSpace: 'pre-wrap',
        background: m.from === 'user' ? '#d1fae5' : '#eef2ff',
        border: '1px solid #e5e7eb',
        fontSize: 14
      }}>
        {m.text}
      </div>
    </div>
  );

  if (!user) return null; // only for logged-in users

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: 9999,
          background: '#16a34a',
          color: '#fff',
          border: 'none',
          borderRadius: 999,
          padding: '12px 16px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          cursor: 'pointer'
        }}
        aria-label="Open FAQ chatbot"
      >
        {open ? 'Close FAQ' : 'FAQ Chat'}
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            right: 20,
            bottom: 80,
            width: 340,
            maxHeight: 480,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ padding: 12, background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
            <strong>Help Center</strong>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Ask something about orders, payments, farmers…</div>
          </div>

          {/* messages */}
          <div style={{ padding: 12, overflowY: 'auto', flex: 1 }}>
            {messages.map(bubble)}
            <div ref={endRef} />
          </div>

          {/* suggestions */}
          <div style={{ padding: '0 12px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => askBot(s)}
                style={{
                  fontSize: 12,
                  background: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: 999,
                  padding: '6px 10px',
                  cursor: 'pointer'
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* input */}
          <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #e5e7eb' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              style={{
                flex: 1, padding: '10px 12px', borderRadius: 8,
                border: '1px solid #e5e7eb', outline: 'none'
              }}
            />
            <button type="submit" style={{
              background: '#16a34a', color: '#fff', border: 'none',
              borderRadius: 8, padding: '10px 12px', cursor: 'pointer'
            }}>
              Send
            </button>
          </form>

          {/* live matches preview */}
          {bestAnswers.length > 0 && (
            <div style={{ padding: '6px 12px', borderTop: '1px dashed #e5e7eb', background: '#fafafa' }}>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Suggestions:</div>
              {bestAnswers.map((b, i) => (
                <div key={i} style={{ fontSize: 12, marginBottom: 4 }}>• {b.a}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
