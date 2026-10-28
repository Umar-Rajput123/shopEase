import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../services/cartApi";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  const { token } = useAuth();

  // Load the logged-in user's cart
  useEffect(() => {
    const loadCart = async () => {
      // If user is not logged in, clear cart state
      if (!token) {
        setCart(null);
        return;
      }

      try {
        const data = await getCart(token);
        setCart(data.cart);
      } catch (error) {
        console.error("Load cart error:", error);
      }
    };

    loadCart();
  }, [token]);

  // Add a product to the cart
  const addItem = async (productId, quantity = 1) => {
    if (!token) {
      throw new Error("Please login to add products to cart");
    }

    const data = await addToCart(
      productId,
      quantity,
      token
    );

    setCart(data.cart);

    return data;
  };

  // Update product quantity in the cart
  const updateItem = async (productId, quantity) => {
    if (!token) {
      throw new Error("Please login to update cart");
    }

    const data = await updateCartItem(
      productId,
      quantity,
      token
    );

    setCart(data.cart);

    return data;
  };

  // Remove a product from the cart
  const removeItem = async (productId) => {
    if (!token) {
      throw new Error(
        "Please login to remove products from cart"
      );
    }

    const data = await removeCartItem(
      productId,
      token
    );

    setCart(data.cart);

    return data;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        token,
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};