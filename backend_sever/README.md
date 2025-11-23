# Backend Server — `backend_sever/`

Overview
-
This folder contains the backend server and supporting modules for the Prompt-Driven Email Agent. The backend hosts the API endpoints used by the frontend, agent scripts, mock data, models, and a Retrieval-Augmented Generation (RAG) stack for answering queries using an index/vector DB.

Quick start (Windows PowerShell)
-
- If you want to use the included virtual environment, activate it:

```powershell
.\backendVenv\Scripts\Activate.ps1
```

- Otherwise create and activate a virtual environment, then install dependencies:

```powershell
python -m venv backendVenv
.\backendVenv\Scripts\Activate.ps1
pip install -r requirements.txt
```

- Run the server (simple way):

```powershell
python app.py
```

Core files and purpose
-
- `app.py`: Flask (or FastAPI) app entrypoint. Exposes REST endpoints used by the frontend (prompts, rag endpoints, email CRUD, etc.).
- `mock_emails.json`: Local sample data used by the frontend and by testing agents.
- `prompts.json`: Prompt templates and preset messages used by the prompt agents.
- `requirements.txt`: Python dependencies for the backend.
- `vercel.json`: Vercel deployment configuration (if deploying serverless functions via Vercel).

Virtual environment
-
- `backendVenv/`: A committed local virtual env directory. You may recreate it locally with `python -m venv backendVenv` if you prefer not to use the committed copy.

Agents (in `agents/`)
-
- `action_agent.py`: Agent that executes actions (e.g., modify ticket, send message) based on prompts or decisions.
- `agent_helper.py`: Utility functions used by agents (helpers, shared logic).
- `categorization_agent.py`: Agent for categorizing emails (labels, priority, routing).
- `parllel_runner.py`: Runs tasks/agents in parallel (note: filename contains a typo `parllel`).
- `reply_draft.py`: Agent focused on drafting reply suggestions.

Models (in `models/`)
-
- `CustomAPIEmbedding.py`: Wrapper for custom embedding provider integration.
- `EmailPayload.py`: Data model for email payloads passed between components.
- `GenerateReplyRequest.py`: Model describing the generate-reply request payload.
- `Query.py`: Query model used by the RAG or search components.

RAG stack (in `rag/`)
-
- `chunking.py`: Splits documents/emails into chunks for indexing.
- `config.py`: RAG-related configuration (index settings, vector DB host, API keys — avoid committing secrets).
- `db_client.py`: Client wrapper for the vector store or DB used for retrieval.
- `db.py`: CRUD helpers for persistence used by the RAG indexer.
- `embedding.py`: Embedding helpers (calls to an LLM/vector provider to embed text).
- `extract_idx.py`: Extracts indexable information from documents.
- `groq_llm.py`: Integration with a particular LLM or query language (groq).
- `indexer.py`: Builds and updates the index from source documents.
- `rag_routes.py`: Flask/FastAPI routes implementing RAG queries for the frontend.
- `service.py`: Higher-level RAG service orchestration.
- `vector_search.py`: Vector search helpers and convenience functions.

Notes & environment
-
- Do not commit secrets (API keys) into source. Put them in environment variables or a secrets manager and reference them in `config.py`.
- The repo includes a ready virtual environment; if you prefer a fresh environment, delete `backendVenv/` and recreate it locally.
- If you plan to deploy to Vercel or another serverless host, check `vercel.json` and transform `app.py` endpoints to the target platform's expected handlers.

Next steps you might want
-
- Add an `.env.sample` file listing required env vars (e.g., `OPENAI_API_KEY`, `VECTOR_DB_URL`).
- Add API documentation (OpenAPI/Swagger) for the main endpoints so the frontend and third-party tools can integrate easily.
