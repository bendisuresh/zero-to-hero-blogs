import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import apiFetch from "../services/api";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children }) {
    const [checking, setChecking] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    const {
        isAuthenticated,
        logout,
    } = useAuth();

    useEffect(() => {
        const verifyAdmin = async () => {
            if (!isAuthenticated) {
                setAuthorized(false);
                setChecking(false);
                return;
            }

            try {
                await apiFetch(
                    "/api/admin/dashboard"
                );

                setAuthorized(true);
            } catch (error) {
                if (
                    error.status === 401 ||
                    error.status === 422 ||
                    error.status === 403
                ) {
                    logout();
                }

                setAuthorized(false);
            } finally {
                setChecking(false);
            }
        };

        verifyAdmin();
    }, [
        isAuthenticated,
        logout,
    ]);

    if (checking) {
        return (
            <main className="admin-route-loading">
                <p>
                    Checking admin access...
                </p>
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