import api from "./api";

export const addToCartApi = async (
  productId: string,
  quantity: number = 1
) => {
  const response = await api.post("/cart", {
    productId,
    quantity,
  });

  return response.data;
};

export const getCartApi = async () => {
  const response = await api.get("/cart");

  return response.data;
};

export const updateCartItemApi = async (
  productId: string,
  quantity: number
) => {
  const response = await api.patch("/cart", {
    productId,
    quantity,
  });

  return response.data;
};

export const removeFromCartApi = async (productId: string) => {
  const response = await api.delete("/cart", {
    data: {
      productId,
    },
  });

  return response.data;
};

export const clearCartApi = async () => {
  const response = await api.delete("/cart/clear");

  return response.data;
};