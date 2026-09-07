import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }

            // Save JWT in browser storage.
            localStorage.setItem("admin_token", data.access_token);

            // Login successful → go to dashboard.
            navigate("/admin/dashboard");

        } catch {
    setError("Unable to connect to the server");
}
    };

    return (
        <div className="admin-login">
            <h1>Admin Login</h1>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Admin email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                <button type="submit">
                    Login
                </button>

                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default AdminLogin;