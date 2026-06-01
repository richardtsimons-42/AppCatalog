# Task 15: Frontend — API Service and Auth Context

**Objective:** Set up the React frontend with axios API client, auth context, and protected route wrapper.

**Files:**
- Create: `AppCatalog.Web/src/services/api.ts`
- Create: `AppCatalog.Web/src/types.ts`
- Create: `AppCatalog.Web/src/context/AuthContext.tsx`
- Create: `AppCatalog.Web/src/components/ProtectedRoute.tsx`

**Step 1: Create types**

Create `AppCatalog.Web/src/types.ts`:

```typescript
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AppCatalogEntry {
  id: string;
  name: string;
  description: string;
  url: string;
  iconUrl?: string;
  category?: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  name: string;
  description: string;
  url: string;
  iconUrl?: string;
  category?: string;
}

export interface UpdateUserRequest {
  name: string;
  description: string;
  url: string;
  iconUrl?: string;
  category?: string;
}
```

**Step 2: Create API service**

Create `AppCatalog.Web/src/services/api.ts`:

```typescript
import axios from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  AppCatalogEntry,
  CreateUserRequest,
  UpdateUserRequest,
} from '../types';

const api = axios.create({
  baseURL: '/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<LoginResponse>('/auth/register', data),
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data),
};

export const appCatalogApi = {
  getAll: () => api.get<AppCatalogEntry[]>('/appcatalog'),
  getMyApps: () => api.get<AppCatalogEntry[]>('/appcatalog/my'),
  getById: (id: string) => api.get<AppCatalogEntry>(`/appcatalog/${id}`),
  create: (data: CreateUserRequest) =>
    api.post<AppCatalogEntry>('/appcatalog', data),
  update: (id: string, data: UpdateUserRequest) =>
    api.put<AppCatalogEntry>(`/appcatalog/${id}`, data),
  delete: (id: string) => api.delete(`/appcatalog/${id}`),
};

export default api;
```

**Step 3: Create AuthContext**

Create `AppCatalog.Web/src/context/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { LoginResponse } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: LoginResponse | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const { data } = await authApi.register({ email, password, firstName, lastName });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**Step 4: Create ProtectedRoute**

Create `AppCatalog.Web/src/components/ProtectedRoute.tsx`:

```typescript
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

**Step 5: Commit**

```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog
git add -A
git commit -m "feat(frontend): add API service, auth context, and protected route"
```
