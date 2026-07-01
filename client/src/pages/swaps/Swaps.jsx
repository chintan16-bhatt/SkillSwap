import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Swaps = () => {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // swap id currently processing
  const { user } = useAuth();

  const fetchSwaps = async () => {
    try {
      const { data } = await axios.get('/swaps');
      setSwaps(data);
    } catch (err) {
      setError('Could not load swaps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  const handleAction = async (swapId, action) => {
    setActionLoading(swapId);
    setError('');
    try {
      await axios.put(`/swaps/${swapId}/${action}`);
      await fetchSwaps(); // refresh list after action
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const isReceiver = (swap) => swap.receiver._id === user._id;
  const isSender = (swap) => swap.sender._id === user._id;

  const statusColors = {
    pending: { bg: '#fff3cd', text: '#856404' },
    accepted: { bg: '#d1ecf1', text: '#0c5460' },
    completed: { bg: '#d4edda', text: '#155724' },
    rejected: { bg: '#f8d7da', text: '#721c24' },
    cancelled: { bg: '#e2e3e5', text: '#383d41' },
  };

  if (loading) return <div style={styles.container}>Loading swaps...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Swaps</h1>

      {error && <div style={styles.error}>{error}</div>}

      {swaps.length === 0 ? (
        <p style={styles.empty}>No swap requests yet. Go search for skills to get started!</p>
      ) : (
        <div style={styles.list}>
          {swaps.map((swap) => {
            const otherUser = isSender(swap) ? swap.receiver : swap.sender;
            const roleLabel = isSender(swap) ? 'You sent to' : 'You received from';
            const color = statusColors[swap.status];

            return (
              <div key={swap._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <p style={styles.roleLabel}>{roleLabel}</p>
                    <h3 style={styles.otherUserName}>{otherUser.name}</h3>
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: color.bg,
                    color: color.text,
                  }}>
                    {swap.status.toUpperCase()}
                  </span>
                </div>

                <div style={styles.skillsRow}>
                  <div style={styles.skillBox}>
                    <p style={styles.skillLabel}>
                      {isSender(swap) ? 'You offer' : 'They offer'}
                    </p>
                    <p style={styles.skillValue}>{swap.skillOffered}</p>
                  </div>
                  <span style={styles.arrow}>⇄</span>
                  <div style={styles.skillBox}>
                    <p style={styles.skillLabel}>
                      {isSender(swap) ? 'You get' : 'They get'}
                    </p>
                    <p style={styles.skillValue}>{swap.skillWanted}</p>
                  </div>
                </div>

                {swap.message && (
                  <p style={styles.message}>"{swap.message}"</p>
                )}

                {/* Action Buttons based on role and status */}
                <div style={styles.actions}>
                  {swap.status === 'pending' && isReceiver(swap) && (
                    <>
                      <button
                        onClick={() => handleAction(swap._id, 'accept')}
                        style={styles.acceptBtn}
                        disabled={actionLoading === swap._id}
                      >
                        {actionLoading === swap._id ? '...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleAction(swap._id, 'reject')}
                        style={styles.rejectBtn}
                        disabled={actionLoading === swap._id}
                      >
                        {actionLoading === swap._id ? '...' : 'Reject'}
                      </button>
                    </>
                  )}

                  {swap.status === 'pending' && isSender(swap) && (
                    <button
                      onClick={() => handleAction(swap._id, 'cancel')}
                      style={styles.cancelBtn}
                      disabled={actionLoading === swap._id}
                    >
                      {actionLoading === swap._id ? '...' : 'Cancel Request'}
                    </button>
                  )}

                  {swap.status === 'accepted' && (
                    <button
                      onClick={() => handleAction(swap._id, 'complete')}
                      style={styles.completeBtn}
                      disabled={actionLoading === swap._id}
                    >
                      {actionLoading === swap._id ? '...' : 'Mark as Completed'}
                    </button>
                  )}

                  {(swap.status === 'completed' ||
                    swap.status === 'rejected' ||
                    swap.status === 'cancelled') && (
                    <p style={styles.finalNote}>
                      {swap.status === 'completed' && '✅ Swap completed'}
                      {swap.status === 'rejected' && '❌ Request was rejected'}
                      {swap.status === 'cancelled' && '🚫 Request was cancelled'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '24px',
  },
  error: {
    backgroundColor: '#ffe0e0',
    color: '#d00',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    padding: '40px 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  roleLabel: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '2px',
  },
  otherUserName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
  },
  skillsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    backgroundColor: '#fafafa',
    padding: '12px',
    borderRadius: '8px',
  },
  skillBox: {
    flex: 1,
    textAlign: 'center',
  },
  skillLabel: {
    fontSize: '11px',
    color: '#888',
    marginBottom: '4px',
    textTransform: 'uppercase',
  },
  skillValue: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
  },
  arrow: {
    fontSize: '20px',
    color: '#6c63ff',
  },
  message: {
    fontSize: '13px',
    color: '#666',
    fontStyle: 'italic',
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  acceptBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  rejectBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#888',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  completeBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#6c63ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  finalNote: {
    fontSize: '13px',
    color: '#888',
    fontStyle: 'italic',
  },
};

export default Swaps;