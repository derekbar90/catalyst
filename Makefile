SHELL=/bin/bash

DOCKER_VERSION := $(shell docker --version 2>/dev/null)
DOCKER_COMPOSE_VERSION := $(shell docker-compose --version 2>/dev/null)

start-stack:
	docker-compose up -d

start-stack-metrics:
	docker-compose -f docker-compose.yml -f docker-compose-metrics.yaml up

stop-stack:
	docker-compose stop

build-stack:
	docker-compose build

dbash:
	docker-compose exec ${SVC} bash

dlog:
	docker-compose logs -f --tail="400" ${SVC}

start-code-server:
	docker run -it -p 127.0.0.1:8080:8080 -v "${HOME}/.local/share/code-server:/home/coder/.local/share/code-server" -v "$PWD:/home/coder/project" codercom/code-server:v2

install-lazydocker:
	curl https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash

lazy:
	lazydocker