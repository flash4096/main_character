import re
from datetime import datetime, date, timezone
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.api import deps
from app.models.user import User
from app.models.memento import Question, Quote
from app.schemas.dashboard import DashboardResponse, CurrentAge, RemainingLife, ProgressMetrics
from app.schemas.memento import QuestionResponse, QuoteResponse
from app.services.calculator import (
    calculate_current_age,
    calculate_remaining_life,
    calculate_time_progress,
)

router = APIRouter()

DEFAULT_QUESTION = {
    "id": 1,
    "text": "If you had only one year left, what would you stop postponing today?",
    "category": "existential",
}

DEFAULT_QUOTE = {
    "id": 1,
    "quote": "You could leave life right now. Let that determine what you do and say and think.",
    "author": "Marcus Aurelius",
    "source": "Meditations",
}


def parse_flexible_date(date_str: Optional[str]) -> Optional[date]:
    if not date_str:
        return None
    s = date_str.strip()
    ymd = re.match(r"^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})", s)
    if ymd:
        try:
            return date(int(ymd.group(1)), int(ymd.group(2)), int(ymd.group(3)))
        except ValueError:
            pass
    mdy = re.match(r"^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})", s)
    if mdy:
        first, second, year = int(mdy.group(1)), int(mdy.group(2)), int(mdy.group(3))
        if first > 12:
            try:
                return date(year, second, first)
            except ValueError:
                pass
        else:
            try:
                return date(year, first, second)
            except ValueError:
                pass
    try:
        return date.fromisoformat(s)
    except ValueError:
        return None


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    birth_date_param: Optional[str] = Query(None, alias="birth_date"),
    expected_life_years_param: Optional[int] = Query(None, alias="expected_life_years"),
    current_user: Optional[User] = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db),
):
    now = datetime.now(timezone.utc)

    # Determine birth date and expected life years
    parsed_date = parse_flexible_date(birth_date_param) if birth_date_param else None
    if parsed_date:
        birth_date = parsed_date
    elif current_user:
        birth_date = current_user.birth_date
    else:
        birth_date = date(1998, 1, 1)

    if expected_life_years_param and expected_life_years_param > 0:
        expected_life_years = expected_life_years_param
    elif current_user:
        expected_life_years = current_user.expected_life_years
    else:
        expected_life_years = 73

    # Calculations
    age_dict = calculate_current_age(birth_date, now)
    rem_life_dict, remaining_seconds, is_gift = calculate_remaining_life(birth_date, expected_life_years, now)
    progress_dict = calculate_time_progress(now)

    # Deterministic daily or minute question logic
    minute_seed = int(now.timestamp() // 60)
    day_of_year = now.timetuple().tm_yday

    # Query Questions
    q_count_res = await db.execute(select(func.count(Question.id)))
    q_count = q_count_res.scalar() or 0

    question_data = None
    if q_count > 0:
        q_offset = minute_seed % q_count
        q_res = await db.execute(select(Question).offset(q_offset).limit(1))
        question_obj = q_res.scalars().first()
        if question_obj:
            question_data = QuestionResponse.model_validate(question_obj)
    
    if not question_data:
        question_data = QuestionResponse(**DEFAULT_QUESTION)

    # Query Quotes
    quote_count_res = await db.execute(select(func.count(Quote.id)))
    quote_count = quote_count_res.scalar() or 0

    quote_data = None
    if quote_count > 0:
        quote_offset = (day_of_year - 1) % quote_count
        quote_res = await db.execute(select(Quote).offset(quote_offset).limit(1))
        quote_obj = quote_res.scalars().first()
        if quote_obj:
            quote_data = QuoteResponse.model_validate(quote_obj)

    if not quote_data:
        quote_data = QuoteResponse(**DEFAULT_QUOTE)

    return DashboardResponse(
        birth_date=birth_date.isoformat(),
        expected_life_years=expected_life_years,
        current_age=CurrentAge(**age_dict),
        remaining_life=RemainingLife(**rem_life_dict),
        remaining_seconds=remaining_seconds,
        is_gift=is_gift,
        gift_message="Every new day is a gift.",
        progress=ProgressMetrics(**progress_dict),
        question=question_data,
        quote=quote_data,
    )
