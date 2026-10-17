import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getMe, logout as apiLogout } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('raju_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('raju_admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const profile = await getMe();
          setUser(profile);
          localStorage.setItem('raju_admin_user', JSON.stringify(profile));
        } catch (err) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('raju_admin_token');
          localStorage.removeItem('raju_admin_user');
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token]);

  const loginUser = async (usernameOrEmail, password) => {
    const res = await apiLogin(usernameOrEmail, password);
    setUser(res.user);
    setToken(res.access_token);
    return res;
  };

  const logoutUser = async () => {
    await apiLogout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login: loginUser,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
