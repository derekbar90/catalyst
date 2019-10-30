---
to: <%=h.changeCase.snakeCase(name)%>/Makefile
---
# https://www.postgresql.org/docs/current/libpq-envars.html
export PGPASSWORD=$(POSTGRES_PASSWORD)
export PSQL_DRIVER ?= psql -h $(POSTGRES_HOST) -p $(POSTGRES_PORT) -U $(POSTGRES_USER) $(POSTGRES_DB)

DB_NAME ?= -

ifneq ($(DB_NAME),-)
setup-database:
	${PSQL_DRIVER} -c 'CREATE DATABASE "${DB_NAME}"' 
else
setup-database:
	@echo ---------------
	@echo Skipping database creation no DB_NAME env var found
	@echo ---------------
endif

start-service: setup-database
	npm run dev