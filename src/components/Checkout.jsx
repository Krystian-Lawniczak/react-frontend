import React, { useState, useEffect } from "react";
import { useCart } from "../Context/CartContext";


const Checkout = () => {
    const { clearCart } = useCart();
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        email: "",
        deliveryMethod: "standard",
        paymentMethod: "card",
    });

    const [userId, setUserId] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUserId(storedUser.id);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:8080/api/orders/cart/finalize/${userId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            
    
            if (response.ok) {
                clearCart();
                setOrderPlaced(true);
            } else {
                console.error("Błąd podczas finalizacji zamówienia");
            }
        } catch (error) {
            console.error("Błąd sieci:", error);
        }
    };
    if (orderPlaced) {
        return (
            <div className="container mt-4">
                <h2>✅ Zamówienie złożone</h2>
                <p>Dziękujemy za zakup! Wkrótce otrzymasz potwierdzenie na e-mail.</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>📦 Złóż zamówienie</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Imię i nazwisko</label>
                    <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Adres dostawy</label>
                    <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Metoda dostawy</label>
                    <select className="form-select" name="deliveryMethod" value={formData.deliveryMethod} onChange={handleChange}>
                        <option value="standard">Standardowa (15 zł)</option>
                        <option value="express">Ekspresowa (30 zł)</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label>Metoda płatności</label>
                    <select className="form-select" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                        <option value="card">Karta płatnicza</option>
                        <option value="cash">Płatność przy odbiorze</option>
                        <option value="blik">BLIK</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Zamawiam</button>
            </form>
        </div>
    );
};

export default Checkout;
