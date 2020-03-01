DOCKER_VERSION := $(shell docker --version 2>/dev/null)
DOCKER_COMPOSE_VERSION := $(shell docker-compose --version 2>/dev/null)

start-stack:
	docker-compose up --build -d

stop-stack:
	docker-compose stop

start-service:
	npm i --save jaeger-client
	npm i
	npm run dev
