import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  createApp,
  updateApp,
  getAppById,
  AppCatalogEntryDto,
} from '../lib/appApi';

export default function AppFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getAppById(id!).then((app) => {
        setName(app.name);
        setDescription(app.description);
        setUrl(app.url);
        setIconUrl(app.iconUrl || '');
        setCategory(app.category || '');
        setLoading(false);
      }).catch(() => {
        setError('Failed to load app');
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const dto: AppCatalogEntryDto = {
      name,
      description,
      url,
      iconUrl: iconUrl || undefined,
      category: category || undefined,
    };

    try {
      if (isEdit) {
        await updateApp(id!, dto);
      } else {
        await createApp(dto);
      }
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        setError(axiosErr.response?.data?.error || 'Failed to save app');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h1>{isEdit ? 'Edit App' : 'Add New App'}</h1>
        <p style={styles.subtitle}>
          {isEdit ? 'Update your web app details' : 'Add a new web app to your catalog'}
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>App Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
              placeholder="My Web App"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
              required
              placeholder="What does this app do?"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>URL *</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={styles.input}
              required
              placeholder="https://myapp.example.com"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Icon URL (optional)</label>
            <input
              type="url"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              style={styles.input}
              placeholder="https://example.com/icon.png"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Category (optional)</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.input}
              placeholder="e.g. Productivity, Finance, Health"
            />
          </div>

          <div style={styles.actions}>
            <Link to="/" style={styles.cancelBtn}>
              Cancel
            </Link>
            <button type="submit" disabled={submitting} style={styles.submitBtn}>
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add App'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  formCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #eee',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: '#666',
  },
  subtitle: {
    color: '#666',
    marginBottom: '24px',
  },
  error: {
    background: '#ffe0e0',
    color: '#c00',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  cancelBtn: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    background: '#fff',
    color: '#666',
    textDecoration: 'none',
    fontSize: '14px',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    background: '#667eea',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
