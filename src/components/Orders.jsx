import React, { useEffect, useState } from "react";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUserId(storedUser.id);
            fetchOrders(storedUser.id);
        } else {
            setLoading(false);
            setError("Użytkownik nie jest zalogowany.");
        }
    }, []);

    const fetchOrders = async (userId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:8080/api/orders/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                const text = await response.text();
                console.error("Błąd serwera:", text);
                setError("Nie udało się pobrać zamówień.");
                return;
            }

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                setOrders(data);
            } else {
                console.error("Niepoprawny typ odpowiedzi:", contentType);
                setError("Serwer zwrócił nieprawidłowy format danych.");
            }
        } catch (err) {
            console.error("Błąd sieci:", err);
            setError("Wystąpił błąd podczas łączenia z serwerem.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container mt-4">⏳ Ładowanie zamówień...</div>;
    }

    if (error) {
        return <div className="container mt-4 text-danger">❌ {error}</div>;
    }

    if (!orders.length) {
        return <div className="container mt-4"><h4>📭 Brak zamówień</h4></div>;
    }

    return (
        <div className="container mt-4">
            <h2>📜 Historia zamówień</h2>
            {orders.map(order => (
                <div key={order.id} className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">🧾 Zamówienie #{order.id}</h5>
                        <p><strong>Data:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Łącznie:</strong> {order.totalPrice.toFixed(2)} zł</p>

                        <h6>🛒 Produkty:</h6>
                        <ul className="list-group list-group-flush">
                            {order.items.map((item, index) => (
                                <li key={index} className="list-group-item">
                                    {item.product.name} — {item.quantity} x {item.price.toFixed(2)} zł
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Orders;
