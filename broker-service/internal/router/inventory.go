package router

import (
	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/calvarycarpentry-admin-portal/broker-service/internal/handlers"
)

type InventoryRouter interface {
	SetupRoutes(router chi.Router)
}

type inventoryRouter struct {
}

func NewInventoryRouter() InventoryRouter {
	return &inventoryRouter{}
}

func (ir *inventoryRouter) SetupRoutes(router chi.Router) {
	// router := chi.NewRouter()

	router.Route("/inventory", func(r chi.Router) {
		ir.SetupProductsRoutes(r)
		ir.SetupIncomingsRoutes(r)
		ir.SetupOutgoingsRoutes(r)
	})

	// return router
}

func (r *inventoryRouter) SetupProductsRoutes(router chi.Router) {
	h := handlers.NewInventoryProductHandler()
	router.Route("/products", func(router chi.Router) {
		router.Get("/", h.List)
		router.Get("/{id}", h.Get)
		router.Post("/", h.Create)
		router.Put("/{id}", h.Update)
		router.Delete("/{id}", h.Delete)
	})
}

func (r *inventoryRouter) SetupIncomingsRoutes(router chi.Router) {
	h := handlers.NewInventoryIncomingHandler()
	router.Route("/incomings", func(router chi.Router) {
		router.Get("/", h.List)
		router.Get("/{id}", h.Get)
		router.Post("/", h.Create)
		router.Put("/{id}", h.Update)
		router.Delete("/{id}", h.Delete)
	})

}

func (r *inventoryRouter) SetupOutgoingsRoutes(router chi.Router) {
	h := handlers.NewInventoryOutgoingHandler()
	router.Route("/outgoings", func(router chi.Router) {
		router.Get("/", h.List)
		router.Get("/{id}", h.Get)
		router.Post("/", h.Create)
		router.Put("/{id}", h.Update)
		router.Delete("/{id}", h.Delete)
	})
}
