import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainContent from "../MainContent";

function CategoryPage({ userId }) {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/products/category/${categoryName}`);
                const data = await res.json();
                console.log("✅ Produkty:", data);
                setProducts(data);
            } catch (error) {
                console.error("❌ Błąd pobierania produktów:", error);
            }
        };

        fetchProducts();
    }, [categoryName]);

    return (
        <div className="container mt-4">
            <h3>Kategoria: {categoryName}</h3>
            <MainContent products={products} isSearching={false} userId={userId} />
        </div>
    );
}

export default CategoryPage;
