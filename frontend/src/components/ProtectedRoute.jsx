import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const [checking, setChecking] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const verifyAdmin = async () => {
            const token = localStorage.getItem("admin_token");

            if (!token) {
                setAuthorized(false);
                setChecking(false);
                return;
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/admin/dashboard`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    localStorage.removeItem("admin_token");
                    setAuthorized(false);
                    setChecking(false);
                    return;
                }

                setAuthorized(true);
            } catch {
                setAuthorized(false);
            } finally {
                setChecking(false);
            }
        };

        verifyAdmin();
    }, []);

    if (checking) {
        return (
            <main className="admin-route-loading">
                <p>Checking admin access...</p>
            </main>
        );
    }

    if (!authorized) {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;