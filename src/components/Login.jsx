import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");  // Używamy email zamiast username
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 
    const navigate = useNavigate();  

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
    
        console.log("📤 Wysyłanie danych logowania:", { email, password });
    
        try {
            const response = await fetch("http://localhost:8080/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }) // ✅ Wysyłamy `email`, a nie `username`
            });
    
            const data = await response.json();
            console.log("📥 Odpowiedź serwera:", data);
    
            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
    
                navigate("/");
                window.location.reload();
            } else {
                setError(data.message || "Błąd logowania. Spróbuj ponownie.");
            }
        } catch (error) {
            console.error("Błąd połączenia:", error);
            setError("Błąd połączenia z serwerem.");
        }
    };
    
    

    return (
        <div className="container mt-5">
            <h2>Logowanie</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email</label> {/* Teraz logujemy się za pomocą emaila */}
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
                <button type="submit" className="btn btn-primary">Zaloguj</button>
            </form>
        </div>
    );
};

export default Login;
