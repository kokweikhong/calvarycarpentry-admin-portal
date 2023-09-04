package types

// InventoryCostingOverview is a struct to map database table inventory overview.
type InventoryCostingOverview struct {
	MonthYear         string  `json:"monthYear" db:"month_year"`
	IncomingCount     int     `json:"incomingCount" db:"incoming_count"`
	IncomingTotalCost float64 `json:"incomingTotalCost" db:"incoming_total_cost"`
	OutgoingCount     int     `json:"outgoingCount" db:"outgoing_count"`
	OutgoingTotalCost float64 `json:"outgoingTotalCost" db:"outgoing_total_cost"`
}
