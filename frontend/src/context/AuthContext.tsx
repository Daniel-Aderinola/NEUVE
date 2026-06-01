'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: any) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, verify user session with backend
  useEffect(() => {
    const verifySession = async () => {
      try {
        // Try to fetch profile - if it fails, user is not authenticated
        const { data } = await authAPI.getProfile();
        if (data && data._id && data.email) {
          setUser(data);
        }
      } catch (error: any) {
        // 401 or other error means user is not authenticated
        // Cookies will be cleared by server if expired
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await authAPI.login({ email, password });
      // httpOnly cookie is set automatically by server
      // Only store user data in state (not in localStorage)
      setUser(data);
    } catch (error: any) {
      setUser(null);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      const { data } = await authAPI.register({ name, email, password, confirmPassword });
      // httpOnly cookie is set automatically by server
      // Only store user data in state (not in localStorage)
      setUser(data);
    } catch (error: any) {
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Server will clear httpOnly cookies
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state
      setUser(null);
    }
  };

  const updateUser = async (formData: any) => {
    try {
      const { data } = await authAPI.updateProfile(formData);
      const updatedUser = { ...user, ...data };
      // Only update state, not localStorage
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const isAuthenticated = user !== null && !loading;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
