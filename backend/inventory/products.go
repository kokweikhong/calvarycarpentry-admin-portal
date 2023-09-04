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

const INVENTORY_PRODUCTSTHUMBNAIL_PATH = "uploads/inventory/products/"

// GetInventory retrieves all inventory records
func (api *inventoryAPI) GetInventoryProducts(c *gin.Context) {
	var (
		inventoryProduct  types.InventoryProduct
		inventoryProducts []types.InventoryProduct
	)

	// Query the database for all inventory products and select one by one
	query := "SELECT id, product_code, product_name, brand, standard_unit, " +
		"product_thumbnail, supplier, remarks, is_exist, created_by, created_at, " +
		"updated_by, updated_at FROM inventory_products"

	rows, err := api.db.Query(query)
	if err != nil {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Error querying the database: %s", err.Error()),
		})
		return
	}

	defer rows.Close()
	for rows.Next() {
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
			&inventoryProduct.UpdatedAt)
		if err != nil {
			fmt.Println(err)
		}
		inventoryProducts = append(inventoryProducts, inventoryProduct)
	}
	c.JSON(200, inventoryProducts)
}

// GetInventoryProduct retrieves a single inventory product
func (api *inventoryAPI) GetInventoryProduct(c *gin.Context) {
	var (
		inventoryProduct types.InventoryProduct
	)
	id := c.Params.ByName("id")

	// Convert the id string to int
	idInt, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Invalid id: %s", err.Error()),
		})
		return
	}

	// Prepare query string
	stmt, err := api.db.Prepare("SELECT id, product_code, product_name, brand, standard_unit, " +
		"product_thumbnail, supplier, remarks, is_exist, created_by, created_at, " +
		"updated_by, updated_at FROM inventory_products WHERE id=$1")
	if err != nil {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Error preparing the statement: %s", err.Error()),
		})
		return
	}

	// Execute the query
	rows, err := stmt.Query(idInt)
	if err != nil {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Error executing the statement: %s", err.Error()),
		})
		return
	}

	defer rows.Close()
	for rows.Next() {
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
			&inventoryProduct.UpdatedAt)
		if err != nil {
			fmt.Println(err)
		}
	}
	c.JSON(200, inventoryProduct)
}

// CreateInventoryProduct creates a new inventory product
func (api *inventoryAPI) CreateInventoryProduct(c *gin.Context) {
	var inventoryProduct types.InventoryProduct
	// Bind the JSON body to the struct

	// Generate the current timestamp
	inventoryProduct.CreatedAt = time.Now()
	inventoryProduct.UpdatedAt = time.Now()

	// Get all the other fields from the form-data
	inventoryProduct.ProductCode = c.PostForm("productCode")
	inventoryProduct.ProductName = c.PostForm("productName")
	inventoryProduct.Brand = c.PostForm("brand")
	inventoryProduct.StandardUnit = c.PostForm("standardUnit")
	inventoryProduct.Supplier = c.PostForm("supplier")
	inventoryProduct.Remarks = c.PostForm("remarks")
	// IsExist is a boolean field
	isExist, err := strconv.ParseBool(c.PostForm("isExist"))
	if err != nil {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Error parsing the boolean value: %s", err.Error()),
		})
		return
	}
	inventoryProduct.IsExist = isExist

	inventoryProduct.CreatedBy = c.PostForm("createdBy")
	inventoryProduct.UpdatedBy = c.PostForm("updatedBy")

	// Save the file for product thumbnail to local storage first
	// Retrieve the file from the form-data
	file, err := c.FormFile("productThumbnail")
	if err != nil {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Error retrieving the file: %s", err.Error()),
		})
		return
	}

	// Get the file extension for the file
	fileExtension := filepath.Ext(file.Filename)

	// Generate uuid for the filename
	uuid := uuid.New()

	filename := uuid.String() + fileExtension

	// Generate filename basee on product code
	dst := filepath.Join(INVENTORY_PRODUCTSTHUMBNAIL_PATH, filename)

	// Save the file to local storage
	err = c.SaveUploadedFile(file, dst)
	if err != nil {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Error saving the file: %s", err.Error()),
		})
		return
	}

	// Set the product thumbnail field
	inventoryProduct.ProductThumbnail = dst

	// Prepare statement for inserting data
	stmt, err := api.db.Prepare("INSERT INTO inventory_products (product_code, " +
		"product_name, brand, standard_unit, product_thumbnail, supplier, " +
		"remarks, is_exist, created_by, created_at, updated_by, updated_at) " +
		"VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)")
	if err != nil {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Error preparing the statement: %s", err.Error()),
		})
		return
	}
	_, err = stmt.Exec(
		inventoryProduct.ProductCode,
		inventoryProduct.ProductName,
		inventoryProduct.Brand,
		inventoryProduct.StandardUnit,
		inventoryProduct.ProductThumbnail,
		inventoryProduct.Supplier,
		inventoryProduct.Remarks,
		inventoryProduct.IsExist,
		inventoryProduct.CreatedBy,
		inventoryProduct.CreatedAt,
		inventoryProduct.UpdatedBy,
		inventoryProduct.UpdatedAt)
	if err != nil {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Error executing the statement: %s", err.Error()),
		})
	}
	c.JSON(200, inventoryProduct)
}

