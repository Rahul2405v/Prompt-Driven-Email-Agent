import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { replyToEmail } from '../backendService/promptsService';

const EmailDetail = ({ email, onClose,id }) => {
  const ref = useRef();

  // reply state hooks must be declared unconditionally at top-level
  const [showReply, setShowReply] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [savedReply, setSavedReply] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // GSAP enter animation
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { y: 10, autoAlpha: 0 },
        { duration: 0.36, y: 0, autoAlpha: 1, ease: 'power2.out' }
      );
    }
  }, [email]);

  // load saved reply when email changes
  useEffect(() => {
    if (!email || !email.id) {
      setSavedReply(null);
      setPromptText('');
      setShowReply(false);
      return;
    }
    try {
      const raw = localStorage.getItem('savedReplies') || '{}';
      const all = JSON.parse(raw);
      setSavedReply(all[email.id] || null);
    } catch (e) {
      setSavedReply(null);
    }
    setPromptText('');
    setShowReply(false);
  }, [email]);

  if (!email) {
    return (
      <div className="email-empty" ref={ref}>
        <p>Select an email to view its details.</p>
      </div>
    );
  }

  // normalize action tasks to array and capture deadline
  let actionTasks = null;
  let actionDeadline = null;
  if (email.actions) {
    const t = email.actions.task;
    actionDeadline = email.actions.deadline || null;
    if (Array.isArray(t)) actionTasks = t;
    else if (typeof t === 'string' && t.trim()) actionTasks = [t.trim()];
  }


  const persistSavedReply = (replyObj) => {
    try {
      const raw = localStorage.getItem('savedReplies') || '{}';
      const all = JSON.parse(raw);
      if (replyObj) all[replyObj.reply_id] = replyObj;
      localStorage.setItem('savedReplies', JSON.stringify(all));
      setSavedReply(replyObj);
    } catch (e) {
      console.error('persistSavedReply error', e);
    }
  };

  const removeSavedReply = (id) => {
    try {
      const raw = localStorage.getItem('savedReplies') || '{}';
      const all = JSON.parse(raw);
      delete all[id];
      localStorage.setItem('savedReplies', JSON.stringify(all));
      setSavedReply(null);
    } catch (e) {
      console.error('removeSavedReply error', e);
    }
  };

  const handleGenerateReply = async () => {
    if (!email || !email.id) return alert('No email selected');
    setIsGenerating(true);
    try {
      const resp = await replyToEmail(email.id, promptText);
      const subject = resp.subject || resp.title || `Re: ${email.subject || ''}`;
      const body = resp.body || resp.text || resp.reply || JSON.stringify(resp);
      const replyObj = { reply_id: email.id, emailId: email.id, subject, body, updatedAt: new Date().toISOString() };
      persistSavedReply(replyObj);
      setShowReply(true);
    } catch (err) {
      console.error(err);
      alert('Failed to generate reply. See console.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEdit = () => {
    if (!savedReply) return alert('No reply to save');
    const updated = { ...savedReply, updatedAt: new Date().toISOString() };
    persistSavedReply(updated);
    alert('Reply saved locally');
  };

  const handleDeleteReply = () => {
    if (!savedReply) return alert('No saved reply');
    if (!window.confirm('Delete this saved reply?')) return;
    removeSavedReply(savedReply.reply_id);
  };

  const handleRegenerateReply = async () => {
    if (!email || !email.id) return;
    setIsGenerating(true);
    try {
      const resp = await replyToEmail(email.id, promptText || '');
      const subject = resp.subject || resp.title || `Re: ${email.subject || ''}`;
      const body = resp.body || resp.text || resp.reply || JSON.stringify(resp);
      const replyObj = { reply_id: email.id, emailId: email.id, subject, body, updatedAt: new Date().toISOString() };
      persistSavedReply(replyObj);
    } catch (err) {
      console.error(err);
      alert('Failed to regenerate reply');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenJson = () => {
    if (!savedReply) return alert('No saved reply');
    const payload = { subject: savedReply.subject, body: savedReply.body };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="email-detail" ref={ref}>
      <div className="email-detail-top">
        <div className="email-header-left">
          <div className="avatar-large">
            {(email.sender_name || '')
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>

          <div>
            <h2 className="email-detail-subject">{email.subject}</h2>
            <div className="email-detail-meta">
              <div className="from">
                {email.sender_name} &lt;{email.sender_email}&gt;
              </div>
              <div className="time">{new Date(email.timestamp).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="email-actions">
          <button className="action-btn" onClick={() => setShowReply((s) => !s)}>Reply</button>
          <button className="action-btn">Archive</button>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>

      <div className="email-detail-body">
        {(email.body_text || '').split('\n').map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>

      {actionTasks && actionTasks.length > 0 && (
        <div className="email-detail-actions">
          <h3>Action Items:</h3>
          {actionDeadline && (
            <div className="action-deadline"><strong>Deadline:</strong> {actionDeadline}</div>
          )}
          <ul>
            {actionTasks.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
        {/* Chat moved to floating widget (bottom-right) to avoid disrupting layout */}
        {showReply && (
          <div className="reply-modal-overlay" onClick={() => setShowReply(false)}>
            <div className="reply-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <div className="reply-modal-header">
                <div className="reply-modal-title">Reply — {email.subject}</div>
                <div>
                  <button className="btn ghost" onClick={() => setShowReply(false)}>Close</button>
                </div>
              </div>
              <div className="reply-modal-body">
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Prompt (used to generate the reply)</label>
                  <textarea rows={4} value={promptText} onChange={(e) => setPromptText(e.target.value)} placeholder="Instruction or leave blank for default reply" />
                </div>

                {savedReply ? (
                  <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
                    <div style={{ marginBottom: 8 }}><strong>Reply ID:</strong> {savedReply.reply_id}</div>
                    <div style={{ marginBottom: 8 }}>
                      <label><strong>Subject</strong></label>
                      <input value={savedReply.subject || ''} onChange={(e) => setSavedReply({ ...savedReply, subject: e.target.value })} />
                    </div>
                    <div>
                      <label><strong>Body</strong></label>
                      <textarea rows={8} value={savedReply.body || ''} onChange={(e) => setSavedReply({ ...savedReply, body: e.target.value })} />
                    </div>
                    <div style={{ marginTop: 8 }}><small>Last updated: {savedReply.updatedAt}</small></div>
                  </div>
                ) : (
                  <div style={{ color: '#666' }}>No saved reply yet. Generate one to begin.</div>
                )}
              </div>
              <div className="reply-modal-footer">
                <button className="btn" onClick={handleOpenJson} disabled={!savedReply}>Open JSON</button>
                <button className="btn" onClick={handleDeleteReply} disabled={!savedReply}>Delete</button>
                <button className="btn" onClick={handleSaveEdit} disabled={!savedReply}>Save</button>
                <button className="btn" onClick={handleRegenerateReply} disabled={isGenerating || !savedReply}>{isGenerating ? 'Regenerating…' : 'Regenerate'}</button>
                <button className="btn primary" onClick={handleGenerateReply} disabled={isGenerating}>{isGenerating ? 'Generating…' : 'Generate Reply'}</button>
              </div>
            </div>
          </div>
        )}

        <div className="email-detail-footer">
        <div><strong>To:</strong> {email.to && email.to.join(', ')}</div>
        {email.cc && email.cc.length > 0 && (
          <div><strong>CC:</strong> {email.cc.join(', ')}</div>
        )}
      </div>
    </div>
  );
};

export default EmailDetail;
