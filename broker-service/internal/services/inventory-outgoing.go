package services

import (
	"log/slog"

	"github.com/kokweikhong/calvarycarpentry-admin-portal/broker-service/internal/db"
	"github.com/kokweikhong/calvarycarpentry-admin-portal/broker-service/internal/model"
)

type InventoryOutgoingService interface {
	List() ([]*model.InventoryOutgoing, error)
	Get(id int) (*model.InventoryOutgoing, error)
	Create(inventoryOutgoing *model.InventoryOutgoing) error
	Update(id int, inventoryOutgoing *model.InventoryOutgoing) error
	Delete(id int) error
}

type inventoryOutgoingService struct{}

func NewInventoryOutgoingService() InventoryOutgoingService {
	return &inventoryOutgoingService{}
}

// ID                int       `json:"id" db:"id"`
// IncomingID        int       `json:"incomingID" db:"incoming_id"`
// Status            string    `json:"status" db:"status"`
// Quantity          float64   `json:"quantity" db:"quantity"`
// ConvertedQuantity float64   `json:"convertedQuantity" db:"converted_quantity"`
// Cost              float64   `json:"cost" db:"cost"`
// RefNo             string    `json:"refNo" db:"ref_no"`
// RefDoc            string    `json:"refDoc" db:"ref_doc"`
// Remarks           string    `json:"remarks" db:"remarks"`
// CreatedBy         string    `json:"createdBy" db:"created_by"`
// CreatedAt         time.Time `json:"createdAt" db:"created_at"`
// UpdatedBy         string    `json:"updatedBy" db:"updated_by"`
// UpdatedAt         time.Time `json:"updatedAt" db:"updated_at"`

func (s *inventoryOutgoingService) List() ([]*model.InventoryOutgoing, error) {
	var inventoryOutgoings []*model.InventoryOutgoing

	db := db.GetDB()

	queryString := `
		SELECT
			id,
			incoming_id,
			status,
			quantity,
			converted_quantity,
			cost,
			ref_no,
			ref_doc,
			remarks,
			created_by,
			created_at,
			updated_by,
			updated_at
		FROM
			inventory_outgoings
	`

	rows, err := db.Query(queryString)
	if err != nil {
		slog.Error("Error querying inventory outgoings", "error", err)
		return nil, err
	}

	for rows.Next() {
		inventoryOutgoing := new(model.InventoryOutgoing)
		err := rows.Scan(
			&inventoryOutgoing.ID,
			&inventoryOutgoing.IncomingID,
			&inventoryOutgoing.Status,
			&inventoryOutgoing.Quantity,
			&inventoryOutgoing.ConvertedQuantity,
			&inventoryOutgoing.Cost,
			&inventoryOutgoing.RefNo,
			&inventoryOutgoing.RefDoc,
			&inventoryOutgoing.Remarks,
			&inventoryOutgoing.CreatedBy,
			&inventoryOutgoing.CreatedAt,
			&inventoryOutgoing.UpdatedBy,
			&inventoryOutgoing.UpdatedAt,
		)
		if err != nil {
			slog.Error("Error scanning inventory outgoing", "error", err)
			return nil, err
		}

		inventoryOutgoings = append(inventoryOutgoings, inventoryOutgoing)
	}

	return inventoryOutgoings, nil
}

func (s *inventoryOutgoingService) Get(id int) (*model.InventoryOutgoing, error) {
	inventoryOutgoing := new(model.InventoryOutgoing)

	db := db.GetDB()

	queryString := `
		SELECT
			id,
			incoming_id,
			status,
			quantity,
			converted_quantity,
			cost,
			ref_no,
			ref_doc,
			remarks,
			created_by,
			created_at,
			updated_by,
			updated_at
		FROM
			inventory_outgoings
		WHERE
			id = $1
	`

	row := db.QueryRow(queryString, id)

	err := row.Scan(
		&inventoryOutgoing.ID,
		&inventoryOutgoing.IncomingID,
		&inventoryOutgoing.Status,
		&inventoryOutgoing.Quantity,
		&inventoryOutgoing.ConvertedQuantity,
		&inventoryOutgoing.Cost,
		&inventoryOutgoing.RefNo,
		&inventoryOutgoing.RefDoc,
		&inventoryOutgoing.Remarks,
		&inventoryOutgoing.CreatedBy,
		&inventoryOutgoing.CreatedAt,
		&inventoryOutgoing.UpdatedBy,
		&inventoryOutgoing.UpdatedAt,
	)
	if err != nil {
		slog.Error("Error scanning inventory outgoing", "error", err)
		return nil, err
	}

	return inventoryOutgoing, nil
}

func (s *inventoryOutgoingService) Create(inventoryOutgoing *model.InventoryOutgoing) error {
	db := db.GetDB()

	queryString := `
		INSERT INTO inventory_outgoings (
			incoming_id,
			status,
			quantity,
			converted_quantity,
			cost,
			ref_no,
			ref_doc,
			remarks,
			created_by,
			created_at,
			updated_by,
			updated_at
		) VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7,
			$8,
			$9,
			NOW(),
			$10,
			NOW()
		)
	`

	_, err := db.Exec(
		queryString,
		inventoryOutgoing.IncomingID,
		inventoryOutgoing.Status,
		inventoryOutgoing.Quantity,
		inventoryOutgoing.ConvertedQuantity,
		inventoryOutgoing.Cost,
		inventoryOutgoing.RefNo,
		inventoryOutgoing.RefDoc,
		inventoryOutgoing.Remarks,
		inventoryOutgoing.CreatedBy,
		inventoryOutgoing.UpdatedBy,
	)
	if err != nil {
		slog.Error("Error creating inventory outgoing", "error", err)
		return err
	}

	return nil
}

func (s *inventoryOutgoingService) Update(id int, inventoryOutgoing *model.InventoryOutgoing) error {
	db := db.GetDB()

	queryString := `
		UPDATE
			inventory_outgoings
		SET
			incoming_id = $1,
			status = $2,
			quantity = $3,
			converted_quantity = $4,
			cost = $5,
			ref_no = $6,
			ref_doc = $7,
			remarks = $8,
			updated_by = $9,
			updated_at = NOW()
		WHERE
			id = $10
	`

	_, err := db.Exec(
		queryString,
		inventoryOutgoing.IncomingID,
		inventoryOutgoing.Status,
		inventoryOutgoing.Quantity,
		inventoryOutgoing.ConvertedQuantity,
		inventoryOutgoing.Cost,
		inventoryOutgoing.RefNo,
		inventoryOutgoing.RefDoc,
		inventoryOutgoing.Remarks,
		inventoryOutgoing.UpdatedBy,
		id,
	)
	if err != nil {
		slog.Error("Error updating inventory outgoing", "error", err)
		return err
	}

	return nil
}

func (s *inventoryOutgoingService) Delete(id int) error {
	db := db.GetDB()

	queryString := `
		DELETE FROM
			inventory_outgoings
		WHERE
			id = $1
	`

	_, err := db.Exec(queryString, id)
	if err != nil {
		slog.Error("Error deleting inventory outgoing", "error", err)
		return err
	}

	return nil
}
