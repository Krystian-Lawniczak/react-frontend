import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const ProductCard = ({ product, userId }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetch(`/api/favorites/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`, // Dodajemy token do nagłówków!
                "Content-Type": "application/json"
            }
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Nie udało się pobrać ulubionych!");
            }
            return res.json();
        })
        .then((data) => {
            setIsFavorite(data.some((fav) => fav.product.id === product.id));
        })
        .catch((error) => console.error("Błąd pobierania ulubionych:", error));
        
    }, [userId, product.id]);

    const toggleFavorite = async () => {
        const token = localStorage.getItem("token"); // Pobierz token JWT
    
        if (!token) {
            console.error("Brak tokena JWT – użytkownik nie jest zalogowany.");
            return;
        }
    
        const url = isFavorite
            ? "http://localhost:8080/api/favorites/remove"
            : "http://localhost:8080/api/favorites/add";
    
        const method = isFavorite ? "DELETE" : "POST";
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Authorization": `Bearer ${token}`, // 🔥 Dodaj token JWT
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, productId: product.id }),
            });
    
            if (!response.ok) {
                throw new Error(`Błąd: ${response.status}`);
            }
    
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Błąd podczas dodawania/usuwania ulubionych:", error);
        }
    };
    
    

    return (
        <div className="product-card">
            <h3>{product.name}</h3>
            <button onClick={toggleFavorite}>
                <FontAwesomeIcon icon={faHeart} className={isFavorite ? "text-danger" : "text-muted"} />
            </button>
        </div>
    );
};

export default ProductCard;
