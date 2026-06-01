import api from '../lib/api';

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

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const { data: response } = await api.post<LoginResponse>('/auth/login', {
    email: data.email,
    password: data.password,
  });
  return response;
}

export async function register(data: RegisterRequest): Promise<LoginResponse> {
  const { data: response } = await api.post<LoginResponse>('/auth/register', {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
  });
  return response;
}
