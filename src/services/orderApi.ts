import api from "./api";

export type ShippingAddress = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
};

export type CreateOrderPayload = {
  shippingAddress: ShippingAddress;
  paymentMethod: "cod" | "card" | "online";
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const response = await api.post("/orders", payload);

  return response.data;
};