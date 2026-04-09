import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from './types';
import { MOCK_USERS } from './mockData';

interface AuthContextType {
  user: User | null;
  firebaseUser: any | null;
  loading: boolean;
  role: UserRole | null;
  isAuthReady: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: false,
  role: null,
  isAuthReady: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(MOCK_USERS.find(u => u.role === 'admin') || MOCK_USERS[0]);
  const [loading, setLoading] = useState(false);

  const login = (role: UserRole) => {
    const mockUser = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser: user ? { uid: user.userId, email: user.email } : null,
        loading,
        role: user?.role || null,
        isAuthReady: true,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
