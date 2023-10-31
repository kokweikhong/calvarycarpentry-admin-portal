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

type InventoryIncomingHandler interface {
	List(w http.ResponseWriter, r *http.Request)
	Get(w http.ResponseWriter, r *http.Request)
	Create(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
	Delete(w http.ResponseWriter, r *http.Request)
}

type inventoryIncomingHandler struct {
	jsonHandler utils.JSONHandler
}

func NewInventoryIncomingHandler() InventoryProductHandler {
	jsonHandler := utils.NewJSONHandler()
	return &inventoryIncomingHandler{
		jsonHandler: jsonHandler,
	}
}

func (h *inventoryIncomingHandler) List(w http.ResponseWriter, r *http.Request) {
	service := services.NewInventoryIncomingService()

	inventoryIncomings, err := service.List()
	if err != nil {
		slog.Error("Error listing inventory incomings", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully listed inventory products", "inventoryIncomings", inventoryIncomings)

	h.jsonHandler.WriteJSON(w, http.StatusOK, inventoryIncomings)
}

func (h *inventoryIncomingHandler) Get(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error converting id to int", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	service := services.NewInventoryIncomingService()

	inventoryIncoming, err := service.Get(id)
	if err != nil {
		slog.Error("Error getting inventory product", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully got inventory product", "inventoryIncoming", inventoryIncoming)

	h.jsonHandler.WriteJSON(w, http.StatusOK, inventoryIncoming)
}

func (h *inventoryIncomingHandler) Create(w http.ResponseWriter, r *http.Request) {
	inventoryIncoming := new(model.InventoryIncoming)

	err := h.jsonHandler.ReadJSON(w, r, inventoryIncoming)
	if err != nil {
		slog.Error("Error reading JSON", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	service := services.NewInventoryIncomingService()

	err = service.Create(inventoryIncoming)
	if err != nil {
		slog.Error("Error creating inventory product", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully created inventory product", "inventoryIncoming", inventoryIncoming)

	h.jsonHandler.WriteJSON(w, http.StatusOK, inventoryIncoming)
}

func (h *inventoryIncomingHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error converting id to int", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	inventoryIncoming := new(model.InventoryIncoming)

	err = h.jsonHandler.ReadJSON(w, r, inventoryIncoming)
	if err != nil {
		slog.Error("Error reading JSON", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	service := services.NewInventoryIncomingService()

	err = service.Update(id, inventoryIncoming)
	if err != nil {
		slog.Error("Error updating inventory product", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully updated inventory product", "inventoryIncoming", inventoryIncoming)

	h.jsonHandler.WriteJSON(w, http.StatusOK, inventoryIncoming)
}

func (h *inventoryIncomingHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error converting id to int", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	service := services.NewInventoryIncomingService()

	err = service.Delete(id)
	if err != nil {
		slog.Error("Error deleting inventory product", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully deleted inventory product", "id", id)

	h.jsonHandler.WriteJSON(w, http.StatusOK, nil)
}
