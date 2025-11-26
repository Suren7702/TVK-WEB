import { Link, useLocation } from "react-router-dom";
import ServerStatusBadge from "./ServerStatusBadge.jsx"; // 👈 import

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="nav-brand">
          <div className="nav-symbol">TVK</div>
          <div className="nav-text">
            <span className="nav-title-ta">தமிழ் மக்கள் முன்னணி</span>
            <span className="nav-subtitle-ta">மாவட்ட அரசியல் தளம்</span>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/" className={isActive("/")}>
            முகப்பு
          </Link>
          <Link to="/news" className={isActive("/news")}>
            செய்திகள்
          </Link>
          <Link to="/barriers" className={isActive("/barriers")}>
            பொறுப்பாளர் தேடல்
          </Link>
          <Link to="/admin/login" className={isActive("/admin/login")}>
            நிர்வாகம்
          </Link>
        </nav>

        {/* 👇 server status on right */}
        <ServerStatusBadge />
      </div>
    </header>
  );
}
