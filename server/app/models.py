from sqlalchemy import Column, ForeignKey, Integer, String
from .database import Base


class Node(Base):
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, unique=True, index=True)
    name = Column(String, index=True)
    parent_id = Column(Integer, ForeignKey("nodes.id"), index=True, nullable=True)  # root if null
