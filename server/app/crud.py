from sqlalchemy.orm import Session

from . import models, schemas


def get_directory(db: Session, directory_id: int):
    return db.query(models.Directory).filter(models.Directory.id == directory_id).first()


def get_directory_by_title(db: Session, title: str):
    return db.query(models.Directory).filter(models.Directory.title == title).first()


def get_directories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Directory).offset(skip).limit(limit).all()


def create_directory(db: Session, directory: schemas.DirectoryCreate):
    db_directory = models.Directory(title=directory.title)
    db.add(db_directory)
    db.commit()
    db.refresh(db_directory)
    return db_directory


def get_command(db: Session, command_id: int):
    return db.query(models.Command).filter(models.Command.id == command_id).first()


def get_command_by_command(db: Session, command: str):
    return db.query(models.Command).filter(models.Command.command == command).first()


def get_commands(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Command).offset(skip).limit(limit).all()


def create_command(db: Session, command: schemas.CommandCreate):
    db_command = models.Command(command=command.command)
    db.add(db_command)
    db.commit()
    db.refresh(db_command)
    return db_command


def get_tags(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Tag).offset(skip).limit(limit).all()


def create_tag(db: Session, tag: schemas.TagCreate, command_id: int):
    db_tag = models.Tag(**tag.dict(), command_id=command_id)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag
