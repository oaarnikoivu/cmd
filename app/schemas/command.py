from pydantic import BaseModel
from typing import Optional, List


class Command(BaseModel):
    command: str
    keywords: Optional[List[str]]

    class Config:
        schema_extra = {"example": {"command": "docker run x", "keywords": ["docker"]}}
