import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./MainContent";
import Login from "./components/Login";  
import Register from "./components/Register";
import Favorites from "./components/Favorites";

function App() {
    const [products, setProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Pobieranie użytkownika z localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setCurrentUserId(storedUser.id);
        }
    }, []);

    // Pobieranie produktów z API
    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error("Błąd pobierania produktów:", error));
    }, []);

    // Obsługa wyszukiwania produktów
    const handleGlobalSearch = (query) => {
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
    };

    return (
        <Router>
            <AppNavbar onSearch={handleGlobalSearch} />
            
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar (tylko na stronach innych niż logowanie) */}
                    <div className="col-md-2">
                        <Sidebar />
                    </div>

                    {/* Główna zawartość */}
                    <div className="col-md-10">
                        <Routes>
                            <Route path="/" element={<MainContent products={products} searchResults={searchResults} isSearching={isSearching} userId={currentUserId} />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            
                            {/* Sprawdzamy, czy użytkownik jest zalogowany przed dodaniem trasy do ulubionych */}
                            {currentUserId && <Route path="/favorites" element={<Favorites userId={currentUserId} />} />}
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
