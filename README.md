# 📧 Prompt-Driven Email Agent

Supercharge your inbox with AI — Categorization, Action-Item Detection, Deadline Extraction, and Auto-Drafted Replies.

---

## 🚀 What is this project?

The **Prompt-Driven Email Agent** intelligently processes emails using LLM-powered agents.
It reads incoming emails, **understands the intent**, detects **actions and deadlines**, and drafts a **polished reply** — all driven by customizable prompts.

Core features:

| Feature                   | Description                                        |
| ------------------------- | -------------------------------------------------- |
| 🧠 Email Categorization   | Action Required / Meeting / Informational / Other  |
| ✔ Action-Item Extraction  | Converts email body into actionable task bullets   |
| ⏳ Deadline Identification | Extracts dates, times & natural-language deadlines |
| ✨ Reply Drafting          | Auto-drafted response based on email context       |
| 📂 Mock Inbox             | Built-in dataset for quick testing                 |
| 🔍 RAG                    | Ask questions using Retrieval-Augmented Generation |

---

## 🔧 Tech Stack

* **Frontend:** React
* **Backend:** Flask / FastAPI
* **LLM:** OpenAI / Groq
* **RAG:** Vector search + embeddings

---

## 📂 Repository Structure

```
Prompt-Driven-Email-Agent/
│
├── app/                     # React UI
│── backend_sever/           # Backend API + Agents + RAG
└── README.md                # (this file)
```

---

# 🛠️ Setup Instructions

### 📌 Clone the repo

```bash
git clone https://github.com/Rahul2405v/Prompt-Driven-Email-Agent.git
cd Prompt-Driven-Email-Agent
```

---

## ⚙ Backend Setup — `backend_sever/`

### 1️⃣ Activate the virtual environment

```powershell
.\backend_sever\backendVenv\Scripts\Activate.ps1
```

OR create a fresh one:

```powershell
python -m venv backendVenv
.\backendVenv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2️⃣ Create a `.env` file (important)

```
OPENAI_API_KEY=your_key_here
# or GROQ_API_KEY=your_key_here
VECTOR_DB_URL=optional_for_RAG
```

### 3️⃣ Start the server

```powershell
python app.py
```

Server runs at → `http://localhost:8000`

---

## 🖥 Frontend Setup — `app/`

```bash
cd app
npm install
npm start
```

Frontend runs at → `http://localhost:3000`

---

# 🔄 Connecting UI ↔ Backend

If the backend runs on a different port, update:

```
app/src/backendService/promptsService.js
app/src/backendService/rag_service.js
```

Example:

```js
export const API_BASE_URL = "http://localhost:8000";
```

---

# 📥 Load the Mock Inbox

✔ The mock inbox dataset is located at:

```
backend_sever/mock_emails.json
```

Ways to load it:

| Method    | How                                     |
| --------- | --------------------------------------- |
| UI button | Click **“Load Mock Inbox”**             |
| API       | `GET http://localhost:8000/emails/mock` |

---

# ✍️ Configure Prompts

All prompt templates are stored in:

```
backend_sever/prompts.json
```

You can modify:

| Prompt                | Purpose                                   |
| --------------------- | ----------------------------------------- |
| categorization_prompt | Controls how the AI classifies emails     |
| action_prompt         | Controls how action items are extracted   |
| deadline_prompt       | Controls deadline extraction behavior     |
| reply_prompt          | Controls tone & structure of auto replies |

> No code updates needed — you can tune the prompts freely.

---

# ⚡ Usage Examples

### 1️⃣ Analyze a single email

```bash
curl -X POST http://localhost:8000/analyze-email \
  -H "Content-Type: application/json" \
  -d '{
    "id": "101",
    "subject": "Submit weekly report by Friday",
    "body": "Hi Rahul, kindly submit the weekly report before Friday evening.",
    "from": "manager@company.com"
  }'
```

📌 Example Output

```json
{
  "id": "101",
  "category": "ACTION_REQUIRED",
  "actions": ["Submit the weekly report"],
  "deadlines": [
    {
      "date": "2025-11-22",
      "time": "18:00",
      "timezone": "Asia/Kolkata"
    }
  ],
  "draft_reply": "Hi, thanks for the update. I will submit the weekly report by Friday evening."
}
```

---

# 🔁 Processing Workflow

```
Incoming Email
      ↓
Preprocessing
      ↓
Three parallel LLM agents
  ├ Categorization Agent
  ├ Action-Item Agent
  └ Deadline Agent
      ↓
Result Aggregation
      ↓
Reply Draft Agent
      ↓
UI & API Response
```

---

# 🌐 RAG — Retrieval-Augmented Querying

You can search previous messages/documents using the chat widget or via API:

```bash
curl -X POST http://localhost:8000/rag/query \
  -d '{"query": "What is the leave policy update?"}'
```

---

# 🤝 Contributing

Pull requests are welcome.
Improvements / ideas? Open an issue!

---

# 🧩 Roadmap

* [ ] Export tasks to Calendar / Slack / Teams
* [ ] Batch summarization for multiple emails
* [ ] Personal style learning for reply drafting

---

# ⭐ Support the Project

If you like this project, **star the repository** — it encourages further development 🤝

---

### 👨‍💻 Author

**Rahul V** — AI • Backend • React
Open to collaboration and feature suggestions.

---
