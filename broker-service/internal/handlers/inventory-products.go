package handlers

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/calvarycarpentry-admin-portal/broker-service/internal/model"
	"github.com/kokweikhong/calvarycarpentry-admin-portal/broker-service/internal/services"
	"github.com/kokweikhong/calvarycarpentry-admin-portal/broker-service/internal/utils"
)

type InventoryProductHandler interface {
	List(w http.ResponseWriter, r *http.Request)
	Get(w http.ResponseWriter, r *http.Request)
	Create(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
	Delete(w http.ResponseWriter, r *http.Request)
}

type inventoryProductHandler struct {
	jsonHandler utils.JSONHandler
}

func NewInventoryProductHandler() InventoryProductHandler {
	jsonHandler := utils.NewJSONHandler()
	return &inventoryProductHandler{
		jsonHandler: jsonHandler,
	}
}

func (h *inventoryProductHandler) List(w http.ResponseWriter, r *http.Request) {
	service := services.NewInventoryProductService()

	inventoryProducts, err := service.List()
	if err != nil {
		slog.Error("Error listing inventory products", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully listed inventory products", "inventoryProducts", inventoryProducts)

	h.jsonHandler.WriteJSON(w, http.StatusOK, inventoryProducts)
}

func (h *inventoryProductHandler) Get(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error converting id to int", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	service := services.NewInventoryProductService()

	inventoryProduct, err := service.Get(id)
	if err != nil {
		slog.Error("Error getting inventory product", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully retrieved inventory product", "inventoryProduct", inventoryProduct)

	h.jsonHandler.WriteJSON(w, http.StatusOK, inventoryProduct)
}

func (h *inventoryProductHandler) Create(w http.ResponseWriter, r *http.Request) {
	inventoryProduct := new(model.InventoryProduct)

	err := h.jsonHandler.ReadJSON(w, r, inventoryProduct)
	if err != nil {
		slog.Error("Error reading request body", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	service := services.NewInventoryProductService()

	err = service.Create(inventoryProduct)
	if err != nil {
		slog.Error("Error creating inventory product", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully created inventory product", "inventoryProduct", inventoryProduct)

	h.jsonHandler.WriteJSON(w, http.StatusOK, inventoryProduct)
}

func (h *inventoryProductHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error converting id to int", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	inventoryProduct := new(model.InventoryProduct)

	err = h.jsonHandler.ReadJSON(w, r, inventoryProduct)
	if err != nil {
		slog.Error("Error reading request body", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	service := services.NewInventoryProductService()

	err = service.Update(id, inventoryProduct)
	if err != nil {
		slog.Error("Error updating inventory product", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully updated inventory product", "inventoryProduct", inventoryProduct)

	h.jsonHandler.WriteJSON(w, http.StatusOK, inventoryProduct)
}

func (h *inventoryProductHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error converting id to int", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	service := services.NewInventoryProductService()

	err = service.Delete(id)
	if err != nil {
		slog.Error("Error deleting inventory product", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully deleted inventory product", "id", id)

	h.jsonHandler.WriteJSON(w, http.StatusOK, id)
}
