import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import DarkModeToggle from '../common/DarkModeToggle';
import LanguageSwitcher from '../common/LanguageSwitcher';
import Button from '../common/Button';
import { useTranslation } from 'react-i18next';  
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { currentTheme } = useDarkMode();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  return (
    <nav 
      className="navbar-container" 
      style={{ backgroundColor: currentTheme.cardBackground }}
    >
      <div className="container d-flex justify-content-between align-items-center py-2">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="navbar-brand"
          style={{
            color: currentTheme.textPrimary,
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.8rem'
          }}
        >
          Momentix
        </Link>

        <button className="menu-toggle d-md-none" onClick={toggleMenu} style={{ color: currentTheme.textPrimary }}>
          ☰
        </button>

        <div className={`menu-items ${menuOpen ? 'show' : ''}`}style={{'--menuBackground': currentTheme.cardBackground,'--menuText': currentTheme.textPrimary}}>
          <DarkModeToggle />
          <LanguageSwitcher />
          {user ? (
            <div className="position-relative">
              <Button onClick={toggleDropdown}>
                {user.name} ▼
              </Button>
              {dropdownOpen && (
                <ul className="dropdown-menu show position-absolute" style={{ top: '100%', right: 0 }}>
                  {user.role === 'admin' && (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/admin/events/create" onClick={() => setDropdownOpen(false)}>
                          {t('Create Event')}
                        </Link>
                      </li>
                      <li>
                        <a 
                          href="/" 
                          className="dropdown-item" 
                          onClick={() => setDropdownOpen(false)}
                          style={{ textDecoration: 'none' }}
                        >
                          {t('View Events')}
                        </a>
                      </li>
                      <li>
                        <a 
                          href="/dashboard" 
                          className="dropdown-item" 
                          onClick={() => setDropdownOpen(false)}
                          style={{ textDecoration: 'none' }}
                        >
                          {t('Dashboard')}
                        </a>

                      </li>
                    </>
                  )}
                  <li>
                    <button onClick={() => { logout(); setDropdownOpen(false);} } className="dropdown-item">
                      {t('Logout')}
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="auth-links d-flex gap-2">
              <Link to="/signin">
                <Button variant="secondary">
                  {t('Login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button>
                  {t('Register')}
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
