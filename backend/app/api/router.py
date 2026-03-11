from fastapi import APIRouter

from app.api.routes.onboarding_routes import router as onboarding_router


api_router = APIRouter()
api_router.include_router(onboarding_router)
