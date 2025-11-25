import json
from langchain_core.prompts import PromptTemplate
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

llm = ChatGroq(
    model_name="llama-3.3-70b-versatile",
    temperature=0.1,
)

load_dotenv()


action_item_prompt_template = PromptTemplate.from_template(
    """You are an AI that extracts structured information from email content.
The user will decide which fields need to be extracted.

Rules:
1. Return ONLY a valid JSON object.
2. The JSON must contain EXACTLY the fields specified by the user.
3. If a field is not found in the email, return an empty string for that field.
4. Do NOT include any extra fields.
5. Do NOT explain anything outside of the JSON.

Fields to extract: {fields_requested}

Email:
Subject: {subject}
Body: {body}
""")

def run_action_extraction(subject: str, body: str, action_prompt: str):
    prompt = action_item_prompt_template.format(
        fields_requested=action_prompt,
        subject=subject,
        body=body
    )

    result = llm.invoke(prompt)
    text = result.content.strip()

    try:
        return json.loads(text)
    except:
        return []
