import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setError("Hasło musi mieć co najmniej 6 znaków");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8080/api/users/change-password", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: user.id,
                    newPassword,
                }),
            });

            if (response.ok) {
                setShowToast(true);
                setTimeout(() => navigate("/profile"), 1500);
            } else {
                setError("Wystąpił błąd przy zmianie hasła");
            }
        } catch (err) {
            setError("Błąd połączenia z serwerem");
        }
    };

    return (
        <div className="container mt-4">
            <h2>🔒 Zmień hasło</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Nowe hasło</label>
                    <input
                        type="password"
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Wprowadź nowe hasło"
                    />
                    {error && <div className="invalid-feedback">{error}</div>}
                </div>
                <button type="submit" className="btn btn-warning">Zmień hasło</button>
            </form>

            <ToastContainer position="bottom-end" className="p-3">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={1500} autohide bg="success">
                    <Toast.Body className="text-white">🔐 Hasło zostało zmienione</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default ChangePassword;
