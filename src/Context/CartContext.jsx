import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // 🔥 Pobieranie koszyka z LocalStorage przy pierwszym załadowaniu
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
                console.log("📥 Wczytano koszyk z localStorage:", JSON.parse(storedCart));
            } catch (error) {
                console.error("❌ Błąd parsowania koszyka z localStorage:", error);
            }
        }
    }, []);

    // 🔥 Aktualizacja LocalStorage po zmianach w koszyku (z dodatkową walidacją)
    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cartItems));
            console.log("📦 Zapisano koszyk do localStorage:", cartItems);
        } else {
            console.warn("⚠️ Koszyk jest pusty, nie zapisuje do localStorage");
        }
    }, [cartItems]);

    // ✅ Dodawanie produktu do koszyka
    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            let newCart;

            if (existingItem) {
                newCart = prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                newCart = [...prevItems, { ...product, quantity }];
            }

            console.log(`🛒 Dodano do koszyka: ${product.name} (ID: ${product.id}), ilość: ${quantity}`);
            console.log("🛍 Nowy stan koszyka:", newCart);
            return newCart;
        });
    };

    // ✅ Usuwanie produktu z koszyka
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            const newCart = prevItems.filter((item) => item.id !== productId);
            console.log(`❌ Usunięto produkt ID: ${productId} z koszyka`);
            return newCart;
        });
    };

    // ✅ Aktualizacja ilości produktu w koszyku
    const updateQuantity = (productId, newQuantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
        console.log(`🔄 Zmieniono ilość produktu ID: ${productId} na ${newQuantity}`);
    };

    // ✅ Obliczanie sumy zamówienia
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getTotalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
