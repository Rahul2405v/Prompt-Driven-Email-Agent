from pydantic import BaseModel


class AskBody(BaseModel):
    prompt: str
    k: int = 4
