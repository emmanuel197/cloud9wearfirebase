import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const { toast } = useToast();
  
  // Define direct hardcoded translations to avoid circular dependencies
  const translations = {
    added: "Item added to cart",
    removed: "Item removed from cart",
    cleared: "Cart has been cleared"
  };
  
  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  });
  
  // Calculate total price, accounting for discounts
  const total = cart.items.reduce(
    (sum, item) => {
      const itemPrice = item.product.discount 
        ? item.product.price * (1 - Math.round(item.product.discount) / 100) 
        : item.product.price;
      return sum + itemPrice * item.quantity;
    },
    0
  );
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  
  // Add item to cart
  const addToCart = (newItem) => {
    setCart((prevCart) => {
      // Check if item already exists in cart (same product, size, and color)
      const existingItemIndex = prevCart.items.findIndex(
        (item) => 
          item.productId === newItem.productId && 
          item.size === newItem.size && 
          item.color === newItem.color
      );
      
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        
        return {
          ...prevCart,
          items: updatedItems,
        };
      } else {
        // Add new item if it doesn't exist
        return {
          ...prevCart,
          items: [...prevCart.items, newItem],
        };
      }
    });
    
    toast({
      title: translations.added,
      description: `${newItem.product.name} (${newItem.size}, ${newItem.color})`,
    });
  };
  
  // Remove item from cart
  const removeFromCart = (productId, size, color) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter(
        (item) => 
          !(item.productId === productId && 
            item.size === size && 
            item.color === color)
      ),
    }));
    
    toast({
      title: translations.removed,
    });
  };
  
  // Update item quantity
  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity < 1) return;
    
    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) => {
        if (
          item.productId === productId &&
          item.size === size &&
          item.color === color
        ) {
          return { ...item, quantity };
        }
        return item;
      });
      
      return {
        ...prevCart,
        items: updatedItems,
      };
    });
  };
  
  // Clear the cart
  const clearCart = () => {
    setCart({ items: [] });
    
    toast({
      title: translations.cleared,
    });
  };
  
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
}