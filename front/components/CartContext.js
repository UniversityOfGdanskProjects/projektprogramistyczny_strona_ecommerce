"use client";
import { createContext, useReducer, useContext } from "react";

const CartContext = createContext({});

const initialState = {
  cartProducts: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_PRODUCT": {
      const existingProduct = state.cartProducts.find(
        (item) => item.id === action.payload.id
      );

      if (existingProduct) {
        return {
          ...state,
          cartProducts: state.cartProducts.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        cartProducts: [
          ...state.cartProducts,
          { ...action.payload, quantity: 1 },
        ],
      };
    }

    case "REMOVE_PRODUCT":
      return {
        ...state,
        cartProducts: state.cartProducts.filter(
          (item) => item.id !== action.payload
        ),
      };

    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cartProducts: state.cartProducts.filter(
            (item) => item.id !== action.payload.productId
          ),
        };
      }
      return {
        ...state,
        cartProducts: state.cartProducts.map((item) =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        cartProducts: [],
      };

    default:
      return state;
  }
}

export function CartContextProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  function getTotalCartCount() {
    return state.cartProducts.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
  }

  function addProduct(productDetails) {
    if (
      !productDetails?.id ||
      !productDetails?.title ||
      !productDetails?.price
    ) {
      console.error("Brakujące wymagane pola produktu:", productDetails);
      return;
    }

    dispatch({ type: "ADD_PRODUCT", payload: productDetails });
  }

  function removeProduct(productId) {
    dispatch({ type: "REMOVE_PRODUCT", payload: productId });
  }

  function updateQuantity(productId, newQuantity) {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, quantity: newQuantity },
    });
  }

  function clearCart() {
    dispatch({ type: "CLEAR_CART" });
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts: state.cartProducts,
        addProduct,
        removeProduct,
        updateQuantity,
        getTotalCartCount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
