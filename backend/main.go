package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"

	"github.com/gin-gonic/gin"
	"github.com/kokweikhong/calvarycarpentry-system-backend/inventory"
	"github.com/kokweikhong/calvarycarpentry-system-backend/users"
)

var (
	DB_HOST     = os.Getenv("DB_HOST")
	DB_PORT     = os.Getenv("DB_PORT")
	DB_USER     = os.Getenv("DB_USER")
	DB_PASSWORD = os.Getenv("DB_PASSWORD")
	DB_NAME     = os.Getenv("DB_NAME")
)

func init() {
	gin.SetMode(gin.ReleaseMode)
}

var (
	logErr = log.New(os.Stderr, "ERROR: ", log.Lshortfile|log.LstdFlags)
)

func main() {

	router := gin.Default()

	fmt.Println("DB_HOST", DB_HOST)
	fmt.Println("DB_PORT", os.Getenv("DB_PORT"))

	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "*")
	})

	fmt.Println(DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		logErr.Fatal(err)
	}
	// defer db.Close()

	if err := db.Ping(); err != nil {
		logErr.Fatal(err)
	}

	// Set a lower memory limit for multipart forms (default is 32 MiB)
	router.MaxMultipartMemory = 8 << 20 // 8 MiB

	// define a route handler for the /upload route
	router.StaticFS("/uploads", http.Dir("uploads"))

	inventory.SetupRouter(router, db)

	users.SetupRouter(router, db)

	fmt.Println("Server is running on port 8000")

	router.Run(":8000")
}
