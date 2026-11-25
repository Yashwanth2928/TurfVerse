
import { Link } from "react-router-dom";
import { Menu, UserRound } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon">⚽</span>
        <span>Turf<span className="logo-green">Verse</span></span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#turfs">Explore Turfs</a>
        <a href="#refreshments">Refreshments</a>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="login-link">
          <UserRound size={17} />
          Login
        </Link>
        <Link to="/register" className="register-btn">
          Sign Up
        </Link>
      </div>

      <button className="mobile-menu" aria-label="Open menu">
        <Menu size={25} />
      </button>
    </nav>
  );
}

export default Navbar;
