import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyApps, AppCatalogEntry, deleteApp } from '../lib/appApi';

export default function DashboardPage() {
  const [apps, setApps] = useState<AppCatalogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadApps = async () => {
    try {
      const data = await getMyApps();
      setApps(data);
    } catch {
      setError('Failed to load your apps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteApp(id);
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setError('Failed to delete app');
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>Loading your apps...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>My Apps</h1>
        <Link to="/add" style={styles.addButton}>
          + Add New App
        </Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {apps.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📦</div>
          <h2>No apps yet</h2>
          <p>Start building your catalog by adding your first web app.</p>
          <Link to="/add" style={styles.addButton}>
            + Add Your First App
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {apps.map((app) => (
            <div key={app.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.cardTitle}>{app.name}</h3>
                  <p style={styles.cardDesc}>{app.description}</p>
                </div>
                <div style={styles.cardActions}>
                  <a href={app.url} target="_blank" rel="noopener noreferrer" style={styles.visitBtn}>
                    Visit
                  </a>
                  <Link to={`/edit/${app.id}`} style={styles.editBtn}>
                    Edit
                  </Link>
                  {!deleteId ? (
                    <button onClick={() => setDeleteId(app.id)} style={styles.deleteBtn}>
                      Delete
                    </button>
                  ) : (
                    <div style={styles.confirmDelete}>
                      <span>Delete?</span>
                      <button onClick={() => handleDelete(app.id)} style={styles.confirmYes}>
                        Yes
                      </button>
                      <button onClick={() => setDeleteId(null)} style={styles.confirmNo}>
                        No
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div style={styles.cardFooter}>
                {app.category && <span style={styles.category}>{app.category}</span>}
                <span style={styles.date}>
                  Added {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: '#666',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #eee',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  error: {
    background: '#ffe0e0',
    color: '#c00',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#666',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #eee',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '6px',
    color: '#1a1a2e',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '12px',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexShrink: 0,
  },
  visitBtn: {
    background: '#667eea',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 500,
  },
  editBtn: {
    background: 'transparent',
    color: '#667eea',
    padding: '6px 14px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
    border: '1px solid #667eea',
  },
  deleteBtn: {
    background: 'transparent',
    color: '#e74c3c',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    border: '1px solid #e74c3c',
    cursor: 'pointer',
  },
  confirmDelete: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    fontSize: '12px',
  },
  confirmYes: {
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '3px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
  },
  confirmNo: {
    background: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
    padding: '3px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #f0f0f0',
  },
  category: {
    background: '#f0f0ff',
    color: '#667eea',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
  },
  date: {
    fontSize: '12px',
    color: '#999',
  },
  addButton: {
    background: '#667eea',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
  },
};
