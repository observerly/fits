#/*****************************************************************************************************************/

#// @author         Michael Roberts <michael@observerly.com>
#// @package        @observerly/fits
#// @license        Copyright © 2021-2024 observerly

#/*****************************************************************************************************************/

# Read .env file and export variables:
include .env
export

#/*****************************************************************************************************************/

# Build the development Docker container:
.PHONY: build
build:
	docker-compose --file local.yaml up --build --detach

#/*****************************************************************************************************************/

# Build and execute a command on the development Docker container:
.PHONY: exec
exec:
	docker exec $(CONTAINER_NAME) $(CMD)

#/*****************************************************************************************************************/

# Build and run the development Docker container, with a running shell:
.PHONY: dev
dev: build
	docker exec --tty --interactive $(CONTAINER_NAME) /bin/zsh

#/*****************************************************************************************************************/

# Stop the running Docker container:
.PHONY: stop
stop:
	docker compose --file $(COMPOSE_FILE) down

#/*****************************************************************************************************************/

# Stop and remove the Docker container and network:
.PHONY: clean
clean: stop
	docker compose --file $(COMPOSE_FILE) rm --stop --volumes
	docker compose --file $(COMPOSE_FILE) down --rmi all --remove-orphans

#/*****************************************************************************************************************/