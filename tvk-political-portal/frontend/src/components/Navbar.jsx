import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  // 1. State to toggle menu
  const [isOpen, setIsOpen] = useState(false);

  // Helper to check active link
  const isActive = (path) => location.pathname === path ? "active" : "";

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-inner">
         {/* BRAND / LOGO */}
          <Link to="/" className="nav-brand" onClick={closeMenu}>
            {/* Updated nav-symbol with image */}
           <div className="nav-symbol">
              <img 
               src="/logo.jfif" /* ✅ Make sure this matches your filename in the public folder */
               alt="TVK Flag Logo" 
               className="nav-logo-img" 
             />
           </div>
           <div className="nav-text">
    <span className="nav-title-ta">தமிழக வெற்றிக் கழகம்</span>
    <span className="nav-subtitle-ta"> திருச்சி மேற்கு மாவட்டம் </span>
           </div>
          </Link>
        {/* 2. HAMBURGER BUTTON (Visible only on Mobile) */}
        <button 
          className="nav-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {/* Simple text icon, or you can use an SVG */}
          {isOpen ? "✕" : "☰"}
        </button>

        {/* 3. LINKS (Conditional Class for Mobile) */}
        <div className={`nav-links ${isOpen ? "show-mobile" : ""}`}>
          <Link to="/" className={`nav-link ${isActive("/")}`} onClick={closeMenu}>
            முகப்பு
          </Link>
          <Link to="/barriers" className={`nav-link ${isActive("/barriers")}`} onClick={closeMenu}>
            நிர்வாகிகள்
          </Link>
          <Link to="/news" className={`nav-link ${isActive("/news")}`} onClick={closeMenu}>
            செய்திகள்
          </Link>
          <Link to="/admin/login" className={`nav-link ${isActive("/admin/login")}`} onClick={closeMenu}>
            நிர்வாகம் Login
          </Link>
        </div>

      </div>
    </nav>
  );
}