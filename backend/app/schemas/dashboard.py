from typing import Optional
from pydantic import BaseModel
from app.schemas.memento import QuestionResponse, QuoteResponse


class CurrentAge(BaseModel):
    years: int
    months: int
    days: int
    hours: int
    minutes: int
    seconds: int
    total_seconds: float
    total_years: float


class RemainingLife(BaseModel):
    years: int
    months: int
    days: int
    total_days: int


class ProgressMetrics(BaseModel):
    year: int
    year_progress_percent: float
    month_name: str
    month_progress_percent: float
    day_progress_percent: float


class DashboardResponse(BaseModel):
    birth_date: str
    expected_life_years: int
    current_age: CurrentAge
    remaining_life: RemainingLife
    remaining_seconds: float
    is_gift: bool  # True if remaining_seconds <= 0
    gift_message: str = "Every new day is a gift."
    progress: ProgressMetrics
    question: Optional[QuestionResponse] = None
    quote: Optional[QuoteResponse] = None
