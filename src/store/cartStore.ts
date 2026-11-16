import { create } from "zustand";
import {
  addToCartApi,
  getCartApi,
  updateCartItemApi,
  removeFromCartApi,
  clearCartApi,
} from "../services/cartApi";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartState = {
  items: CartItem[];
  loading: boolean;

  addToCart: (product: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  increaseQuantity: (id: string) => Promise<void>;
  decreaseQuantity: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
};

const formatCartItems = (cart: any): CartItem[] => {
  if (!cart?.items) return [];

  return cart.items
    .filter((item: any) => item.product)
    .map((item: any) => ({
      id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images?.[0],
    }));
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    const token = localStorage.getItem("nexora_token");

    if (!token) {
      set({ items: [] });
      return;
    }

    try {
      set({ loading: true });

      const response = await getCartApi();
      const cart = response.data;

      set({
        items: formatCartItems(cart),
      });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      set({ items: [] });
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (product) => {
    const token = localStorage.getItem("nexora_token");

    if (!token) {
      throw new Error("Please sign in before adding products to your cart.");
    }

    try {
      set({ loading: true });

      await addToCartApi(product.id, 1);

      // MongoDB থেকে updated cart আবার load করবে
      await get().fetchCart();
    } finally {
      set({ loading: false });
    }
  },

  removeFromCart: async (id) => {
    try {
      set({ loading: true });

      await removeFromCartApi(id);
      await get().fetchCart();
    } finally {
      set({ loading: false });
    }
  },

  increaseQuantity: async (id) => {
    const item = get().items.find((cartItem) => cartItem.id === id);

    if (!item) return;

    try {
      set({ loading: true });

      await updateCartItemApi(id, item.quantity + 1);
      await get().fetchCart();
    } finally {
      set({ loading: false });
    }
  },

  decreaseQuantity: async (id) => {
    const item = get().items.find((cartItem) => cartItem.id === id);

    if (!item) return;

    try {
      set({ loading: true });

      // Quantity 1 হলে product remove হবে
      if (item.quantity <= 1) {
        await removeFromCartApi(id);
      } else {
        await updateCartItemApi(id, item.quantity - 1);
      }

      await get().fetchCart();
    } finally {
      set({ loading: false });
    }
  },

  clearCart: async () => {
    try {
      set({ loading: true });

      await clearCartApi();

      set({
        items: [],
      });
    } finally {
      set({ loading: false });
    }
  },
}));