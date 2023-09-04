package inventory

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kokweikhong/calvarycarpentry-system-backend/types"
)

const INVENTORY_OUTGOING_REFDOC_PATH = "uploads/inventory/outgoing"

// GetInventoryOutgoingSummary returns all inventory outgoing summary records.
func (api *inventoryAPI) GetInventoryOutgoingSummary(c *gin.Context) {
	var (
		inventoryOutgoingSummary   types.InventoryOutgoingSummary
		inventoryOutgoingSummaries []types.InventoryOutgoingSummary
	)

	query := "SELECT o.id, o.incoming_id, o.status, o.quantity, o.converted_quantity, " +
		"o.cost, o.ref_no, o.ref_doc, o.remarks, o.created_by, o.created_at, o.updated_by, o.updated_at, " +
		"i.product_code, i.product_name, i.supplier, i.standard_unit, i.unit, " +
		"i.length, i.width, i.thickness " +
		"FROM inventory_outgoing o " +
		"LEFT JOIN inventory_incoming_summary i ON o.incoming_id = i.id ORDER BY o.id DESC"

	stmt, err := api.db.Prepare(query)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to prepare statement: %s", err.Error()): err.Error()})
		return
	}

	rows, err := stmt.Query()
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to query rows: %s", err.Error()): err.Error()})
		return
	}

	for rows.Next() {
		err := rows.Scan(
			&inventoryOutgoingSummary.ID,
			&inventoryOutgoingSummary.IncomingID,
			&inventoryOutgoingSummary.Status,
			&inventoryOutgoingSummary.Quantity,
			&inventoryOutgoingSummary.ConvertedQuantity,
			&inventoryOutgoingSummary.Cost,
			&inventoryOutgoingSummary.RefNo,
			&inventoryOutgoingSummary.RefDoc,
			&inventoryOutgoingSummary.Remarks,
			&inventoryOutgoingSummary.CreatedBy,
			&inventoryOutgoingSummary.CreatedAt,
			&inventoryOutgoingSummary.UpdatedBy,
			&inventoryOutgoingSummary.UpdatedAt,
			&inventoryOutgoingSummary.ProductCode,
			&inventoryOutgoingSummary.ProductName,
			&inventoryOutgoingSummary.Supplier,
			&inventoryOutgoingSummary.StandardUnit,
			&inventoryOutgoingSummary.Unit,
			&inventoryOutgoingSummary.Length,
			&inventoryOutgoingSummary.Width,
			&inventoryOutgoingSummary.Thickness)
		if err != nil {
			c.JSON(500, gin.H{fmt.Sprintf("error to scan rows: %s", err.Error()): err.Error()})
			return
		}
		inventoryOutgoingSummaries = append(inventoryOutgoingSummaries, inventoryOutgoingSummary)
	}

	c.JSON(http.StatusOK, inventoryOutgoingSummaries)
}

// GetInventoryOutgoing returns all inventory outgoing records.
func (api *inventoryAPI) GetInventoryOutgoing(c *gin.Context) {
	var (
		inventoryOutgoing  types.InventoryOutgoing
		inventoryOutgoings []types.InventoryOutgoing
	)

	query := "SELECT id, incoming_id, status, quantity, converted_quantity, " +
		"cost, ref_no, ref_doc, remarks, created_by, created_at, updated_by, updated_at " +
		"FROM inventory_outgoing ORDER BY id DESC"

	stmt, err := api.db.Prepare(query)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to query statement: %s", err.Error()): err.Error()})
		return
	}

	rows, err := stmt.Query()
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to query rows: %s", err.Error()): err.Error()})
		return
	}

	for rows.Next() {
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
			&inventoryOutgoing.UpdatedAt)
		if err != nil {
			c.JSON(500, gin.H{fmt.Sprintf("error to query rows: %s", err.Error()): err.Error()})
			return
		}
		inventoryOutgoings = append(inventoryOutgoings, inventoryOutgoing)
	}

	c.JSON(http.StatusOK, inventoryOutgoings)
}

