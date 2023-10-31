package main

import (
	"log"
	"log/slog"

	"github.com/kokweikhong/calvarycarpentry-admin-portal/broker-service/internal/config"
	"github.com/kokweikhong/calvarycarpentry-admin-portal/broker-service/internal/router"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	if err := config.Init(); err != nil {
		slog.Error("Error initializing config", "error", err)
		panic(err)
	}
	slog.Info("Config initialized successfully")

	// init db

	// init router
	r := router.Init()

	slog.Info("Starting server...")
	r.Run(":8080")

	// start server
	// log.Fatal(http.ListenAndServe(":8080", router))

}
