package inventory

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

type inventoryAPI struct {
	db *sql.DB
}

func SetupRouter(router *gin.Engine, db *sql.DB) {
	api := &inventoryAPI{db: db}

	inventoryAPI := router.Group("/inventory")
	{
		inventoryAPI.GET("/products", api.GetInventoryProducts)
		inventoryAPI.GET("/products/summary", api.GetInventoryProdcutsSummary)
		inventoryAPI.POST("/products/create", api.CreateInventoryProduct)
		// Get a single inventory record
		inventoryAPI.GET("/products/:id", api.GetInventoryProduct)
		// Update a single inventory record
		inventoryAPI.POST("/products/update/:id", api.UpdateInventoryProduct)
		// Delete a single inventory record
		inventoryAPI.POST("/products/delete/:id", api.DeleteInventoryProduct)

		// Inventory incoming routes
		inventoryAPI.GET("/incoming/summary", api.GetInventoryIncomingSummary)
		// Get all inventory incoming records
		inventoryAPI.GET("/incoming", api.GetInventoryIncoming)
		// Get a single inventory incoming record
		inventoryAPI.GET("/incoming/:id", api.GetInventoryIncomingByID)
		// Create a single inventory incoming record
		inventoryAPI.POST("/incoming/create", api.CreateInventoryIncoming)
		// Update a single inventory incoming record
		inventoryAPI.POST("/incoming/update/:id", api.UpdateInventoryIncoming)
		// Delete a single inventory incoming record
		inventoryAPI.POST("/incoming/delete/:id", api.DeleteInventoryIncoming)

		// Inventory outgoing routes
		inventoryAPI.GET("/outgoing", api.GetInventoryOutgoing)
		// Inventory outgoing summary
		inventoryAPI.GET("/outgoing/summary", api.GetInventoryOutgoingSummary)
		// Get a single inventory outgoing record
		inventoryAPI.GET("/outgoing/:id", api.GetInventoryOutgoingByID)
		// Create a single inventory outgoing record
		inventoryAPI.POST("/outgoing/create", api.CreateInventoryOutgoing)
		// Update a single inventory outgoing record
		inventoryAPI.POST("/outgoing/update/:id", api.UpdateInventoryOutgoing)
		// Delete a single inventory outgoing record
		inventoryAPI.POST("/outgoing/delete/:id", api.DeleteInventoryOutgoing)

		inventoryAPI.GET("/overview/costing", api.GetCostingOverview)

	}
}
