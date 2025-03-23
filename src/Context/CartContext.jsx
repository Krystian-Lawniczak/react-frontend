import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false); // ✅

    // 🔁 Wczytanie koszyka z localStorage
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
            console.log("🛒 Wczytano koszyk z localStorage:", JSON.parse(storedCart));
        }
        setIsInitialized(true); // ✅ Ustawiamy flagę po załadowaniu
    }, []);

    // 💾 Zapisywanie koszyka do localStorage (bez względu na zawartość)
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("cart", JSON.stringify(cartItems));
            console.log("💾 Zaktualizowano koszyk w localStorage:", cartItems);
        }
    }, [cartItems, isInitialized]);

    const addToCart = (product, quantity) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
            )
        );
    };

    const getTotalPrice = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    const clearCart = () => {
        setCartItems([]);
        console.log("🧹 Koszyk został wyczyszczony");
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                getTotalPrice,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
