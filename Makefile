DOCKER_VERSION := $(shell docker --version 2>/dev/null)
DOCKER_COMPOSE_VERSION := $(shell docker-compose --version 2>/dev/null)

ENV_BROWSER_HYDRA_HOST ?= localhost
ENV_BROWSER_CONSUMER_HOST ?= localhost
ENV_BROWSER_IDP_HOST ?= localhost
ENV_BROWSER_OATHKEEPER_PROXY_HOST ?= localhost

ENV_HYDRA_VERSION ?= v1.0.0-rc.5_oryOS.10
ENV_KETO_VERSION ?= v0.2.2-sandbox_oryOS.10
ENV_OATHKEEPER_VESRION ?= v0.14.2_oryOS.10
ENV_LOGIN_CONSENT_VERSION ?= v1.0.0-rc.5

export LOGIN_CONSENT_VERSION=${ENV_LOGIN_CONSENT_VERSION}
export HYDRA_VERSION=${ENV_HYDRA_VERSION}
export OATHKEEPER_VERSION=${ENV_OATHKEEPER_VESRION}
export KETO_VERSION=${ENV_KETO_VERSION}

export BROWSER_HYDRA_HOST=${ENV_BROWSER_HYDRA_HOST}
export BROWSER_CONSUMER_HOST=${ENV_BROWSER_CONSUMER_HOST}
export BROWSER_IDP_HOST=${ENV_BROWSER_IDP_HOST}
export BROWSER_OATHKEEPER_PROXY_HOST=${ENV_BROWSER_OATHKEEPER_PROXY_HOST}

start-stack:
	docker-compose up --build -d

stop-stack:
	docker-compose stop

start-service:
	npm run dev

start-code-server:
	docker run -it -p 127.0.0.1:8080:8080 -v "${HOME}/.local/share/code-server:/home/coder/.local/share/code-server" -v "$PWD:/home/coder/project" codercom/code-server:v2

