SHELL=/bin/bash

DOCKER_VERSION := $(shell docker --version 2>/dev/null)
DOCKER_COMPOSE_VERSION := $(shell docker-compose --version 2>/dev/null)
HOST_NAME := -

include .env
export $(shell sed 's/=.*//' .env)

start-stack:
	docker-compose up -d

start-dev:
	@echo "Don't forget to run make setup-local-certs"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

stop-stack:
	docker-compose stop

setup-repos: stop-tracking-acme-changes
	git submodule update --init --recursive

build-stack:
	chmod 600 traefik/acme.json
	docker-compose build --parallel

dbash:
	docker-compose exec ${SVC} bash

dlog:
	docker-compose logs -f --tail="400" ${SVC}

install-code-server:
	curl -fsSL https://code-server.dev/install.sh | sh

start-code-server:
	echo Starting Code Server: Please use the following config to find your password '~/.config/code-server/config.yaml':
	cat ~/.config/code-server/config.yaml 
	code-server --bind-addr=127.0.0.1:6969

stop-code-server:
	kill $(lsof -t -i:6969)

install-lazydocker:
	curl https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash

lazy:
	lazydocker

new-service:
	npm run hygen service new

stop-tracking-acme-changes:
	git update-index --skip-worktree traefik/acme.json

generate-user-token:
	docker-compose exec hydra hydra token user --skip-tls-verify --port 9010 --auth-url http://trust.${HOST_NAME}/oauth2/auth --token-url http://hydra:4444/oauth2/token --client-id catalyst_platform --client-secret ubj_PF4YaLaz9kuTzZFqqrXbey2U --scope openid,offline

ifneq ($(HOST_NAME),-)
setup-local-certs:
	@echo ---------------
	@echo - Heads up, this will only work on Mac. Please refer to:
	@echo - https://mkcert.dev for other platforms
	@echo ---------------
	@brew install mkcert nss
	@- cd traefik && mkdir certs
	@echo Creating certificates
	mkcert -cert-file traefik/certs/certs-cert.pem -key-file traefik/certs/certs-key.pem ${HOST_NAME} "*.${HOST_NAME}" 
	@echo Installing certificates
	cd traefik/certs && mkcert -cert-file certs-cert.pem -key-file certs-key.pem --install
	@echo Certificates installed!
else
setup-local-certs:
	@echo ---------------
	@echo - Only run this if the HOST_NAME in your .env has been set!
	@echo - Heads up, this will only work on Mac. Please refer to:
	@echo - https://mkcert.dev for other platforms
	@echo ---------------
endif
