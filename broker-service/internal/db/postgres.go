package db

import (
	"database/sql"
	"fmt"
	"log/slog"

	"github.com/kokweikhong/calvarycarpentry-admin-portal/broker-service/internal/config"
	_ "github.com/lib/pq"
)

var db *sql.DB

func Init() error {
	connectionString := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		config.CommonConfig.PostgresHost,
		config.CommonConfig.PostgresPort,
		config.CommonConfig.PostgresUser,
		config.CommonConfig.PostgresPassword,
		config.CommonConfig.PostgresDBName,
	)
	slog.Info("Connecting to database...", "connectionString", connectionString)

	postgresDB, err := sql.Open("postgres", connectionString)
	if err != nil {
		slog.Error("Error connecting to database", "error", err)
		return err
	}

	if err := postgresDB.Ping(); err != nil {
		slog.Error("Error pinging database", "error", err)
		return err
	}

	db = postgresDB

	return nil
}

func GetDB() *sql.DB {
	return db
}

func Close() {
	db.Close()
}
