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

type InventoryOutgoingHandler interface {
	List(w http.ResponseWriter, r *http.Request)
	Get(w http.ResponseWriter, r *http.Request)
	Create(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
	Delete(w http.ResponseWriter, r *http.Request)
}

type inventoryOutgoingHandler struct {
	jsonHandler utils.JSONHandler
}

func NewInventoryOutgoingHandler() InventoryOutgoingHandler {
	jsonHandler := utils.NewJSONHandler()
	return &inventoryOutgoingHandler{
		jsonHandler: jsonHandler,
	}
}

func (h *inventoryOutgoingHandler) List(w http.ResponseWriter, r *http.Request) {
	service := services.NewInventoryOutgoingService()

	inventoryOutgoings, err := service.List()
	if err != nil {
		slog.Error("Error listing inventory outgoings", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully listed inventory outgoings", "inventoryOutgoings", inventoryOutgoings)

	h.jsonHandler.WriteJSON(w, http.StatusOK, inventoryOutgoings)
}

func (h *inventoryOutgoingHandler) Get(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error converting id to int", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	service := services.NewInventoryOutgoingService()

	inventoryOutgoing, err := service.Get(id)
	if err != nil {
		slog.Error("Error getting inventory outgoing", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully got inventory outgoing", "inventoryOutgoing", inventoryOutgoing)

	h.jsonHandler.WriteJSON(w, http.StatusOK, inventoryOutgoing)
}

func (h *inventoryOutgoingHandler) Create(w http.ResponseWriter, r *http.Request) {
	inventoryOutgoing := new(model.InventoryOutgoing)

	err := h.jsonHandler.ReadJSON(w, r, inventoryOutgoing)
	if err != nil {
		slog.Error("Error reading JSON", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	service := services.NewInventoryOutgoingService()

	err = service.Create(inventoryOutgoing)
	if err != nil {
		slog.Error("Error creating inventory outgoing", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully created inventory outgoing", "inventoryOutgoing", inventoryOutgoing)

	h.jsonHandler.WriteJSON(w, http.StatusOK, inventoryOutgoing)
}

func (h *inventoryOutgoingHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error converting id to int", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	inventoryOutgoing := new(model.InventoryOutgoing)

	err = h.jsonHandler.ReadJSON(w, r, inventoryOutgoing)
	if err != nil {
		slog.Error("Error reading JSON", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	service := services.NewInventoryOutgoingService()

	err = service.Update(id, inventoryOutgoing)
	if err != nil {
		slog.Error("Error updating inventory outgoing", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully updated inventory outgoing", "inventoryOutgoing", inventoryOutgoing)

	h.jsonHandler.WriteJSON(w, http.StatusOK, inventoryOutgoing)
}

func (h *inventoryOutgoingHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error converting id to int", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	service := services.NewInventoryOutgoingService()

	err = service.Delete(id)
	if err != nil {
		slog.Error("Error deleting inventory outgoing", "error", err)
		h.jsonHandler.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	slog.Info("Successfully deleted inventory outgoing", "id", id)

	h.jsonHandler.WriteJSON(w, http.StatusOK, nil)
}
