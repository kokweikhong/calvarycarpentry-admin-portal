package users

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kokweikhong/calvarycarpentry-system-backend/types"
	"golang.org/x/crypto/bcrypt"
)

type UsersAPI struct {
	db *sql.DB
}

const PROFILE_IMAGE_PATH = "uploads/profile_images/"

func SetupRouter(router *gin.Engine, db *sql.DB) {
	api := &UsersAPI{db: db}

	usersAPI := router.Group("/users")
	{
		usersAPI.GET("/", api.GetUsers)
		usersAPI.GET("/:id", api.GetUser)
		usersAPI.POST("/email", api.GetUserByEmail)
		usersAPI.POST("/create", api.CreateUser)
		usersAPI.POST("/update/:id", api.UpdateUser)
		usersAPI.POST("/update/password", api.UpdatePassword)
		usersAPI.POST("/update/profile", api.UpdateProfile)
		usersAPI.POST("/delete/:id", api.DeleteUser)

	}
}

// GetUsers returns all users.
func (api *UsersAPI) GetUsers(c *gin.Context) {
	var (
		users []types.User
		user  types.User
	)
	rows, err := api.db.Query("SELECT id, username, email, role, department, " +
		"profile_image, is_exist, created_at, updated_at FROM users")
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	for rows.Next() {
		err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.Role,
			&user.Department, &user.ProfileImage, &user.IsExist, &user.CreatedAt,
			&user.UpdatedAt)
		if err != nil {
			c.JSON(500, gin.H{"error to scan rows": err.Error()})
			return
		}

		users = append(users, user)
	}

	c.JSON(200, users)
}

// GetUser returns a single user.
func (api *UsersAPI) GetUser(c *gin.Context) {
	var (
		user types.User
		id   = c.Params.ByName("id")
	)
	row := api.db.QueryRow("SELECT id, username, email, password, role, department, "+
		"profile_image, is_exist, created_at, updated_at FROM users WHERE id = $1", id)
	err := row.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Role,
		&user.Department, &user.ProfileImage, &user.IsExist, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	fmt.Println(user)

	c.JSON(200, user)
}

// GetUserByEmail returns a single user by email.
func (api *UsersAPI) GetUserByEmail(c *gin.Context) {
	var (
		user types.User
	)

	// email from request body
	var interfaceAuth map[string]string
	c.Bind(&interfaceAuth)
	email := interfaceAuth["email"]
	fmt.Println(interfaceAuth)

	row := api.db.QueryRow("SELECT id, username, email, password, role, department, "+
		"profile_image, is_exist, created_at, updated_at FROM users WHERE email = $1", email)
	err := row.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Role,
		&user.Department, &user.ProfileImage, &user.IsExist, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	password := interfaceAuth["password"]

	// Comparing the password with the hash
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		// If the two passwords don't match, return a 401 status
		c.JSON(401, gin.H{"error": "passwords don't match"})
		return
	}

	c.JSON(200, user)
}

