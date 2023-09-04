package inventory

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kokweikhong/calvarycarpentry-system-backend/types"
)

const INVENTORY_INCOMING_REFDOC_PATH = "uploads/inventory/incoming"

// GetInventoryIncoming returns all inventory incoming records.
func (api *inventoryAPI) GetInventoryIncomingSummary(c *gin.Context) {
	var (
		incomings []types.InventoryIncomingSummary
		incoming  types.InventoryIncomingSummary
	)

	queryStr := "SELECT id, product_id, status, quantity, length, " +
		"width, thickness, unit, converted_quantity, ref_no, ref_doc, cost, " +
		"store_location, store_country, remarks, created_by, created_at, " +
		"updated_by, updated_at, product_code, product_name, supplier, " +
		"standard_unit, sum_outgoing_converted_quantity, sum_outgoing_cost, " +
		"available_quantity, available_converted_quantity, sum_outgoing_quantity " +
		"FROM inventory_incoming_summary"

	// Check any query string for minConvertedQuantity
	query := c.Request.URL.Query()
	availableQty := query.Get("availableqty")

	// Check if minConvertedQuantity is empty
	if availableQty != "" {
		// Convert minConvertedQuantity to float64
		availableQtyFloat, err := strconv.ParseFloat(availableQty, 64)
		if err == nil {
			queryStr += fmt.Sprintf(" WHERE available_quantity >= %f", availableQtyFloat)
			// c.JSON(500, gin.H{"error to convert availableqty to float64": err.Error()})
			// return
		}
		// extend query string
		// queryStr += fmt.Sprintf(" WHERE available_quantity >= %f", availableQtyFloat)
	}

	stmt, err := api.db.Prepare(queryStr)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to prepare statement: %s", err.Error()): err.Error()})
		return
	}
	rows, err := stmt.Query()
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to query statement: %s", err.Error()): err.Error()})
		return
	}

	for rows.Next() {
		err := rows.Scan(
			&incoming.ID, &incoming.ProductID, &incoming.Status,
			&incoming.Quantity, &incoming.Length, &incoming.Width,
			&incoming.Thickness, &incoming.Unit, &incoming.ConvertedQuantity,
			&incoming.RefNo, &incoming.RefDoc, &incoming.Cost, &incoming.StoreLocation,
			&incoming.StoreCountry, &incoming.Remarks, &incoming.CreatedBy,
			&incoming.CreatedAt, &incoming.UpdatedBy, &incoming.UpdatedAt,
			&incoming.ProductCode, &incoming.ProductName, &incoming.Supplier,
			&incoming.StandardUnit, &incoming.SumOutgoingConvertedQuantity,
			&incoming.SumOutgoingCost, &incoming.AvailableQuantity,
			&incoming.AvailableConvertedQuantity, &incoming.SumOutgoingQuantity)
		if err != nil {
			c.JSON(500, gin.H{"error to scan rows": err.Error()})
			return
		}

		incomings = append(incomings, incoming)
	}

	c.JSON(200, incomings)
}

// GetInventoryIncoming returns all inventory incoming records.
func (api *inventoryAPI) GetInventoryIncoming(c *gin.Context) {
	var (
		incomings []types.InventoryIncoming
		incoming  types.InventoryIncoming
	)
	stmt, err := api.db.Prepare("SELECT id, product_id, status, quantity " +
		"length, width, thickness, unit, converted_quantity, ref_no, ref_doc, cost, " +
		"store_location, store_country, remarks, created_by, created_at, " +
		"updated_by, updated_at " +
		"FROM inventory_incoming")
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to prepare statement: %s", err.Error()): err.Error()})
		return
	}

	rows, err := stmt.Query()
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to query statement: %s", err.Error()): err.Error()})
		return
	}

	for rows.Next() {
		err := rows.Scan(
			&incoming.ID, &incoming.ProductID, &incoming.Status,
			&incoming.Quantity, &incoming.Length, &incoming.Width,
			&incoming.Thickness, &incoming.Unit, &incoming.ConvertedQuantity,
			&incoming.RefNo, &incoming.RefDoc, &incoming.Cost, &incoming.StoreLocation,
			&incoming.StoreCountry, &incoming.Remarks, &incoming.CreatedBy,
			&incoming.CreatedAt, &incoming.UpdatedBy, &incoming.UpdatedAt)
		if err != nil {
			c.JSON(500, gin.H{"error to scan rows": err.Error()})
			return
		}

		incomings = append(incomings, incoming)
	}

	c.JSON(200, incomings)
}

