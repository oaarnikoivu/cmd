from sqlalchemy.orm import Session
from typing import Any

from . import models, schemas


def get_node_by_name(db: Session, name: str):
    return db.query(models.Node).filter(models.Node.name == name).first()


def create_node(db: Session, node: schemas.NodeCreate):
    db_node = models.Node(name=node.name)
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    return db_node


def check_for_existing(db: Session, node: schemas.NodeCreate, db_parent: Any):
    return (
        db.query(models.Node).filter(models.Node.name == node.name).filter(models.Node.parent_id == db_parent.id).all()
    )


def create_child(db: Session, node: schemas.NodeCreate, db_parent: Any):
    db_node = models.Node(name=node.name, parent_id=db_parent.id)
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    return db_node
