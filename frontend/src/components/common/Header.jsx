import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './Header.css';
import logo from "../../assets/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signupPage');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Azissam Realty" />
          </Link>
        </div>

        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li><Link to="/buy">Buy</Link></li>
            <li><Link to="/rent">Rent</Link></li>
            <li><Link to="/sell">Sell</Link></li>
            <li><Link to="/price-estimator">Price Estimator</Link></li>
            <li><Link to="/find-agent">Find an Agent</Link></li>
          </ul>
        </nav>

        <div className="header-actions">
          <button className="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" 
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <span className="user-name" onClick={toggleDropdown}>
                {user.firstName} {user.lastName}
              </span>

              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-item"><Link to="/favorites">Annonces aimées</Link></div>
                  <div className="dropdown-item"><Link to="/saved-searches">Mes recherches sauvegardées</Link></div>
                  <div className="dropdown-item"><Link to="/estimations">Mes estimations</Link></div>
                  <div className="dropdown-item"><Link to="/my-ads">Mes Annonces</Link></div>
                  <div className="dropdown-item"><Link to="/inbox">Inbox</Link></div>
                  <div className="dropdown-item"><Link to="/settings">Paramètres</Link></div>
                  <div className="dropdown-item logout" onClick={handleLogout}>Déconnexion</div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="account-btn" onClick={handleLogin}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
              <button className="signup-btn" onClick={handleSignUp}>Sign up</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
