const API_BASE_URL = "http://localhost:8080/api"; // Adres backendu

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/users/login?username=${username}&password=${password}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    return await response.json();
};

