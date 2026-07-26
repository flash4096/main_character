from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    birth_date: Optional[date] = Field(default=date(1995, 1, 1))
    expected_life_years: Optional[int] = Field(default=73, ge=1, le=150)


class UserCreate(UserBase):
    password: str = Field(min_length=6)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    birth_date: Optional[date] = None
    expected_life_years: Optional[int] = Field(default=None, ge=1, le=150)
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    sub: Optional[str] = None
