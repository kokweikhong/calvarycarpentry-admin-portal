package router

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type BaseRoute interface {
	SetupRoutes() chi.Router
	Run(addr string)
}

type Router struct {
	router chi.Router
}

func NewRouter() BaseRoute {
	return &Router{
		router: chi.NewRouter(),
	}
}

func (ro *Router) SetupRoutes() chi.Router {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	inventoryRouter := NewInventoryRouter()
	r.Group(func(r chi.Router) {
		r.Route("/", func(r chi.Router) {
			inventoryRouter.SetupRoutes(r)
		})
	})

	ro.router = r

	return r
}

func Init() BaseRoute {
	r := NewRouter()

	r.SetupRoutes()

	return r
}

func (ro *Router) Run(addr string) {
	log.Fatal(http.ListenAndServe(addr, ro.router))
}
