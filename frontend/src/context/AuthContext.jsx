import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, removeToken, setToken as saveToken, getUserRole } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      // In production, validate token with backend
      setUser({ token, role: getUserRole() });
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    saveToken(token);
    setUser({ token, ...userData });
  };

  const logout = () => {
    removeToken();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
