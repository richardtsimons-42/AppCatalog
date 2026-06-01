# Task 17: Frontend — Apps Page and App Routing

**Objective:** Create the main Apps page (list + add + edit + delete) and wire up routing in App.tsx.

**Files:**
- Create: `AppCatalog.Web/src/pages/AppsPage.tsx`
- Create: `AppCatalog.Web/src/components/AppCard.tsx`
- Create: `AppCatalog.Web/src/components/AppForm.tsx`
- Modify: `AppCatalog.Web/src/App.tsx`

**Step 1: Create AppCard component**

Create `AppCatalog.Web/src/components/AppCard.tsx`:

```typescript
import React from 'react';
import type { AppCatalogEntry } from '../types';

interface AppCardProps {
  entry: AppCatalogEntry;
  onEdit: (entry: AppCatalogEntry) => void;
  onDelete: (id: string) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ entry, onEdit, onDelete }) => (
  <div style={{
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div>
      <a href={entry.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', fontSize: 16 }}>
        {entry.iconUrl && <img src={entry.iconUrl} alt="" style={{ width: 20, height: 20, marginRight: 8, verticalAlign: 'middle' }} />}
        {entry.name}
      </a>
      <p style={{ margin: '4px 0', color: '#666' }}>{entry.description}</p>
      {entry.category && (
        <span style={{ fontSize: 12, background: '#eee', padding: '2px 8px', borderRadius: 4 }}>
          {entry.category}
        </span>
      )}
    </div>
    <div>
      <button onClick={() => onEdit(entry)} style={{ marginRight: 8, padding: '4px 12px' }}>Edit</button>
      <button onClick={() => onDelete(entry.id)} style={{ padding: '4px 12px', color: 'red' }}>Delete</button>
    </div>
  </div>
);
```

**Step 2: Create AppForm component**

Create `AppCatalog.Web/src/components/AppForm.tsx`:

```typescript
import React, { useState } from 'react';
import type { AppCatalogEntry, CreateUserRequest, UpdateUserRequest } from '../types';

interface AppFormProps {
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  editingEntry?: AppCatalogEntry | null;
  onCancel: () => void;
}

export const AppForm: React.FC<AppFormProps> = ({ onSubmit, editingEntry, onCancel }) => {
  const [name, setName] = useState(editingEntry?.name || '');
  const [description, setDescription] = useState(editingEntry?.description || '');
  const [url, setUrl] = useState(editingEntry?.url || '');
  const [iconUrl, setIconUrl] = useState(editingEntry?.iconUrl || '');
  const [category, setCategory] = useState(editingEntry?.category || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, description, url, iconUrl, category });
    setName('');
    setDescription('');
    setUrl('');
    setIconUrl('');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
      <h3>{editingEntry ? 'Edit App' : 'Add New App'}</h3>
      <div style={{ marginBottom: 8 }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <input placeholder="Icon URL" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
      </div>
      <button type="submit" style={{ marginRight: 8, padding: '8px 16px' }}>
        {editingEntry ? 'Update' : 'Add'}
      </button>
      <button type="button" onClick={onCancel} style={{ padding: '8px 16px' }}>Cancel</button>
    </form>
  );
};
```

**Step 3: Create AppsPage**

Create `AppCatalog.Web/src/pages/AppsPage.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { appCatalogApi } from '../services/api';
import type { AppCatalogEntry, CreateUserRequest, UpdateUserRequest } from '../types';
import { AppCard } from '../components/AppCard';
import { AppForm } from '../components/AppForm';

export const AppsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [apps, setApps] = useState<AppCatalogEntry[]>([]);
  const [editing, setEditing] = useState<AppCatalogEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadApps = async () => {
    const { data } = await appCatalogApi.getMyApps();
    setApps(data);
    setLoading(false);
  };

  useEffect(() => { loadApps(); }, []);

  const handleCreate = async (data: CreateUserRequest) => {
    await appCatalogApi.create(data);
    setShowForm(false);
    loadApps();
  };

  const handleUpdate = async (data: UpdateUserRequest) => {
    if (editing) {
      await appCatalogApi.update(editing.id, data);
      setEditing(null);
      setShowForm(false);
      loadApps();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this app?')) {
      await appCatalogApi.delete(id);
      loadApps();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>My Apps</h1>
        <div>
          <span style={{ marginRight: 16 }}>{user?.firstName} {user?.lastName}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {!showForm && !editing && (
        <button onClick={() => setShowForm(true)} style={{ marginBottom: 16, padding: '8px 16px' }}>
          + Add New App
        </button>
      )}

      {(showForm || editing) && (
        <AppForm
          onSubmit={editing ? handleUpdate : handleCreate}
          editingEntry={editing}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {apps.length === 0 ? (
        <p>No apps yet. Add your first web app!</p>
      ) : (
        apps.map((app) => (
          <AppCard
            key={app.id}
            entry={app}
            onEdit={(e) => { setEditing(e); setShowForm(false); }}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};
```

**Step 4: Update App.tsx**

Replace `AppCatalog.Web/src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AppsPage } from './pages/AppsPage';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/apps"
        element={
          <ProtectedRoute>
            <AppsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/apps' : '/login'} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

**Step 5: Commit**

```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog
git add -A
git commit -m "feat(frontend): add Apps page with CRUD, routing, and logout"
```
