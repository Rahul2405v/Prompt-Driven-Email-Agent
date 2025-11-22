import React, { useState } from 'react';
import { replyToEmail } from '../backendService/rag_service';
import '../css/RagChat.css';
import MessageItem from './MessageItem';

export default function RagChat({ initialPrompt = 'Summarize recent emails for me' }) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant', text, meta }
  const [loading, setLoading] = useState(false);
  const [k, setK] = useState(3);

  const send = async () => {
    if (!prompt || loading) return;
    const userMsg = { role: 'user', text: prompt };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const resp = await replyToEmail(prompt, k);
      // resp expected shape: { answer, chunks, extracted_ids }
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
  };

  const copyAnswer = (text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  return (
    <div className="rag-chat">
      <div className="rag-header">
        <div className="rag-title">RAG Assistant</div>
        <div className="rag-controls">
          <label style={{ fontSize: 12, color: '#556' }}>k</label>
          <input type="number" min={0} value={k} onChange={(e) => setK(Number(e.target.value || 0))} />
          <button onClick={clear}>Clear</button>
        </div>
      </div>

      <div className="rag-history">
        {messages.length === 0 && <div style={{ color: '#666', padding: 8 }}>Ask about the inbox and I will summarize and point to related emails.</div>}
        {messages.map((m, i) => (
          <MessageItem key={i} msg={m} />
        ))}
      </div>

      <div className="rag-input">
        <textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <div className="rag-actions">
          <button className="btn ghost" onClick={clear}>Clear</button>
          <button className="btn primary" onClick={send} disabled={loading}>{loading ? 'Thinking…' : 'Ask'}</button>
        </div>
      </div>
    </div>
  );
}
