import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    // Controls whether the mobile menu is open
    const [menuOpen, setMenuOpen] = useState(false);

    // Close the mobile menu after clicking a link
    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            {/* Website logo / name */}
            <div className="navbar-logo">
                <Link to="/" onClick={closeMenu}>
                    Zero to Hero Blogs
                </Link>
            </div>

            {/* Mobile menu button */}
            <button
                className="menu-button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu"
            >
                ☰
            </button>

            {/* Main navigation links */}
            <div
                className={`navbar-links ${
                    menuOpen ? "navbar-links-open" : ""
                }`}
            >
                <Link to="/" onClick={closeMenu}>
                    Home
                </Link>

                <Link to="/business" onClick={closeMenu}>
                    Business
                </Link>

                <Link to="/job" onClick={closeMenu}>
                    Job
                </Link>

                <Link to="/investment" onClick={closeMenu}>
                    Investment
                </Link>

                <Link to="/other" onClick={closeMenu}>
                    Other
                </Link>

                {/* Admin link on mobile */}
                <div className="mobile-admin">
                    <Link to="/admin/login" onClick={closeMenu}>
                        Admin Login
                    </Link>
                </div>
            </div>

            {/* Admin login link on desktop */}
            <div className="navbar-admin">
                <Link to="/admin/login">
                    Admin Login
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;