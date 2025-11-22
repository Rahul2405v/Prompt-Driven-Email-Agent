import React, { useState, useEffect } from 'react';
import { processEmail } from '../backendService/promptsService';
import '../css/ChatWidget.css';

const ChatWidget = ({ emailId }) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // when email changes, keep history or reset — here we reset
    setMessages([]);
  }, [emailId]);

  const handleToggle = () => setOpen((v) => !v);

  const handleSend = async () => {
    const q = (prompt || '').trim();
    if (!q) return;
    if (!emailId) {
      setMessages((m) => [...m, { q, a: 'Select an email first to ask about it.' }]);
      setPrompt('');
      return;
    }
    console.log('Processing email with prompt:', q, emailId);
    setLoading(true);
    setPrompt('');
    try {
      const res = await processEmail({ id: emailId, prmopt: q });
      let answer = null;
      if (res && typeof res === 'object') {
        answer = res.processed?.result || res.processed?.reply || res.answer || res.response || res.text || res.raw || JSON.stringify(res);
      } else {
        answer = String(res);
      }
      setMessages((prev) => [...prev, { q, a: answer }]);
    } catch (err) {
      setMessages((prev) => [...prev, { q, a: 'Error: ' + (err.message || String(err)) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget" aria-live="polite">
      <div className={`chat-toggle ${open ? 'open' : ''}`} onClick={handleToggle} title="Chat">
        <div className="chat-icon">💬</div>
        <div className="chat-label">Chat</div>
      </div>

      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <strong>Email Assistant</strong>
            <button className="chat-close" onClick={handleToggle}>✕</button>
          </div>

          <div className="chat-body">
            {messages.length === 0 && <div className="muted">Ask a question about the selected email.</div>}
            {messages.map((m, i) => (
              <div key={i} className="chat-pair">
                <div className="chat-q"><strong>You:</strong> {m.q}</div>
                <div className="chat-a"><strong>Assistant:</strong> <pre style={{whiteSpace: 'pre-wrap', margin: 0}}>{m.a}</pre></div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <textarea
              placeholder={emailId ? 'Ask about the selected email...' : 'Select an email first.'}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
            <div className="chat-actions">
              <button onClick={handleSend} disabled={loading || !prompt.trim()}>{loading ? 'Thinking…' : 'Send'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
