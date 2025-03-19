import { createContext, useContext, useState, useEffect } from "react";

// Tworzymy kontekst
const CartContext = createContext();

// Hook do łatwego użycia kontekstu
export const useCart = () => useContext(CartContext);

// Provider dla całej aplikacji
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Pobieranie koszyka z localStorage przy starcie
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
    }, []);

    // Aktualizacja localStorage po każdej zmianie koszyka
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // 🔹 Dodawanie produktu do koszyka
    const addToCart = (product) => {
        setCartItems((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    // 🔹 Usuwanie produktu z koszyka
    const removeFromCart = (id) => {
        setCartItems((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    // 🔹 Zmiana ilości produktu w koszyku
    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        setCartItems((prevCart) =>
            prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    // 🔹 Obliczanie całkowitej wartości koszyka
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, updateQuantity, getTotalPrice }}
        >
            {children}
        </CartContext.Provider>
    );
};
