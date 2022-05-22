from pydantic import BaseModel


class TagBase(BaseModel):
    tag: str


class TagCreate(TagBase):
    pass


class Tag(TagBase):
    id: int
    command_id: int

    class Config:
        orm_mode = True


class CommandBase(BaseModel):
    command: str


class CommandCreate(CommandBase):
    pass


class Command(CommandBase):
    id: int
    tags: list[Tag] = []

    class Config:
        orm_mode = True
