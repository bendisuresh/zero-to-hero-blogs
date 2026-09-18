import { useEffect, useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
        Boolean(localStorage.getItem("admin_token"))
    );

    useEffect(() => {
        const handleAuthChange = () => {
            setIsAdminLoggedIn(
                Boolean(
                    localStorage.getItem("admin_token")
                )
            );
        };

        window.addEventListener(
            "admin-auth-changed",
            handleAuthChange
        );

        return () => {
            window.removeEventListener(
                "admin-auth-changed",
                handleAuthChange
            );
        };
    }, []);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleAdminLogout = () => {
        localStorage.removeItem("admin_token");

        setIsAdminLoggedIn(false);

        setMenuOpen(false);

        window.dispatchEvent(
            new Event("admin-auth-changed")
        );

        navigate("/admin/login");
    };

    return (
        <nav className="navbar">

            {/* Website logo / name */}

            <div className="navbar-logo">
                <Link
                    to="/"
                    onClick={closeMenu}
                >
                    Zero to Hero Blogs
                </Link>
            </div>


            {/* Mobile menu button */}

            <button
                className="menu-button"
                onClick={() =>
                    setMenuOpen(!menuOpen)
                }
                aria-label="Toggle navigation menu"
            >
                ☰
            </button>


            {/* Main navigation links */}

            <div
                className={`navbar-links ${
                    menuOpen
                        ? "navbar-links-open"
                        : ""
                }`}
            >

                <Link
                    to="/"
                    onClick={closeMenu}
                >
                    Home
                </Link>

                <Link
                    to="/business"
                    onClick={closeMenu}
                >
                    Business
                </Link>

                <Link
                    to="/job"
                    onClick={closeMenu}
                >
                    Job
                </Link>

                <Link
                    to="/investment"
                    onClick={closeMenu}
                >
                    Investment
                </Link>

                <Link
                    to="/other"
                    onClick={closeMenu}
                >
                    Other
                </Link>


                {/* Admin link on mobile */}

                <div className="mobile-admin">

                    {isAdminLoggedIn ? (
                        <button
                            type="button"
                            onClick={
                                handleAdminLogout
                            }
                        >
                            Admin Logout
                        </button>
                    ) : (
                        <Link
                            to="/admin/login"
                            onClick={closeMenu}
                        >
                            Admin Login
                        </Link>
                    )}

                </div>

            </div>


            {/* Admin link on desktop */}

            <div className="navbar-admin">

                {isAdminLoggedIn ? (
                    <button
                        type="button"
                        onClick={
                            handleAdminLogout
                        }
                    >
                        Admin Logout
                    </button>
                ) : (
                    <Link to="/admin/login">
                        Admin Login
                    </Link>
                )}

            </div>

        </nav>
    );
}

export default Navbar;