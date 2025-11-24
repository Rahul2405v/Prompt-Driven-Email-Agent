import React, { useState, useMemo, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { fetchEmails } from '../backendService/promptsService';

import EmailList from './EmailList';
import EmailDetail from './EmailDetail';
import { Link } from "react-router-dom";
import ChatWidget from './ChatWidget';
import RagChat from './RagChat';
import AddEmail from './AddEmail';

const EmailsPage = () => {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [emailData, setEmailData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const headerRef = useRef();
  const listRef = useRef();
  const detailRef = useRef();

  const categories = useMemo(() => {
    const set = new Set();
    emailData.forEach((e) => set.add(e.category || 'Uncategorized'));
    return Array.from(set.values());
  }, [emailData]);

  // Initial page animations
  useEffect(() => {
    if (!isLoading && headerRef.current && listRef.current && detailRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        headerRef.current,
        { y: -30, autoAlpha: 0 },
        { duration: 0.6, y: 0, autoAlpha: 1, ease: 'power3.out' }
      )
      .fromTo(
        listRef.current,
        { x: -40, autoAlpha: 0 },
        { duration: 0.5, x: 0, autoAlpha: 1, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(
        detailRef.current,
        { x: 40, autoAlpha: 0 },
        { duration: 0.5, x: 0, autoAlpha: 1, ease: 'power2.out' },
        '-=0.4'
      );
    }
  }, [isLoading]);

  const loadEmails = async () => {
    setIsLoading(true);
    try {
      const fetched = await fetchEmails();
      if (Array.isArray(fetched)) {
        const withCategory = fetched.map((e) => ({ category: e.category || 'Uncategorized', ...e }));
        setEmailData(withCategory);
      }
    } catch (err) {
      console.error('Failed to fetch emails:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, []);

  const handleEmailAdded = (newEmail) => {
    // Add the new email to the list
    setEmailData(prev => [{ category: newEmail.category || 'Uncategorized', ...newEmail }, ...prev]);
    // Optionally select the new email
    setSelected(newEmail);
  };

  const sorted = useMemo(() => {
    return [...emailData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [emailData]);

  const filtered = useMemo(() => {
    return sorted.filter((m) => {
      if (folder !== 'All' && m.folder !== folder) return false;
      if (categoryFilter !== 'All' && (m.category || 'Uncategorized') !== categoryFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        (m.subject && m.subject.toLowerCase().includes(s)) ||
        (m.sender_name && m.sender_name.toLowerCase().includes(s)) ||
        (m.body_text && m.body_text.toLowerCase().includes(s))
      );
    });
  }, [sorted, search, folder, categoryFilter]);

  if (isLoading) {
    return (
      <div className="emails-loading">
        <div className="loading-content">
          <div className="loading-spinner-large"></div>
          <h2>📧 Loading Your Emails...</h2>
          <p>Fetching your inbox</p>
          <div className="loading-shimmer">
            <div className="shimmer-line"></div>
            <div className="shimmer-line"></div>
            <div className="shimmer-line"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="emails-page">
      <header className="emails-header" ref={headerRef}>
        <div className="emails-header-left">
          <h1>📧 View Emails</h1>
          <div className="emails-subtitle">All messages — quick preview and animated detail</div>
        </div>
        <div className="emails-controls">
          <AddEmail onEmailAdded={handleEmailAdded} />
          <input
            className="emails-search"
            placeholder="🔍 Search by subject, sender or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="emails-category-filter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option key="All" value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </header>
      <div className="emails-container">
        <aside className="emails-list-pane" ref={listRef}>
          <div className="emails-list-header">
            <h3>Inbox ({filtered.length})</h3>
          </div>
          <EmailList
            emails={filtered}
            onSelect={(e) => setSelected(e)}
            selectedId={selected ? selected.id : null}
          />
        </aside>
        <main className="emails-detail-pane" ref={detailRef}>
          {selected ? (
            <EmailDetail email={selected} id={selected.id} onClose={() => setSelected(null)} />
          ) : (
            <div className="email-empty">
              <div className="empty-icon">📬</div>
              <h2>Welcome to Your Inbox!</h2>
              <p>Select an email from the list to view its details and interact with it.</p>
              <p className="empty-hint">Customize your Email Agent behavior in the "Prompt Brain" tab.</p>
              <Link to="/prompts" className="empty-link">Go to Prompt Brain →</Link>
              <div className="rag-chat-container">
                <RagChat />
              </div>
            </div>
          )}
        </main>
      </div>
      <ChatWidget emailId={selected ? selected.id : null} />
    </div>
  );
};

export default EmailsPage;
