import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { FaSun, FaMoon } from 'react-icons/fa'; 

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
      style={{ width: '40px', height: '40px' }}
      title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
    >
      {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
    </button>
  );
};

export default DarkModeToggle;
