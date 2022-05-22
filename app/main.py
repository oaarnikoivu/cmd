from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine

from . import crud, models, schemas


models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Deps
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/commands/", include_in_schema=False)
@app.post("/commands", response_model=schemas.Command)
def create_command(command: schemas.CommandCreate, db: Session = Depends(get_db)):
    db_command = crud.get_command_by_command(db, command=command.command)
    if db_command:
        raise HTTPException(status_code=400, detail="Command already exists!")
    return crud.create_command(db=db, command=command)


@app.get("/commands/", include_in_schema=False)
@app.get("/commands", response_model=list[schemas.Command])
def read_commands(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    commands = crud.get_commands(db, skip=skip, limit=limit)
    return commands


@app.get("/commands/{command_id}/", include_in_schema=False)
@app.get("/commands/{command_id}", response_model=schemas.Command)
def read_command(command_id: int, db: Session = Depends(get_db)):
    db_command = crud.get_command(db, command_id=command_id)
    if db_command is None:
        raise HTTPException(status_code=404, detail="Command not found!")
    return db_command


@app.post("/commands/{command_id}/tags/", include_in_schema=False)
@app.post("/commands/{command_id}/tags", response_model=schemas.Tag)
def create_tag_for_command(command_id: int, tag: schemas.TagCreate, db: Session = Depends(get_db)):
    return crud.create_tag(db=db, tag=tag, command_id=command_id)


@app.get("/tags/", include_in_schema=False)
@app.get("/tags", response_model=list[schemas.Tag])
def read_tags(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tags = crud.get_tags(db, skip=skip, limit=limit)
    return tags


@app.get("/")
async def root():
    return {"message": ""}
