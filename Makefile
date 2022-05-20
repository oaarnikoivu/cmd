HOST=127.0.0.1
PORT=8002

prepare-dev:
	pipenv install --dev 
	pipenv run pre-commit install 

clean:
	pipenv --rm 

lint:
	pipenv run black app/
	pipenv run flake8

run:
	pipenv run uvicorn app.main:app --reload --host $(HOST) --port $(PORT)