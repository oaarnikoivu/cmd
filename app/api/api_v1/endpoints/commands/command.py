from fastapi import APIRouter
from app.schemas.command import Command

router = APIRouter()


@router.post("/command/", include_in_schema=False)
@router.post("/command", summary="New command")
async def command(command: Command):
    return command
