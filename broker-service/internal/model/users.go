package model

import "time"

type User struct {
	ID           int       `json:"id" db:"id"`
	Username     string    `json:"username" db:"username"`
	Email        string    `json:"email" db:"email"`
	Password     string    `json:"password" db:"password"`
	Role         string    `json:"role" db:"role"`
	Department   string    `json:"department" db:"department"`
	ProfileImage string    `json:"profileImage" db:"profile_image"`
	IsExist      bool      `json:"isExist" db:"is_exist"`
	IsVerified   bool      `json:"isVerified" db:"is_verified"`
	CreatedAt    time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt    time.Time `json:"updatedAt" db:"updated_at"`
}
