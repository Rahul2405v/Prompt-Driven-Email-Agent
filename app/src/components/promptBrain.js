import React, { useEffect, useState, useRef } from "react";
import { getPrompts, savePrompts } from "../backendService/promptsService";
import gsap from "gsap";
import "../css/promptBrain.css";
import { Link } from "react-router-dom";
export default function PromptBrain() {
  const [prompts, setPrompts] = useState({
    categorization: "",
    action_item: "",
    auto_reply: "",
    summarization : ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const containerRef = useRef(null);
    useEffect(
        () =>{
            getPrompts().then((data) => setPrompts(data));
        },[]
    );
  const updateField = (field, value) => {
    setPrompts((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await savePrompts(prompts);
      gsap.to("#save-btn", {
        scale: 1.1,
        backgroundColor: "#10ca73ff",
        duration: 0.3,
        yoyo: true,
        repeat: 1
      });
    } catch (err) {
      console.error("Failed to save prompts", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="prompt-brain-container" ref={containerRef}>
        <Link to="/">&#8592; Back to Emails</Link>
      <h1 className="title">Prompt Brain</h1>
      <p className="subtitle">Customize how your Email Agent thinks and behaves.</p>
    
      <div className="prompt-section">
        <label>📌 Categorization Prompt</label>
        <textarea
          value={prompts.categorization}
          onChange={(e) => updateField("categorization", e.target.value)}
        />
      </div>

      <div className="prompt-section">
        <label>📝 Action Item Extraction Prompt</label>
        <textarea
          value={prompts.action_item}
          onChange={(e) => updateField("action_item", e.target.value)}
        />
      </div>

      <div className="prompt-section">
        <label>✉️ Auto Reply Draft Prompt</label>
        <textarea
          value={prompts.auto_reply}
          onChange={(e) => updateField("auto_reply", e.target.value)}
        />
      </div>
        <div className="prompt-section">
        <label>📋 summarization</label>
        <textarea
          value={prompts.summarization}
          onChange={(e) => updateField("summarization", e.target.value)}
        />
      </div>
      <button
        id="save-btn"
        className={`save-btn ${isSaving ? 'saving' : ''}`}
        onClick={handleSave}
        disabled={isSaving}
        aria-busy={isSaving}
      >
        {isSaving ? (
          <>
            <span className="spinner" aria-hidden="true"></span>
            Saving Prompts...
          </>
        ) : (
          "Save Prompts"
        )}
      </button>
      <>
        <h1>Current Prompt Brain</h1>
        <h4>{prompts.action_item}</h4>
        <h4>{prompts.auto_reply}</h4>
        <h4>{prompts.categorization}</h4>
        <h4>{prompts.summarization}</h4>
      </>
    </div>
  );
}
