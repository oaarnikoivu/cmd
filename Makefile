HOST=127.0.0.1
PORT=8002

prepare-dev:
	pipenv install --dev 
	pipenv run pre-commit install 

clean:
	pipenv --rm 

lint:
	pipenv run black cmd/
	pipenv run flake8

run:
	pipenv run uvicorn cmd.main:app --reload --host $(HOST) --port $(PORT)