// CreateUser creates a single user.
func (api *UsersAPI) CreateUser(c *gin.Context) {
	var (
		user types.User
	)

	// Form data
	user.Username = c.PostForm("username")
	user.Email = c.PostForm("email")
	user.Role = c.PostForm("role")
	user.Department = c.PostForm("department")
	user.IsExist = true
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	// Store password as hash
	bytes, err := bcrypt.GenerateFromPassword([]byte(c.PostForm("password")), 14)
	if err != nil {
		c.JSON(500, gin.H{"error for hashing password": err.Error()})
		return
	}
	user.Password = string(bytes)

	// Check profile image is valid File
	file, err := c.FormFile("profileImage")
	if err != nil {
		c.JSON(500, gin.H{"error for getting file": err.Error()})
		return
	}

	// Get the extension of the file
	ext := filepath.Ext(file.Filename)

	// Generate uuid for filename
	uuid := uuid.New()

	// Save the file to specific path
	if err := c.SaveUploadedFile(file, PROFILE_IMAGE_PATH+uuid.String()+ext); err != nil {
		c.JSON(500, gin.H{"error for saving file": err.Error()})
		return
	}

	user.ProfileImage = PROFILE_IMAGE_PATH + uuid.String() + ext

	// Insert to database
	stmt, err := api.db.Prepare("INSERT INTO users(username, email, password, role, " +
		"department, profile_image, is_exist, created_at, updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)")
	if err != nil {
		c.JSON(500, gin.H{"error for preparing statement": err.Error()})
		return
	}

	_, err = stmt.Exec(user.Username, user.Email, user.Password, user.Role,
		user.Department, user.ProfileImage, user.IsExist, user.CreatedAt, user.UpdatedAt)
	if err != nil {
		c.JSON(500, gin.H{"error for executing statement": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "User created successfully!"})
}

// UpdateUser updates a single user.
func (api *UsersAPI) UpdateUser(c *gin.Context) {
	var (
		user types.User
		id   = c.Params.ByName("id")
	)

	// Form data
	user.Username = c.PostForm("username")
	user.Email = c.PostForm("email")
	user.Role = c.PostForm("role")
	user.Department = c.PostForm("department")
	user.IsExist, _ = strconv.ParseBool(c.PostForm("isExist"))
	user.UpdatedAt = time.Now()

	// Get previous profile image and password
	row := api.db.QueryRow("SELECT profile_image FROM users WHERE id = $1", id)
	err := row.Scan(&user.ProfileImage)
	if err != nil {
		c.JSON(500, gin.H{"error for getting previous file": err.Error()})
		return
	}

	// Check profile image is valid File
	file, err := c.FormFile("profileImage")
	if err == nil {
		// If the profile image is not updated, use the previous profile image
		// Get the extension of the file
		ext := filepath.Ext(file.Filename)

		// Generate uuid for filename
		uuid := uuid.New()

		// Save the file to specific path
		if err := c.SaveUploadedFile(file, PROFILE_IMAGE_PATH+uuid.String()+ext); err != nil {
			c.JSON(500, gin.H{"error for saving file": err.Error()})
			return
		}

		// Delete previous profile image
		if err := os.Remove(user.ProfileImage); err != nil {
			c.JSON(500, gin.H{"error for deleting file": err.Error()})
			return
		}
		user.ProfileImage = PROFILE_IMAGE_PATH + uuid.String() + ext
	}

	// Update to database
	stmt, err := api.db.Prepare("UPDATE users SET username=$1, email=$2, role=$3, " +
		"department=$4, profile_image=$5, is_exist=$6, updated_at=$7 WHERE id=$8")
	if err != nil {
		c.JSON(500, gin.H{"error for preparing statement": err.Error()})
		return
	}

	_, err = stmt.Exec(
		user.Username, user.Email, user.Role, user.Department,
		user.ProfileImage, user.IsExist, user.UpdatedAt, id,
	)
	if err != nil {
		c.JSON(500, gin.H{"error for executing statement": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "User updated successfully!"})
}

// DeleteUser deletes a single user.
func (api *UsersAPI) DeleteUser(c *gin.Context) {
	// Get id from url and delete user
	id := c.Params.ByName("id")

	// Delete user from database
	stmt, err := api.db.Prepare("DELETE FROM users WHERE id=$1")
	if err != nil {
		c.JSON(500, gin.H{"error for preparing statement": err.Error()})
		return
	}

	_, err = stmt.Exec(id)
	if err != nil {
		c.JSON(500, gin.H{"error for executing statement": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": fmt.Sprintf("User %s deleted successfully!", id)})
}

func (api *UsersAPI) UpdatePassword(c *gin.Context) {
	var (
		user types.User
		id   int
	)

	// Form data
	user.Email = c.PostForm("email")
	user.Password = c.PostForm("password")
	user.UpdatedAt = time.Now()

	// Get user by email
	row := api.db.QueryRow("SELECT id FROM users WHERE email = $1", user.Email)
	err := row.Scan(&id)
	if err != nil {
		c.JSON(500, gin.H{"error for getting user": err.Error()})
		return
	}

	// Store password as hash
	bytes, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	if err != nil {
		c.JSON(500, gin.H{"error for hashing password": err.Error()})
		return
	}
	user.Password = string(bytes)

	// Update to database
	stmt, err := api.db.Prepare(
		"UPDATE users SET password=$1, updated_at=$2 WHERE id=$3")
	if err != nil {
		c.JSON(500, gin.H{"error for preparing statement": err.Error()})
		return
	}

	_, err = stmt.Exec(user.Password, user.UpdatedAt, id)
	if err != nil {
		c.JSON(500, gin.H{"error for executing statement": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Password updated successfully!"})
}

// ID           int       `json:"id" db:"id"`
// Username     string    `json:"username" db:"username"`
// Email        string    `json:"email" db:"email"`
// Password     string    `json:"password" db:"password"`
// Role         string    `json:"role" db:"role"`
// Department   string    `json:"department" db:"department"`
// ProfileImage string    `json:"profileImage" db:"profile_image"`
// IsExist      bool      `json:"isExist" db:"is_exist"`
// CreatedAt    time.Time `json:"createdAt" db:"created_at"`
// UpdatedAt    time.Time `json:"updatedAt" db:"updated_at"`

func (api *UsersAPI) UpdateProfile(c *gin.Context) {
	var (
		user types.User
		id   int
	)

	// Form data
	user.Email = c.PostForm("email")
	user.Username = c.PostForm("username")
	user.UpdatedAt = time.Now()

	// Get user by email
	row := api.db.QueryRow("SELECT id FROM users WHERE email = $1", user.Email)
	err := row.Scan(&id)
	if err != nil {
		c.JSON(500, gin.H{"error for getting user": err.Error()})
		return
	}

	// get profile image
	file, err := c.FormFile("profileImage")
	if err == nil {
		// If the profile image is not updated, use the previous profile image
		// Get the extension of the file
		ext := filepath.Ext(file.Filename)

		// Generate uuid for filename
		uuid := uuid.New()

		// Save the file to specific path
		if err := c.SaveUploadedFile(file, PROFILE_IMAGE_PATH+uuid.String()+ext); err != nil {
			c.JSON(500, gin.H{"error for saving file": err.Error()})
			return
		}

		// Delete previous profile image
		os.Remove(user.ProfileImage)

		// Update profile image
		user.ProfileImage = PROFILE_IMAGE_PATH + uuid.String() + ext
	} else {
		// If the profile image is not updated, use the previous profile image
		user.ProfileImage = c.PostForm("profileImage")
	}

	// Update to database
	stmt, err := api.db.Prepare(
		"UPDATE users SET username=$1, updated_at=$2, profile_image=$3 WHERE id=$4")
	if err != nil {
		c.JSON(500, gin.H{"error for preparing statement": err.Error()})
		return
	}

	_, err = stmt.Exec(user.Username, user.UpdatedAt, user.ProfileImage, id)
	if err != nil {
		c.JSON(500, gin.H{"error for executing statement": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Profile updated successfully!"})
}