// GetInventoryOutgoingByID returns a single inventory outgoing record.
func (api *inventoryAPI) GetInventoryOutgoingByID(c *gin.Context) {
	var (
		inventoryOutgoing types.InventoryOutgoing
	)

	query := "SELECT id, incoming_id, status, quantity, converted_quantity, " +
		"cost, ref_no, ref_doc, remarks, created_by, created_at, updated_by, updated_at " +
		"FROM inventory_outgoing WHERE id = $1"

	stmt, err := api.db.Prepare(query)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to query statement: %s", err.Error()): err.Error()})
		return
	}

	err = stmt.QueryRow(c.Param("id")).Scan(
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
		&inventoryOutgoing.UpdatedAt)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to query rows: %s", err.Error()): err.Error()})
		return
	}

	c.JSON(http.StatusOK, inventoryOutgoing)
}

// CreateInventoryOutgoing creates a single inventory outgoing record.
func (api *inventoryAPI) CreateInventoryOutgoing(c *gin.Context) {
	var (
		inventoryOutgoing types.InventoryOutgoing
	)

	// Get file from refDoc form field
	file, err := c.FormFile("refDoc")
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to get file from form field: %s", err.Error()): err.Error()})
		return
	}

	// Get file extension
	fileExt := filepath.Ext(file.Filename)

	// Generate new file name
	uuid := uuid.New()

	// filename include path
	filename := filepath.Join(INVENTORY_OUTGOING_REFDOC_PATH, fmt.Sprintf("%s%s", uuid, fileExt))

	// Upload the file to specific dst.
	err = c.SaveUploadedFile(file, filename)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to save uploaded file: %s", err.Error()): err.Error()})
		return
	}

	inventoryOutgoing.RefDoc = filename

	// Get form fields
	inventoryOutgoing.IncomingID, _ = strconv.Atoi(c.PostForm("incomingID"))
	inventoryOutgoing.Status = c.PostForm("status")
	inventoryOutgoing.Quantity, _ = strconv.ParseFloat(c.PostForm("quantity"), 64)
	inventoryOutgoing.ConvertedQuantity, _ = strconv.ParseFloat(c.PostForm("convertedQuantity"), 64)
	inventoryOutgoing.Cost, _ = strconv.ParseFloat(c.PostForm("cost"), 64)
	inventoryOutgoing.RefNo = c.PostForm("refNo")
	inventoryOutgoing.Remarks = c.PostForm("remarks")
	inventoryOutgoing.CreatedBy = c.PostForm("createdBy")
	inventoryOutgoing.UpdatedBy = c.PostForm("updatedBy")

	query := "INSERT INTO inventory_outgoing (incoming_id, status, quantity, converted_quantity, " +
		"cost, ref_no, ref_doc, remarks, created_by, created_at, updated_by, updated_at) " +
		"VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now(), $10, now())"

	stmt, err := api.db.Prepare(query)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to prepare statement: %s", err.Error()): err.Error()})
		return
	}

	_, err = stmt.Exec(
		inventoryOutgoing.IncomingID,
		inventoryOutgoing.Status,
		inventoryOutgoing.Quantity,
		inventoryOutgoing.ConvertedQuantity,
		inventoryOutgoing.Cost,
		inventoryOutgoing.RefNo,
		inventoryOutgoing.RefDoc,
		inventoryOutgoing.Remarks,
		inventoryOutgoing.CreatedBy,
		inventoryOutgoing.UpdatedBy)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to execute statement: %s", err.Error()): err.Error()})
		return
	}

	c.JSON(http.StatusOK, inventoryOutgoing)
}