// GetInventoryIncomingByID returns a inventory incoming record by ID.
func (api *inventoryAPI) GetInventoryIncomingByID(c *gin.Context) {
	var (
		incoming types.InventoryIncoming
	)
	id := c.Params.ByName("id")

	stmt, err := api.db.Prepare("SELECT id, product_id, status, quantity, length, " +
		"width, thickness, unit, converted_quantity, ref_no, ref_doc, cost, " +
		"store_location, store_country, remarks, created_by, created_at, " +
		"updated_by, updated_at " +
		"FROM inventory_incoming WHERE id = $1")
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to prepare statement: %s", err.Error()): err.Error()})
		return
	}

	err = stmt.QueryRow(id).Scan(
		&incoming.ID, &incoming.ProductID, &incoming.Status,
		&incoming.Quantity, &incoming.Length, &incoming.Width,
		&incoming.Thickness, &incoming.Unit, &incoming.ConvertedQuantity,
		&incoming.RefNo, &incoming.RefDoc, &incoming.Cost, &incoming.StoreLocation,
		&incoming.StoreCountry, &incoming.Remarks, &incoming.CreatedBy,
		&incoming.CreatedAt, &incoming.UpdatedBy, &incoming.UpdatedAt)
	if err != nil {
		c.JSON(500, gin.H{"error to scan rows": err.Error()})
		return
	}

	c.JSON(200, incoming)
}

// CreateInventoryIncoming creates a inventory incoming record.
func (api *inventoryAPI) CreateInventoryIncoming(c *gin.Context) {
	var (
		incoming types.InventoryIncoming
	)

	incoming.CreatedAt = time.Now()
	incoming.UpdatedAt = time.Now()

	// incoming other field by post form
	incoming.ProductID, _ = strconv.Atoi(c.PostForm("productID"))
	incoming.Status = c.PostForm("status")
	incoming.Quantity, _ = strconv.ParseFloat(c.PostForm("quantity"), 64)
	incoming.Length, _ = strconv.ParseFloat(c.PostForm("length"), 64)
	incoming.Width, _ = strconv.ParseFloat(c.PostForm("width"), 64)
	incoming.Thickness, _ = strconv.ParseFloat(c.PostForm("thickness"), 64)
	incoming.Unit = c.PostForm("unit")
	incoming.ConvertedQuantity, _ = strconv.ParseFloat(c.PostForm("convertedQuantity"), 64)
	incoming.RefNo = c.PostForm("refNo")
	incoming.Cost, _ = strconv.ParseFloat(c.PostForm("cost"), 64)
	incoming.StoreLocation = c.PostForm("storeLocation")
	incoming.StoreCountry = c.PostForm("storeCountry")
	incoming.Remarks = c.PostForm("remarks")
	incoming.CreatedBy = c.PostForm("createdBy")
	incoming.UpdatedBy = c.PostForm("updatedBy")

	// refDoc is file
	file, err := c.FormFile("refDoc")
	if err != nil {
		c.JSON(500, gin.H{"error to get file": err.Error()})
		return
	}

	uuid := uuid.New()

	// Get the file extension
	extension := filepath.Ext(file.Filename)

	// Generate random file name
	dst := filepath.Join(INVENTORY_INCOMING_REFDOC_PATH, uuid.String()+extension)

	// Upload the file to specific dst.
	err = c.SaveUploadedFile(file, dst)
	if err != nil {
		c.JSON(500, gin.H{"error to save file": err.Error()})
		return
	}

	incoming.RefDoc = dst

	// insert to database
	_, err = api.db.Exec("INSERT INTO inventory_incoming (product_id, "+
		"status, quantity, length, width, thickness, converted_quantity, "+
		"ref_no, ref_doc, cost, store_location, store_country, remarks, "+
		"created_by, created_at, updated_by, unit) VALUES ($1, $2, $3, $4, $5, $6, "+
		"$7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
		incoming.ProductID, incoming.Status, incoming.Quantity, incoming.Length,
		incoming.Width, incoming.Thickness, incoming.ConvertedQuantity,
		incoming.RefNo, incoming.RefDoc, incoming.Cost, incoming.StoreLocation,
		incoming.StoreCountry, incoming.Remarks, incoming.CreatedBy,
		incoming.CreatedAt, incoming.UpdatedBy, incoming.Unit)
	if err != nil {
		c.JSON(500, gin.H{"error to insert": err.Error()})
		return
	}

	c.JSON(200, incoming)
}

