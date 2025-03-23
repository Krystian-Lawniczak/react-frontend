import React, { lazy, Suspense, useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";
const CartProvider = lazy(() => import("./Context/CartContext").then(module => ({ default: module.CartProvider })));

const Sidebar = lazy(() => import("./components/Sidebar"));
const MainContent = lazy(() => import("./MainContent"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Favorites = lazy(() => import("./components/Favorites"));
const Cart = lazy(() => import("./components/Cart"));
const Checkout = lazy(() => import("./components/Checkout"));
const Orders = lazy(() => import("./components/Orders"));
const Profile = lazy(() => import("./components/Profile")); // 🧑 Dodajemy profil
const EditProfile = lazy(() => import("./components/EditProfile")); // 🛠️ Formularz edycji profilu
const ChangePassword = lazy(() => import("./components/ChangePassword"));

function App() {
    const [products, setProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setCurrentUserId(storedUser.id);
        }
    }, []);

    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error("Błąd pobierania produktów:", error));
    }, []);

    const handleGlobalSearch = useCallback((query) => {
        if (query.trim().length > 0) {
            fetch(`http://localhost:8080/api/products/search?name=${query}`)
                .then(response => response.json())
                .then(data => {
                    setSearchResults(data);
                    setIsSearching(true);
                })
                .catch(error => console.error("Błąd pobierania wyników wyszukiwania:", error));
        } else {
            setIsSearching(false);
        }
    }, []);

    return (
        <CartProvider>
            <Router>
                <AppNavbar onSearch={handleGlobalSearch} />

                <div className="container-fluid">
                    <div className="row">
                        {window.location.pathname !== "/login" && window.location.pathname !== "/register" && (
                            <div className="col-md-2">
                                <Suspense fallback={<div>Ładowanie sidebaru...</div>}>
                                    <Sidebar />
                                </Suspense>
                            </div>
                        )}

                        <div className={window.location.pathname === "/login" || window.location.pathname === "/register" ? "col-md-12" : "col-md-10"}>
                            <Suspense fallback={<div>Ładowanie strony...</div>}>
                                <Routes>
                                    <Route path="/" element={<MainContent products={products} searchResults={searchResults} isSearching={isSearching} userId={currentUserId} />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/cart" element={<Cart userId={currentUserId} />} />
                                    <Route path="/checkout" element={<Checkout />} />
                                    
                                    {currentUserId && (
                                        <>
                                            <Route path="/favorites" element={<Favorites userId={currentUserId} />} />
                                            <Route path="/orders" element={<Orders />} />
                                            <Route path="/profile" element={<Profile />} />
                                            <Route path="/edit-profile" element={<EditProfile />} />
                                            <Route path="/change-password" element={<ChangePassword />} />
                                        </>
                                    )}
                                </Routes>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
