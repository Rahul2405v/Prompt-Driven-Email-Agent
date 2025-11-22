import React, { useState } from "react";
import { processEmail } from "../backendService/promptsService";

export default function EmailProcessor() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState(null);

  const handleProcess = async () => {
    const payload = {
      id: "email_001",
      subject,
      body
    };

    const response = await processEmail(payload);
    setResult(response);
  };

  return (
    <div>
      <h2>Process Email</h2>

      <input 
        type="text" 
        placeholder="Enter subject" 
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea 
        placeholder="Enter body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <button onClick={handleProcess}>Submit</button>

      {result && (
        <div>
          <h3>Category: {result.category}</h3>
          <h4>Actions:</h4>
          <ul>
            {result.actions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