// UpdateInventoryProduct updates a single inventory product
func (api *inventoryAPI) UpdateInventoryProduct(c *gin.Context) {
	var inventoryProduct types.InventoryProduct
	id := c.Params.ByName("id")
	query := fmt.Sprintf("SELECT id, product_code, product_name, brand, standard_unit, "+
		"product_thumbnail, supplier, remarks, is_exist, created_by, created_at, "+
		"updated_by, updated_at FROM inventory_products WHERE id=%s", id)
	rows, err := api.db.Query(query)
	if err != nil {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Error querying the database: %s", err.Error()),
		})
		return
	}
	defer rows.Close()
	for rows.Next() {
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
			&inventoryProduct.UpdatedAt)
		if err != nil {
			c.JSON(400, gin.H{
				"error": fmt.Sprintf("Error scanning the rows: %s", err.Error()),
			})
		}
	}

	// get all the fields from the post form
	inventoryProduct.ProductCode = c.PostForm("productCode")
	inventoryProduct.ProductName = c.PostForm("productName")
	inventoryProduct.Brand = c.PostForm("brand")
	inventoryProduct.StandardUnit = c.PostForm("standardUnit")
	inventoryProduct.Supplier = c.PostForm("supplier")
	inventoryProduct.Remarks = c.PostForm("remarks")
	inventoryProduct.IsExist, _ = strconv.ParseBool(c.PostForm("isExist"))
	inventoryProduct.UpdatedBy = c.PostForm("updatedBy")

	file, err := c.FormFile("productThumbnail")
	if err == nil {
		// Delete the file from local storage
		os.Remove(inventoryProduct.ProductThumbnail)

		// Get the file extension for the file
		fileExtension := filepath.Ext(file.Filename)

		uuid := uuid.New()

		// Generate filename basee on product code
		dst := filepath.Join(INVENTORY_PRODUCTSTHUMBNAIL_PATH, uuid.String()+fileExtension)

		// Save the file to local storage
		err = c.SaveUploadedFile(file, dst)
		if err != nil {
			c.JSON(400, gin.H{
				"error": fmt.Sprintf("Error saving the file: %s", err.Error()),
			})
			return
		}
		inventoryProduct.ProductThumbnail = dst
	} else {
		inventoryProduct.ProductThumbnail = c.PostForm("productThumbnail")
		fmt.Println(inventoryProduct.ProductThumbnail)
	}

	stmt, err := api.db.Prepare(
		"UPDATE inventory_products SET product_code=$1, product_name=$2, " +
			"brand=$3, standard_unit=$4, supplier=$5, product_thumbnail=$6, " +
			"remarks=$7, is_exist=$8, updated_by=$9 WHERE id=$10",
	)
	if err != nil {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Error preparing the statement: %s", err.Error()),
		})
	}
	_, err = stmt.Exec(
		inventoryProduct.ProductCode,
		inventoryProduct.ProductName,
		inventoryProduct.Brand,
		inventoryProduct.StandardUnit,
		inventoryProduct.Supplier,
		inventoryProduct.ProductThumbnail,
		inventoryProduct.Remarks,
		inventoryProduct.IsExist,
		inventoryProduct.UpdatedBy,
		inventoryProduct.ID)
	if err != nil {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Error executing the statement: %s", err.Error()),
		})
	}
	c.JSON(200, inventoryProduct)
}

// DeleteInventoryProduct deletes a single inventory product
func (api *inventoryAPI) DeleteInventoryProduct(c *gin.Context) {
	id := c.Params.ByName("id")

	// Delete the file from local storage
	var productThumbnail string
	err := api.db.QueryRow("SELECT product_thumbnail FROM inventory_products WHERE id = $1", id).Scan(&productThumbnail)
	if err != nil {
		c.JSON(500, gin.H{"error to query": err.Error()})
		return
	}

	os.Remove(productThumbnail)

	stmt, err := api.db.Prepare("DELETE FROM inventory_products WHERE id=$1")
	if err != nil {
		fmt.Println(err)
	}
	_, err = stmt.Exec(id)
	if err != nil {
		fmt.Println(err)
	}
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}

// GetInventoryProdcutsSummary retrieves the summary of all inventory products
func (api *inventoryAPI) GetInventoryProdcutsSummary(c *gin.Context) {
	var (
		inventoryProductSummary  types.InventoryProductSummary
		inventoryProductsSummary []types.InventoryProductSummary
	)

	stmt, err := api.db.Prepare("SELECT id, product_code, product_name, brand, " +
		"standard_unit, product_thumbnail, supplier, remarks, is_exist, created_by, " +
		"created_at, updated_by, updated_at, sum_incoming_converted_quantity, " +
		"sum_incoming_cost, sum_outgoing_converted_quantity, sum_outgoing_cost, " +
		"available_quantity FROM inventory_products_summary")
	if err != nil {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Error preparing the statement: %s", err.Error()),
		})
		return
	}
	rows, err := stmt.Query()
	if err != nil {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Error executing the statement: %s", err.Error()),
		})
		return
	}

	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&inventoryProductSummary.ID,
			&inventoryProductSummary.ProductCode,
			&inventoryProductSummary.ProductName,
			&inventoryProductSummary.Brand,
			&inventoryProductSummary.StandardUnit,
			&inventoryProductSummary.ProductThumbnail,
			&inventoryProductSummary.Supplier,
			&inventoryProductSummary.Remarks,
			&inventoryProductSummary.IsExist,
			&inventoryProductSummary.CreatedBy,
			&inventoryProductSummary.CreatedAt,
			&inventoryProductSummary.UpdatedBy,
			&inventoryProductSummary.UpdatedAt,
			&inventoryProductSummary.SumIncomingConvertedQuantity,
			&inventoryProductSummary.SumIncomingCost,
			&inventoryProductSummary.SumOutgoingConvertedQuantity,
			&inventoryProductSummary.SumOutgoingCost,
			&inventoryProductSummary.AvailableQuantity)
		if err != nil {
			fmt.Println(err)
		}
		inventoryProductsSummary = append(inventoryProductsSummary, inventoryProductSummary)
	}
	c.JSON(200, inventoryProductsSummary)
}
