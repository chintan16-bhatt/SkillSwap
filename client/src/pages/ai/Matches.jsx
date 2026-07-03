import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const Matches = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const fetchMatches = async () => {
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const { data } = await axios.post('/ai/match-suggestions');
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not get AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 8) return { bg: '#e8f5e9', text: '#2e7d32' };
    if (score >= 5) return { bg: '#fff3cd', text: '#856404' };
    return { bg: '#f8d7da', text: '#721c24' };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>✨ AI Match Suggestions</h1>
        <p style={styles.subtitle}>
          Let AI analyze your skills and find your best swap partners
        </p>
      </div>

      {!searched && (
        <div style={styles.startBox}>
          <p style={styles.startText}>
            Click below to get personalized AI-powered match suggestions
            based on your profile.
          </p>
          <button onClick={fetchMatches} style={styles.generateBtn} disabled={loading}>
            {loading ? '✨ Analyzing...' : '✨ Find My Best Matches'}
          </button>
        </div>
      )}

      {loading && (
        <div style={styles.loadingBox}>
          <p>🤖 AI is analyzing skill compatibility across all users...</p>
          <p style={styles.loadingHint}>This usually takes a few seconds</p>
        </div>
      )}

      {error && <div style={styles.error}>{error}</div>}

      {searched && !loading && !error && suggestions.length === 0 && (
        <div style={styles.empty}>
          No matches found yet. Try updating your profile with more skills!
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div style={styles.results}>
          <button onClick={fetchMatches} style={styles.refreshBtn}>
            🔄 Refresh Suggestions
          </button>

          {suggestions.map((match, i) => {
            const color = scoreColor(match.compatibilityScore);
            return (
              <div key={i} style={styles.matchCard}>
                <div style={styles.matchHeader}>
                  <div style={styles.rankBadge}>#{i + 1}</div>
                  <h3 style={styles.matchName}>{match.name}</h3>
                  <span style={{
                    ...styles.scoreBadge,
                    backgroundColor: color.bg,
                    color: color.text,
                  }}>
                    {match.compatibilityScore}/10 Match
                  </span>
                </div>

                <p style={styles.reason}>{match.reason}</p>

                <div style={styles.learnRow}>
                  <div style={styles.learnBox}>
                    <p style={styles.learnLabel}>💡 You can learn</p>
                    <p style={styles.learnText}>{match.youCanLearn}</p>
                  </div>
                  <div style={styles.learnBox}>
                    <p style={styles.learnLabel}>🎯 They can learn</p>
                    <p style={styles.learnText}>{match.theyCanLearn}</p>
                  </div>
                </div>

                <button
                  style={styles.swapBtn}
                  onClick={() => navigate(`/swaps/new/${match.userId}`)}
                >
                  Request Swap with {match.name.split(' ')[0]}
                </button>
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
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#666',
  },
  startBox: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  startText: {
    color: '#666',
    marginBottom: '20px',
    fontSize: '15px',
  },
  generateBtn: {
    backgroundColor: '#6c63ff',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loadingBox: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  loadingHint: {
    fontSize: '13px',
    color: '#999',
    marginTop: '8px',
  },
  error: {
    backgroundColor: '#ffe0e0',
    color: '#d00',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  empty: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
    color: '#888',
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  refreshBtn: {
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    border: '1px solid #6c63ff',
    color: '#6c63ff',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  matchCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  matchHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  rankBadge: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#6c63ff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
  },
  matchName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  scoreBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
  },
  reason: {
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  learnRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  },
  learnBox: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: '12px',
    borderRadius: '8px',
  },
  learnLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#888',
    marginBottom: '4px',
  },
  learnText: {
    fontSize: '13px',
    color: '#555',
    lineHeight: '1.5',
  },
  swapBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#6c63ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default Matches;