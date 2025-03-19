import React, { useEffect } from "react";
import { useCart } from "../Context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

    useEffect(() => {
        console.log("📥 Koszyk w Cart.jsx:", cartItems);
    }, [cartItems]);

    return (
        <div className="container mt-4">
            <h2>🛒 Twój Koszyk</h2>
            {cartItems.length === 0 ? (
                <p>Twój koszyk jest pusty. <Link to="/">Przeglądaj produkty</Link></p>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Produkt</th>
                                <th>Cena</th>
                                <th>Ilość</th>
                                <th>Usuń</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.price.toFixed(2)} zł</td>
                                    <td>
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn btn-sm btn-outline-secondary">
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <span className="mx-2">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn btn-sm btn-outline-secondary">
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => removeFromCart(item.id)} className="btn btn-sm btn-danger">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h4>💰 Łączna kwota: {getTotalPrice().toFixed(2)} zł</h4>
                </>
            )}
        </div>
    );
};

export default Cart;
