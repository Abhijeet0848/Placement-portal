import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Recruiter' | 'PlacementOfficer' | 'Admin';
  profile: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  updateUser: (profileData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const data = await api.get('/auth/profile');
      setUser(data.user);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      fetchProfile();
    } else {
      setLoading(false);
    }

    const handleLogoutEvent = () => {
      logout();
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('tokens', JSON.stringify(data.tokens));
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    const data = await api.post('/auth/register', { name, email, password, role });
    localStorage.setItem('tokens', JSON.stringify(data.tokens));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('tokens');
    setUser(null);
  };

  const updateUser = async (profileData: any) => {
    const data = await api.put('/auth/profile', profileData);
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
