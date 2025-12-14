import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sendKafkaEvents } from "../actions/trackUser";

type Product = {
  id: string;
  title: string;
  price: string;
  image: string;
  salesPrice: number
  quantity?: number;
  shopId: string;
};

type Store = {
  cart: Product[];
  wishlist: Product[];
  addToCart: (product: Product, user: any, location: any, deviceInfo: string) => void;
  removeFromCart: (id: string, user: any, location: any, deviceInfo: string) => void;
  addToWishList: (product: Product, user: any, location: any, deviceInfo: string) => void;
  removeFromWishList: (id: string, user: any, location: any, deviceInfo: string) => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      addToCart: (product, user, location, deviceInfo) => {
        const existing = get().cart.find((item) => item.id === product.id);
        set((state) => {
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                  : item
              ),
            };
          }

          return {
            cart: [...state.cart, { ...product, quantity: product?.quantity }],
          };
        });

        //send kafka event
        if (user?.id && location && deviceInfo) {
          sendKafkaEvents({
            userId: user.id,
            productId: product?.id,
            shopId: product?.shopId,
            action: "add_to_cart",
            country: location?.country || "Unknown",
            city: location?.city || "Unknown",
            device: deviceInfo || "UnKnown Device"
          })
        }
      },

      removeFromCart: (id, user, location, deviceInfo) => {
        const removedProduct = get().cart.find((item) => item.id === id)
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
        //send kafka event
        if (user?.id && location && deviceInfo && removedProduct) {
          sendKafkaEvents({
            userId: user.id,
            productId: removedProduct?.id,
            shopId: removedProduct?.shopId,
            action: "remove_from_cart",
            country: location?.country || "Unknown",
            city: location?.city || "Unknown",
            device: deviceInfo || "UnKnown Device"
          })
        }
      },

      addToWishList: (product, user, location, deviceInfo) => {
        set((state) => {
          if (state.wishlist.some((item) => item.id === product.id)) {
            return state;
          }
          return {
            wishlist: [...state.wishlist, product],
          };
        });
        //send kafka event
        if (user?.id && location && deviceInfo) {
          sendKafkaEvents({
            userId: user.id,
            productId: product?.id,
            shopId: product?.shopId,
            action: "add_to_wishlist",
            country: location?.country || "Unknown",
            city: location?.city || "Unknown",
            device: deviceInfo || "UnKnown Device"
          })
        }
      },

      removeFromWishList: (id, user, location, deviceInfo) => {
        const removedProduct = get().wishlist.find((item) => item.id === id)

        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== id),
        }));

        //send kafka event
        if (user?.id && location && deviceInfo && removedProduct) {
          sendKafkaEvents({
            userId: user.id,
            productId: removedProduct?.id,
            shopId: removedProduct?.shopId,
            action: "remove_from_wishlist",
            country: location?.country || "Unknown",
            city: location?.city || "Unknown",
            device: deviceInfo || "UnKnown Device"
          })
        }
      },
    }),
    { name: "store-storage" }
  )
);
