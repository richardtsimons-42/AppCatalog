import api from '../lib/api';

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

export interface AppCatalogEntryDto {
  name: string;
  description: string;
  url: string;
  iconUrl?: string;
  category?: string;
}

export async function getMyApps(): Promise<AppCatalogEntry[]> {
  const { data } = await api.get<AppCatalogEntry[]>('/appcatalog/my');
  return data;
}

export async function getAppById(id: string): Promise<AppCatalogEntry> {
  const { data } = await api.get<AppCatalogEntry>(`/appcatalog/${id}`);
  return data;
}

export async function createApp(dto: AppCatalogEntryDto): Promise<AppCatalogEntry> {
  const { data } = await api.post<AppCatalogEntry>('/appcatalog', dto);
  return data;
}

export async function updateApp(id: string, dto: AppCatalogEntryDto): Promise<AppCatalogEntry> {
  const { data } = await api.put<AppCatalogEntry>(`/appcatalog/${id}`, dto);
  return data;
}

export async function deleteApp(id: string): Promise<void> {
  await api.delete(`/appcatalog/${id}`);
}
