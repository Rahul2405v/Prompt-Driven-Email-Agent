from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
from dotenv import load_dotenv
import uvicorn

from agents.agent_helper import ask_agent
from agents.parllel_runner import process_all_emails
from agents.reply_draft import generate_reply_draft
from models.GenerateReplyRequest import GenerateReplyRequest
from models.AskBody import AskBody
from models.ManualEmailInput import ManualEmailInput
from rag.indexer import build_index
from rag.service import rag_answer
from rag.embedding import embed_query
from rag.extract_idx import find as find_ids
from rag.db_client import get_prompts as db_get_prompts, save_prompts as db_save_prompts, get_emails as db_get_emails
from services.email_service import process_and_store_email, find_email_by_id, prepare_email_context

load_dotenv()

app = FastAPI(title="Email Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== PROMPT ROUTES ====================

@app.get("/prompts")
def get_prompts():
    return db_get_prompts()


@app.post("/prompts")
def update_prompts(data: dict):
    try:
        db_save_prompts(data)
        result = process_all_emails()
        return {"status": "success", "processing_result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update prompts: {str(e)}")


# ==================== EMAIL ROUTES ====================

@app.get("/emails")
def get_all_emails():
    return db_get_emails()


@app.post("/process-all-emails")
def process_all():
    return process_all_emails()


@app.post("/add-email")
def add_email_manually(email_input: ManualEmailInput):
    try:
        prompts = db_get_prompts()
        email_data = process_and_store_email(email_input.dict(), prompts)
        return {
            "status": "success",
            "message": "Email added and processed successfully",
            "email": email_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process email: {str(e)}")


@app.post("/process-email")
def process_email(payload: dict):
    email_id = payload.get("id")
    prmopt = payload.get("prmopt")

    if not email_id or not prmopt:
        raise HTTPException(status_code=400, detail="id and prmopt are required")

    try:
        email = find_email_by_id(email_id)
        subject, body, timestamp = prepare_email_context(email)
        body = body.split("\n\nTimestamp:")[0] + f"\n\nTimestamp: {timestamp}"
        
        final_prompt = f"User instruction: {prmopt}. Strictly follow this instruction."
        return ask_agent(subject, body, final_prompt, timestamp, email_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.post("/generate-reply")
def generate_reply(request: GenerateReplyRequest):
    try:
        email = find_email_by_id(request.id)
        subject, body, _ = prepare_email_context(email)
        
        reply_prompt = request.prompt if request.prompt else "reply_prompt"
        result = generate_reply_draft(subject=subject, body=body, prompt=reply_prompt)
        
        return json.loads(result)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except json.JSONDecodeError:
        return {"error": "Model returned invalid JSON"}


# ==================== RAG ROUTES ====================

@app.get("/init")
def rag_init():
    return {"indexed": build_index()}


@app.post("/embed")
def rag_embed(body: AskBody):
    return {"vector": embed_query(body.prompt)}


@app.post("/ask")
def rag_ask(body: AskBody):
    reply, docs = rag_answer(body.prompt, body.k)
    extract_ids = find_ids(reply)
    return {"answer": reply, "chunks": docs, "extracted_ids": extract_ids}


# ==================== HEALTH CHECK ====================

@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
