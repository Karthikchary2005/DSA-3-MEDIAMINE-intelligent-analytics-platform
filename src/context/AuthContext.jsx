import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentSession, setCurrentSession, clearSession } from '../services/storageService.js';
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut, switchActiveRole } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentSession());

  useEffect(() => {
    const handleSessionChange = () => {
      setUser(getCurrentSession());
    };
    window.addEventListener('mediamine:session-updated', handleSessionChange);
    return () => window.removeEventListener('mediamine:session-updated', handleSessionChange);
  }, []);

  const login = (email, password) => {
    const res = authSignIn(email, password);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  const register = (name, email, password) => {
    const res = authSignUp(name, email, password);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    authSignOut();
    setUser(null);
  };

  const changeRole = (newRole) => {
    const updated = switchActiveRole(newRole);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user ? user.role : 'GUEST',
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout,
      changeRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
