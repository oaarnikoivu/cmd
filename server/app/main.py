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


@app.post("/nodes/", include_in_schema=False)
@app.post("/nodes", response_model=schemas.Node)
def mkdir(node: schemas.NodeCreate, db: Session = Depends(get_db)):
    db_node = crud.get_node_by_name(db, name=node.name)
    if db_node:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Directory already exists!")
    return crud.create_node(db=db, node=node)


@app.post("/child/", include_in_schema=False)
@app.post("/child", response_model=schemas.Node)
def mksubdir(node: schemas.NodeCreate, db: Session = Depends(get_db)):
    db_parent = crud.get_node_by_name(db=db, name=node.parent)
    if not db_parent:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Attempting to create a sub-directory with no known parent!"
        )
    exists = crud.check_for_existing(db=db, node=node, db_parent=db_parent)
    if len(exists) != 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Directory already exists!")
    return crud.create_child(db=db, node=node, db_parent=db_parent)
