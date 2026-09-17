import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

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
                setError(
                    data.message ||
                    "Invalid email or password"
                );

                return;
            }

            localStorage.setItem(
                "admin_token",
                data.access_token
            );

            navigate("/admin/dashboard");

        } catch {
            setError(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login-page">

            <div className="admin-login-layout">

                {/* =================================================
                    BRAND / INTRO
                    ================================================= */}

                <section className="admin-login-intro">

                    <div className="admin-brand-mark">
                        ZH
                    </div>

                    <span className="admin-login-eyebrow">
                        ZERO TO HERO BLOGS
                    </span>

                    <h1>
                        Welcome back.
                    </h1>

                    <p>
                        Manage stories, comments and content
                        from your admin workspace.
                    </p>

                    <div className="admin-login-points">

                        <div>
                            <span>01</span>
                            <p>
                                Create and manage stories
                            </p>
                        </div>

                        <div>
                            <span>02</span>
                            <p>
                                Moderate community comments
                            </p>
                        </div>

                        <div>
                            <span>03</span>
                            <p>
                                Keep your content organized
                            </p>
                        </div>

                    </div>

                </section>


                {/* =================================================
                    LOGIN CARD
                    ================================================= */}

                <section className="login-card">

                    <div className="login-card-heading">

                        <span>
                            ADMIN ACCESS
                        </span>

                        <h2>
                            Sign in
                        </h2>

                        <p>
                            Enter your administrator credentials
                            to continue.
                        </p>

                    </div>


                    <form
                        className="login-form"
                        onSubmit={handleLogin}
                    >

                        {/* Email */}

                        <div className="login-field">

                            <label htmlFor="admin-email">
                                Email address
                            </label>

                            <input
                                id="admin-email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                autoComplete="email"
                                required
                            />

                        </div>


                        {/* Password */}

                        <div className="login-field">

                            <label htmlFor="admin-password">
                                Password
                            </label>

                            <input
                                id="admin-password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                autoComplete="current-password"
                                required
                            />

                        </div>


                        {/* Error */}

                        {error && (
                            <div
                                className="login-error"
                                role="alert"
                            >
                                <span>
                                    !
                                </span>

                                <p>
                                    {error}
                                </p>
                            </div>
                        )}


                        {/* Submit */}

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="login-spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </form>


                    <div className="login-security-note">

                        <span>
                            🔒
                        </span>

                        <p>
                            Admin access is protected by
                            authentication and authorization.
                        </p>

                    </div>

                </section>

            </div>

        </main>
    );
}

export default AdminLogin;