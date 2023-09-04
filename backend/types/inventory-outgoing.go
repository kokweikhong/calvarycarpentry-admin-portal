package types

import "time"

// InventoryOutgoing is a struct to map database table inventory_outgoing.
type InventoryOutgoing struct {
	ID                int       `json:"id" db:"id"`
	IncomingID        int       `json:"incomingID" db:"incoming_id"`
	Status            string    `json:"status" db:"status"`
	Quantity          float64   `json:"quantity" db:"quantity"`
	ConvertedQuantity float64   `json:"convertedQuantity" db:"converted_quantity"`
	Cost              float64   `json:"cost" db:"cost"`
	RefNo             string    `json:"refNo" db:"ref_no"`
	RefDoc            string    `json:"refDoc" db:"ref_doc"`
	Remarks           string    `json:"remarks" db:"remarks"`
	CreatedBy         string    `json:"createdBy" db:"created_by"`
	CreatedAt         time.Time `json:"createdAt" db:"created_at"`
	UpdatedBy         string    `json:"updatedBy" db:"updated_by"`
	UpdatedAt         time.Time `json:"updatedAt" db:"updated_at"`
}

// InventoryOutgoingSummary is a struct to map database table inventory_outgoing.
type InventoryOutgoingSummary struct {
	InventoryOutgoing
	ProductCode  string `json:"productCode" db:"product_code"`
	ProductName  string `json:"productName" db:"product_name"`
	Supplier     string `json:"supplier" db:"supplier"`
	StandardUnit string `json:"standardUnit" db:"standard_unit"`
	Length       string `json:"length" db:"length"`
	Width        string `json:"width" db:"width"`
	Thickness    string `json:"thickness" db:"thickness"`
	Unit         string `json:"unit" db:"unit"`
}
