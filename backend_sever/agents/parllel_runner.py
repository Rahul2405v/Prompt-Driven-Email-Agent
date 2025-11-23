import json
import hashlib
from langchain_core.runnables import RunnableSequence
from agents.categorization_agent import categorization_prompt_template
from agents.action_agent import action_item_prompt_template
from langchain_groq import ChatGroq
import time
import os
from dotenv import load_dotenv
from rag.db_client import get_prompts as db_get_prompts, get_emails as db_get_emails, update_email as db_update_email

load_dotenv()

llm = ChatGroq(
    model_name="llama-3.3-70b-versatile",
    temperature=0.1,
)

# 1. Define Chains Separately (to allow running them individually)
category_chain = categorization_prompt_template | llm
action_chain = action_item_prompt_template | llm

# Helper function to create a hash of the prompt text
def get_prompt_hash(prompt_text):
    return hashlib.md5(prompt_text.encode('utf-8')).hexdigest()

def process_all_emails():
    prompts = db_get_prompts()
    
    # Get current hashes of the prompts from the DB
    current_cat_prompt = prompts["categorization"]
    current_action_prompt = prompts["action_item"]
    
    current_cat_hash = get_prompt_hash(current_cat_prompt)
    current_action_hash = get_prompt_hash(current_action_prompt)

    try:
        emails = db_get_emails()
    except Exception:
        return {"success": False, "message": "Cannot read emails from DB"}

    updated_emails = []
    
    for email in emails:
        email_id = email.get("id")
        subject = email.get("subject", "")
        body = email.get("body_text", "")
        timestamp = email.get("timestamp", "")
        full_body = f"{body}\n\nTimestamp: {timestamp}"
        
        # Retrieve stored hashes from the specific email (if they exist)
        # You need to ensure your DB can store/retrieve these fields
        stored_cat_hash = email.get("categorization_prompt_hash", "")
        stored_action_hash = email.get("action_prompt_hash", "")
        
        # Initialize variables with existing values
        new_category = email.get("category")
        new_actions = email.get("actions")
        
        # Flags to track if we updated anything
        updated_cat = False
        updated_act = False

        # --- LOGIC: Only run Categorization if prompt changed OR category is missing ---
        if stored_cat_hash != current_cat_hash or not new_category:
            print(f"Processing Category for Email {email_id}...")
            try:
                input_data = {"subject": subject, "body": full_body, "categorization_prompt": current_cat_prompt}
                cat_result = category_chain.invoke(input_data)
                new_category = cat_result.content.strip()
                updated_cat = True
            except Exception as e:
                print(f"Error categorizing: {e}")

        # --- LOGIC: Only run Action Extraction if prompt changed OR actions are missing ---
        if stored_action_hash != current_action_hash or not new_actions:
            print(f"Processing Actions for Email {email_id}...")
            try:
                input_data = {"subject": subject, "body": full_body, "action_item_prompt": current_action_prompt}
                act_result = action_chain.invoke(input_data)
                raw_actions = act_result.content.strip()
                try:
                    new_actions = json.loads(raw_actions)
                except:
                    new_actions = [] 
                updated_act = True
            except Exception as e:
                print(f"Error extracting actions: {e}")

        # Only update DB if something actually changed
        if updated_cat or updated_act:
            updates = {}
            
            if updated_cat:
                updates["category"] = new_category
                updates["categorization_prompt_hash"] = current_cat_hash # Save new hash
                email["category"] = new_category
            
            if updated_act:
                updates["actions"] = new_actions
                updates["action_prompt_hash"] = current_action_hash # Save new hash
                email["actions"] = new_actions

            if email_id:
                try:
                    db_update_email(email_id, updates)
                except Exception:
                    pass
            
            # Sleep only if we actually made API calls
            time.sleep(1) 

        updated_emails.append(email)

    return {
        "success": True,
        "total_processed": len(updated_emails),
        "data": updated_emails
    }