import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const Button = ({
  children,
  onClick,
  variant = 'primary', 
  type = 'button',
  className = '',
  disabled = false,
}) => {
  const { currentTheme } = useDarkMode();

  const isOutline = variant.startsWith('outline-');
  const baseColor = currentTheme.primary;

  const baseStyles = {
    padding: '8px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: isOutline ? `2px solid ${baseColor}` : (variant === 'secondary' ? `1px solid ${baseColor}` : 'none'),
    backgroundColor: isOutline || variant === 'secondary' ? 'transparent' : baseColor,
    color: isOutline ? baseColor : (variant === 'secondary' ? baseColor : currentTheme.buttonText),
  };

  const hoverStyles = {
    backgroundColor: isOutline ? baseColor : currentTheme.primaryHover,
    color: currentTheme.buttonText,
    border: `2px solid ${baseColor}`,
  };

  return (
    <button
      type={type}
      className={`btn ${className}`}
      onClick={onClick}
      style={baseStyles}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.target.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.target.style, baseStyles);
        }
      }}
    >
      {children}
    </button>
  );
};

export default Button;
