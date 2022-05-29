from pydantic import BaseModel
from typing import Optional


class NodeBase(BaseModel):
    name: str
    parent: Optional[str] = None


class NodeCreate(NodeBase):
    pass


class Node(NodeBase):
    id: int
    parent_id: Optional[int]

    class Config:
        orm_mode = True
