from typing import Optional
from pydantic import BaseModel


class QuestionResponse(BaseModel):
    id: int
    text: str
    category: Optional[str] = "existential"

    class Config:
        from_attributes = True


class QuoteResponse(BaseModel):
    id: int
    quote: str
    author: str
    source: Optional[str] = None

    class Config:
        from_attributes = True
