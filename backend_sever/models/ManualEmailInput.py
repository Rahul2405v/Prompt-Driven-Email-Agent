from pydantic import BaseModel
from typing import List, Optional


class ManualEmailInput(BaseModel):
    sender_name: str
    sender_email: str
    subject: str
    body_text: str
    to: List[str]
    cc: Optional[List[str]] = []
    bcc: Optional[List[str]] = []
    folder: Optional[str] = "Inbox"