// UpdateInventoryOutgoing updates a single inventory outgoing record.
func (api *inventoryAPI) UpdateInventoryOutgoing(c *gin.Context) {
	// Get id from url
	id := c.Param("id")

	var (
		inventoryOutgoing types.InventoryOutgoing
	)

	// Get previous refDoc
	row := api.db.QueryRow("SELECT ref_doc FROM inventory_outgoing WHERE id = $1", id)
	err := row.Scan(&inventoryOutgoing.RefDoc)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to query row: %s", err.Error()): err.Error()})
		return
	}

	// Get file from refDoc form field
	file, err := c.FormFile("refDoc")
	if err != nil {
		// use back the same refDoc
		inventoryOutgoing.RefDoc = c.PostForm("refDoc")
	} else {
		// Delete previous file
		os.Remove(inventoryOutgoing.RefDoc)

		// Get file extension
		fileExt := filepath.Ext(file.Filename)

		// Generate new file name
		uuid := uuid.New()

		// filename include path
		filename := filepath.Join(INVENTORY_OUTGOING_REFDOC_PATH, fmt.Sprintf("%s%s", uuid, fileExt))

		// Upload the file to specific dst.
		err = c.SaveUploadedFile(file, filename)
		if err != nil {
			c.JSON(500, gin.H{fmt.Sprintf("error to save uploaded file: %s", err.Error()): err.Error()})
			return
		}

		inventoryOutgoing.RefDoc = filename
	}

	// Get form fields
	inventoryOutgoing.IncomingID, _ = strconv.Atoi(c.PostForm("incomingID"))
	inventoryOutgoing.Status = c.PostForm("status")
	inventoryOutgoing.Quantity, _ = strconv.ParseFloat(c.PostForm("quantity"), 64)
	inventoryOutgoing.ConvertedQuantity, _ = strconv.ParseFloat(c.PostForm("convertedQuantity"), 64)
	inventoryOutgoing.Cost, _ = strconv.ParseFloat(c.PostForm("cost"), 64)
	inventoryOutgoing.RefNo = c.PostForm("refNo")
	inventoryOutgoing.Remarks = c.PostForm("remarks")
	inventoryOutgoing.UpdatedBy = c.PostForm("updatedBy")

	query := "UPDATE inventory_outgoing SET incoming_id = $1, status = $2, quantity = $3, " +
		"converted_quantity = $4, cost = $5, ref_no = $6, ref_doc = $7, remarks = $8, " +
		"updated_by = $9, updated_at = now() WHERE id = $10"

	stmt, err := api.db.Prepare(query)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to prepare statement: %s", err.Error()): err.Error()})
		return
	}

	_, err = stmt.Exec(
		inventoryOutgoing.IncomingID,
		inventoryOutgoing.Status,
		inventoryOutgoing.Quantity,
		inventoryOutgoing.ConvertedQuantity,
		inventoryOutgoing.Cost,
		inventoryOutgoing.RefNo,
		inventoryOutgoing.RefDoc,
		inventoryOutgoing.Remarks,
		inventoryOutgoing.UpdatedBy,
		id)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to execute statement: %s", err.Error()): err.Error()})
		return
	}

	c.JSON(http.StatusOK, inventoryOutgoing)
}

// DeleteInventoryOutgoing deletes a single inventory outgoing record.
func (api *inventoryAPI) DeleteInventoryOutgoing(c *gin.Context) {
	// Get id from url
	id := c.Param("id")

	// Delete file from server
	var (
		inventoryOutgoing types.InventoryOutgoing
	)

	query := "SELECT ref_doc FROM inventory_outgoing WHERE id = $1"

	stmt, err := api.db.Prepare(query)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to prepare statement: %s", err.Error()): err.Error()})
		return
	}

	err = stmt.QueryRow(id).Scan(&inventoryOutgoing.RefDoc)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to query row: %s", err.Error()): err.Error()})
		return
	}

	os.Remove(inventoryOutgoing.RefDoc)

	query = "DELETE FROM inventory_outgoing WHERE id = $1"

	stmt, err = api.db.Prepare(query)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to prepare statement: %s", err.Error()): err.Error()})
		return
	}

	_, err = stmt.Exec(id)
	if err != nil {
		c.JSON(500, gin.H{fmt.Sprintf("error to execute statement: %s", err.Error()): err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "inventory outgoing deleted"})
}
