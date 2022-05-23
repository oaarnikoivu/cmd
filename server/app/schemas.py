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


class DirectoryBase(BaseModel):
    title: str


class DirectoryCreate(DirectoryBase):
    pass


class Directory(DirectoryBase):
    id: int
    links: list = []

    class Config:
        orm_mode = True

    tag: str


class LinkBase(BaseModel):
    url: str


class LinkCreate(LinkBase):
    pass


class Link(LinkBase):
    id: int
    directory_id: int

    class Config:
        orm_mode = True
