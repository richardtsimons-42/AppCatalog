import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login, register, LoginResponse } from '../lib/authApi';

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const doLogin = async (email: string, password: string) => {
    const response = await login({ email, password });
    setToken(response.token);
    const user: User = {
      userId: response.userId,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role,
    };
    setUser(user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const doRegister = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await register({ email, password, firstName, lastName });
    setToken(response.token);
    const user: User = {
      userId: response.userId,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role,
    };
    setUser(user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const doLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login: doLogin,
        register: doRegister,
        logout: doLogout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
