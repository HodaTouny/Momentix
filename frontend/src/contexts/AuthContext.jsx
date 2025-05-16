import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const loggedUser = await authService.getCurrentUser();
        loggedUser.role = loggedUser.role.toLowerCase();
        setUser(loggedUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (credentials) => {
  await authService.login(credentials);
  const loggedUser = await authService.getCurrentUser();
  loggedUser.role = loggedUser.role.toLowerCase();
    setUser(loggedUser);
    console.log(loggedUser.role);
    if(loggedUser.role === 'admin')
    {
      navigate('/dashboard');
    }else{
      navigate('/');
    }
  };
  const register = async (userData) => {
    await authService.register(userData);
    navigate('/signin');
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

