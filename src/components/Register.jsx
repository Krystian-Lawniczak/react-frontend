import React, { useState } from "react";
import axios from "axios";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState(""); // ✅ Dodano email
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
    
        console.log("Wysyłam żądanie do API...");
    
        try {
            const response = await fetch("http://localhost:8080/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password: password.trim(),
                }),
            });
    
            const data = await response.json();
            console.log("Odpowiedź serwera:", data);
    
            if (response.ok) {
                setSuccess(data.message);
                setError(null);
            } else {
                setError(data.message || "Błąd rejestracji.");
            }
        } catch (error) {
            console.error("Błąd połączenia:", error);
            setError("Błąd połączenia z serwerem.");
        }
    };
    
    

    return (
        <div className="container mt-5">
            <h2>Rejestracja</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Nazwa użytkownika</label>
                    <input 
                        type="text" 
                        className="form-control"
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Email</label> {/* ✅ Dodano pole email */}
                    <input 
                        type="email" 
                        className="form-control"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Hasło</label>
                    <input 
                        type="password" 
                        className="form-control"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Zarejestruj się</button>
            </form>
        </div>
    );
};

export default Register;
