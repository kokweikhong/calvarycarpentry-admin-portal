import { InventoryOutgoingValues } from "@/types/inventory-outgoing";
import { InventoryIncomingValues } from "@/types/inventory-incoming";
import { InventoryProductValues } from "@/types/inventory-products";
import { UserValues } from "@/types/user";

export const UserEmptyData: UserValues = {
  id: 0,
  username: "",
  email: "",
  password: "",
  role: "",
  department: "",
  profileImage: "",
  isExist: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const InventoryIncomingEmptyData: InventoryIncomingValues = {
  id: 0,
  productID: 0,
  status: "",
  quantity: 0,
  length: 0,
  width: 0,
  thickness: 0,
  unit: "",
  convertedQuantity: 0,
  refNo: "",
  refDoc: "",
  cost: 0,
  storeLocation: "",
  storeCountry: "",
  remarks: "",
  createdBy: "",
  createdAt: "",
  updatedBy: "",
  updatedAt: "",
};

export const InventoryOutgoingEmptyData: InventoryOutgoingValues = {
  id: 0,
  incomingID: 0,
  quantity: 0,
  convertedQuantity: 0,
  status: "",
  cost: 0,
  refNo: "",
  refDoc: "",
  remarks: "",
  createdBy: "",
  createdAt: new Date(),
  updatedBy: "",
  updatedAt: new Date(),
};

export const InventoryProductEmptyData: InventoryProductValues = {
  id: 0,
  productCode: "",
  productName: "",
  brand: "",
  standardUnit: "",
  supplier: "",
  productThumbnail: "",
  remarks: "",
  isExist: true,
  createdBy: "",
  createdAt: "",
  updatedBy: "",
  updatedAt: "",
};
