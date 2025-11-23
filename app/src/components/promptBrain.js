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
  const [isLoading, setIsLoading] = useState(true);

  const containerRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const loadPrompts = async () => {
      setIsLoading(true);
      try {
        const data = await getPrompts();
        setPrompts(data);
      } catch (err) {
        console.error('Failed to load prompts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPrompts();
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: 30, autoAlpha: 0 },
        { duration: 0.6, y: 0, autoAlpha: 1, ease: 'power3.out' }
      );
      
      gsap.fromTo(
        sectionsRef.current,
        { y: 20, autoAlpha: 0 },
        { duration: 0.5, y: 0, autoAlpha: 1, ease: 'power2.out', stagger: 0.1, delay: 0.2 }
      );
    }
  }, [isLoading]);
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

  if (isLoading) {
    return (
      <div className="prompt-brain-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>🧠 Loading Prompt Brain...</h2>
          <p>Fetching your custom prompts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prompt-brain-page">
      <div className="prompt-brain-container" ref={containerRef}>
        <div className="header-section">
          <Link to="/" className="back-link">
            <span className="back-arrow">←</span> Back to Emails
          </Link>
          <div className="header-content">
            <h1 className="title">🧠 Prompt Brain</h1>
            <p className="subtitle">Customize how your Email Agent thinks and behaves</p>
          </div>
        </div>
      
        <div className="prompts-grid">
          <div className="prompt-section" ref={el => sectionsRef.current[0] = el}>
            <label>
              <span className="label-icon">📌</span>
              <span className="label-text">Categorization Prompt</span>
            </label>
            <textarea
              value={prompts.categorization}
              onChange={(e) => updateField("categorization", e.target.value)}
              placeholder="Enter how emails should be categorized..."
            />
          </div>

          <div className="prompt-section" ref={el => sectionsRef.current[1] = el}>
            <label>
              <span className="label-icon">📝</span>
              <span className="label-text">Action Item Extraction Prompt</span>
            </label>
            <textarea
              value={prompts.action_item}
              onChange={(e) => updateField("action_item", e.target.value)}
              placeholder="Define how to extract action items..."
            />
          </div>

          <div className="prompt-section" ref={el => sectionsRef.current[2] = el}>
            <label>
              <span className="label-icon">✉️</span>
              <span className="label-text">Auto Reply Draft Prompt</span>
            </label>
            <textarea
              value={prompts.auto_reply}
              onChange={(e) => updateField("auto_reply", e.target.value)}
              placeholder="Specify how to draft automatic replies..."
            />
          </div>

          <div className="prompt-section" ref={el => sectionsRef.current[3] = el}>
            <label>
              <span className="label-icon">📋</span>
              <span className="label-text">Summarization Prompt</span>
            </label>
            <textarea
              value={prompts.summarization}
              onChange={(e) => updateField("summarization", e.target.value)}
              placeholder="Describe how emails should be summarized..."
            />
          </div>
        </div>

        <div className="action-section">
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
              <>
                <span className="save-icon">💾</span>
                Save All Prompts
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
