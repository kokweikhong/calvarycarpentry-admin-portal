package services

import (
	"log/slog"

	"github.com/kokweikhong/calvarycarpentry-admin-portal/broker-service/internal/db"
	"github.com/kokweikhong/calvarycarpentry-admin-portal/broker-service/internal/model"
)

type InventoryIncomingService interface {
	List() ([]*model.InventoryIncoming, error)
	Get(id int) (*model.InventoryIncoming, error)
	Create(inventoryIncoming *model.InventoryIncoming) error
	Update(id int, inventoryIncoming *model.InventoryIncoming) error
	Delete(id int) error
}

type inventoryIncomingService struct{}

func NewInventoryIncomingService() InventoryIncomingService {
	return &inventoryIncomingService{}
}

func (s *inventoryIncomingService) List() ([]*model.InventoryIncoming, error) {
	var inventoryIncomings []*model.InventoryIncoming

	db := db.GetDB()

	queryString := `
		SELECT
			id,
			product_id,
			status,
			quantity,
			length,
			width,
			thickness,
			unit,
			converted_quantity,
			ref_no,
			ref_doc,
			cost,
			store_location,
			store_country,
			remarks,
			created_by,
			created_at,
			updated_by,
			updated_at
		FROM
			inventory_incomings
	`

	rows, err := db.Query(queryString)
	if err != nil {
		slog.Error("Error querying inventory incomings", "error", err)
		return nil, err
	}

	for rows.Next() {
		inventoryIncoming := new(model.InventoryIncoming)
		err := rows.Scan(
			&inventoryIncoming.ID,
			&inventoryIncoming.ProductID,
			&inventoryIncoming.Status,
			&inventoryIncoming.Quantity,
			&inventoryIncoming.Length,
			&inventoryIncoming.Width,
			&inventoryIncoming.Thickness,
			&inventoryIncoming.Unit,
			&inventoryIncoming.ConvertedQuantity,
			&inventoryIncoming.RefNo,
			&inventoryIncoming.RefDoc,
			&inventoryIncoming.Cost,
			&inventoryIncoming.StoreLocation,
			&inventoryIncoming.StoreCountry,
			&inventoryIncoming.Remarks,
			&inventoryIncoming.CreatedBy,
			&inventoryIncoming.CreatedAt,
			&inventoryIncoming.UpdatedBy,
			&inventoryIncoming.UpdatedAt,
		)
		if err != nil {
			slog.Error("Error scanning inventory incoming", "error", err)
			return nil, err
		}

		inventoryIncomings = append(inventoryIncomings, inventoryIncoming)
	}

	if err := rows.Err(); err != nil {
		slog.Error("Error iterating inventory incoming rows", "error", err)
		return nil, err
	}

	slog.Info("Successfully retrieved inventory incomings", "inventoryIncomings", inventoryIncomings)

	return inventoryIncomings, nil
}

func (s *inventoryIncomingService) Get(id int) (*model.InventoryIncoming, error) {
	inventoryIncoming := new(model.InventoryIncoming)

	db := db.GetDB()

	queryString := `
		SELECT
			id,
			product_id,
			status,
			quantity,
			length,
			width,
			thickness,
			unit,
			converted_quantity,
			ref_no,
			ref_doc,
			cost,
			store_location,
			store_country,
			remarks,
			created_by,
			created_at,
			updated_by,
			updated_at
		FROM
			inventory_incomings
		WHERE
			id = $1
	`

	err := db.QueryRow(queryString, id).Scan(
		&inventoryIncoming.ID,
		&inventoryIncoming.ProductID,
		&inventoryIncoming.Status,
		&inventoryIncoming.Quantity,
		&inventoryIncoming.Length,
		&inventoryIncoming.Width,
		&inventoryIncoming.Thickness,
		&inventoryIncoming.Unit,
		&inventoryIncoming.ConvertedQuantity,
		&inventoryIncoming.RefNo,
		&inventoryIncoming.RefDoc,
		&inventoryIncoming.Cost,
		&inventoryIncoming.StoreLocation,
		&inventoryIncoming.StoreCountry,
		&inventoryIncoming.Remarks,
		&inventoryIncoming.CreatedBy,
		&inventoryIncoming.CreatedAt,
		&inventoryIncoming.UpdatedBy,
		&inventoryIncoming.UpdatedAt,
	)
	if err != nil {
		slog.Error("Error scanning inventory incoming", "error", err)
		return nil, err
	}

	slog.Info("Successfully retrieved inventory incoming", "inventoryIncoming", inventoryIncoming)

	return inventoryIncoming, nil
}

