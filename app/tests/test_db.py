from http.client import responses
import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.main import app, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture()
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_create_command(test_db):
    response = client.post("/commands", json={"command": "docker run x"})
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["command"] == "docker run x"
    command_id = data["id"]

    response = client.get(f"/commands/{command_id}")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["command"] == "docker run x"
    assert data["id"] == command_id


def test_update_command(test_db):
    response = client.post("/commands", json={"command": "docker run x"})
    data = response.json()
    old_command = data["command"]
    old_command_id = data["id"]

    new_command = "docker run y"
    response = client.put(f"/commands/{old_command_id}", params={"command": {new_command}})
    assert response.status_code == 200, response.text

    response = client.get("/commands")

    assert response.status_code == 200, response.text

    data = response.json()
    command = data[0]["command"]
    assert command != old_command
    assert command == new_command


def test_delete_command(test_db):
    response = client.post("/commands", json={"command": "docker run x"})
    data = response.json()
    old_command_id = data["id"]

    response = client.delete(f"/commands/{old_command_id}")

    assert response.status_code == 200, response.text

    response = client.get("/commands")
    assert response.status_code == 200, response.text
    data = response.json()

    assert data == []


def test_create_tag(test_db):
    response = client.post("/commands", json={"command": "docker run x"})
    assert response.status_code == 200, response.text
    data = response.json()
    command_id = data["id"]

    assert data["tags"] == []

    response = client.post(f"/commands/{command_id}/tags", json={"tag": "docker"})
    assert response.status_code == 200, response.text

    response = client.get(f"/commands/{command_id}")
    assert response.status_code == 200, response.text

    data = response.json()
    assert "tags" in data
    assert data["tags"][0]["tag"] == "docker"


def test_update_tag(test_db):
    response = client.post("/commands", json={"command": "docker run x"})
    assert response.status_code == 200, response.text
    data = response.json()
    command_id = data["id"]

    response = client.post(f"/commands/{command_id}/tags", json={"tag": "docker"})
    assert response.status_code == 200, response.text

    data = response.json()
    tag_id = data["id"]

    response = client.put(f"/commands/{command_id}/tags/{tag_id}", params={"tag": "test"})
    assert response.status_code == 200, response.text

    response = client.get("/tags")
    assert response.status_code == 200, response.text

    data = response.json()
    assert data[0]["tag"] == "test"


def test_delete_tag(test_db):
    response = client.post("/commands", json={"command": "docker run x"})
    assert response.status_code == 200, response.text
    data = response.json()
    command_id = data["id"]

    response = client.post(f"/commands/{command_id}/tags", json={"tag": "docker"})
    assert response.status_code == 200, response.text

    data = response.json()
    tag_id = data["id"]

    response = client.delete(f"/commands/{command_id}/tags/{tag_id}")
    assert response.status_code == 200, response.text

    response = client.get("/tags")
    assert response.status_code == 200, response.text

    data = response.json()
    assert data == []