// UpdateInventoryIncoming updates a inventory incoming record.
func (api *inventoryAPI) UpdateInventoryIncoming(c *gin.Context) {
	var (
		incoming types.InventoryIncoming
	)

	// get id from url
	id := c.Params.ByName("id")

	incoming.UpdatedAt = time.Now()

	// incoming other field by post form
	incoming.ProductID, _ = strconv.Atoi(c.PostForm("productID"))
	fmt.Println(incoming.ProductID)
	incoming.Status = c.PostForm("status")
	incoming.Quantity, _ = strconv.ParseFloat(c.PostForm("quantity"), 64)
	incoming.Length, _ = strconv.ParseFloat(c.PostForm("length"), 64)
	incoming.Width, _ = strconv.ParseFloat(c.PostForm("width"), 64)
	incoming.Thickness, _ = strconv.ParseFloat(c.PostForm("thickness"), 64)
	incoming.Unit = c.PostForm("unit")
	incoming.ConvertedQuantity, _ = strconv.ParseFloat(c.PostForm("convertedQuantity"), 64)
	incoming.RefNo = c.PostForm("refNo")
	incoming.Cost, _ = strconv.ParseFloat(c.PostForm("cost"), 64)
	incoming.StoreLocation = c.PostForm("storeLocation")
	incoming.StoreCountry = c.PostForm("storeCountry")
	incoming.Remarks = c.PostForm("remarks")
	incoming.UpdatedBy = c.PostForm("updatedBy")

	// refDoc is file
	file, err := c.FormFile("refDoc")
	if err == nil {
		// Delete the file from refDoc
		os.Remove(incoming.RefDoc)

		// Get the file extension
		extension := filepath.Ext(file.Filename)

		// Generate random file name
		uuid := uuid.New()

		dst := filepath.Join(INVENTORY_INCOMING_REFDOC_PATH, uuid.String()+extension)

		// Save the file to local storage
		err = c.SaveUploadedFile(file, dst)
		if err != nil {
			c.JSON(400, gin.H{
				"error": fmt.Sprintf("Error saving the file: %s", err.Error()),
			})
			return
		}
		incoming.RefDoc = dst
	} else {
		incoming.RefDoc = c.PostForm("refDoc")
	}

	// update database
	_, err = api.db.Exec("UPDATE inventory_incoming SET product_id = $1, "+
		"status = $2, quantity = $3, length = $4, width = $5, thickness = $6, "+
		"converted_quantity = $7, ref_no = $8, ref_doc = $9, cost = $10, "+
		"store_location = $11, store_country = $12, remarks = $13, "+
		"updated_by = $14, updated_at = $15, unit = $16 WHERE id = $17",
		incoming.ProductID, incoming.Status, incoming.Quantity, incoming.Length,
		incoming.Width, incoming.Thickness, incoming.ConvertedQuantity,
		incoming.RefNo, incoming.RefDoc, incoming.Cost, incoming.StoreLocation,
		incoming.StoreCountry, incoming.Remarks, incoming.UpdatedBy,
		incoming.UpdatedAt, incoming.Unit, id)
	if err != nil {
		c.JSON(500, gin.H{"error to update": err.Error()})
		return
	}

	c.JSON(200, incoming)
}

// DeleteInventoryIncoming deletes a inventory incoming record.
func (api *inventoryAPI) DeleteInventoryIncoming(c *gin.Context) {
	id := c.Params.ByName("id")

	// Get the file path
	var refDoc string
	err := api.db.QueryRow("SELECT ref_doc FROM inventory_incoming WHERE id = $1", id).Scan(&refDoc)
	if err != nil {
		c.JSON(500, gin.H{"error to query": err.Error()})
		return
	}

	// Delete the file from refDoc
	os.Remove(refDoc)

	_, err = api.db.Exec("DELETE FROM inventory_incoming WHERE id = $1", id)
	if err != nil {
		c.JSON(500, gin.H{"error to delete": err.Error()})
		return
	}

	c.JSON(200, gin.H{"id #" + id: "deleted"})
}
