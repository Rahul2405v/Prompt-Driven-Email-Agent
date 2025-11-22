import React, { useState, useMemo, useEffect } from 'react';
import { fetchEmails } from '../backendService/promptsService';

import EmailList from './EmailList';
import EmailDetail from './EmailDetail';
import { Link } from "react-router-dom";
import ChatWidget from './ChatWidget';
import RagChat from './RagChat';

const EmailsPage = () => {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [emailData, setEmailData] = useState([]);

  const categories = useMemo(() => {
    const set = new Set();
    emailData.forEach((e) => set.add(e.category || 'Uncategorized'));
    return Array.from(set.values());
  }, [emailData]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const fetched = await fetchEmails();
        if (mounted && Array.isArray(fetched)) {
 
          const withCategory = fetched.map((e) => ({ category: e.category || 'Uncategorized', ...e }));
          setEmailData(withCategory);
        }
      } catch (err) {
        console.error('Failed to fetch emails:', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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

  return (
    <div className="emails-page">
      <header className="emails-header">
        <div className="emails-header-left">
          <h1>View Emails</h1>
          <div className="emails-subtitle">All messages — quick preview and animated detail</div>
        </div>
        <div className="emails-controls">
          <input
            className="emails-search"
            placeholder="Search by subject, sender or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="emails-category-filter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option key="All" value="All">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </header>
      <div className="emails-container">
        <aside className="emails-list-pane">
          <EmailList
            emails={filtered}
            onSelect={(e) => setSelected(e)}
            selectedId={selected ? selected.id : null}
          />
        </aside>
        <main className="emails-detail-pane">
          {selected ? (
            <EmailDetail email={selected} id={selected.id} onClose={() => setSelected(null)} />
          ) : (
            <div className="email-empty">
              <p>Hey Welcome! Select an email to view its details.</p>
              <p>Customize your Email Agent behavior in the "Prompt Brain" tab.</p>
              <Link to="/prompts">Go to Prompt Brain</Link>
              <RagChat />
            </div>
          )}
        </main>
      </div>
      <ChatWidget emailId={selected ? selected.id : null} />
    </div>
  );
};

export default EmailsPage;
