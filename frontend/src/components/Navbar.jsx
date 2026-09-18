import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleAdminLogout = () => {
        logout();
        setMenuOpen(false);
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

                    {isAuthenticated ? (
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

                {isAuthenticated ? (
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

        </nav>
    );
}

export default Navbar;
