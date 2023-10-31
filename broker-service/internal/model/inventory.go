package model

import "time"

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
