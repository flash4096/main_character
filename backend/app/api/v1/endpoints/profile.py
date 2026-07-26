from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.models.user import User
from app.schemas.user import UserUpdate, UserResponse

router = APIRouter()


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_required_current_user),
    db: AsyncSession = Depends(deps.get_db),
):
    if user_in.email is not None and user_in.email != current_user.email:
        result = await db.execute(select(User).where(User.email == user_in.email))
        existing_user = result.scalars().first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use by another user.",
            )
        current_user.email = user_in.email

    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.birth_date is not None:
        current_user.birth_date = user_in.birth_date
    if user_in.expected_life_years is not None:
        current_user.expected_life_years = user_in.expected_life_years

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)

    return current_user
