import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";

interface CartItem {
  productId: number;
  quantity: number;
  size: string;
  color: string;
  product: Product;
}

interface Cart {
  items: CartItem[];
}

interface CartContextType {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, size: string, color: string) => void;
  updateQuantity: (productId: number, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { toast } = useToast();
  // Use a simpler approach without dependencies that might cause circular references
  const [t] = useState<(key: string) => string>((key: string) => {
    // Simple fallback translation function
    return key;
  });
  
  // Initialize cart from localStorage
  const [cart, setCart] = useState<Cart>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  });
  
  // Calculate total price
  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  
  // Add item to cart
  const addToCart = (newItem: CartItem) => {
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
      title: t("cart.notifications.added"),
      description: `${newItem.product.name} (${newItem.size}, ${newItem.color})`,
    });
  };
  
  // Remove item from cart
  const removeFromCart = (productId: number, size: string, color: string) => {
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
      title: t("cart.notifications.removed"),
    });
  };
  
  // Update item quantity
  const updateQuantity = (productId: number, size: string, color: string, quantity: number) => {
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
      title: t("cart.notifications.cleared"),
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
