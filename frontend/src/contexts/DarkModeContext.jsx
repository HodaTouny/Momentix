import React, { createContext, useContext, useState, useEffect } from 'react';
import theme from '../theme';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      localStorage.setItem('darkMode', JSON.stringify(!prev));
      return !prev;
    });
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  useEffect(() => {
    document.body.style.backgroundColor = currentTheme.background;
  }, [currentTheme]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, currentTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
