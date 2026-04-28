import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { trackInteraction } from "@/lib/userTaste";

const CartContext = createContext(null);
const KEY = "sahel-cart";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, qty }];
    });
    trackInteraction(product.id, "cart");
    toast.success(`Added ${product.name} to cart`);
  };

  const remove = (id) => setItems((p) => p.filter((i) => i.id !== id));
  const setQty = (id, qty) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);

  const { subtotal, count } = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const count = items.reduce((s, i) => s + i.qty, 0);
    return { subtotal, count };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  return ctx ?? { items: [], add: () => {}, remove: () => {}, setQty: () => {}, clear: () => {}, subtotal: 0, count: 0 };
};
