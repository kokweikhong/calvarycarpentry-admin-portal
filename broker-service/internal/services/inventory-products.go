package services

import (
	"log/slog"

	"github.com/kokweikhong/calvarycarpentry-admin-portal/broker-service/internal/db"
	"github.com/kokweikhong/calvarycarpentry-admin-portal/broker-service/internal/model"
)

type InventoryProductService interface {
	List() ([]*model.InventoryProduct, error)
	Get(id int) (*model.InventoryProduct, error)
	Create(inventoryProduct *model.InventoryProduct) error
	Update(id int, inventoryProduct *model.InventoryProduct) error
	Delete(id int) error
}

type inventoryProductService struct{}

func NewInventoryProductService() InventoryProductService {
	return &inventoryProductService{}
}

func (s *inventoryProductService) List() ([]*model.InventoryProduct, error) {
	var inventoryProducts []*model.InventoryProduct

	db := db.GetDB()

	queryString := `
		SELECT
			id,
			product_code,
			product_name,
			brand,
			standard_unit,
			product_thumbnail,
			supplier,
			remarks,
			is_exist,
			created_by,
			created_at,
			updated_by,
			updated_at
		FROM
			inventory_products
	`

	rows, err := db.Query(queryString)
	if err != nil {
		slog.Error("Error querying inventory products", "error", err)
		return nil, err
	}

	for rows.Next() {
		inventoryProduct := new(model.InventoryProduct)
		err := rows.Scan(
			&inventoryProduct.ID,
			&inventoryProduct.ProductCode,
			&inventoryProduct.ProductName,
			&inventoryProduct.Brand,
			&inventoryProduct.StandardUnit,
			&inventoryProduct.ProductThumbnail,
			&inventoryProduct.Supplier,
			&inventoryProduct.Remarks,
			&inventoryProduct.IsExist,
			&inventoryProduct.CreatedBy,
			&inventoryProduct.CreatedAt,
			&inventoryProduct.UpdatedBy,
			&inventoryProduct.UpdatedAt,
		)
		if err != nil {
			slog.Error("Error scanning inventory product", "error", err)
			return nil, err
		}

		inventoryProducts = append(inventoryProducts, inventoryProduct)
	}

	if err := rows.Err(); err != nil {
		slog.Error("Error iterating inventory product rows", "error", err)
		return nil, err
	}

	slog.Info("Successfully retrieved inventory products", "inventoryProducts", inventoryProducts)

	return inventoryProducts, nil
}

func (s *inventoryProductService) Get(id int) (*model.InventoryProduct, error) {
	inventoryProduct := new(model.InventoryProduct)

	db := db.GetDB()

	queryString := `
		SELECT
			id,
			product_code,
			product_name,
			brand,
			standard_unit,
			product_thumbnail,
			supplier,
			remarks,
			is_exist,
			created_by,
			created_at,
			updated_by,
			updated_at
		FROM
			inventory_products
		WHERE
			id = $1
	`

	row := db.QueryRow(queryString, id)

	err := row.Scan(
		&inventoryProduct.ID,
		&inventoryProduct.ProductCode,
		&inventoryProduct.ProductName,
		&inventoryProduct.Brand,
		&inventoryProduct.StandardUnit,
		&inventoryProduct.ProductThumbnail,
		&inventoryProduct.Supplier,
		&inventoryProduct.Remarks,
		&inventoryProduct.IsExist,
		&inventoryProduct.CreatedBy,
		&inventoryProduct.CreatedAt,
		&inventoryProduct.UpdatedBy,
		&inventoryProduct.UpdatedAt,
	)
	if err != nil {
		slog.Error("Error scanning inventory product", "error", err)
		return nil, err
	}

	slog.Info("Successfully retrieved inventory product", "inventoryProduct", inventoryProduct)

	return inventoryProduct, nil
}

func (s *inventoryProductService) Create(inventoryProduct *model.InventoryProduct) error {
	db := db.GetDB()

	queryString := `
		INSERT INTO inventory_products (
			product_code,
			product_name,
			brand,
			standard_unit,
			product_thumbnail,
			supplier,
			remarks,
			is_exist,
			created_by,
			created_at,
			updated_by,
			updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10, NOW()
		)
	`

	_, err := db.Exec(
		queryString,
		inventoryProduct.ProductCode,
		inventoryProduct.ProductName,
		inventoryProduct.Brand,
		inventoryProduct.StandardUnit,
		inventoryProduct.ProductThumbnail,
		inventoryProduct.Supplier,
		inventoryProduct.Remarks,
		inventoryProduct.IsExist,
		inventoryProduct.CreatedBy,
		inventoryProduct.UpdatedBy,
	)
	if err != nil {
		slog.Error("Error creating inventory product", "error", err)
		return err
	}

	slog.Info("Successfully created inventory product", "inventoryProduct", inventoryProduct)

	return nil
}

func (s *inventoryProductService) Update(id int, inventoryProduct *model.InventoryProduct) error {
	db := db.GetDB()

	queryString := `
		UPDATE
			inventory_products
		SET
			product_code = $1,
			product_name = $2,
			brand = $3,
			standard_unit = $4,
			product_thumbnail = $5,
			supplier = $6,
			remarks = $7,
			is_exist = $8,
			updated_by = $9,
			updated_at = NOW()
		WHERE
			id = $10
	`

	_, err := db.Exec(
		queryString,
		inventoryProduct.ProductCode,
		inventoryProduct.ProductName,
		inventoryProduct.Brand,
		inventoryProduct.StandardUnit,
		inventoryProduct.ProductThumbnail,
		inventoryProduct.Supplier,
		inventoryProduct.Remarks,
		inventoryProduct.IsExist,
		inventoryProduct.UpdatedBy,
		id,
	)
	if err != nil {
		slog.Error("Error updating inventory product", "error", err)
		return err
	}

	slog.Info("Successfully updated inventory product", "id", id)

	return nil
}

func (s *inventoryProductService) Delete(id int) error {
	db := db.GetDB()

	queryString := `
		DELETE FROM
			inventory_products
		WHERE
			id = $1
	`

	_, err := db.Exec(queryString, id)
	if err != nil {
		slog.Error("Error deleting inventory product", "error", err)
		return err
	}

	slog.Info("Successfully deleted inventory product", "id", id)

	return nil
}
