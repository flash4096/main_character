from fastapi import APIRouter
from app.api.v1.endpoints import auth, dashboard, profile, memento

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(dashboard.router, tags=["Dashboard"])
api_router.include_router(profile.router, tags=["Profile"])
api_router.include_router(memento.router, tags=["Memento Mori"])
