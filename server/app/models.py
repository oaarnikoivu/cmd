from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from .database import Base


class Command(Base):
    __tablename__ = "commands"

    id = Column(Integer, primary_key=True, index=True)
    command = Column(String, unique=True, index=True)

    tags = relationship("Tag", back_populates="command")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String, index=True)
    command_id = Column(Integer, ForeignKey("commands.id"))

    command = relationship("Command", back_populates="tags")
