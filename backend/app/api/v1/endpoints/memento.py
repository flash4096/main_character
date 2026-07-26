import random
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.api import deps
from app.models.memento import Question, Quote
from app.schemas.memento import QuestionResponse, QuoteResponse

router = APIRouter()


@router.get("/questions", response_model=List[QuestionResponse])
async def get_questions(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(deps.get_db),
):
    result = await db.execute(select(Question).offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/questions/random", response_model=QuestionResponse)
async def get_random_question(
    db: AsyncSession = Depends(deps.get_db),
):
    result = await db.execute(select(Question))
    questions = result.scalars().all()
    if not questions:
        return QuestionResponse(
            id=1,
            text="If you had only one year left, what would you stop postponing today?",
            category="existential"
        )
    return QuestionResponse.model_validate(random.choice(questions))


@router.get("/quotes", response_model=List[QuoteResponse])
async def get_quotes(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(deps.get_db),
):
    result = await db.execute(select(Quote).offset(skip).limit(limit))
    return result.scalars().all()
