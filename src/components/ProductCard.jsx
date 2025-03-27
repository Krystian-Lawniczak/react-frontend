import React, { useState, useEffect } from "react";
import { useCart } from "./Context/CartContext"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { Card, Button } from "react-bootstrap";

const ProductCard = ({ product, userId }) => {
    console.log("🔹 `ProductCard` się renderuje!");
    console.log("📦 Produkt otrzymany przez `ProductCard`:", product);

    const [isFavorite, setIsFavorite] = useState(false);
    const { addToCart } = useCart(); 

    useEffect(() => {
        if (!userId) return;
        fetch(`http://localhost:8080/api/favorites/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        })
        .then((res) => res.ok ? res.json() : Promise.reject("Błąd pobierania ulubionych!"))
        .then((data) => {
            setIsFavorite(data.some((fav) => fav.product.id === product.id));
        })
        .catch((error) => console.error(error));
    }, [userId, product.id]);

    const toggleFavorite = async () => {
        const token = localStorage.getItem("token");
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
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, productId: product.id }),
            });

            if (!response.ok) throw new Error(`Błąd: ${response.status}`);
            
          
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Błąd przy obsłudze ulubionych:", error);
        }
    };

    const handleAddToCart = async () => {
        console.log("🛒 Dodawanie do koszyka:", product);
        
        try {
            const response = await fetch(`http://localhost:8080/api/orders/cart/add`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, productId: product.id, quantity: 1 }),
            });

            if (!response.ok) throw new Error(`Błąd: ${response.status}`);

            const updatedCart = await response.json();
            console.log("✅ Koszyk po dodaniu:", updatedCart);
        } catch (error) {
            console.error("Błąd dodawania do koszyka:", error);
        }
    };

    return (
        <Card className="m-3 p-2 shadow-sm">
            <Card.Img variant="top" src={product.image || "https://via.placeholder.com/150"} />
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>Cena: {product.price.toFixed(2)} zł</Card.Text>

                <Button variant="primary" onClick={handleAddToCart} className="me-2">
                    <FontAwesomeIcon icon={faCartPlus} className="me-2" /> Dodaj do koszyka
                </Button>

                <Button variant="outline-danger" onClick={toggleFavorite}>
                    <FontAwesomeIcon icon={faHeart} className={isFavorite ? "text-danger" : "text-muted"} />
                </Button>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
