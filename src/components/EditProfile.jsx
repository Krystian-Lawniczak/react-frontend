import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";

const EditProfile = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const [formData, setFormData] = useState({
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        role: storedUser.role || "ROLE_USER",
        enabled: storedUser.enabled ?? true,
        password: storedUser.password, // 🔥 wymagane przez backend
    });

    const [errors, setErrors] = useState({});
    const [showToast, setShowToast] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.name || formData.name.length < 3) newErrors.name = "Imię musi mieć co najmniej 3 znaki";
        if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Niepoprawny email";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8080/api/users/${formData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setShowToast(true);
                setTimeout(() => navigate("/profile"), 1500);
            }
        } catch (err) {
            console.error("❌ Błąd aktualizacji:", err);
        }
    };

    return (
        <div className="container mt-4">
            <h2>✏️ Edytuj dane</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Imię</label>
                    <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} name="name" value={formData.name} onChange={handleChange} required />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} name="email" value={formData.email} onChange={handleChange} required />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <button type="submit" className="btn btn-success">Zapisz zmiany</button>
            </form>

            <ToastContainer position="bottom-end" className="p-3">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={1500} autohide bg="success">
                    <Toast.Body className="text-white">✅ Dane zaktualizowane</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default EditProfile;
