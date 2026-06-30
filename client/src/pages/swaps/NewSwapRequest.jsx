import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const NewSwapRequest = () => {
  const { receiverId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [receiver, setReceiver] = useState(null);
  const [skillOffered, setSkillOffered] = useState('');
  const [skillWanted, setSkillWanted] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        const { data } = await axios.get(`/users/${receiverId}`);
        setReceiver(data);
      } catch (err) {
        setError('Could not load user profile');
      }
    };
    fetchReceiver();
  }, [receiverId]);

  const handleGenerateMessage = async () => {
    if (!skillOffered || !skillWanted) {
      return setError('Please select skills first to generate a message');
    }
    setGenerating(true);
    setError('');

    try {
      const { data } = await axios.post('/ai/swap-message', {
        receiverName: receiver.name,
        skillOffered,
        skillWanted,
        receiverBio: receiver.bio,
      });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate message');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!skillOffered || !skillWanted) {
      return setError('Please select both skills');
    }

    setLoading(true);

    try {
      await axios.post('/swaps', {
        receiverId,
        skillOffered,
        skillWanted,
        message,
      });
      setSuccess(true);
      setTimeout(() => navigate('/swaps'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send swap request');
    } finally {
      setLoading(false);
    }
  };

  if (!receiver) {
    return <div style={styles.container}>{error || 'Loading...'}</div>;
  }

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          ✅ Swap request sent to {receiver.name}!
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Request a Skill Swap</h1>
        <p style={styles.subtitle}>with {receiver.name}</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              What skill will you offer? (from your profile)
            </label>
            <select
              value={skillOffered}
              onChange={(e) => setSkillOffered(e.target.value)}
              style={styles.select}
              required
            >
              <option value="">Select a skill you offer</option>
              {user?.skillsOffered?.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              What skill do you want from {receiver.name}?
            </label>
            <select
              value={skillWanted}
              onChange={(e) => setSkillWanted(e.target.value)}
              style={styles.select}
              required
            >
              <option value="">Select a skill they offer</option>
              {receiver.skillsOffered.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <div style={styles.messageHeader}>
              <label style={styles.label}>Message</label>
              <button
                type="button"
                onClick={handleGenerateMessage}
                style={styles.aiBtn}
                disabled={generating}
              >
                {generating ? '✨ Generating...' : '✨ Generate with AI'}
              </button>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message or generate one with AI"
              style={styles.textarea}
              rows={5}
            />
          </div>

          <button
            type="submit"
            style={loading ? { ...styles.submitBtn, opacity: 0.7 } : styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Swap Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '0 24px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px',
  },
  subtitle: {
    color: '#666',
    marginBottom: '24px',
  },
  error: {
    backgroundColor: '#ffe0e0',
    color: '#d00',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  successBox: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#333',
  },
  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiBtn: {
    backgroundColor: '#f0effe',
    color: '#6c63ff',
    border: '1px solid #6c63ff',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#6c63ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default NewSwapRequest;