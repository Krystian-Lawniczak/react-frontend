import React, { useState, useEffect } from "react";

function Favorites({ userId, onRemoveFavorite }) {
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("🚀 Próbuję pobrać ulubione produkty...");

        const fetchFavorites = async () => {
            const token = localStorage.getItem("token");
            console.log("📌 Token JWT:", token);

            if (!token) {
                console.error("❌ Brak tokena JWT w localStorage!");
                setError("Brak uprawnień. Zaloguj się ponownie.");
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

                console.log("📡 Wysłane zapytanie do:", response.url);
                console.log("📡 Otrzymana odpowiedź:", response.status);

                if (!response.ok) {
                    throw new Error(`Błąd pobierania: ${response.status}`);
                }

                const data = await response.json();
                console.log("✅ Otrzymane ulubione produkty:", data);

                setFavorites(data);
            } catch (error) {
                console.error("❌ Błąd pobierania ulubionych:", error);
                setError("Nie udało się załadować ulubionych przedmiotów.");
            }
        };

        fetchFavorites();
    }, [userId]);

    const removeFavorite = async (productId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("❌ Brak tokena JWT w localStorage!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/favorites/remove", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId, productId })
            });

            if (!response.ok) {
                throw new Error(`Błąd usuwania: ${response.status}`);
            }

            setFavorites((prevFavorites) =>
                prevFavorites.filter((fav) => fav.id !== productId)
            );

            // Powiadomienie MainContent.jsx, aby zaktualizować serduszka
            onRemoveFavorite(productId);
        } catch (error) {
            console.error("❌ Błąd usuwania ulubionego produktu:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Ulubione produkty</h2>
            {error && <p className="text-danger">{error}</p>}
            {favorites.length === 0 ? (
                <p>Brak ulubionych produktów</p>
            ) : (
                <div className="row d-flex flex-wrap justify-content-start">
                    {favorites.map((fav) => (
                        <div key={fav.id} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{fav.name}</h5> {/* ✅ Bez fav.product */}
                                    <p className="card-text">${fav.price}</p>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => removeFavorite(fav.id)}
                                    >
                                        Usuń
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorites;
