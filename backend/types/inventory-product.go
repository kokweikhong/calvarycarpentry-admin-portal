package types

import "time"

// InventoryProduct is a struct to map database table inventory_product.
type InventoryProduct struct {
	ID               int       `json:"id" db:"id"`
	ProductCode      string    `json:"productCode" db:"product_code"`
	ProductName      string    `json:"productName" db:"product_name"`
	Brand            string    `json:"brand" db:"brand"`
	StandardUnit     string    `json:"standardUnit" db:"standard_unit"`
	ProductThumbnail string    `json:"productThumbnail" db:"product_thumbnail"`
	Supplier         string    `json:"supplier" db:"supplier"`
	Remarks          string    `json:"remarks" db:"remarks"`
	IsExist          bool      `json:"isExist" db:"is_exist"`
	CreatedBy        string    `json:"createdBy" db:"created_by"`
	CreatedAt        time.Time `json:"createdAt" db:"created_at"`
	UpdatedBy        string    `json:"updatedBy" db:"updated_by"`
	UpdatedAt        time.Time `json:"updatedAt" db:"updated_at"`
}

// InventoryProductSummary is a struct to map database table inventory_product.
type InventoryProductSummary struct {
	InventoryProduct
	SumIncomingConvertedQuantity float64 `json:"sumIncomingConvertedQuantity" db:"sum_incoming_converted_quantity"`
	SumOutgoingConvertedQuantity float64 `json:"sumOutgoingConvertedQuantity" db:"sum_outgoing_converted_quantity"`
	SumIncomingCost              float64 `json:"sumIncomingCost" db:"sum_incoming_cost"`
	SumOutgoingCost              float64 `json:"sumOutgoingCost" db:"sum_outgoing_cost"`
	AvailableQuantity            float64 `json:"availableQuantity" db:"available_quantity"`
}
