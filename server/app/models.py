from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from .database import Base


class Directory(Base):
    __tablename__ = "directories"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)

    links = relationship("Link", back_populates="directory")


class Link(Base):
    __tablename__ = "links"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    directory_id = Column(Integer, ForeignKey("directories.id"))

    directory = relationship("Directory", back_populates="links")


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
