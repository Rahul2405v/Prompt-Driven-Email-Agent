"""Email processing and storage service"""
import os
from datetime import datetime
import uuid
from typing import Dict, Any
from pymongo import MongoClient

from agents.parllel_runner import run_parallel_processing
from rag.db_client import update_email, get_emails as db_get_emails
from rag.embedding import embed_texts
from rag.chunking import flatten_email, chunk_text
from rag.config import DB_NAME, COLLECTION_NAME


def generate_email_ids():
    return f"msg_{uuid.uuid4().hex[:8]}", f"thd_{uuid.uuid4().hex[:8]}"


def create_email_data(email_input: Dict[str, Any], email_id: str, thread_id: str, 
                      timestamp: str, category: str, action_items: Any) -> Dict[str, Any]:
    return {
        "id": email_id,
        "thread_id": thread_id,
        "folder": email_input.get("folder", "Inbox"),
        "timestamp": timestamp,
        "sender_name": email_input["sender_name"],
        "sender_email": email_input["sender_email"],
        "subject": email_input["subject"],
        "body_text": email_input["body_text"],
        "to": email_input["to"],
        "cc": email_input.get("cc", []),
        "bcc": email_input.get("bcc", []),
        "category": category,
        "actions": action_items if isinstance(action_items, dict) else {"task": "", "deadline": ""}
    }


def store_email_embeddings(email_data: Dict[str, Any]) -> None:
    try:
        email_content = flatten_email(email_data)
        chunks = chunk_text(email_content)
        chunk_texts = [chunk["chunk"] for chunk in chunks]
        embeddings = embed_texts(chunk_texts)
        
        chunk_documents = [
            {
                "email_id": email_data["id"],
                "chunk": chunk["chunk"],
                "embedding": embedding,
            }
            for chunk, embedding in zip(chunks, embeddings)
        ]
        
        if chunk_documents:
            mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
            client = MongoClient(mongo_uri)
            db = client[DB_NAME]
            chunks_collection = db[COLLECTION_NAME]
            chunks_collection.insert_many(chunk_documents)
            
    except Exception as e:
        print(f"Warning: Failed to generate/store embeddings: {str(e)}")


def process_and_store_email(email_input: Dict[str, Any], prompts: Dict[str, Any]) -> Dict[str, Any]:
    email_id, thread_id = generate_email_ids()
    timestamp = datetime.utcnow().isoformat() + "Z"
    
    enhanced_body = email_input["body_text"] + f"\n\nTimestamp: {timestamp}"
    category, action_items = run_parallel_processing(
        subject=email_input["subject"],
        body=enhanced_body,
        prompts=prompts
    )
    
    email_data = create_email_data(email_input, email_id, thread_id, timestamp, category, action_items)
    update_email(email_id, email_data)
    store_email_embeddings(email_data)
    
    return email_data


def find_email_by_id(email_id: str) -> Dict[str, Any]:
    emails = db_get_emails()
    email = next((e for e in emails if e.get("id") == email_id), None)
    if not email:
        raise ValueError(f"Email with id {email_id} not found")
    return email


def prepare_email_context(email: Dict[str, Any]) -> tuple:
    subject = email.get("subject", "")
    body = email.get("body_text", "")
    timestamp = email.get("timestamp", "")
    sender = email.get("sender_name", "Unknown Sender")
    
    enhanced_body = f"{body}\n\nTimestamp: {timestamp}\nSender: {sender}"
    return subject, enhanced_body, timestamp
