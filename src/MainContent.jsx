import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

function MainContent({ products, searchResults, isSearching, userId }) {
    const [favorites, setFavorites] = useState([]);

    // 🟢 Pobierz ulubione produkty użytkownika przy załadowaniu strony
    useEffect(() => {
        if (!userId) return;

        const fetchFavorites = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Brak tokena JWT!");
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/favorites/${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) throw new Error(`Błąd pobierania: ${response.status}`);

                const data = await response.json();
                setFavorites(data.map(fav => fav.id)); // 🟢 Pobieramy ID ulubionych produktów
            } catch (error) {
                console.error("Błąd pobierania ulubionych:", error);
            }
        };

        fetchFavorites();
    }, [userId]);

    // 🟢 Obsługa dodawania/usuwania ulubionych
    const toggleFavorite = async (productId) => {
        if (!userId) {
            alert("Musisz być zalogowany, aby dodać do ulubionych!");
            return;
        }

        const isFavorite = favorites.includes(productId);
        const url = isFavorite
            ? "http://localhost:8080/api/favorites/remove"
            : "http://localhost:8080/api/favorites/add";
        const method = isFavorite ? "DELETE" : "POST";

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Brak tokena JWT!");
                return;
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId, productId }),
            });

            if (!response.ok) throw new Error(`Błąd operacji: ${response.status}`);

            setFavorites((prev) =>
                isFavorite ? prev.filter((id) => id !== productId) : [...prev, productId]
            );
        } catch (error) {
            console.error("Błąd dodawania/usuwania ulubionych:", error);
        }
    };

    return (
        <div className="container mt-4">
            {isSearching ? (
                <>
                    <h3>Wyniki wyszukiwania</h3>
                    <div className="row d-flex flex-wrap justify-content-start">
                        {searchResults.map((product) => (
                            <div key={product.id} className="col-md-4 mb-3">
                                <div className="card position-relative">
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className={`position-absolute top-0 end-0 m-2 ${favorites.includes(product.id) ? "text-danger" : "text-muted"}`}
                                        style={{ cursor: "pointer", fontSize: "1.5rem" }}
                                        onClick={() => toggleFavorite(product.id)}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">${product.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="row d-flex flex-wrap justify-content-start">
                        {products.map((product) => (
                            <div key={product.id} className="col-md-4 mb-3">
                                <div className="card position-relative">
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className={`position-absolute top-0 end-0 m-2 ${favorites.includes(product.id) ? "text-danger" : "text-muted"}`}
                                        style={{ cursor: "pointer", fontSize: "1.5rem" }}
                                        onClick={() => toggleFavorite(product.id)}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">${product.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default MainContent;
