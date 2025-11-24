import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { replyToEmail } from '../backendService/rag_service';
import '../css/RagChat.css';
import MessageItem from './MessageItem';

export default function RagChat({ initialPrompt = 'Summarize recent emails for me' }) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [messages, setMessages] = useState(() => {
    // Load from localStorage on initial render
    try {
      const saved = localStorage.getItem('ragChatHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load chat history:', e);
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [k, setK] = useState(() => {
    // Load k from localStorage
    try {
      const saved = localStorage.getItem('ragChatK');
      return saved ? Number(saved) : 3;
    } catch (e) {
      return 3;
    }
  });
  
  const chatRef = useRef();
  const historyRef = useRef();

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('ragChatHistory', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }, [messages]);

  // Save k to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('ragChatK', String(k));
    } catch (e) {
      console.error('Failed to save k:', e);
    }
  }, [k]);

  // Entrance animation
  useEffect(() => {
    if (chatRef.current) {
      gsap.fromTo(
        chatRef.current,
        { y: 20, autoAlpha: 0 },
        { duration: 0.5, y: 0, autoAlpha: 1, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, []);

  // Animate new messages
  useEffect(() => {
    if (historyRef.current && messages.length > 0) {
      const lastMsg = historyRef.current.lastElementChild;
      if (lastMsg) {
        gsap.fromTo(
          lastMsg,
          { x: -20, autoAlpha: 0 },
          { duration: 0.4, x: 0, autoAlpha: 1, ease: 'power2.out' }
        );
        lastMsg.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, [messages]);

  const send = async () => {
    if (!prompt || loading) return;
    const userMsg = { role: 'user', text: prompt };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const resp = await replyToEmail(prompt, k);
      // resp expected shape: { answer, chunks, extracted_ids }
      console.log('RAG response:', resp);
      const assistantText = resp.answer || JSON.stringify(resp);
      const meta = { extracted_ids: resp.extracted_ids || [] };
      const assistantMsg = { role: 'assistant', text: assistantText, meta };
      setMessages((m) => [...m, assistantMsg]);
    } catch (err) {
      console.error('RAG request failed', err);
      setMessages((m) => [...m, { role: 'assistant', text: 'Error: failed to get answer.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setMessages([]);
    try {
      localStorage.removeItem('ragChatHistory');
    } catch (e) {
      console.error('Failed to clear chat history:', e);
    }
  };

  const copyAnswer = (text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  return (
    <div className="rag-chat" ref={chatRef}>
      <div className="rag-header">
        <div className="rag-title-container">
          <span className="rag-icon">🤖</span>
          <div className="rag-title">RAG Assistant</div>
        </div>
        <div className="rag-controls">
          <label className="k-label">Top-K</label>
          <input type="number" min={0} max={10} value={k} onChange={(e) => setK(Number(e.target.value || 0))} />
          <button className="btn-clear" onClick={clear}>Clear All</button>
        </div>
      </div>

      <div className="rag-history" ref={historyRef}>
        {messages.length === 0 && (
          <div className="rag-empty">
            <div className="empty-icon">💬</div>
            <p>Ask about your inbox and I'll summarize and point to related emails.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <MessageItem key={i} msg={m} onEmailClick={(emailId) => {
            console.log('Email clicked:', emailId);
            // Try to find and click the email in the list
            const emailElement = document.querySelector(`[data-email-id="${emailId}"]`);
            if (emailElement) {
              emailElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              emailElement.click();
            } else {
              alert(`Email ID: ${emailId}\nClick OK to search for this email in your inbox.`);
            }
          }} />
        ))}
      </div>

      <div className="rag-input">
        <textarea 
          rows={3} 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask me anything about your emails..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              send();
            }
          }}
        />
        <div className="rag-actions">
          <div className="input-hint">Ctrl + Enter to send</div>
          <div className="action-buttons">
            <button className="btn ghost" onClick={clear}>Clear</button>
            <button className="btn primary" onClick={send} disabled={loading}>
              {loading ? '🤔 Thinking…' : '✨ Ask'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
