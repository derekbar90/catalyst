---
to: <%=h.changeCase.snakeCase(name)%>/Makefile
---
# https://www.postgresql.org/docs/current/libpq-envars.html
export PGPASSWORD=$(POSTGRES_PASSWORD)
export PSQL_DRIVER ?= psql -h $(POSTGRES_HOST) -p $(POSTGRES_PORT) -U $(POSTGRES_USER) $(POSTGRES_DB)

DB_NAME ?= -

ifneq ($(DB_NAME),-)
setup-database:
	-${PSQL_DRIVER} -c 'CREATE DATABASE "${DB_NAME}"' 
else
setup-database:
	@echo ---------------
	@echo Skipping database creation no DB_NAME env var found
	@echo ---------------
endif

start-service: setup-database
	npm run dev

create-db-migration:
	npm run sequelize migration:generate -- --name=${name}

db-migrate:
	npm run sequelize db:migrate

db-migrate-status:
	npm run sequelize db:migrate:status

db-rollback-last-migration:
	npm run sequelize db:migrate:undo

db-rollback-all-migrations:
	npm run sequelize db:migrate:undo:all

db-seed-specific:
	npm run sequelize db:seed

db-seed-all:
	npm run sequelize db:seed:all

db-seed-undo-specific:
	npm run sequelize db:seed:undo

db-seed-all:
	npm run sequelize db:seed:undo:all
