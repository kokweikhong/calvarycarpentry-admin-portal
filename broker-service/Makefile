run: build
	@echo "Running..."
	./bin/main

build:
	@echo "Building..."
	go build -o ./bin/ ./cmd/app/main.go

migrate-create:
	@echo "Creating migration..."
	migrate create -ext sql -dir ./migrations -seq ${NAME}

migrate-up:
	@echo "Migrating up..."
	migrate -path ./migrations -database ${POSTGRES_DSN} up

migrate-down:
	@echo "Migrating down..."
	migrate -path ./migrations -database ${POSTGRES_DSN} down

migrate-force:
	@echo "Migrating force..."
	migrate -path ./migrations -database ${POSTGRES_DSN} force ${VERSION}
