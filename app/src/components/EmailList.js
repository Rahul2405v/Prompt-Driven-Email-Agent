import React from 'react';
import EmailListItem from './EmailListItem';
import '../css/EmailList.css';

const EmailList = ({ emails, onSelect, selectedId }) => {
  return (
    <div className="email-list">
      {emails.map((m) => (
        <EmailListItem key={m.id} email={m} onSelect={onSelect} selected={selectedId === m.id} />
      ))}
    </div>
  );
};

export default EmailList;
