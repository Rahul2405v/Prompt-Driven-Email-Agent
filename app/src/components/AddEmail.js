import React, { useState } from 'react';
import '../css/AddEmail.css';

const AddEmail = ({ onEmailAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_email: '',
    subject: '',
    body_text: '',
    to: '',
    cc: '',
    bcc: '',
    folder: 'Inbox'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      // Convert comma-separated strings to arrays
      const payload = {
        sender_name: formData.sender_name,
        sender_email: formData.sender_email,
        subject: formData.subject,
        body_text: formData.body_text,
        to: formData.to.split(',').map(e => e.trim()).filter(e => e),
        cc: formData.cc ? formData.cc.split(',').map(e => e.trim()).filter(e => e) : [],
        bcc: formData.bcc ? formData.bcc.split(',').map(e => e.trim()).filter(e => e) : [],
        folder: formData.folder
      };

      const response = await fetch('https://ai-email-enhancer.vercel.app/add-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: 'Email added successfully!',
          email: data.email
        });
        
        // Reset form
        setFormData({
          sender_name: '',
          sender_email: '',
          subject: '',
          body_text: '',
          to: '',
          cc: '',
          bcc: '',
          folder: 'Inbox'
        });

        // Notify parent component
        if (onEmailAdded) {
          onEmailAdded(data.email);
        }

        // Close modal after 2 seconds
        setTimeout(() => {
          setIsOpen(false);
          setResult(null);
        }, 2000);
      } else {
        setResult({
          success: false,
          message: data.detail || 'Failed to add email'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillExample = () => {
    setFormData({
      sender_name: 'Sarah Chen',
      sender_email: 'sarah.chen@neural-systems.com',
      subject: 'Urgent: Model Training Pipeline Optimization',
      body_text: `Hi Alex,

I've reviewed the latest logs from the nightly build, and there's something we need to address immediately. Although the accuracy improved by roughly 2% after the latest model tweaks, the latency has gone up significantly on the inference cluster.

Please inspect the feature extraction pipeline added in Build 2047. Early signs suggest the new attention fusion layer may be causing longer compute cycles. We cannot proceed with the scheduled rollout until this is resolved.

Let me know once you've run a trace and profiled the nodes so we can finalize the optimization plan.

Best,
Sarah`,
      to: 'alex.dev@example.com',
      cc: 'engineering@neural-systems.com',
      bcc: '',
      folder: 'Inbox'
    });
  };

  return (
    <>
      <button className="add-email-trigger" onClick={() => setIsOpen(true)}>
        ➕ Add New Email
      </button>

      {isOpen && (
        <div className="add-email-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="add-email-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📧 Ingest New Email</h2>
              <button className="modal-close" onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Sender Name *</label>
                    <input
                      type="text"
                      name="sender_name"
                      value={formData.sender_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Sender Email *</label>
                    <input
                      type="email"
                      name="sender_email"
                      value={formData.sender_email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Email subject"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Body *</label>
                  <textarea
                    name="body_text"
                    value={formData.body_text}
                    onChange={handleChange}
                    placeholder="Email content..."
                    rows="8"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>To (comma-separated) *</label>
                  <input
                    type="text"
                    name="to"
                    value={formData.to}
                    onChange={handleChange}
                    placeholder="recipient1@example.com, recipient2@example.com"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CC (comma-separated)</label>
                    <input
                      type="text"
                      name="cc"
                      value={formData.cc}
                      onChange={handleChange}
                      placeholder="cc1@example.com, cc2@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Folder</label>
                    <select name="folder" value={formData.folder} onChange={handleChange}>
                      <option value="Inbox">Inbox</option>
                      <option value="Sent">Sent</option>
                      <option value="Drafts">Drafts</option>
                      <option value="Spam">Spam</option>
                    </select>
                  </div>
                </div>

                {result && (
                  <div className={`result-message ${result.success ? 'success' : 'error'}`}>
                    <strong>{result.success ? '✅' : '❌'}</strong> {result.message}
                    {result.success && result.email && (
                      <div className="result-details">
                        <p><strong>Category:</strong> {result.email.category}</p>
                        <p><strong>Task:</strong> {result.email.actions?.task || 'None'}</p>
                        {result.email.actions?.deadline && (
                          <p><strong>Deadline:</strong> {result.email.actions.deadline}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={fillExample}>
                    📋 Fill Example
                  </button>
                  <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? '⏳ Processing...' : '✉️ Add Email'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEmail;

