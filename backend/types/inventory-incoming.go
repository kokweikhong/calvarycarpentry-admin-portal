package types

import "time"

// InventoryIncoming is a struct to map database table inventory_incoming.
type InventoryIncoming struct {
	ID                int       `json:"id" db:"id"`
	ProductID         int       `json:"productID" db:"product_id"`
	Status            string    `json:"status" db:"status"`
	Quantity          float64   `json:"quantity" db:"quantity"`
	Length            float64   `json:"length" db:"length"`
	Width             float64   `json:"width" db:"width"`
	Thickness         float64   `json:"thickness" db:"thickness"`
	Unit              string    `json:"unit" db:"unit"`
	ConvertedQuantity float64   `json:"convertedQuantity" db:"converted_quantity"`
	RefNo             string    `json:"refNo" db:"ref_no"`
	RefDoc            string    `json:"refDoc" db:"ref_doc"`
	Cost              float64   `json:"cost" db:"cost"`
	StoreLocation     string    `json:"storeLocation" db:"store_location"`
	StoreCountry      string    `json:"storeCountry" db:"store_country"`
	Remarks           string    `json:"remarks" db:"remarks"`
	CreatedBy         string    `json:"createdBy" db:"created_by"`
	CreatedAt         time.Time `json:"createdAt" db:"created_at"`
	UpdatedBy         string    `json:"updatedBy" db:"updated_by"`
	UpdatedAt         time.Time `json:"updatedAt" db:"updated_at"`
}

// InventoryIncomingSummary is a struct to map database table inventory_incoming.
type InventoryIncomingSummary struct {
	InventoryIncoming
	ProductCode                  string  `json:"productCode" db:"product_code"`
	ProductName                  string  `json:"productName" db:"product_name"`
	Supplier                     string  `json:"supplier" db:"supplier"`
	StandardUnit                 string  `json:"standardUnit" db:"standard_unit"`
	SumOutgoingQuantity          float64 `json:"sumOutgoingQuantity" db:"sum_outgoing_quantity"`
	SumOutgoingConvertedQuantity float64 `json:"sumOutgoingConvertedQuantity" db:"sum_outgoing_converted_quantity"`
	SumOutgoingCost              float64 `json:"sumOutgoingCost" db:"sum_outgoing_cost"`
	AvailableQuantity            float64 `json:"availableQuantity" db:"available_quantity"`
	AvailableConvertedQuantity   float64 `json:"availableConvertedQuantity" db:"available_converted_quantity"`
}
