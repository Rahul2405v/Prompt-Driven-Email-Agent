<img width="1919" height="901" alt="image" src="https://github.com/user-attachments/assets/f6dac6b4-a81f-43b1-b6ba-d5b822ddc8d8" /># Prompt-Driven AI Email Productivity Agent

A full‑stack AI‑powered Email Productivity Agent capable of categorizing emails, extracting action items, drafting replies, and allowing natural chat‑based inbox interaction — fully driven by user‑defined prompts.

This system is built using **React, FastAPI, LangChain, Groq, MongoDB Atlas Vector Search, FastEmbed, and GSAP animations** and deployed on **Vercel**.

---

## 🚀 Live Deployment

| Component         | URL                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| Frontend (React)  | [https://prompt-driven-email-agent.vercel.app/](https://prompt-driven-email-agent.vercel.app/) |
| Backend (FastAPI) | [https://email-agent-lemon.vercel.app/](https://email-agent-lemon.vercel.app/)                 |

---

## 📌 Features

* 🔹 Automatic **email categorization** using LLM agents
* 🔹 **Action‑item extraction** in structured JSON format
* 🔹 **Reply draft generation** using customizable auto‑reply prompts
* 🔹 **Chat‑style inbox assistant** powered by RAG
* 🔹 **Prompt Brain panel** — modify agent behaviour without changing code
* 🔹 **Search & filter inbox** by sender, subject, content, and category
* 🔹 **Smooth GSAP page animations** for modern UX
* 🔹 **Never sends emails automatically** — all replies are saved as drafts

---
---
### Architecture
<img width="2005" height="1333" alt="diagram-export-11-24-2025-4_50_45-PM" src="https://github.com/user-attachments/assets/1910f12e-bc4b-4eb6-88bb-f4f75236b713" />

---

## 🧠 Tech Stack

### Frontend

* React
* GSAP Animations
* Tailored CSS UI components

### Backend

* FastAPI
* LangChain (Agentic framework)
* Groq LLM integration

### Retrieval Augmented Generation (RAG)

* FastEmbed (vector embedding)
* MongoDB Atlas Vector Search (Cosine similarity)
* Chunk‑based email indexing system

### Deployment

* Vercel (both frontend + backend)

---

## 📂 Folder Structure Overview

```
project_root/
│
├── agents/                  # LangChain agent logic
│   ├── action_agent.py
│   ├── categorization_agent.py
│   ├── reply_draft.py
│   ├── agent_helper.py
│   └── parllel_runner.py
│
├── rag/                     # Retrieval‑Augmented Generation stack
│   ├── chunking.py
│   ├── config.py
│   ├── db_client.py
│   ├── db.py
│   ├── embedding.py
│   ├── extract_idx.py
│   ├── groq_llm.py
│   ├── indexer.py
│   ├── rag_routes.py
│   └── vector_search.py
│
├── models/                  # Pydantic models
│   ├── EmailPayload.py
│   ├── GenerateReplyRequest.py
│   ├── Query.py
│   └── CustomAPIEmbedding.py
│
└── frontend/                # React UI (deployed)
```

---

## 🛠️ Setup Instructions

### Backend Setup

```bash
git clone <repo-url>
cd backend
pip install -r requirements.txt
```

Create `.env` file with:

```
MODEL_NAME="llama-3.3-70b"
GROQ_API_KEY="gsk_gJrT9U..."
MONGODB_URI="mongodb+srv://..."
MONGODB_DB="rag_db"
MONGODB_COLLECTION="emails"
HUGGINGFACEHUB_API_TOKEN="..."

```

Start backend:
In windows
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## ▶️ How to Run the System

1. Start the backend server (FastAPI)
2. Start the frontend (React)
3. Load inbox from UI
4. Customize prompts in **Prompt Brain** tab
5. Process inbox → automatic categorization & task extraction
6. Use **Email Agent chat** to:

   * Summarize emails
   * Extract responsibilities
   * Generate reply drafts
7. Drafts can be saved — system never auto‑sends

---

## 🧩 Prompt Brain (Agent Configuration)

Users can edit built‑in prompts to modify agent behaviour:

* Categorization Prompt
* Action‑Item Extraction Prompt
* Auto‑Reply Drafting Prompt
* Summarization prompt
Changing prompts immediately alters the agent’s output — no code changes required.

---

## 🔐 Safety & Reliability

* All LLM actions default to **draft mode only**
* Backend validates structured JSON output
* Fail‑safes for LLM errors & malformed responses
* Email content is never sent to external APIs without user consent

---
