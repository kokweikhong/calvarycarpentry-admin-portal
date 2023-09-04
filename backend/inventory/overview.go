package inventory

import (
	"github.com/gin-gonic/gin"
	"github.com/kokweikhong/calvarycarpentry-system-backend/types"
)

func (api *inventoryAPI) GetCostingOverview(c *gin.Context) {
	var (
		costingOverview []types.InventoryCostingOverview
		costing         types.InventoryCostingOverview
	)

	query := `
    SELECT
        TO_CHAR(date_trunc('month', combined.created_at), 'YYYY-MM') AS month_year,
        SUM(combined.incoming_cost) AS total_incoming_cost,
        SUM(combined.outgoing_cost) AS total_outgoing_cost,
        SUM(combined.incoming_id) AS total_incoming_count,
        SUM(combined.outgoing_id) AS total_outgoing_count
    FROM (
        SELECT
            created_at,    
            cost * converted_quantity AS incoming_cost,
            0 AS outgoing_cost,
            1 AS incoming_id,
            0 AS outgoing_id
    FROM
        inventory_incoming
    UNION ALL
    SELECT
        created_at,
        0 AS incoming_cost,
        cost * converted_quantity AS outgoing_cost,
        0 AS incoming_id,
        1 AS outgoing_id
    FROM
        inventory_outgoing
    ) AS combined
    GROUP BY
        month_year
    ORDER BY
        month_year;
`

	// query := "SELECT " +
	// 	"TO_CHAR(i.created_at, 'MM-YYYY') AS month_year, " +
	// 	"COALESCE(COUNT(DISTINCT i.id), 0) AS incoming_count, " +
	// 	"COALESCE(SUM(i.cost), 0) AS incoming_total_cost, " +
	// 	"COALESCE(COUNT(DISTINCT o.id), 0) AS outgoing_count, " +
	// 	"COALESCE(SUM(o.cost), 0) AS outgoing_total_cost " +
	// 	"FROM " +
	// 	"inventory_incoming i " +
	// 	"LEFT JOIN " +
	// 	"inventory_outgoing o " +
	// 	"ON " +
	// 	"TO_CHAR(i.created_at, 'MM-YYYY') = TO_CHAR(o.created_at, 'MM-YYYY') " +
	// 	"GROUP BY " +
	// 	"TO_CHAR(i.created_at, 'MM-YYYY') " +
	// 	"ORDER BY " +
	// 	"TO_CHAR(i.created_at, 'MM-YYYY');"

	stmt, err := api.db.Prepare(query)
	if err != nil {
		c.JSON(500, gin.H{"error to prepare statement": err.Error()})
		return
	}

	rows, err := stmt.Query()
	if err != nil {
		c.JSON(500, gin.H{"error to execute query": err.Error()})
		return
	}

	for rows.Next() {
		err := rows.Scan(
			&costing.MonthYear,
			&costing.IncomingTotalCost,
			&costing.OutgoingTotalCost,
			&costing.IncomingCount,
			&costing.OutgoingCount,
		)
		if err != nil {
			c.JSON(500, gin.H{"error to scan rows": err.Error()})
			return
		}
		costingOverview = append(costingOverview, costing)
	}

	c.JSON(200, costingOverview)
}
