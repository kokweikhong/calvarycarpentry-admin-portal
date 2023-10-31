package config

import (
	"log/slog"
	"os"

	"github.com/joho/godotenv"
)

type Common struct {
	ListenAddr       string
	PostgresHost     string
	PostgresPort     string
	PostgresUser     string
	PostgresPassword string
	PostgresDBName   string
	JwtSecret        string
}

var (
	// CommonConfig is the common config
	CommonConfig *Common
)

func Init() error {
	if err := godotenv.Load("internal/config/.env"); err != nil {
		slog.Error("Error loading .env file", "error", err)
		return err
	}

	CommonConfig = &Common{
		ListenAddr:       os.Getenv("LISTEN_ADDR"),
		PostgresHost:     os.Getenv("POSTGRES_HOST"),
		PostgresPort:     os.Getenv("POSTGRES_PORT"),
		PostgresUser:     os.Getenv("POSTGRES_USER"),
		PostgresPassword: os.Getenv("POSTGRES_PASSWORD"),
		PostgresDBName:   os.Getenv("POSTGRES_DBNAME"),
		JwtSecret:        os.Getenv("JWT_SECRET"),
	}

	return nil
}
