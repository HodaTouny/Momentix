import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { ClipLoader } from 'react-spinners'; 

const LoadingSpinner = ({ size = 80 }) => {
  const { currentTheme } = useDarkMode();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '150px',
      width: '100%',
    }}>
      <ClipLoader 
        color={currentTheme.secondary} 
        size={size} 
        cssOverride={{
          borderWidth: `5px`,
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
