from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine

from . import crud, models, schemas


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)


# Deps
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/dirs/", include_in_schema=False)
@app.post("/dirs", response_model=schemas.Directory)
def mkdir(directory: schemas.DirectoryCreate, db: Session = Depends(get_db)):
    db_directory = crud.get_directory_by_title(db, title=directory.title)
    if db_directory:
        raise HTTPException(status_code=400, detail="Directory already exists!")
    return crud.create_directory(db=db, directory=directory)


@app.get("/dirs/", include_in_schema=False)
@app.get("/dirs", response_model=list[schemas.Directory])
def ls(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    directories = crud.get_directories(db, skip=skip, limit=limit)
    return directories


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


@app.put("/commands/{command_id}/", include_in_schema=False)
@app.put("/commands/{command_id}")
def update_command(command_id: int, command: str, db: Session = Depends(get_db)):
    old_command = db.query(models.Command).filter(models.Command.id == command_id)
    if not old_command.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Command with the id {command_id} is not available"
        )
    old_command.update({"command": command})
    db.commit()
    return "Success"


@app.delete("/commands/{command_id}/", include_in_schema=False)
@app.delete("/commands/{command_id}")
def delete_command(command_id: int, db: Session = Depends(get_db)):
    try:
        db.query(models.Command).filter(models.Command.id == command_id).delete()
        db.query(models.Tag).filter(models.Tag.command_id == command_id).delete()
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"{str(e)}")
    return


@app.post("/commands/{command_id}/tags/", include_in_schema=False)
@app.post("/commands/{command_id}/tags", response_model=schemas.Tag)
def create_tag_for_command(command_id: int, tag: schemas.TagCreate, db: Session = Depends(get_db)):
    return crud.create_tag(db=db, tag=tag, command_id=command_id)


@app.get("/tags/", include_in_schema=False)
@app.get("/tags", response_model=list[schemas.Tag])
def read_tags(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tags = crud.get_tags(db, skip=skip, limit=limit)
    return tags


@app.put("/commands/{command_id}/tags/{tag_id}/", include_in_schema=False)
@app.put("/commands/{command_id}/tags/{tag_id}")
def update_tag(command_id: int, tag_id: int, tag: str, db: Session = Depends(get_db)):
    tags = db.query(models.Tag).filter(models.Tag.command_id == command_id)
    if not tags.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Tags not found for command {command_id}")
    old_tag = tags.filter(models.Tag.id == tag_id)
    if not old_tag.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Tag not found for the id {tag_id}")
    old_tag.update({"tag": tag})
    db.commit()
    return "Success"


@app.delete("/commands/{command_id}/tags/{tag_id}/", include_in_schema=False)
@app.delete("/commands/{command_id}/tags/{tag_id}")
def delete_tag(command_id: int, tag_id: int, db: Session = Depends(get_db)):
    try:
        db.query(models.Tag).filter(models.Tag.command_id == command_id).filter(models.Tag.id == tag_id).delete()
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"{str(e)}")
    return


@app.get("/")
async def root():
    return {"message": ""}
