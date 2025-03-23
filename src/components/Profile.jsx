import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="container mt-4">
            <h2>👤 Mój profil</h2>
            <p><strong>Imię:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <button className="btn btn-primary me-2" onClick={() => navigate("/edit-profile")}>
    Edytuj dane
</button>
<button className="btn btn-outline-secondary" onClick={() => navigate("/change-password")}>
    Zmień hasło
</button>


        </div>
    );
};

export default Profile;
