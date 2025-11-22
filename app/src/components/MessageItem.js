import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function MessageItem({ msg }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { y: 10, autoAlpha: 0, scale: 0.995 },
      { duration: 0.45, y: 0, autoAlpha: 1, scale: 1, ease: 'power3.out' }
    );
  }, []);

  return (
    <div ref={ref} className={`rag-msg ${msg.role === 'user' ? 'user' : 'assistant'}`}>
      <div className="text">{msg.text}</div>
      {msg.meta && msg.meta.extracted_ids && msg.meta.extracted_ids.length > 0 && (
        <div className="rag-badges">
          {msg.meta.extracted_ids.map((id) => (
            <span key={id} className="rag-badge" data-id={id}>{id}</span>
          ))}
        </div>
      )}
      {msg.role === 'assistant' && (
        <div className="meta" style={{ marginTop: 8 }}>
          <button className="btn ghost" onClick={() => navigator.clipboard?.writeText(msg.text).catch(() => {})}>Copy</button>
        </div>
      )}
    </div>
  );
}
