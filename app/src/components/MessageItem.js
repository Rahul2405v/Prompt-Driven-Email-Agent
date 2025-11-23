import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function MessageItem({ msg, onEmailClick }) {
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

  const handleBadgeClick = (emailId) => {
    if (onEmailClick) {
      onEmailClick(emailId);
    } else {
      // Fallback: scroll to email in list if possible
      const emailElement = document.querySelector(`[data-email-id="${emailId}"]`);
      if (emailElement) {
        emailElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        emailElement.classList.add('highlight-flash');
        setTimeout(() => emailElement.classList.remove('highlight-flash'), 2000);
      }
    }
  };

  return (
    <div ref={ref} className={`rag-msg ${msg.role === 'user' ? 'user' : 'assistant'}`}>
      <div className="text">{msg.text}</div>
      {msg.meta && msg.meta.extracted_ids && msg.meta.extracted_ids.length > 0 && (
        <div className="rag-badges">
          <span className="badge-label">📧 Related emails:</span>
          {msg.meta.extracted_ids.map((id) => (
            <button 
              key={id} 
              className="rag-badge clickable" 
              onClick={() => handleBadgeClick(id)}
              title={`View email ${id}`}
            >
              {id}
            </button>
          ))}
        </div>
      )}
      {msg.role === 'assistant' && (
        <div className="meta" style={{ marginTop: 8 }}>
          <button className="btn ghost" onClick={() => navigator.clipboard?.writeText(msg.text).catch(() => {})}>📋 Copy</button>
        </div>
      )}
    </div>
  );
}
