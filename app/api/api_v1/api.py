from fastapi import APIRouter
from .endpoints.commands import command

api_router = APIRouter()

api_router.include_router(command.router, prefix="", tags=["commands"])