func (s *inventoryIncomingService) Create(inventoryIncoming *model.InventoryIncoming) error {
	db := db.GetDB()

	queryString := `
		INSERT INTO inventory_incomings (
			product_id,
			status,
			quantity,
			length,
			width,
			thickness,
			unit,
			converted_quantity,
			ref_no,
			ref_doc,
			cost,
			store_location,
			store_country,
			remarks,
			created_by,
			created_at,
			updated_by,
			updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
			$11, $12, $13, $14, $15, NOW(), $16, NOW()
		)
	`

	_, err := db.Exec(
		queryString,
		inventoryIncoming.ProductID,
		inventoryIncoming.Status,
		inventoryIncoming.Quantity,
		inventoryIncoming.Length,
		inventoryIncoming.Width,
		inventoryIncoming.Thickness,
		inventoryIncoming.Unit,
		inventoryIncoming.ConvertedQuantity,
		inventoryIncoming.RefNo,
		inventoryIncoming.RefDoc,
		inventoryIncoming.Cost,
		inventoryIncoming.StoreLocation,
		inventoryIncoming.StoreCountry,
		inventoryIncoming.Remarks,
		inventoryIncoming.CreatedBy,
		inventoryIncoming.UpdatedBy,
	)
	if err != nil {
		slog.Error("Error creating inventory incoming", "error", err)
		return err
	}

	slog.Info("Successfully created inventory incoming", "inventoryIncoming", inventoryIncoming)

	return nil
}

func (s *inventoryIncomingService) Update(id int, inventoryIncoming *model.InventoryIncoming) error {
	db := db.GetDB()

	queryString := `
		UPDATE
			inventory_incomings
		SET
			product_id = $1,
			status = $2,
			quantity = $3,
			length = $4,
			width = $5,
			thickness = $6,
			unit = $7,
			converted_quantity = $8,
			ref_no = $9,
			ref_doc = $10,
			cost = $11,
			store_location = $12,
			store_country = $13,
			remarks = $14,
			updated_by = $15,
			updated_at = NOW()
		WHERE
			id = $16
	`

	_, err := db.Exec(
		queryString,
		inventoryIncoming.ProductID,
		inventoryIncoming.Status,
		inventoryIncoming.Quantity,
		inventoryIncoming.Length,
		inventoryIncoming.Width,
		inventoryIncoming.Thickness,
		inventoryIncoming.Unit,
		inventoryIncoming.ConvertedQuantity,
		inventoryIncoming.RefNo,
		inventoryIncoming.RefDoc,
		inventoryIncoming.Cost,
		inventoryIncoming.StoreLocation,
		inventoryIncoming.StoreCountry,
		inventoryIncoming.Remarks,
		inventoryIncoming.UpdatedBy,
		id,
	)
	if err != nil {
		slog.Error("Error updating inventory incoming", "error", err)
		return err
	}

	slog.Info("Successfully updated inventory incoming", "inventoryIncoming", inventoryIncoming)

	return nil
}

func (s *inventoryIncomingService) Delete(id int) error {
	db := db.GetDB()

	queryString := `
		DELETE FROM
			inventory_incomings
		WHERE
			id = $1
	`

	_, err := db.Exec(queryString, id)
	if err != nil {
		slog.Error("Error deleting inventory incoming", "error", err)
		return err
	}

	slog.Info("Successfully deleted inventory incoming", "id", id)

	return nil
}
