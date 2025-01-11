"use client";
import { createContext, useState, useContext } from "react";

const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);

  function getTotalCartCount() {
    return cartProducts.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  function addProduct(productDetails) {
    if (!productDetails || typeof productDetails !== "object") {
      console.error("Nieprawidłowe dane produktu:", productDetails);
      return;
    }

    if (
      !productDetails.id ||
      !productDetails.title ||
      !productDetails.price ||
      !productDetails.image
    ) {
      console.error("Brakujące wymagane pola produktu:", productDetails);
      return;
    }

    console.log("Dodawany produkt (pełne dane):", productDetails);

    setCartProducts((prev) => {
      console.log("Poprzedni stan koszyka:", prev);

      const existingProduct = prev.find(
        (item) => item.id === productDetails.id
      );

      if (existingProduct) {
        console.log("Znaleziono istniejący produkt, aktualizuję ilość");
        const updated = prev.map((item) =>
          item.id === productDetails.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
        console.log("Zaktualizowany koszyk:", updated);
        return updated;
      } else {
        console.log("Dodaję nowy produkt");
        const newCart = [...prev, { ...productDetails, quantity: 1 }];
        console.log("Nowy stan koszyka:", newCart);
        return newCart;
      }
    });
  }

  function removeProduct(productId) {
    setCartProducts((prev) => prev.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }

    setCartProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addProduct,
        removeProduct,
        updateQuantity,
        getTotalCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
