import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function EmailListItem({ email, onSelect, selected }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el, { x: -8, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4, ease: 'power3.out' });
  }, []);

  const avatarFor = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  };

  const timeShort = (ts) => {
    try { return new Date(ts).toLocaleString(); } catch (e) { return ts; }
  };

  const snippetOf = (text, n = 80) => {
    if (!text) return '';
    return text.replace(/\s+/g, ' ').slice(0, n) + (text.length > n ? '…' : '');
  };

  const recent = (Date.now() - new Date(email.timestamp).getTime()) < 1000 * 60 * 60 * 24;

  return (
    <div 
      ref={ref} 
      className={`email-list-item${selected ? ' selected' : ''}`} 
      onClick={() => onSelect(email)}
      data-email-id={email.id}
    >
      <div className="email-left">
        <div className="avatar">{avatarFor(email.sender_name)}</div>
      </div>
      <div className="email-main">
        <div className="email-row">
          <div className="email-sender">{email.sender_name}</div>
          <div className="email-time">{timeShort(email.timestamp)}</div>
        </div>
        <div className="email-subject">{email.subject}</div>
        <div className="email-category-badge">{email.category || 'Uncategorized'}</div>
        <div className="email-snippet">{snippetOf(email.body_text)}</div>
      </div>
      <div className="email-right">{recent && <span className="recent-dot" title="recent">●</span>}</div>
    </div>
  );
}
